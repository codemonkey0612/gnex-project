"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  role: string;
}

export function Sidebar({ items, role }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const roleLabelMap: Record<string, string> = {
    CLIENT: "発注者",
    CONTRACTOR: "受注者",
    LEAD_BUYER: "パートナー",
    ADMIN: "管理者",
  };

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <span className="text-xl font-bold text-primary">G-NEX</span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {roleLabelMap[role] ?? role}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t p-4">
          <div className="mb-3 truncate text-sm">
            <p className="font-medium text-foreground">
              {user?.clientProfile?.contactName ??
                user?.contractorProfile?.contactName ??
                user?.leadBuyerProfile?.contactName ??
                user?.email}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogoutIcon />
            ログアウト
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---- Mobile Header ---- */

interface MobileHeaderProps {
  items: NavItem[];
  role: string;
}

export function MobileHeader({ items, role }: MobileHeaderProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const roleLabelMap: Record<string, string> = {
    CLIENT: "発注者",
    CONTRACTOR: "受注者",
    LEAD_BUYER: "パートナー",
    ADMIN: "管理者",
  };

  return (
    <div className="lg:hidden">
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">G-NEX</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
            {roleLabelMap[role] ?? role}
          </span>
        </div>
        <button
          onClick={logout}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent"
        >
          <LogoutIcon />
        </button>
      </div>
      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card">
        <nav className="flex">
          {items.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ---- Icons ---- */

function LogoutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
