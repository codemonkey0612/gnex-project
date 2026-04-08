"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { HomeIcon, FolderIcon, ChartIcon } from "@/components/dashboard/icons";
import { UsersIcon } from "@/components/dashboard/icons";

const NAV_ITEMS = [
  { href: "/dashboard/admin", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/admin/users", label: "ユーザー管理", icon: <UsersIcon /> },
  { href: "/dashboard/admin/leads", label: "リード単価", icon: <ChartIcon /> },
  { href: "/dashboard/admin/projects", label: "案件管理", icon: <FolderIcon /> },
];

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "発注者",
  CONTRACTOR: "受注者",
  LEAD_BUYER: "リード購入者",
  ADMIN: "管理者",
};

const STATUS_VARIANTS: Record<string, { label: string; variant: string }> = {
  ACTIVE: { label: "有効", variant: "success" },
  PENDING_VERIFICATION: { label: "メール未確認", variant: "warning" },
  PENDING_APPROVAL: { label: "承認待ち", variant: "warning" },
  SUSPENDED: { label: "凍結", variant: "danger" },
};

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  clientProfile?: { companyName: string | null; contactName: string } | null;
  contractorProfile?: { companyName: string; contactName: string } | null;
  leadBuyerProfile?: { companyName: string; contactName: string } | null;
  [key: string]: unknown;
}

export function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const params = new URLSearchParams();
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
      }
      setLoading(false);
    }
    load();
  }, [roleFilter, statusFilter]);

  async function updateUserStatus(userId: string, status: string) {
    const action = status === "ACTIVE" ? "承認" : "凍結";
    if (!confirm(`このユーザーを${action}しますか？`)) return;
    setActionLoading(userId);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u)),
      );
    }
    setActionLoading(null);
  }

  function getName(user: User): string {
    return (
      user.contractorProfile?.companyName ??
      user.clientProfile?.companyName ??
      user.leadBuyerProfile?.companyName ??
      "—"
    );
  }

  const columns = [
    { key: "email", header: "メール", render: (row: User) => row.email },
    { key: "name", header: "企業名", render: (row: User) => getName(row) },
    { key: "role", header: "ロール", render: (row: User) => ROLE_LABELS[row.role] ?? row.role },
    {
      key: "status",
      header: "ステータス",
      render: (row: User) => {
        const s = STATUS_VARIANTS[row.status] ?? { label: row.status, variant: "neutral" };
        return <StatusBadge label={s.label} variant={s.variant as "success" | "warning" | "danger" | "info" | "neutral"} />;
      },
    },
    {
      key: "createdAt",
      header: "登録日",
      render: (row: User) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
    },
    {
      key: "actions",
      header: "",
      render: (row: User) => (
        <div className="flex gap-1">
          {row.status === "PENDING_APPROVAL" && (
            <Button
              size="sm"
              onClick={() => updateUserStatus(row.id, "ACTIVE")}
              disabled={actionLoading === row.id}
            >
              承認
            </Button>
          )}
          {row.status === "ACTIVE" && row.role !== "ADMIN" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateUserStatus(row.id, "SUSPENDED")}
              disabled={actionLoading === row.id}
            >
              凍結
            </Button>
          )}
          {row.status === "SUSPENDED" && (
            <Button
              size="sm"
              onClick={() => updateUserStatus(row.id, "ACTIVE")}
              disabled={actionLoading === row.id}
            >
              解除
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="ADMIN">
      <h1 className="text-2xl font-bold text-foreground">ユーザー管理</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="">全ロール</option>
          <option value="CLIENT">発注者</option>
          <option value="CONTRACTOR">受注者</option>
          <option value="LEAD_BUYER">リード購入者</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          <option value="">全ステータス</option>
          <option value="PENDING_APPROVAL">承認待ち</option>
          <option value="ACTIVE">有効</option>
          <option value="SUSPENDED">凍結</option>
        </select>
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={columns} data={users} emptyMessage="ユーザーがいません" />
        )}
      </div>
    </DashboardShell>
  );
}
