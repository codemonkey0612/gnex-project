import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

// Role-based route access
const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard/issuer": ["CLIENT"],
  "/dashboard/contractor": ["CONTRACTOR"],
  "/dashboard/lead": ["LEAD_BUYER"],
  "/dashboard/admin": ["ADMIN"],
};

// Redirect map per role
const ROLE_DASHBOARD: Record<string, string> = {
  CLIENT: "/dashboard/issuer",
  CONTRACTOR: "/dashboard/contractor",
  LEAD_BUYER: "/dashboard/lead",
  ADMIN: "/dashboard/admin",
};

// API routes that require authentication
const PROTECTED_API_ROUTES = [
  "/api/auth/me",
  "/api/projects",
  "/api/messages",
  "/api/leads",
  "/api/notifications",
  "/api/admin",
  "/api/upload",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from cookie
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  // ---- Security Headers ----
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // ---- Auth routes: redirect to dashboard if already logged in ----
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (session) {
      const redirectTo = ROLE_DASHBOARD[session.role] ?? "/";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return response;
  }

  // ---- Protected routes: redirect to login if not authenticated ----
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check account status
    if (session.status === "SUSPENDED") {
      return NextResponse.redirect(
        new URL("/login?error=account_suspended", request.url),
      );
    }

    // Role-based access control
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(session.role)) {
          return NextResponse.redirect(
            new URL(ROLE_DASHBOARD[session.role] ?? "/", request.url),
          );
        }
      }
    }

    return response;
  }

  // ---- Protected API routes ----
  const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedApi && !session) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
