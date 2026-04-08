import { requireRole } from "@/lib/auth/server";
import { ContractorDashboardContent } from "./contractor-dashboard-content";

export default async function ContractorDashboardPage() {
  const session = await requireRole("CONTRACTOR");

  return <ContractorDashboardContent email={session.email} />;
}
