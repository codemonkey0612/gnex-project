import { requireRole } from "@/lib/auth/server";
import { AdminDashboardContent } from "./admin-dashboard-content";

export default async function AdminDashboardPage() {
  const session = await requireRole("ADMIN");

  return <AdminDashboardContent email={session.email} />;
}
