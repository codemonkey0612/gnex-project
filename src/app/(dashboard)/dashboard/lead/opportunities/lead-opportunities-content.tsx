"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface Lead {
  id: string;
  buildingType: string;
  prefecture: string | null;
  serviceUnit: string;
  leadType: string;
  priceYen: number;
  createdAt: string;
  [key: string]: unknown;
}

interface RevealedContact {
  email: string;
  companyName: string | null;
  contactName: string | null;
  phone: string | null;
  prefecture: string | null;
  city: string | null;
}

export function LeadOpportunitiesContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [revealedContact, setRevealedContact] = useState<RevealedContact | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handlePurchase(lead: Lead) {
    if (!confirm(`このリードを¥${lead.priceYen.toLocaleString()}で購入しますか？`)) return;
    setPurchasing(lead.id);
    setError("");
    try {
      const res = await fetch(`/api/leads/${lead.id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadType: lead.leadType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setRevealedContact(data.data.contact);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    } catch {
      setError("購入中にエラーが発生しました");
    } finally {
      setPurchasing(null);
    }
  }

  const columns = [
    {
      key: "buildingType",
      header: "建物種別",
      render: (row: Lead) => BUILDING_TYPE_LABELS[row.buildingType] ?? row.buildingType,
    },
    {
      key: "prefecture",
      header: "エリア",
      render: (row: Lead) => row.prefecture ?? "—",
    },
    {
      key: "leadType",
      header: "リード種別",
      render: (row: Lead) => LEAD_TYPE_LABELS[row.leadType] ?? row.leadType,
    },
    {
      key: "priceYen",
      header: "単価",
      render: (row: Lead) => `¥${row.priceYen.toLocaleString()}`,
    },
    {
      key: "createdAt",
      header: "投稿日",
      render: (row: Lead) => new Date(row.createdAt).toLocaleDateString("ja-JP"),
    },
    {
      key: "actions",
      header: "",
      render: (row: Lead) => (
        <Button
          size="sm"
          onClick={() => handlePurchase(row)}
          disabled={purchasing === row.id}
        >
          {purchasing === row.id ? "処理中..." : "開示する"}
        </Button>
      ),
    },
  ];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="LEAD_BUYER">
      <h1 className="text-2xl font-bold text-foreground">リード案件</h1>
      <p className="mt-1 text-sm text-muted-foreground">あなたのカテゴリーに合致するリード案件を表示しています</p>

      {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}

      {revealedContact && (
        <Alert variant="success" className="mt-4">
          <AlertDescription>
            <p className="font-medium">連絡先が開示されました</p>
            <div className="mt-2 space-y-1 text-sm">
              {revealedContact.companyName && <p>企業名：{revealedContact.companyName}</p>}
              {revealedContact.contactName && <p>担当者：{revealedContact.contactName}</p>}
              <p>メール：{revealedContact.email}</p>
              {revealedContact.phone && <p>電話：{revealedContact.phone}</p>}
              {revealedContact.prefecture && <p>所在地：{revealedContact.prefecture} {revealedContact.city}</p>}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
        ) : (
          <DataTable columns={columns} data={leads} emptyMessage="対象のリード案件がありません" />
        )}
      </div>
    </DashboardShell>
  );
}
