import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { getSessionFromCookie, type SessionPayload } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@prisma/client";

/**
 * Get authenticated session or return 401 error response
 */
export async function getSessionOrError(): Promise<
  | { session: SessionPayload; error?: never }
  | { session?: never; error: NextResponse }
> {
  const session = await getSessionFromCookie();
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "未認証です" },
        { status: 401 },
      ),
    };
  }
  return { session };
}

/**
 * Parse JSON request body against a Zod schema
 */
export async function parseBodyOrError<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<
  | { data: T; error?: never }
  | { data?: never; error: NextResponse }
> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return {
        error: NextResponse.json(
          { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
          { status: 400 },
        ),
      };
    }
    return { data: parsed.data };
  } catch {
    return {
      error: NextResponse.json(
        { error: "リクエストの形式が正しくありません" },
        { status: 400 },
      ),
    };
  }
}

/**
 * Extract pagination params from URL search params
 */
export function paginationFromParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      linkUrl: params.linkUrl ?? null,
      metadata: params.metadata ? (params.metadata as object) : undefined,
    },
  });
}
