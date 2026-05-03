import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function ProjectSettingsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const supabase = createServerClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.projectId)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Настройки проекта: {project?.name}</h1>
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Переименовать проект</h2>
          <form className="mt-2 flex gap-2">
            <input
              type="text"
              defaultValue={project?.name}
              className="flex-1 rounded border px-3 py-2"
            />
            <Button type="submit">Сохранить</Button>
          </form>
        </div>

        <div className="rounded-lg border border-red-200 p-4">
          <h2 className="font-semibold text-red-600">Опасная зона</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Удаление проекта приведёт к безвозвратной потере всех связанных документов и аудитов.
          </p>
          <form className="mt-2">
            <Button type="submit" variant="destructive">
              Удалить проект
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}