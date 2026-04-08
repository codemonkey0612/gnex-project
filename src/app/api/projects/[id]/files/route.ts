import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError } from "@/lib/api-helpers";
import { saveFile } from "@/lib/upload";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    if (session.role !== "CLIENT") {
      return NextResponse.json(
        { error: "発注者のみファイルをアップロードできます" },
        { status: 403 },
      );
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json(
        { error: "案件が見つかりません" },
        { status: 404 },
      );
    }
    if (project.ownerId !== session.userId) {
      return NextResponse.json(
        { error: "この案件にファイルをアップロードする権限がありません" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "ファイルを選択してください" },
        { status: 400 },
      );
    }

    const savedFiles = [];
    for (const file of files) {
      try {
        const result = await saveFile(file, `projects/${id}`);
        const dbFile = await prisma.projectFile.create({
          data: {
            projectId: id,
            fileName: result.fileName,
            fileUrl: result.fileUrl,
            fileKey: result.fileKey,
            fileSize: result.fileSize,
            mimeType: result.mimeType,
          },
        });
        savedFiles.push(dbFile);
      } catch (err) {
        const message = err instanceof Error ? err.message : "ファイルの保存に失敗しました";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    return NextResponse.json({ data: savedFiles }, { status: 201 });
  } catch (error) {
    console.error("Upload project files error:", error);
    return NextResponse.json(
      { error: "ファイルのアップロード中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
