import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, resetPasswordSchema } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { token, password } = parsed.data;

    // Find valid reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: `reset_${token}` },
      include: { user: true },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "無効なリセットトークンです" },
        { status: 400 },
      );
    }

    if (resetRecord.usedAt) {
      return NextResponse.json(
        { error: "このリセットリンクは既に使用されています" },
        { status: 400 },
      );
    }

    if (resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "リセットリンクの有効期限が切れています。再度リクエストしてください。" },
        { status: 400 },
      );
    }

    // Update password and mark token as used
    const newPasswordHash = await hashPassword(password);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      message: "パスワードが正常に再設定されました。新しいパスワードでログインしてください。",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "パスワード再設定中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
