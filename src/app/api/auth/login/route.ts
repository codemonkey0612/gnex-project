import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  loginSchema,
  checkRateLimit,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimit = checkRateLimit("login", ip);
    if (!rateLimit.allowed) {
      const retryMinutes = Math.ceil(rateLimit.retryAfterMs / 60_000);
      return NextResponse.json(
        {
          error: `ログインの試行回数が上限に達しました。${retryMinutes}分後に再度お試しください。`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 },
      );
    }

    // Check account status
    if (user.status === "PENDING_VERIFICATION") {
      return NextResponse.json(
        {
          error:
            "メールアドレスが未確認です。登録時に送信された確認メールをご確認ください。",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 },
      );
    }

    if (user.status === "PENDING_APPROVAL") {
      return NextResponse.json(
        {
          error:
            "アカウントは現在審査中です。承認完了までしばらくお待ちください。",
          code: "PENDING_APPROVAL",
        },
        { status: 403 },
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        {
          error:
            "このアカウントは凍結されています。サポートまでお問い合わせください。",
          code: "ACCOUNT_SUSPENDED",
        },
        { status: 403 },
      );
    }

    // Create session and set cookie
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    await setSessionCookie(token);

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Determine redirect based on role
    const redirectMap: Record<string, string> = {
      CLIENT: "/dashboard/issuer",
      CONTRACTOR: "/dashboard/contractor",
      LEAD_BUYER: "/dashboard/lead",
      ADMIN: "/dashboard/admin",
    };

    return NextResponse.json({
      message: "ログインしました",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      redirectTo: redirectMap[user.role] ?? "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "ログイン中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
