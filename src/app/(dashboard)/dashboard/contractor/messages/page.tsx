import { requireRole } from "@/lib/auth/server";
import { MessagesContent } from "../../issuer/messages/messages-content";

export default async function ContractorMessagesPage() {
  const session = await requireRole("CONTRACTOR");

  return <MessagesContent userId={session.userId} role="CONTRACTOR" />;
}
