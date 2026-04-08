"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { HomeIcon, FolderIcon, ChartIcon } from "@/components/dashboard/icons";
import { UsersIcon } from "@/components/dashboard/icons";

const NAV_ITEMS = [
  { href: "/dashboard/admin", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/admin/users", label: "ユーザー管理", icon: <UsersIcon /> },
  { href: "/dashboard/admin/leads", label: "リード単価", icon: <ChartIcon /> },
  { href: "/dashboard/admin/projects", label: "案件管理", icon: <FolderIcon /> },
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  SUBSIDY: "補助金（士業向け）",
  FINANCE: "融資・リース（金融向け）",
  WASTE: "産廃（有価物買取業者向け）",
};

interface PricingItem {
  id: string;
  leadType: string;
  priceYen: number;
  isActive: boolean;
  purchaseCount: number;
  totalRevenue: number;
}

export function AdminLeadPricingContent() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/lead-pricing");
      if (res.ok) {
        const data = await res.json();
        setPricing(data.data);
        const vals: Record<string, string> = {};
        for (const p of data.data) {
          vals[p.leadType] = String(p.priceYen);
        }
        setEditValues(vals);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(leadType: string) {
    setSaving(leadType);
    setMessage("");
    const priceYen = parseInt(editValues[leadType], 10);
    if (isNaN(priceYen) || priceYen <= 0) {
      setMessage("有効な金額を入力してください");
      setSaving(null);
      return;
    }
    const res = await fetch("/api/admin/lead-pricing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadType, priceYen }),
    });
    if (res.ok) {
      setPricing((prev) =>
        prev.map((p) => (p.leadType === leadType ? { ...p, priceYen } : p)),
      );
      setMessage("単価を更新しました");
    }
    setSaving(null);
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} role="ADMIN">
      <h1 className="text-2xl font-bold text-foreground">リード単価管理</h1>

      {message && (
        <Alert variant="success" className="mt-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
        ) : (
          pricing.map((p) => (
            <div key={p.leadType} className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold text-foreground">
                {LEAD_TYPE_LABELS[p.leadType] ?? p.leadType}
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>現在の単価（円）</Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      type="number"
                      value={editValues[p.leadType] ?? ""}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, [p.leadType]: e.target.value }))
                      }
                    />
                    <Button
                      onClick={() => handleSave(p.leadType)}
                      disabled={saving === p.leadType}
                    >
                      保存
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">購入件数</p>
                  <p className="mt-1 text-xl font-bold">{p.purchaseCount}件</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">累計売上</p>
                  <p className="mt-1 text-xl font-bold">¥{p.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
