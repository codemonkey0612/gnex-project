import { requireRole } from "@/lib/auth/server";
import { LeadOpportunitiesContent } from "./lead-opportunities-content";

export default async function LeadOpportunitiesPage() {
  await requireRole("LEAD_BUYER");

  return <LeadOpportunitiesContent />;
}
