"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  SearchIcon,
  CreditCardIcon,
  FolderIcon,
} from "@/components/dashboard/icons";
import { BUILDING_TYPE_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/lead", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/lead/opportunities", label: "リード案件", icon: <SearchIcon /> },
  { href: "/dashboard/lead/history", label: "購入履歴", icon: <CreditCardIcon /> },
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  SUBSIDY: "補助金",
  FINANCE: "融資・リース",
  WASTE: "産廃",
};

interface LeadRow {
  id: string;
  buildingType: string;
  prefecture: string | null;
  leadType: string;
  priceYen: number;
  createdAt: string;
  [key: string]: unknown;
}

const LEAD_COLUMNS = [
  {
    key: "prefecture",
    header: "エリア",
    render: (row: LeadRow) => row.prefecture ?? "—",
  },
  {
    key: "buildingType",
    header: "建物種別",
    className: "hidden sm:table-cell",
    render: (row: LeadRow) => BUILDING_TYPE_LABELS[row.buildingType] ?? row.buildingType,
  },
  {
    key: "leadType",
    header: "ニーズ",
    render: (row: LeadRow) => LEAD_TYPE_LABELS[row.leadType] ?? row.leadType,
  },
  {
    key: "priceYen",
    header: "料金",
    render: (row: LeadRow) => `¥${row.priceYen.toLocaleString()}`,
  },
  {
    key: "actions",
    header: "",
    render: (_row: LeadRow) => (
      <Link href="/dashboard/lead/opportunities">
        <Button size="sm" variant="outline">開示する</Button>
      </Link>
    ),
  },
];

export function LeadDashboardContent({ email }: { email: string }) {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [stats, setStats] = useState({ available: 0, purchased: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [leadsRes, purchasesRes, notifRes] = await Promise.all([
          fetch("/api/leads?limit=5"),
          fetch("/api/leads/purchases?limit=5"),
          fetch("/api/notifications"),
        ]);

        if (leadsRes.ok) {
          const data = await leadsRes.json();
          setLeads(data.data ?? []);
          setStats((s) => ({ ...s, available: data.data?.length ?? 0 }));
        }

        if (purchasesRes.ok) {
          const data = await purchasesRes.json();
          setStats((s) => ({ ...s, purchased: data.pagination?.total ?? 0 }));
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
    <DashboardShell navItems={NAV_ITEMS} role="LEAD_BUYER">
      <div>
        <h1 className="text-2xl font-bold text-foreground">パートナーダッシュボード</h1>
        <p className="mt-1 text-sm text-muted-foreground">ようこそ、{email} さん</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="対象リード案件" value={loading ? "..." : stats.available} icon={<SearchIcon />} />
        <StatCard title="購入済みリード" value={loading ? "..." : stats.purchased} icon={<FolderIcon />} />
        <StatCard title="未読通知" value={loading ? "..." : stats.unread} icon={<CreditCardIcon />} />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">リード案件一覧（匿名）</h2>
          <Link href="/dashboard/lead/opportunities" className="text-sm text-secondary hover:underline">
            すべて見る
          </Link>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          「開示する」ボタンで連絡先情報を購入できます。購入前の情報は匿名です。
        </p>
        {loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={LEAD_COLUMNS} data={leads} emptyMessage="対象のリード案件がありません" />
        )}
      </div>
    </DashboardShell>
  );
}
