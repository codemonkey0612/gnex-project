import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, createNotification } from "@/lib/api-helpers";
import { leadPurchaseSchema } from "@/lib/validations";
import { randomUUID } from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: projectId } = await params;

    if (session.role !== "LEAD_BUYER") {
      return NextResponse.json(
        { error: "リード購入者のみ購入できます" },
        { status: 403 },
      );
    }

    const parsed = await parseBodyOrError(request, leadPurchaseSchema);
    if (parsed.error) return parsed.error;
    const { leadType } = parsed.data;

    // Validate project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            email: true,
            clientProfile: {
              select: {
                companyName: true,
                contactName: true,
                phone: true,
                prefecture: true,
                city: true,
              },
            },
          },
        },
      },
    });
    if (!project) {
      return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
    }
    if (!project.isLeadTarget || project.status !== "OPEN") {
      return NextResponse.json(
        { error: "この案件はリード購入対象ではありません" },
        { status: 400 },
      );
    }

    // Check lead type matches project flags
    const typeMatch =
      (leadType === "SUBSIDY" && project.leadSubsidy) ||
      (leadType === "FINANCE" && project.leadFinance) ||
      (leadType === "WASTE" && project.leadWaste);
    if (!typeMatch) {
      return NextResponse.json(
        { error: "このリード種別は対象ではありません" },
        { status: 400 },
      );
    }

    // Check not already purchased
    const existing = await prisma.leadPurchase.findUnique({
      where: {
        buyerId_projectId_leadType: {
          buyerId: session.userId,
          projectId,
          leadType,
        },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "このリードは既に購入済みです" },
        { status: 409 },
      );
    }

    // Get pricing
    const pricing = await prisma.leadPricing.findUnique({
      where: { leadType },
    });
    const priceYen = pricing?.priceYen ?? 10000;

    // Mock payment (TODO: integrate Stripe)
    const mockPaymentId = `mock_${randomUUID()}`;

    const purchase = await prisma.leadPurchase.create({
      data: {
        buyerId: session.userId,
        projectId,
        leadType,
        priceYen,
        stripePaymentId: mockPaymentId,
        paidAt: new Date(),
        contactRevealed: true,
      },
    });

    // Notify admin
    await createNotification({
      userId: session.userId,
      type: "LEAD_PURCHASED",
      title: "リードを購入しました",
      message: `リード（${leadType}）を¥${priceYen.toLocaleString()}で購入しました。`,
      linkUrl: "/dashboard/lead/history",
    });

    return NextResponse.json({
      data: {
        purchase,
        contact: {
          email: project.owner.email,
          companyName: project.owner.clientProfile?.companyName,
          contactName: project.owner.clientProfile?.contactName,
          phone: project.owner.clientProfile?.phone,
          prefecture: project.owner.clientProfile?.prefecture,
          city: project.owner.clientProfile?.city,
        },
      },
    });
  } catch (error) {
    console.error("Purchase lead error:", error);
    return NextResponse.json(
      { error: "リードの購入中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
