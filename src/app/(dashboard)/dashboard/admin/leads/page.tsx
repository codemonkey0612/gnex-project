import { requireRole } from "@/lib/auth/server";
import { AdminLeadPricingContent } from "./admin-lead-pricing-content";

export default async function AdminLeadPricingPage() {
  await requireRole("ADMIN");

  return <AdminLeadPricingContent />;
}
