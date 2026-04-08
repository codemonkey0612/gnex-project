"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import {
  HomeIcon,
  SearchIcon,
  FolderIcon,
  MessageIcon,
  ChartIcon,
} from "@/components/dashboard/icons";
import { SERVICE_UNIT_LABELS, BUILDING_TYPE_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/contractor", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/contractor/projects", label: "案件検索", icon: <SearchIcon /> },
  { href: "/dashboard/contractor/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/contractor/analytics", label: "実績", icon: <ChartIcon /> },
];

interface ProjectRow {
  id: string;
  serviceUnit: string;
  buildingType: string;
  prefecture: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  createdAt: string;
  [key: string]: unknown;
}

const PROJECT_COLUMNS = [
  {
    key: "serviceUnit",
    header: "カテゴリー",
    render: (row: ProjectRow) => (
      <span className="font-medium text-foreground">
        {SERVICE_UNIT_LABELS[row.serviceUnit]?.split("：")[0] ?? row.serviceUnit}
      </span>
    ),
  },
  {
    key: "buildingType",
    header: "建物種別",
    className: "hidden md:table-cell",
    render: (row: ProjectRow) => BUILDING_TYPE_LABELS[row.buildingType] ?? row.buildingType,
  },
  {
    key: "prefecture",
    header: "エリア",
    className: "hidden sm:table-cell",
    render: (row: ProjectRow) => row.prefecture ?? "—",
  },
  {
    key: "createdAt",
    header: "投稿",
    className: "text-right",
    render: (row: ProjectRow) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
  },
  {
    key: "actions",
    header: "",
    render: (row: ProjectRow) => (
      <Link href={`/dashboard/contractor/projects/${row.id}`} className="text-sm text-secondary hover:underline">
        詳細
      </Link>
    ),
  },
];

export function ContractorDashboardContent({ email }: { email: string }) {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [stats, setStats] = useState({ available: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projectsRes, notifRes] = await Promise.all([
          fetch("/api/projects?limit=5"),
          fetch("/api/notifications"),
        ]);

        if (projectsRes.ok) {
          const data = await projectsRes.json();
          setProjects(data.data ?? []);
          setStats((s) => ({ ...s, available: data.pagination?.total ?? 0 }));
        }

        if (notifRes.ok) {
          const data = await notifRes.json();
          setStats((s) => ({ ...s, unread: data.unreadCount ?? 0 }));
        }
      } catch {
        // Silently fail
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <DashboardShell navItems={NAV_ITEMS} role="CONTRACTOR">
      <div>
        <h1 className="text-2xl font-bold text-foreground">受注者ダッシュボード</h1>
        <p className="mt-1 text-sm text-muted-foreground">ようこそ、{email} さん</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="対応可能な案件" value={loading ? "..." : stats.available} icon={<SearchIcon />} />
        <StatCard title="未読通知" value={loading ? "..." : stats.unread} icon={<MessageIcon />} />
        <StatCard title="実績" value="—" subtitle="案件完了後に更新" icon={<FolderIcon />} />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">新着案件</h2>
          <Link href="/dashboard/contractor/projects" className="text-sm text-secondary hover:underline">
            すべて見る
          </Link>
        </div>
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={PROJECT_COLUMNS} data={projects} emptyMessage="対応可能な案件がありません" />
        )}
      </div>
    </DashboardShell>
  );
}
