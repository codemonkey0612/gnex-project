import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError } from "@/lib/api-helpers";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return NextResponse.json(
        { error: "通知が見つかりません" },
        { status: 404 },
      );
    }
    if (notification.userId !== session.userId) {
      return NextResponse.json(
        { error: "この通知にアクセスする権限がありません" },
        { status: 403 },
      );
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return NextResponse.json(
      { error: "通知の更新中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
