"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { HomeIcon, FolderIcon, MessageIcon, ChartIcon, PlusIcon } from "@/components/dashboard/icons";
import { SERVICE_UNIT_LABELS, BUILDING_TYPE_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/issuer", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/issuer/projects", label: "案件一覧", icon: <FolderIcon /> },
  { href: "/dashboard/issuer/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/issuer/analytics", label: "コスト分析", icon: <ChartIcon /> },
];

const STATUS_MAP: Record<string, { label: string; variant: string }> = {
  DRAFT: { label: "下書き", variant: "neutral" },
  OPEN: { label: "公開中", variant: "info" },
  IN_REVIEW: { label: "比較中", variant: "warning" },
  IN_PROGRESS: { label: "進行中", variant: "success" },
  COMPLETED: { label: "完了", variant: "success" },
  CANCELLED: { label: "キャンセル", variant: "danger" },
};

interface Project {
  id: string;
  serviceUnit: string;
  buildingType: string;
  prefecture: string | null;
  status: string;
  createdAt: string;
  _count: { proposals: number };
  [key: string]: unknown;
}

export function ProjectsListContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function load() {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/projects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.data);
      }
      setLoading(false);
    }
    load();
  }, [statusFilter]);

  const columns = [
    {
      key: "serviceUnit",
      header: "カテゴリー",
      render: (row: Project) => (
        <span className="text-xs">{SERVICE_UNIT_LABELS[row.serviceUnit]?.split("：")[0] ?? row.serviceUnit}</span>
      ),
    },
    {
      key: "buildingType",
      header: "建物種別",
      render: (row: Project) => BUILDING_TYPE_LABELS[row.buildingType] ?? row.buildingType,
    },
    {
      key: "prefecture",
      header: "エリア",
      render: (row: Project) => row.prefecture ?? "—",
    },
    {
      key: "proposals",
      header: "提案数",
      render: (row: Project) => row._count.proposals,
    },
    {
      key: "status",
      header: "ステータス",
      render: (row: Project) => {
        const s = STATUS_MAP[row.status] ?? { label: row.status, variant: "neutral" };
        return <StatusBadge label={s.label} variant={s.variant as "success" | "warning" | "danger" | "info" | "neutral"} />;
      },
    },
    {
      key: "createdAt",
      header: "作成日",
      render: (row: Project) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
    },
    {
      key: "actions",
      header: "",
      render: (row: Project) => (
        <Link href={`/dashboard/issuer/projects/${row.id}`} className="text-sm text-secondary hover:underline">
          詳細
        </Link>
      ),
    },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="CLIENT">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground">案件一覧</h1>
        <Link href="/dashboard/issuer/projects/new">
          <Button><PlusIcon className="mr-2 h-4 w-4" />新規案件を投稿</Button>
        </Link>
      </div>

      <div className="mt-4 flex gap-2">
        {["", "DRAFT", "OPEN", "IN_REVIEW", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s ? (STATUS_MAP[s]?.label ?? s) : "すべて"}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={columns} data={projects} emptyMessage="案件がありません" />
        )}
      </div>
    </DashboardShell>
  );
}
