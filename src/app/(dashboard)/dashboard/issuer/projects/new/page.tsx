import { requireRole } from "@/lib/auth/server";
import { ProjectWizard } from "./project-wizard";

export default async function NewProjectPage() {
  await requireRole("CLIENT");

  return <ProjectWizard />;
}
