import { requireRole } from "@/lib/auth/server";
import { ContractorProjectsContent } from "./contractor-projects-content";

export default async function ContractorProjectsPage() {
  await requireRole("CONTRACTOR");

  return <ContractorProjectsContent />;
}
