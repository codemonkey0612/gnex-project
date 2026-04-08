import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, paginationFromParams } from "@/lib/api-helpers";
import { createProjectSchema, projectQuerySchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "CLIENT") {
      return NextResponse.json(
        { error: "発注者のみ案件を作成できます" },
        { status: 403 },
      );
    }

    const parsed = await parseBodyOrError(request, createProjectSchema);
    if (parsed.error) return parsed.error;
    const { publish, ...data } = parsed.data;

    const isLeadTarget = data.leadSubsidy || data.leadFinance || data.leadWaste;

    const project = await prisma.project.create({
      data: {
        ownerId: session.userId,
        status: publish ? "OPEN" : "DRAFT",
        serviceUnit: data.serviceUnit,
        requestType: data.requestType,
        buildingType: data.buildingType,
        prefecture: data.prefecture ?? null,
        city: data.city ?? null,
        address: data.address ?? null,
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        description: data.description ?? null,
        formResponses: data.formResponses ? (data.formResponses as object) : undefined,
        isPrivate: data.isPrivate,
        isPhotoPrivate: data.isPhotoPrivate,
        leadSubsidy: data.leadSubsidy,
        leadFinance: data.leadFinance,
        leadWaste: data.leadWaste,
        isLeadTarget,
      },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "案件の作成中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    const { searchParams } = new URL(request.url);
    const query = projectQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!query.success) {
      return NextResponse.json(
        { error: "クエリパラメータが不正です" },
        { status: 400 },
      );
    }

    const { page, limit, skip } = paginationFromParams(searchParams);

    // Build role-based where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (query.data.status) where.status = query.data.status;
    if (query.data.serviceUnit) where.serviceUnit = query.data.serviceUnit;
    if (query.data.prefecture) where.prefecture = query.data.prefecture;

    if (session.role === "CLIENT") {
      where.ownerId = session.userId;
    } else if (session.role === "CONTRACTOR") {
      where.status = query.data.status ?? "OPEN";
      // Filter by contractor's service capabilities
      const profile = await prisma.contractorProfile.findUnique({
        where: { userId: session.userId },
        select: { serviceUnits: true, serviceAreas: true },
      });
      if (profile) {
        where.serviceUnit = query.data.serviceUnit
          ? { in: profile.serviceUnits.filter((u) => u === query.data.serviceUnit) }
          : { in: profile.serviceUnits };
        if (profile.serviceAreas.length > 0) {
          where.prefecture = query.data.prefecture
            ? { in: profile.serviceAreas.filter((a) => a === query.data.prefecture) }
            : { in: profile.serviceAreas };
        }
      }
      where.isPrivate = false;
    } else if (session.role === "LEAD_BUYER") {
      where.isLeadTarget = true;
      where.status = "OPEN";
      const profile = await prisma.leadBuyerProfile.findUnique({
        where: { userId: session.userId },
        select: { category: true, serviceAreas: true },
      });
      if (profile) {
        if (profile.category === "LEGAL") where.leadSubsidy = true;
        else if (profile.category === "FINANCE") where.leadFinance = true;
        else if (profile.category === "WASTE") where.leadWaste = true;
        if (profile.serviceAreas.length > 0) {
          where.prefecture = { in: profile.serviceAreas };
        }
      }
    }
    // ADMIN sees all - no additional filters

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: {
              id: true,
              clientProfile: {
                select: { companyName: true, contactName: true },
              },
            },
          },
          _count: { select: { proposals: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("List projects error:", error);
    return NextResponse.json(
      { error: "案件一覧の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
