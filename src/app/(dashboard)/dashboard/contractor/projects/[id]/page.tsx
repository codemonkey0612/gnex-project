import { requireRole } from "@/lib/auth/server";
import { ContractorProjectDetailContent } from "./contractor-project-detail-content";

export default async function ContractorProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("CONTRACTOR");
  const { id } = await params;

  return <ContractorProjectDetailContent projectId={id} />;
}
