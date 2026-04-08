"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ConversationThread } from "@/components/dashboard/conversation-thread";
import { HomeIcon, FolderIcon, MessageIcon, ChartIcon } from "@/components/dashboard/icons";

const ISSUER_NAV = [
  { href: "/dashboard/issuer", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/issuer/projects", label: "案件一覧", icon: <FolderIcon /> },
  { href: "/dashboard/issuer/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/issuer/analytics", label: "コスト分析", icon: <ChartIcon /> },
];

const CONTRACTOR_NAV = [
  { href: "/dashboard/contractor", label: "ホーム", icon: <HomeIcon /> },
  { href: "/dashboard/contractor/projects", label: "案件検索", icon: <FolderIcon /> },
  { href: "/dashboard/contractor/messages", label: "メッセージ", icon: <MessageIcon /> },
  { href: "/dashboard/contractor/analytics", label: "実績", icon: <ChartIcon /> },
];

interface Conversation {
  id: string;
  projectId: string | null;
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
  unreadCount: number;
  otherParticipants: Array<{
    id: string;
    email: string;
    clientProfile?: { contactName: string; companyName: string | null } | null;
    contractorProfile?: { contactName: string; companyName: string } | null;
    leadBuyerProfile?: { contactName: string; companyName: string } | null;
  }>;
  updatedAt: string;
}

function getParticipantName(p: Conversation["otherParticipants"][0]): string {
  return (
    p.contractorProfile?.companyName ??
    p.clientProfile?.companyName ??
    p.leadBuyerProfile?.companyName ??
    p.email
  );
}

export function MessagesContent({ userId, role }: { userId: string; role: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const navItems = role === "CONTRACTOR" ? CONTRACTOR_NAV : ISSUER_NAV;

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data);
        if (data.data.length > 0 && !selectedId) {
          setSelectedId(data.data[0].id);
        }
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardShell navItems={navItems} role={role}>
      <h1 className="text-2xl font-bold text-foreground">メッセージ</h1>

      {loading ? (
        <p className="py-8 text-center text-muted-foreground">読み込み中...</p>
      ) : conversations.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">メッセージはまだありません</p>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* Conversation List */}
          <div className="space-y-1 lg:col-span-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedId === conv.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate">
                    {conv.otherParticipants.map(getParticipantName).join(", ")}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                {conv.lastMessage && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {conv.lastMessage.content}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Thread */}
          <div className="lg:col-span-2">
            {selectedId ? (
              <ConversationThread
                conversationId={selectedId}
                currentUserId={userId}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                会話を選択してください
              </p>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
