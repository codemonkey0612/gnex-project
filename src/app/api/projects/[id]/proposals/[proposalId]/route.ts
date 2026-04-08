import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, createNotification } from "@/lib/api-helpers";
import { updateProposalStatusSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; proposalId: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: projectId, proposalId } = await params;

    const proposal = await prisma.proposal.findFirst({
      where: { id: proposalId, projectId },
      include: {
        contractor: session.role === "ADMIN"
          ? {
              select: {
                id: true,
                contractorProfile: {
                  select: { companyName: true, contactName: true },
                },
              },
            }
          : undefined,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "提案が見つかりません" }, { status: 404 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
    }

    const isOwner = project.ownerId === session.userId;
    const isContractor = proposal.contractorId === session.userId;
    const isAdmin = session.role === "ADMIN";

    if (!isOwner && !isContractor && !isAdmin) {
      return NextResponse.json({ error: "アクセス権限がありません" }, { status: 403 });
    }

    // Owner sees blind version (hide contractor identity)
    if (isOwner && !isAdmin) {
      const { contractorId, ...rest } = proposal;
      void contractorId;
      return NextResponse.json({ data: rest });
    }

    return NextResponse.json({ data: proposal });
  } catch (error) {
    console.error("Get proposal error:", error);
    return NextResponse.json(
      { error: "提案の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; proposalId: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id: projectId, proposalId } = await params;

    const parsed = await parseBodyOrError(request, updateProposalStatusSchema);
    if (parsed.error) return parsed.error;
    const { status: newStatus } = parsed.data;

    const proposal = await prisma.proposal.findFirst({
      where: { id: proposalId, projectId },
    });
    if (!proposal) {
      return NextResponse.json({ error: "提案が見つかりません" }, { status: 404 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
    }

    const isOwner = project.ownerId === session.userId;
    const isContractor = proposal.contractorId === session.userId;

    // Contractor can only WITHDRAW their own proposal
    if (newStatus === "WITHDRAWN") {
      if (!isContractor) {
        return NextResponse.json(
          { error: "自分の提案のみ取り下げできます" },
          { status: 403 },
        );
      }
      const updated = await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "WITHDRAWN" },
      });
      return NextResponse.json({ data: updated });
    }

    // Only project owner can SHORTLIST, SELECT, or REJECT
    if (!isOwner) {
      return NextResponse.json(
        { error: "案件のオーナーのみ提案のステータスを変更できます" },
        { status: 403 },
      );
    }

    if (newStatus === "SELECTED") {
      // Use transaction to select one and reject others
      const [updatedProposal] = await prisma.$transaction([
        prisma.proposal.update({
          where: { id: proposalId },
          data: { status: "SELECTED" },
        }),
        prisma.project.update({
          where: { id: projectId },
          data: {
            selectedProposalId: proposalId,
            status: "IN_PROGRESS",
          },
        }),
        // Reject all other proposals
        prisma.proposal.updateMany({
          where: {
            projectId,
            id: { not: proposalId },
            status: { not: "WITHDRAWN" },
          },
          data: { status: "REJECTED" },
        }),
      ]);

      // Notify selected contractor
      await createNotification({
        userId: proposal.contractorId,
        type: "PROJECT_SELECTED",
        title: "業者として選定されました",
        message: "おめでとうございます！案件の業者として選定されました。",
        linkUrl: `/dashboard/contractor/projects/${projectId}`,
      });

      // Notify rejected contractors
      const rejectedProposals = await prisma.proposal.findMany({
        where: {
          projectId,
          id: { not: proposalId },
          status: "REJECTED",
        },
        select: { contractorId: true },
      });

      for (const rejected of rejectedProposals) {
        await createNotification({
          userId: rejected.contractorId,
          type: "PROJECT_STATUS_CHANGE",
          title: "提案結果のお知らせ",
          message: "残念ながら、今回は他の業者が選定されました。",
          linkUrl: `/dashboard/contractor/projects/${projectId}`,
        });
      }

      return NextResponse.json({ data: updatedProposal });
    }

    // SHORTLISTED or REJECTED
    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: newStatus },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Update proposal status error:", error);
    return NextResponse.json(
      { error: "提案ステータスの更新中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
