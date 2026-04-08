"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { HomeIcon, FolderIcon, ChartIcon } from "@/components/dashboard/icons";
import { BUILDING_TYPE_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/lead", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/lead/opportunities", label: "リード案件", icon: <FolderIcon /> },
  { href: "/dashboard/lead/history", label: "購入履歴", icon: <ChartIcon /> },
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  SUBSIDY: "補助金",
  FINANCE: "融資・リース",
  WASTE: "産廃",
};

interface Purchase {
  id: string;
  leadType: string;
  priceYen: number;
  createdAt: string;
  project: {
    id: string;
    buildingType: string;
    prefecture: string | null;
    city: string | null;
    owner: {
      email: string;
      clientProfile: {
        companyName: string | null;
        contactName: string | null;
        phone: string | null;
      } | null;
    };
  };
  [key: string]: unknown;
}

export function PurchaseHistoryContent() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/leads/purchases");
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const columns = [
    {
      key: "leadType",
      header: "種別",
      render: (row: Purchase) => LEAD_TYPE_LABELS[row.leadType] ?? row.leadType,
    },
    {
      key: "building",
      header: "建物種別",
      render: (row: Purchase) => BUILDING_TYPE_LABELS[row.project.buildingType] ?? row.project.buildingType,
    },
    {
      key: "area",
      header: "エリア",
      render: (row: Purchase) => [row.project.prefecture, row.project.city].filter(Boolean).join(" ") || "—",
    },
    {
      key: "company",
      header: "企業名",
      render: (row: Purchase) => row.project.owner.clientProfile?.companyName ?? "—",
    },
    {
      key: "contact",
      header: "担当者",
      render: (row: Purchase) => row.project.owner.clientProfile?.contactName ?? "—",
    },
    {
      key: "email",
      header: "メール",
      render: (row: Purchase) => row.project.owner.email,
    },
    {
      key: "price",
      header: "購入額",
      render: (row: Purchase) => `¥${row.priceYen.toLocaleString()}`,
    },
    {
      key: "date",
      header: "購入日",
      render: (row: Purchase) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
    },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="LEAD_BUYER">
      <h1 className="text-2xl font-bold text-foreground">購入履歴</h1>

      <div className="mt-4">
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={columns} data={purchases} emptyMessage="購入履歴がありません" />
        )}
      </div>
    </DashboardShell>
  );
}
