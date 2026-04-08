"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { HomeIcon, FolderIcon, MessageIcon, ChartIcon } from "@/components/dashboard/icons";
import { SERVICE_UNIT_LABELS, BUILDING_TYPE_LABELS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard/contractor", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/contractor/projects", label: "案件検索", icon: <FolderIcon /> },
  { href: "/dashboard/contractor/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/contractor/analytics", label: "実績", icon: <ChartIcon /> },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProjectData = any;

interface ProposalForm {
  content: string;
  priceMin: string;
  priceMax: string;
  cannotEstimate: string;
  estimatedDays: string;
}

export function ContractorProjectDetailContent({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectData>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [myProposal, setMyProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<ProposalForm>({
    content: "",
    priceMin: "",
    priceMax: "",
    cannotEstimate: "",
    estimatedDays: "",
  });

  useEffect(() => {
    async function load() {
      const [projectRes, proposalRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/proposals`),
      ]);
      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data.data);
      }
      if (proposalRes.ok) {
        const data = await proposalRes.json();
        if (data.data && data.data.length > 0) {
          setMyProposal(data.data[0]);
        }
      }
      setLoading(false);
    }
    load();
  }, [projectId]);

  async function handleSubmitProposal() {
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: form.content,
          priceMin: form.priceMin ? parseInt(form.priceMin, 10) : undefined,
          priceMax: form.priceMax ? parseInt(form.priceMax, 10) : undefined,
          cannotEstimate: form.cannotEstimate || undefined,
          estimatedDays: form.estimatedDays ? parseInt(form.estimatedDays, 10) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setMyProposal(data.data);
      setSuccess("提案を提出しました");
    } catch {
      setError("提案の提出中にエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell navItems={NAV_ITEMS} role="CONTRACTOR">
        <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell navItems={NAV_ITEMS} role="CONTRACTOR">
        <Alert variant="destructive"><AlertDescription>案件が見つかりません</AlertDescription></Alert>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={NAV_ITEMS} role="CONTRACTOR">
      <Link href="/dashboard/contractor/projects" className="text-sm text-secondary hover:underline">
        &larr; 案件検索
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-foreground">案件詳細</h1>

      {/* Project Info */}
      <div className="mt-4 rounded-lg border bg-card p-5">
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

      {/* My Proposal or Submit Form */}
      <div className="mt-6">
        {myProposal ? (
          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">あなたの提案</h2>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge
                label={myProposal.status === "SUBMITTED" ? "提出済" : myProposal.status === "SELECTED" ? "選定済" : myProposal.status === "REJECTED" ? "不採用" : myProposal.status}
                variant={myProposal.status === "SELECTED" ? "success" : myProposal.status === "REJECTED" ? "danger" : "info"}
              />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">{myProposal.content}</p>
            {(myProposal.priceMin || myProposal.priceMax) && (
              <p className="mt-2 text-sm text-muted-foreground">
                概算金額：¥{(myProposal.priceMin ?? 0).toLocaleString()} 〜 ¥{(myProposal.priceMax ?? 0).toLocaleString()}
              </p>
            )}
          </div>
        ) : project.status === "OPEN" ? (
          <div className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold text-foreground">提案を提出する</h2>

            {error && <Alert variant="destructive" className="mt-3"><AlertDescription>{error}</AlertDescription></Alert>}
            {success && <Alert variant="success" className="mt-3"><AlertDescription>{success}</AlertDescription></Alert>}

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">提案内容 *</Label>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="使用予定のメーカー・型番、施工方法、工事の流れなど"
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priceMin">概算金額 下限（円）</Label>
                  <Input
                    id="priceMin"
                    type="number"
                    value={form.priceMin}
                    onChange={(e) => setForm((f) => ({ ...f, priceMin: e.target.value }))}
                    placeholder="1000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMax">概算金額 上限（円）</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    value={form.priceMax}
                    onChange={(e) => setForm((f) => ({ ...f, priceMax: e.target.value }))}
                    placeholder="3000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cannotEstimate">概算見積不可の項目</Label>
                <Input
                  id="cannotEstimate"
                  value={form.cannotEstimate}
                  onChange={(e) => setForm((f) => ({ ...f, cannotEstimate: e.target.value }))}
                  placeholder="現地調査後に確定"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDays">概算工期（日）</Label>
                <Input
                  id="estimatedDays"
                  type="number"
                  value={form.estimatedDays}
                  onChange={(e) => setForm((f) => ({ ...f, estimatedDays: e.target.value }))}
                  placeholder="30"
                />
              </div>

              <Button onClick={handleSubmitProposal} disabled={submitting || !form.content} className="w-full">
                {submitting ? "提出中..." : "提案を提出する"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">この案件は現在応募を受け付けていません</p>
        )}
      </div>
    </DashboardShell>
  );
}
