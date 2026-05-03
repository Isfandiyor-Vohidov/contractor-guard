"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProject(formData: FormData) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name || !name.trim()) throw new Error("Название обязательно");

  // Временно обходим проблему типизации supabase
  const { data: project, error } = await (supabase as any)
    .from("projects")
    .insert({ user_id: user.id, name: name.trim() })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}