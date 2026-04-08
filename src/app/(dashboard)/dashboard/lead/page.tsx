import { requireRole } from "@/lib/auth/server";
import { LeadDashboardContent } from "./lead-dashboard-content";

export default async function LeadDashboardPage() {
  const session = await requireRole("LEAD_BUYER");

  return <LeadDashboardContent email={session.email} />;
}
