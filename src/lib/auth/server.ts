import { redirect } from "next/navigation";
import { getSessionFromCookie, type SessionPayload } from "./session";
import type { UserRole } from "@prisma/client";

/**
 * Get current session or redirect to login.
 * Use in Server Components and Server Actions.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSessionFromCookie();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * Require specific role(s). Redirects to correct dashboard if unauthorized.
 */
export async function requireRole(
  ...roles: UserRole[]
): Promise<SessionPayload> {
  const session = await requireAuth();

  if (!roles.includes(session.role)) {
    const redirectMap: Record<string, string> = {
      CLIENT: "/dashboard/issuer",
      CONTRACTOR: "/dashboard/contractor",
      LEAD_BUYER: "/dashboard/lead",
      ADMIN: "/dashboard/admin",
    };
    redirect(redirectMap[session.role] ?? "/");
  }

  return session;
}

/**
 * Get current session or null (non-redirecting).
 * Use when auth is optional.
 */
export async function getAuth(): Promise<SessionPayload | null> {
  return getSessionFromCookie();
}
