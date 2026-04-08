"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { HomeIcon, FolderIcon, MessageIcon, ChartIcon } from "@/components/dashboard/icons";
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

interface Proposal {
  id: string;
  blindLabel: string;
  content: string;
  priceMin: number | null;
  priceMax: number | null;
  cannotEstimate: string | null;
  estimatedDays: number | null;
  status: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProjectData = any;

export function ProjectDetailContent({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.data);
      } else {
        setError("案件が見つかりません");
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function updateStatus(status: string) {
    setActionLoading(true);
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setProject(data.data);
      // Reload to get updated proposals
      window.location.reload();
    }
    setActionLoading(false);
  }

  async function selectProposal(proposalId: string) {
    if (!confirm("この業者を選定しますか？他の提案は不採用となります。")) return;
    setActionLoading(true);
    const res = await fetch(`/api/projects/${projectId}/proposals/${proposalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SELECTED" }),
    });
    if (res.ok) {
      window.location.reload();
    }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <DashboardShell navItems={NAV_ITEMS} role="CLIENT">
        <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
      </DashboardShell>
    );
  }

  if (error || !project) {
    return (
      <DashboardShell navItems={NAV_ITEMS} role="CLIENT">
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      </DashboardShell>
    );
  }

  const status = STATUS_MAP[project.status] ?? { label: project.status, variant: "neutral" };
  const proposals: Proposal[] = project.proposals ?? [];

  return (
    <DashboardShell navItems={NAV_ITEMS} role="CLIENT">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/issuer/projects" className="text-sm text-secondary hover:underline">
            &larr; 案件一覧
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-foreground">案件詳細</h1>
        </div>
        <StatusBadge label={status.label} variant={status.variant as "success" | "warning" | "danger" | "info" | "neutral"} />
      </div>

      {/* Project Info */}
      <div className="mt-6 rounded-lg border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">サービスUnit</p>
            <p className="font-medium">{SERVICE_UNIT_LABELS[project.serviceUnit] ?? project.serviceUnit}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">建物種別</p>
            <p className="font-medium">{BUILDING_TYPE_LABELS[project.buildingType] ?? project.buildingType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">所在地</p>
            <p className="font-medium">{[project.prefecture, project.city].filter(Boolean).join(" ") || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">予算目安</p>
            <p className="font-medium">
              {project.budgetMin || project.budgetMax
                ? `${project.budgetMin ?? "—"}万円 〜 ${project.budgetMax ?? "—"}万円`
                : "—"}
            </p>
          </div>
        </div>
        {project.description && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">依頼内容</p>
            <p className="mt-1 whitespace-pre-wrap text-sm">{project.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {project.status === "DRAFT" && (
          <Button onClick={() => updateStatus("OPEN")} disabled={actionLoading}>公開する</Button>
        )}
        {project.status === "OPEN" && proposals.length > 0 && (
          <Button onClick={() => updateStatus("IN_REVIEW")} disabled={actionLoading}>見積比較に進む</Button>
        )}
        {(project.status === "DRAFT" || project.status === "OPEN") && (
          <Button variant="outline" onClick={() => updateStatus("CANCELLED")} disabled={actionLoading}>
            キャンセル
          </Button>
        )}
        {project.status === "IN_PROGRESS" && (
          <Button onClick={() => updateStatus("COMPLETED")} disabled={actionLoading}>完了にする</Button>
        )}
      </div>

      {/* Files */}
      {project.files && project.files.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-foreground">添付ファイル</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {project.files.map((f: { id: string; fileName: string; fileUrl: string; mimeType: string }) => (
              <a key={f.id} href={f.fileUrl} target="_blank" rel="noopener noreferrer"
                className="rounded-lg border bg-card p-3 text-center hover:bg-accent/50 transition-colors">
                <p className="truncate text-xs text-muted-foreground">{f.fileName}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Proposals - Blind Comparison */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-foreground">
          提案一覧（{proposals.length}件）
        </h2>
        {proposals.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">まだ提案がありません</p>
        ) : (
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {proposals.map((p) => (
              <div key={p.id} className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{p.blindLabel}</h3>
                  <StatusBadge
                    label={p.status === "SUBMITTED" ? "提出済" : p.status === "SELECTED" ? "選定済" : p.status === "REJECTED" ? "不採用" : p.status}
                    variant={p.status === "SELECTED" ? "success" : p.status === "REJECTED" ? "danger" : "info"}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.content}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">概算金額：</span>
                    <span className="font-medium">
                      {p.priceMin || p.priceMax
                        ? `¥${(p.priceMin ?? 0).toLocaleString()} 〜 ¥${(p.priceMax ?? 0).toLocaleString()}`
                        : p.cannotEstimate ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">工期：</span>
                    <span className="font-medium">{p.estimatedDays ? `約${p.estimatedDays}日` : "—"}</span>
                  </div>
                </div>
                {(project.status === "OPEN" || project.status === "IN_REVIEW") && p.status === "SUBMITTED" && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => selectProposal(p.id)} disabled={actionLoading}>
                      この業者を選定
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
