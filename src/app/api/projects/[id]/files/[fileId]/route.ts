import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError } from "@/lib/api-helpers";
import { deleteFile } from "@/lib/upload";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id, fileId } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 },
      );
    }

    if (project.ownerId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "このファイルを削除する権限がありません" },
        { status: 403 },
      );
    }

    const file = await prisma.projectFile.findFirst({
      where: { id: fileId, projectId: id },
    });
    if (!file) {
      return NextResponse.json(
        { error: "ファイルが見つかりません" },
        { status: 404 },
      );
    }

    await deleteFile(file.fileKey);
    await prisma.projectFile.delete({ where: { id: fileId } });

    return NextResponse.json({ message: "ファイルを削除しました" });
  } catch (error) {
    console.error("Delete project file error:", error);
    return NextResponse.json(
      { error: "ファイルの削除中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
