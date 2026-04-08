import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

interface SaveFileResult {
  fileName: string;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Save uploaded file to local filesystem (dev) or S3 (production)
 */
export async function saveFile(
  file: File,
  directory: string,
): Promise<SaveFileResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("ファイルサイズは10MB以下にしてください");
  }

  // Validate mime type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("対応していないファイル形式です（JPEG, PNG, WebP, PDF のみ）");
  }

  // TODO: In production, use AWS S3 instead of local filesystem
  // const s3Client = new S3Client({ region: process.env.AWS_REGION });
  // await s3Client.send(new PutObjectCommand({ ... }));

  const dirPath = path.join(UPLOAD_DIR, directory);
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }

  const ext = path.extname(file.name) || "";
  const fileKey = `${directory}/${randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileKey);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    fileName: file.name,
    fileUrl: `/uploads/${fileKey}`,
    fileKey,
    fileSize: file.size,
    mimeType: file.type,
  };
}

/**
 * Delete a file from local filesystem (dev) or S3 (production)
 */
export async function deleteFile(fileKey: string): Promise<void> {
  // TODO: In production, use AWS S3
  // await s3Client.send(new DeleteObjectCommand({ Bucket, Key: fileKey }));

  const filePath = path.join(UPLOAD_DIR, fileKey);
  try {
    await unlink(filePath);
  } catch {
    // File may not exist, ignore
  }
}
