import { NextRequest, NextResponse } from "next/server";
import { getSessionOrError } from "@/lib/api-helpers";
import { saveFile } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const directory = (formData.get("directory") as string) ?? "general";

    if (!file) {
      return NextResponse.json(
        { error: "ファイルを選択してください" },
        { status: 400 },
      );
    }

    try {
      const result = await saveFile(file, directory);
      return NextResponse.json({ data: result }, { status: 201 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "ファイルの保存に失敗しました";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "ファイルのアップロード中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
