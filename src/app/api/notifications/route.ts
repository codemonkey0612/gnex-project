import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, paginationFromParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = paginationFromParams(searchParams);

    const where = { userId: session.userId };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: session.userId, isRead: false },
      }),
    ]);

    return NextResponse.json({
      data: notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("List notifications error:", error);
    return NextResponse.json(
      { error: "通知一覧の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
