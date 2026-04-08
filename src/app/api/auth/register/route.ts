import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  registerSchema,
  checkRateLimit,
  sendEmail,
  buildVerificationEmail,
  buildAdminNewContractorEmail,
} from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const rateLimit = checkRateLimit("register", ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "登録の試行回数が上限に達しました。しばらくしてから再度お試しください。",
        },
        { status: 429 },
      );
    }

    const body = await request.json();

    // Validate with discriminated union (role-specific validation)
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Also check password confirmation (discriminated union doesn't carry refine)
    if (data.password !== body.confirmPassword) {
      return NextResponse.json(
        {
          error: "パスワードが一致しません",
          details: {
            fieldErrors: { confirmPassword: ["パスワードが一致しません"] },
          },
        },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 409 },
      );
    }

    // Create user with PENDING_VERIFICATION status
    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        status: "PENDING_VERIFICATION",
      },
    });

    // Create role-specific profile
    if (data.role === "CLIENT") {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          contactName: data.contactName,
          companyName: data.companyName ?? null,
          buildingType: data.buildingType,
          prefecture: data.prefecture ?? null,
        },
      });
    } else if (data.role === "CONTRACTOR") {
      await prisma.contractorProfile.create({
        data: {
          userId: user.id,
          contactName: data.contactName,
          companyName: data.companyName,
          phone: data.phone,
          description: data.description ?? null,
          serviceUnits: data.serviceUnits,
          serviceAreas: data.serviceAreas,
        },
      });
    } else if (data.role === "LEAD_BUYER") {
      await prisma.leadBuyerProfile.create({
        data: {
          userId: user.id,
          contactName: data.contactName,
          companyName: data.companyName,
          phone: data.phone,
          category: data.category,
          serviceAreas: data.serviceAreas,
        },
      });
    }

    // Generate verification token and send email
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: `verify_${verificationToken}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const emailParams = buildVerificationEmail(data.email, verificationToken);
    await sendEmail(emailParams);

    // For contractors and lead buyers, also notify admin
    if (data.role === "CONTRACTOR" || data.role === "LEAD_BUYER") {
      try {
        const adminEmail = buildAdminNewContractorEmail({
          companyName: data.companyName,
          contactName: data.contactName,
          email: data.email,
          role: data.role,
        });
        await sendEmail(adminEmail);
      } catch (e) {
        // Don't fail registration if admin email fails
        console.error("Failed to send admin notification:", e);
      }
    }

    return NextResponse.json(
      {
        message:
          "登録が完了しました。メールアドレスに確認メールを送信しました。",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "登録中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
