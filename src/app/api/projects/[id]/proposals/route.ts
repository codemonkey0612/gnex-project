import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, createNotification } from "@/lib/api-helpers";
import { createProposalSchema } from "@/lib/validations";

const BLIND_LABELS = ["プランA", "プランB", "プランC", "プランD", "プランE", "プランF"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: projectId } = await params;

    if (session.role !== "CONTRACTOR") {
      return NextResponse.json(
        { error: "受注者のみ提案を提出できます" },
        { status: 403 },
      );
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
    }
    if (project.status !== "OPEN") {
      return NextResponse.json(
        { error: "この案件は現在応募を受け付けていません" },
        { status: 400 },
      );
    }

    // Check contractor capabilities
    const profile = await prisma.contractorProfile.findUnique({
      where: { userId: session.userId },
      select: { serviceUnits: true, serviceAreas: true },
    });
    if (!profile) {
      return NextResponse.json(
        { error: "受注者プロフィールが見つかりません" },
        { status: 400 },
      );
    }
    if (!profile.serviceUnits.includes(project.serviceUnit)) {
      return NextResponse.json(
        { error: "このサービスUnitには対応していません" },
        { status: 400 },
      );
    }
    if (
      project.prefecture &&
      profile.serviceAreas.length > 0 &&
      !profile.serviceAreas.includes(project.prefecture)
    ) {
      return NextResponse.json(
        { error: "このエリアには対応していません" },
        { status: 400 },
      );
    }

    // Check duplicate
    const existing = await prisma.proposal.findUnique({
      where: { projectId_contractorId: { projectId, contractorId: session.userId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "この案件には既に提案済みです" },
        { status: 409 },
      );
    }

    const parsed = await parseBodyOrError(request, createProposalSchema);
    if (parsed.error) return parsed.error;
    const data = parsed.data;

    // Auto-assign blind label
    const proposalCount = await prisma.proposal.count({ where: { projectId } });
    const blindLabel = BLIND_LABELS[proposalCount] ?? `プラン${proposalCount + 1}`;

    const proposal = await prisma.proposal.create({
      data: {
        projectId,
        contractorId: session.userId,
        content: data.content,
        priceMin: data.priceMin ?? null,
        priceMax: data.priceMax ?? null,
        cannotEstimate: data.cannotEstimate ?? null,
        estimatedDays: data.estimatedDays ?? null,
        blindLabel,
      },
    });

    // Notify project owner
    await createNotification({
      userId: project.ownerId,
      type: "PROJECT_NEW_PROPOSAL",
      title: "新しい見積が届きました",
      message: `「${blindLabel}」が提出されました。`,
      linkUrl: `/dashboard/issuer/projects/${projectId}`,
    });

    return NextResponse.json({ data: proposal }, { status: 201 });
  } catch (error) {
    console.error("Create proposal error:", error);
    return NextResponse.json(
      { error: "提案の提出中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: projectId } = await params;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
    }

    const isOwner = project.ownerId === session.userId;
    const isAdmin = session.role === "ADMIN";

    if (isOwner) {
      // Owner sees blind proposals (no contractor identity)
      const proposals = await prisma.proposal.findMany({
        where: { projectId },
        select: {
          id: true,
          status: true,
          content: true,
          priceMin: true,
          priceMax: true,
          cannotEstimate: true,
          estimatedDays: true,
          blindLabel: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ data: proposals });
    }

    if (session.role === "CONTRACTOR") {
      // Contractor sees only their own proposal
      const proposal = await prisma.proposal.findUnique({
        where: { projectId_contractorId: { projectId, contractorId: session.userId } },
      });
      return NextResponse.json({ data: proposal ? [proposal] : [] });
    }

    if (isAdmin) {
      // Admin sees all with contractor info
      const proposals = await prisma.proposal.findMany({
        where: { projectId },
        include: {
          contractor: {
            select: {
              id: true,
              contractorProfile: {
                select: { companyName: true, contactName: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ data: proposals });
    }

    return NextResponse.json({ error: "アクセス権限がありません" }, { status: 403 });
  } catch (error) {
    console.error("List proposals error:", error);
    return NextResponse.json(
      { error: "提案一覧の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
