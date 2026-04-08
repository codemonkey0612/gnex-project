import { requireRole } from "@/lib/auth/server";
import { IssuerDashboardContent } from "./issuer-dashboard-content";

export default async function IssuerDashboardPage() {
  const session = await requireRole("CLIENT");

  return <IssuerDashboardContent email={session.email} />;
}
