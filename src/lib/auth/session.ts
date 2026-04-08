import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole, AccountStatus } from "@prisma/client";

// Session payload stored in JWT
export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  iat: number;
  exp: number;
}

const SESSION_COOKIE_NAME = "gnex_session";
// Long-term session: 30 days (requirements: セッション保持期間を長くする)
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function getSecretKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: {
  userId: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    status: payload.status,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE)
    .sign(getSecretKey());

  return token;
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// For middleware (Edge runtime) - parse token without next/headers
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  return verifySession(token);
}

export { SESSION_COOKIE_NAME };
