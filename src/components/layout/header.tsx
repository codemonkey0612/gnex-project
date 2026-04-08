"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "ホーム" },
  { href: "/buildings", label: "建物別カテゴリ" },
  { href: "/solutions", label: "課題別カテゴリ" },
  { href: "/simulator", label: "総合シミュレーター" },
  { href: "/subsidies", label: "対策・補助金" },
  { href: "/case-studies", label: "導入事例" },
  { href: "/contact", label: "お問い合わせ" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            G
          </div>
          <div>
            <span className="text-lg font-bold text-primary">G-NEX</span>
            <span className="ml-1 hidden text-[10px] text-muted-foreground sm:inline">
              COST REDUCTION PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden sm:block">
            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              お問い合わせ
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-foreground/70 hover:bg-accent lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-3 lg:hidden">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-secondary hover:bg-accent"
            >
              ログイン
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
