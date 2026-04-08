import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, createNotification } from "@/lib/api-helpers";
import { updateProjectSchema } from "@/lib/validations";

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["OPEN", "CANCELLED"],
  OPEN: ["IN_REVIEW", "CANCELLED"],
  IN_REVIEW: ["IN_PROGRESS", "OPEN", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
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
        files: { orderBy: { sortOrder: "asc" } },
        proposals: session.role === "ADMIN" || undefined
          ? {
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
            }
          : undefined,
        _count: { select: { proposals: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 },
      );
    }

    // Authorization
    const isOwner = project.ownerId === session.userId;
    const isAdmin = session.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      if (session.role === "CONTRACTOR" && project.status !== "OPEN" && project.status !== "IN_REVIEW" && project.status !== "IN_PROGRESS") {
        return NextResponse.json(
          { error: "この案件にアクセスする権限がありません" },
          { status: 403 },
        );
      }
    }

    // If owner is viewing, include proposals with blind labels (no contractor identity)
    if (isOwner && !project.proposals) {
      const proposals = await prisma.proposal.findMany({
        where: { projectId: id },
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
      return NextResponse.json({ data: { ...project, proposals } });
    }

    // For contractors, hide owner contact info unless they have a selected proposal
    if (session.role === "CONTRACTOR" && !isAdmin) {
      const hasSelectedProposal = await prisma.proposal.findFirst({
        where: {
          projectId: id,
          contractorId: session.userId,
          status: "SELECTED",
        },
      });
      if (!hasSelectedProposal) {
        const { owner, ...rest } = project;
        return NextResponse.json({
          data: {
            ...rest,
            owner: { id: owner.id, clientProfile: { companyName: owner.clientProfile?.companyName } },
          },
        });
      }
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "案件の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    const parsed = await parseBodyOrError(request, updateProjectSchema);
    if (parsed.error) return parsed.error;
    const data = parsed.data;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 },
      );
    }

    const isOwner = project.ownerId === session.userId;
    const isAdmin = session.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "この案件を更新する権限がありません" },
        { status: 403 },
      );
    }

    // Validate status transition
    if (data.status && data.status !== project.status) {
      const allowed = VALID_TRANSITIONS[project.status] ?? [];
      if (!allowed.includes(data.status)) {
        return NextResponse.json(
          { error: `ステータスを「${project.status}」から「${data.status}」に変更できません` },
          { status: 400 },
        );
      }
    }

    const isLeadTarget = (data.leadSubsidy ?? project.leadSubsidy) ||
      (data.leadFinance ?? project.leadFinance) ||
      (data.leadWaste ?? project.leadWaste);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { formResponses, ...restData } = data;
    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...restData,
        ...(formResponses ? { formResponses: formResponses as object } : {}),
        isLeadTarget,
        completedAt: data.status === "COMPLETED" ? new Date() : undefined,
      },
    });

    // Notify lead buyers when project becomes OPEN with lead flags
    if (data.status === "OPEN" && isLeadTarget) {
      const leadBuyers = await prisma.leadBuyerProfile.findMany({
        select: { userId: true, category: true, serviceAreas: true },
      });

      for (const buyer of leadBuyers) {
        const matchesCategory =
          (buyer.category === "LEGAL" && (data.leadSubsidy ?? project.leadSubsidy)) ||
          (buyer.category === "FINANCE" && (data.leadFinance ?? project.leadFinance)) ||
          (buyer.category === "WASTE" && (data.leadWaste ?? project.leadWaste));
        const matchesArea = buyer.serviceAreas.length === 0 ||
          buyer.serviceAreas.includes(updated.prefecture ?? "");

        if (matchesCategory && matchesArea) {
          await createNotification({
            userId: buyer.userId,
            type: "LEAD_AVAILABLE",
            title: "新しいリード案件があります",
            message: `${updated.prefecture ?? ""}の${updated.buildingType}案件が公開されました。`,
            linkUrl: "/dashboard/lead/opportunities",
          });
        }
      }
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "案件の更新中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 },
      );
    }

    const isOwner = project.ownerId === session.userId;
    const isAdmin = session.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "この案件を削除する権限がありません" },
        { status: 403 },
      );
    }

    if (project.status !== "DRAFT" && project.status !== "CANCELLED") {
      return NextResponse.json(
        { error: "下書きまたはキャンセル済みの案件のみ削除できます" },
        { status: 400 },
      );
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "案件を削除しました" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "案件の削除中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
