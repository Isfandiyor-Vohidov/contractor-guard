import { createProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProjectPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Новый проект</h1>
      <form action={createProject} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Название проекта
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Например: Редизайн сайта"
            required
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="submit">Создать</Button>
        </div>
      </form>
    </div>
  );
}