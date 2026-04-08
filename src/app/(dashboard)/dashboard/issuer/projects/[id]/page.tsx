import { requireRole } from "@/lib/auth/server";
import { ProjectDetailContent } from "./project-detail-content";

export default async function IssuerProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("CLIENT");
  const { id } = await params;

  return <ProjectDetailContent projectId={id} />;
}
