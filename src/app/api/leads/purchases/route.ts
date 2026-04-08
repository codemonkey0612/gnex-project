import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, paginationFromParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    if (session.role !== "LEAD_BUYER") {
      return NextResponse.json(
        { error: "リード購入者のみアクセスできます" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = paginationFromParams(searchParams);

    const [purchases, total] = await Promise.all([
      prisma.leadPurchase.findMany({
        where: { buyerId: session.userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: {
              id: true,
              serviceUnit: true,
              buildingType: true,
              prefecture: true,
              city: true,
              owner: {
                select: {
                  email: true,
                  clientProfile: {
                    select: {
                      companyName: true,
                      contactName: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.leadPurchase.count({ where: { buyerId: session.userId } }),
    ]);

    return NextResponse.json({
      data: purchases,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("List purchases error:", error);
    return NextResponse.json(
      { error: "購入履歴の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
