import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseBodyOrError } from "@/lib/api-helpers";
import { getSessionFromCookie } from "@/lib/auth/session";
import { simulatorInputSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseBodyOrError(request, simulatorInputSchema);
    if (parsed.error) return parsed.error;
    const { configId, inputValue } = parsed.data;

    const config = await prisma.simulatorConfig.findUnique({
      where: { id: configId },
    });
    if (!config || !config.isActive) {
      return NextResponse.json(
        { error: "シミュレーター設定が見つかりません" },
        { status: 404 },
      );
    }

    let baseScale: number;
    let estimatedCost: number;
    let subsidyAmount: number;
    let annualSaving: number;
    let co2Reduction: number;

    if (config.pattern === "PATTERN_A") {
      // Scale-based: e.g., solar panel area
      baseScale = inputValue * config.variable1;
      estimatedCost = baseScale * config.variable2;
      subsidyAmount = Math.min(estimatedCost * config.variable3, config.variable4);
      annualSaving = baseScale * config.variable5;
      co2Reduction = baseScale * config.variable6;
    } else {
      // Cost-based: e.g., current electricity cost
      baseScale = inputValue * config.variable1;
      estimatedCost = inputValue * config.variable2;
      subsidyAmount = Math.min(estimatedCost * config.variable3, config.variable4);
      annualSaving = inputValue * config.variable5;
      co2Reduction = inputValue * config.variable6;
    }

    const netCost = estimatedCost - subsidyAmount;
    const paybackYears = annualSaving > 0 ? netCost / annualSaving : null;

    const result = {
      baseScale: Math.round(baseScale * 100) / 100,
      estimatedCost: Math.round(estimatedCost),
      subsidyAmount: Math.round(subsidyAmount),
      annualSaving: Math.round(annualSaving),
      paybackYears: paybackYears ? Math.round(paybackYears * 10) / 10 : null,
      co2Reduction: Math.round(co2Reduction * 100) / 100,
    };

    // Save result if user is logged in
    const session = await getSessionFromCookie();
    if (session) {
      await prisma.simulatorResult.create({
        data: {
          configId,
          userId: session.userId,
          inputValue,
          ...result,
        },
      });
    }

    return NextResponse.json({
      data: {
        ...result,
        configName: config.name,
        inputLabel: config.inputLabel,
        inputUnit: config.inputUnit,
      },
    });
  } catch (error) {
    console.error("Simulator calculation error:", error);
    return NextResponse.json(
      { error: "シミュレーション中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
