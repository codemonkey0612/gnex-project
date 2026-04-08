import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, paginationFromParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "LEAD_BUYER") {
      return NextResponse.json(
        { error: "リード購入者のみアクセスできます" },
        { status: 403 },
      );
    }

    const profile = await prisma.leadBuyerProfile.findUnique({
      where: { userId: session.userId },
      select: { category: true, serviceAreas: true },
    });
    if (!profile) {
      return NextResponse.json(
        { error: "プロフィールが見つかりません" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = paginationFromParams(searchParams);

    // Build lead filter based on buyer's category
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isLeadTarget: true,
      status: "OPEN",
    };

    if (profile.category === "LEGAL") where.leadSubsidy = true;
    else if (profile.category === "FINANCE") where.leadFinance = true;
    else if (profile.category === "WASTE") where.leadWaste = true;

    if (profile.serviceAreas.length > 0) {
      where.prefecture = { in: profile.serviceAreas };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          serviceUnit: true,
          buildingType: true,
          prefecture: true,
          leadSubsidy: true,
          leadFinance: true,
          leadWaste: true,
          createdAt: true,
          // Anonymized: no owner info
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Exclude already-purchased leads
    const purchasedProjectIds = await prisma.leadPurchase.findMany({
      where: { buyerId: session.userId },
      select: { projectId: true },
    });
    const purchasedIds = new Set(purchasedProjectIds.map((p) => p.projectId));

    // Get pricing for display
    const pricing = await prisma.leadPricing.findMany({
      where: { isActive: true },
    });
    const priceMap = Object.fromEntries(
      pricing.map((p) => [p.leadType, p.priceYen]),
    );

    const leads = projects
      .filter((p) => !purchasedIds.has(p.id))
      .map((p) => {
        const leadType = profile.category === "LEGAL" ? "SUBSIDY"
          : profile.category === "FINANCE" ? "FINANCE"
          : "WASTE";
        return {
          ...p,
          leadType,
          priceYen: priceMap[leadType] ?? 0,
          isPurchased: false,
        };
      });

    return NextResponse.json({
      data: leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("List leads error:", error);
    return NextResponse.json(
      { error: "リード一覧の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
