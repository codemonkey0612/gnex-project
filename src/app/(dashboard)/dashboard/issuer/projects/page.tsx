import { requireRole } from "@/lib/auth/server";
import { ProjectsListContent } from "./projects-list-content";

export default async function IssuerProjectsPage() {
  await requireRole("CLIENT");

  return <ProjectsListContent />;
}
