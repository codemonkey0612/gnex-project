import { NextRequest, NextResponse } from "next/server";
import { getSessionOrError } from "@/lib/api-helpers";
import { deleteFile } from "@/lib/upload";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;

    const { key } = await params;
    await deleteFile(decodeURIComponent(key));

    return NextResponse.json({ message: "ファイルを削除しました" });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "ファイルの削除中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
