"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { SimpleBarChart } from "@/components/dashboard/simple-bar-chart";
import { SimplePieChart } from "@/components/dashboard/pie-chart";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  HomeIcon,
  FolderIcon,
  MessageIcon,
  ChartIcon,
  PlusIcon,
} from "@/components/dashboard/icons";
import { SERVICE_UNIT_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/issuer", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/issuer/projects", label: "案件一覧", icon: <FolderIcon /> },
  { href: "/dashboard/issuer/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/issuer/analytics", label: "コスト分析", icon: <ChartIcon /> },
];

const COST_BREAKDOWN = [
  { label: "電気", value: 55, color: "hsl(215, 60%, 35%)" },
  { label: "ガス", value: 20, color: "hsl(215, 50%, 55%)" },
  { label: "産廃処理", value: 15, color: "hsl(40, 80%, 55%)" },
  { label: "その他", value: 10, color: "hsl(0, 0%, 75%)" },
];

const STATUS_MAP: Record<string, { label: string; variant: string }> = {
  OPEN: { label: "公開中", variant: "success" },
  IN_REVIEW: { label: "見積比較中", variant: "info" },
  IN_PROGRESS: { label: "進行中", variant: "warning" },
  DRAFT: { label: "下書き", variant: "neutral" },
  COMPLETED: { label: "完了", variant: "success" },
  CANCELLED: { label: "キャンセル", variant: "danger" },
};

interface ProjectRow {
  id: string;
  serviceUnit: string;
  status: string;
  _count: { proposals: number };
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
    key: "status",
    header: "ステータス",
    render: (row: ProjectRow) => {
      const s = STATUS_MAP[row.status] ?? STATUS_MAP.DRAFT;
      return (
        <StatusBadge
          label={s.label}
          variant={s.variant as "success" | "info" | "warning" | "neutral"}
        />
      );
    },
  },
  {
    key: "proposals",
    header: "見積",
    className: "hidden sm:table-cell",
    render: (row: ProjectRow) => <span>{row._count?.proposals ?? 0}件</span>,
  },
  {
    key: "actions",
    header: "",
    render: (row: ProjectRow) => (
      <Link
        href={`/dashboard/issuer/projects/${row.id}`}
        className="text-sm text-secondary hover:underline"
      >
        詳細
      </Link>
    ),
  },
];

export function IssuerDashboardContent({ email }: { email: string }) {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [stats, setStats] = useState({ active: 0, proposals: 0, unread: 0 });
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
          const projectList = data.data ?? [];
          setProjects(projectList);

          const activeCount = projectList.filter(
            (p: ProjectRow) => p.status === "OPEN" || p.status === "IN_REVIEW" || p.status === "IN_PROGRESS",
          ).length;
          const totalProposals = projectList.reduce(
            (sum: number, p: ProjectRow) => sum + (p._count?.proposals ?? 0),
            0,
          );
          setStats((s) => ({ ...s, active: activeCount, proposals: totalProposals }));
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

  // Placeholder chart data (would come from ElectricityBill API in full implementation)
  const monthlyCosts = [
    { label: "10月", value: 420000 },
    { label: "11月", value: 380000 },
    { label: "12月", value: 450000 },
    { label: "1月", value: 510000 },
    { label: "2月", value: 470000 },
    { label: "3月", value: 390000 },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="CLIENT">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            発注者ダッシュボード
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ようこそ、{email} さん
          </p>
        </div>
        <Link href="/dashboard/issuer/projects/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            新規案件を投稿
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="進行中の案件"
          value={loading ? "..." : stats.active}
          icon={<FolderIcon />}
        />
        <StatCard
          title="受け取った見積"
          value={loading ? "..." : stats.proposals}
          icon={<ChartIcon />}
        />
        <StatCard
          title="未読通知"
          value={loading ? "..." : stats.unread}
          icon={<MessageIcon />}
        />
        <StatCard
          title="月間推定削減額"
          value="—"
          subtitle="シミュレーターで計算"
          icon={<ChartIcon />}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SimpleBarChart
          data={monthlyCosts}
          title="月間電気料金推移（円）"
          unit="円"
        />
        <SimplePieChart data={COST_BREAKDOWN} title="コスト内訳" />
      </div>

      {/* Projects Table */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">案件一覧</h2>
          <Link
            href="/dashboard/issuer/projects"
            className="text-sm text-secondary hover:underline"
          >
            すべて見る
          </Link>
        </div>
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable
            columns={PROJECT_COLUMNS}
            data={projects}
            emptyMessage="案件がありません。新規案件を投稿しましょう。"
          />
        )}
      </div>
    </DashboardShell>
  );
}
