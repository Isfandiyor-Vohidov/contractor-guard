import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Workspace } from "@/components/workspace/workspace";
import { ProjectAudits } from "@/components/projects/project-audits";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createServerClient();
  
  // Используем as any, чтобы избежать ошибок типов
  const { data: project } = await (supabase as any)
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">
          Загрузите ТЗ и результат работы, затем запустите аудит.
        </p>
      </div>
      <Workspace projectId={projectId} />

      {/* История аудитов */}
      <ProjectAudits projectId={projectId} />
    </div>
  );
}