"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  ChartIcon,
  TagIcon,
  ShieldIcon,
} from "@/components/dashboard/icons";

const NAV_ITEMS = [
  { href: "/dashboard/admin", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/admin/users", label: "ユーザー管理", icon: <UsersIcon /> },
  { href: "/dashboard/admin/leads", label: "リード管理", icon: <TagIcon /> },
];

const ROLE_LABELS: Record<string, string> = {
  CONTRACTOR: "受注者",
  LEAD_BUYER: "パートナー",
  CLIENT: "発注者",
};

interface ApprovalRow {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  contractorProfile?: { companyName: string; contactName: string } | null;
  leadBuyerProfile?: { companyName: string; contactName: string } | null;
  [key: string]: unknown;
}

export function AdminDashboardContent({ email }: { email: string }) {
  const [pendingUsers, setPendingUsers] = useState<ApprovalRow[]>([]);
  const [stats, setStats] = useState({ pending: 0, totalUsers: 0, activeProjects: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [pendingRes, allUsersRes, projectsRes] = await Promise.all([
          fetch("/api/admin/users?status=PENDING_APPROVAL&limit=10"),
          fetch("/api/admin/users?limit=1"),
          fetch("/api/projects?limit=1"),
        ]);

        if (pendingRes.ok) {
          const data = await pendingRes.json();
          setPendingUsers(data.data ?? []);
          setStats((s) => ({ ...s, pending: data.pagination?.total ?? 0 }));
        }
        if (allUsersRes.ok) {
          const data = await allUsersRes.json();
          setStats((s) => ({ ...s, totalUsers: data.pagination?.total ?? 0 }));
        }
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setStats((s) => ({ ...s, activeProjects: data.pagination?.total ?? 0 }));
        }
      } catch {
        // Silently fail
      }
      setLoading(false);
    }
    load();
  }, []);

  async function approveUser(userId: string) {
    setActionLoading(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACTIVE" }),
    });
    if (res.ok) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setStats((s) => ({ ...s, pending: s.pending - 1 }));
    }
    setActionLoading(null);
  }

  function getName(row: ApprovalRow) {
    return row.contractorProfile?.companyName ?? row.leadBuyerProfile?.companyName ?? row.email;
  }

  const APPROVAL_COLUMNS = [
    {
      key: "name",
      header: "企業名",
      render: (row: ApprovalRow) => (
        <span className="font-medium text-foreground">{getName(row)}</span>
      ),
    },
    { key: "email", header: "メール", className: "hidden md:table-cell" },
    {
      key: "role",
      header: "種別",
      render: (row: ApprovalRow) => (
        <StatusBadge label={ROLE_LABELS[row.role] ?? row.role} variant="info" />
      ),
    },
    {
      key: "createdAt",
      header: "登録日",
      className: "hidden sm:table-cell",
      render: (row: ApprovalRow) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
    },
    {
      key: "action",
      header: "",
      render: (row: ApprovalRow) => (
        <Button
          size="sm"
          onClick={() => approveUser(row.id)}
          disabled={actionLoading === row.id}
        >
          承認
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="ADMIN">
      <div>
        <h1 className="text-2xl font-bold text-foreground">管理者ダッシュボード</h1>
        <p className="mt-1 text-sm text-muted-foreground">ようこそ、{email} さん</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="承認待ち" value={loading ? "..." : stats.pending} icon={<ShieldIcon />} />
        <StatCard title="総ユーザー数" value={loading ? "..." : stats.totalUsers} icon={<UsersIcon />} />
        <StatCard title="案件数" value={loading ? "..." : stats.activeProjects} icon={<FolderIcon />} />
      </div>

      {/* Approval Queue */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            承認待ちキュー
            {stats.pending > 0 && (
              <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                {stats.pending}件
              </span>
            )}
          </h2>
          <Link href="/dashboard/admin/users" className="text-sm text-secondary hover:underline">
            ユーザー管理
          </Link>
        </div>
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={APPROVAL_COLUMNS} data={pendingUsers} emptyMessage="承認待ちのユーザーはいません" />
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/dashboard/admin/users"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          <UsersIcon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">ユーザー管理</p>
            <p className="text-xs text-muted-foreground">承認・凍結管理</p>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/leads"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          <TagIcon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">リード価格設定</p>
            <p className="text-xs text-muted-foreground">カテゴリ別料金管理</p>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/leads"
          className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          <ChartIcon className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">売上レポート</p>
            <p className="text-xs text-muted-foreground">リード販売実績</p>
          </div>
        </Link>
      </div>
    </DashboardShell>
  );
}
