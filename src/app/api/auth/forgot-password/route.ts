import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  forgotPasswordSchema,
  checkRateLimit,
  sendEmail,
  buildPasswordResetEmail,
} from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimit = checkRateLimit("forgot-password", ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "リクエストの上限に達しました。しばらくしてから再度お試しください。" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 },
      );
    }

    const { email } = parsed.data;

    // Always return success to prevent email enumeration
    const successMessage =
      "パスワード再設定のメールを送信しました。メールをご確認ください。";

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json({ message: successMessage });
    }

    // Invalidate any existing reset tokens for this user
    await prisma.passwordReset.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        token: { not: { startsWith: "verify_" } },
      },
      data: { usedAt: new Date() },
    });

    // Create new reset token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: `reset_${token}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset email
    const emailParams = buildPasswordResetEmail(email, token);
    await sendEmail(emailParams);

    return NextResponse.json({ message: successMessage });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "処理中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
