import { requireRole } from "@/lib/auth/server";
import { MessagesContent } from "./messages-content";

export default async function IssuerMessagesPage() {
  const session = await requireRole("CLIENT");

  return <MessagesContent userId={session.userId} role="CLIENT" />;
}
