import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ error: "未認証です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        clientProfile: {
          select: {
            companyName: true,
            contactName: true,
            buildingType: true,
            prefecture: true,
          },
        },
        contractorProfile: {
          select: {
            companyName: true,
            contactName: true,
            serviceUnits: true,
            serviceAreas: true,
            completedCount: true,
          },
        },
        leadBuyerProfile: {
          select: {
            companyName: true,
            contactName: true,
            category: true,
            serviceAreas: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "ユーザー情報の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
