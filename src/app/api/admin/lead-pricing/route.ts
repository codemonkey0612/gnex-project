import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError } from "@/lib/api-helpers";
import { leadPricingUpdateSchema } from "@/lib/validations";

export async function GET(_request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "管理者のみアクセスできます" }, { status: 403 });
    }

    const pricing = await prisma.leadPricing.findMany({
      orderBy: { leadType: "asc" },
    });

    // Get purchase counts per lead type
    const purchaseCounts = await prisma.leadPurchase.groupBy({
      by: ["leadType"],
      _count: { id: true },
      _sum: { priceYen: true },
    });

    const enriched = pricing.map((p) => {
      const stats = purchaseCounts.find((c) => c.leadType === p.leadType);
      return {
        ...p,
        purchaseCount: stats?._count.id ?? 0,
        totalRevenue: stats?._sum.priceYen ?? 0,
      };
    });

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("Get lead pricing error:", error);
    return NextResponse.json(
      { error: "リード単価の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "管理者のみアクセスできます" }, { status: 403 });
    }

    const parsed = await parseBodyOrError(request, leadPricingUpdateSchema);
    if (parsed.error) return parsed.error;
    const { leadType, priceYen, isActive } = parsed.data;

    const pricing = await prisma.leadPricing.upsert({
      where: { leadType },
      update: {
        priceYen,
        isActive: isActive ?? true,
        updatedBy: session.userId,
      },
      create: {
        leadType,
        priceYen,
        isActive: isActive ?? true,
        updatedBy: session.userId,
      },
    });

    return NextResponse.json({ data: pricing });
  } catch (error) {
    console.error("Update lead pricing error:", error);
    return NextResponse.json(
      { error: "リード単価の更新中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
