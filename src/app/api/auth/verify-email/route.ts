import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", request.url),
      );
    }

    // Rate limit
    const rateLimit = checkRateLimit("verify-email", email);
    if (!rateLimit.allowed) {
      return NextResponse.redirect(
        new URL("/login?error=rate_limited", request.url),
      );
    }

    // Find valid verification token
    const verifyRecord = await prisma.passwordReset.findUnique({
      where: { token: `verify_${token}` },
      include: { user: true },
    });

    if (!verifyRecord) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", request.url),
      );
    }

    if (verifyRecord.usedAt) {
      return NextResponse.redirect(
        new URL("/login?message=already_verified", request.url),
      );
    }

    if (verifyRecord.expiresAt < new Date()) {
      return NextResponse.redirect(
        new URL("/login?error=token_expired", request.url),
      );
    }

    if (verifyRecord.user.email !== email) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_token", request.url),
      );
    }

    // Determine new status after verification
    // Contractors/Lead buyers need approval, clients become active immediately
    const newStatus =
      verifyRecord.user.role === "CONTRACTOR" ||
      verifyRecord.user.role === "LEAD_BUYER"
        ? "PENDING_APPROVAL"
        : "ACTIVE";

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verifyRecord.userId },
        data: {
          emailVerified: new Date(),
          status: newStatus,
        },
      }),
      prisma.passwordReset.update({
        where: { id: verifyRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    // Notify admin if contractor/lead buyer needs approval
    if (newStatus === "PENDING_APPROVAL") {
      // Create notification for admin users
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN", status: "ACTIVE" },
        select: { id: true },
      });

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: "SYSTEM" as const,
            title: "新規受注者の承認リクエスト",
            message: `${email} が受注者として登録しました。承認をお願いします。`,
            linkUrl: "/dashboard/admin/users",
          })),
        });
      }

      return NextResponse.redirect(
        new URL("/login?message=verification_pending_approval", request.url),
      );
    }

    return NextResponse.redirect(
      new URL("/login?message=email_verified", request.url),
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/login?error=verification_failed", request.url),
    );
  }
}
