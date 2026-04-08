import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const configs = await prisma.simulatorConfig.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        serviceUnit: true,
        pattern: true,
        inputLabel: true,
        inputUnit: true,
      },
    });

    return NextResponse.json({ data: configs });
  } catch (error) {
    console.error("Get simulator configs error:", error);
    return NextResponse.json(
      { error: "シミュレーター設定の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
