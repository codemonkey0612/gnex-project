import { requireRole } from "@/lib/auth/server";
import { AdminUsersContent } from "./admin-users-content";

export default async function AdminUsersPage() {
  await requireRole("ADMIN");

  return <AdminUsersContent />;
}
