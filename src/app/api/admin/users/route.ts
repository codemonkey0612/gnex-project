import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, paginationFromParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "管理者のみアクセスできます" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = paginationFromParams(searchParams);
    const statusFilter = searchParams.get("status");
    const roleFilter = searchParams.get("role");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (statusFilter) where.status = statusFilter;
    if (roleFilter) where.role = roleFilter;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          clientProfile: {
            select: { companyName: true, contactName: true },
          },
          contractorProfile: {
            select: {
              companyName: true,
              contactName: true,
              serviceUnits: true,
              serviceAreas: true,
              approvedAt: true,
            },
          },
          leadBuyerProfile: {
            select: {
              companyName: true,
              contactName: true,
              category: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("List users error:", error);
    return NextResponse.json(
      { error: "ユーザー一覧の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
