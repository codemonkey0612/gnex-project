import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, createNotification } from "@/lib/api-helpers";
import { adminUserUpdateSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "管理者のみアクセスできます" }, { status: 403 });
    }

    const { id } = await params;
    const parsed = await parseBodyOrError(request, adminUserUpdateSchema);
    if (parsed.error) return parsed.error;
    const { status: newStatus } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // Prevent admin from modifying other admins
    if (user.role === "ADMIN" && user.id !== session.userId) {
      return NextResponse.json(
        { error: "他の管理者のステータスは変更できません" },
        { status: 403 },
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status: newStatus },
    });

    // If approving a contractor/lead buyer
    if (newStatus === "ACTIVE" && user.status === "PENDING_APPROVAL") {
      if (user.role === "CONTRACTOR") {
        await prisma.contractorProfile.update({
          where: { userId: id },
          data: { approvedAt: new Date() },
        });
      }

      await createNotification({
        userId: id,
        type: "ACCOUNT_APPROVED",
        title: "アカウントが承認されました",
        message: "G-NEXへのご登録が承認されました。サービスをご利用いただけます。",
        linkUrl: user.role === "CONTRACTOR"
          ? "/dashboard/contractor"
          : "/dashboard/lead",
      });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Update user status error:", error);
    return NextResponse.json(
      { error: "ユーザーステータスの更新中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
