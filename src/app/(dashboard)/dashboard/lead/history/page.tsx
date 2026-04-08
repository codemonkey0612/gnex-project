import { requireRole } from "@/lib/auth/server";
import { PurchaseHistoryContent } from "./purchase-history-content";

export default async function PurchaseHistoryPage() {
  await requireRole("LEAD_BUYER");

  return <PurchaseHistoryContent />;
}
