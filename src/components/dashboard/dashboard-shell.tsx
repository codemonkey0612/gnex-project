"use client";

import { Sidebar, MobileHeader } from "./sidebar";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  role: string;
}

export function DashboardShell({ children, navItems, role }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={navItems} role={role} />
      <MobileHeader items={navItems} role={role} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}
