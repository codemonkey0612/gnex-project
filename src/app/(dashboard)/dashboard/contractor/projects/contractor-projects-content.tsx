"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { HomeIcon, FolderIcon, MessageIcon, ChartIcon } from "@/components/dashboard/icons";
import { SERVICE_UNIT_LABELS, BUILDING_TYPE_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/contractor", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/contractor/projects", label: "案件検索", icon: <FolderIcon /> },
  { href: "/dashboard/contractor/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/contractor/analytics", label: "実績", icon: <ChartIcon /> },
];

interface Project {
  id: string;
  serviceUnit: string;
  buildingType: string;
  prefecture: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  createdAt: string;
  [key: string]: unknown;
}

export function ContractorProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const columns = [
    {
      key: "serviceUnit",
      header: "カテゴリー",
      render: (row: Project) => SERVICE_UNIT_LABELS[row.serviceUnit]?.split("：")[0] ?? row.serviceUnit,
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
      key: "budget",
      header: "予算目安",
      render: (row: Project) =>
        row.budgetMin || row.budgetMax
          ? `${row.budgetMin ?? "—"}〜${row.budgetMax ?? "—"}万円`
          : "—",
    },
    {
      key: "createdAt",
      header: "投稿日",
      render: (row: Project) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
    },
    {
      key: "actions",
      header: "",
      render: (row: Project) => (
        <Link href={`/dashboard/contractor/projects/${row.id}`} className="text-sm text-secondary hover:underline">
          詳細・応募
        </Link>
      ),
    },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="CONTRACTOR">
      <h1 className="text-2xl font-bold text-foreground">案件検索</h1>
      <p className="mt-1 text-sm text-muted-foreground">あなたの対応エリア・Unitに合致する案件を表示しています</p>

      <div className="mt-6">
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={columns} data={projects} emptyMessage="対応可能な案件がありません" />
        )}
      </div>
    </DashboardShell>
  );
}
