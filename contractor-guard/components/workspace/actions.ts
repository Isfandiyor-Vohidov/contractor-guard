"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { runAuditPipeline } from "@/lib/ai/pipeline";

export async function startAudit(projectId: string, tzDocId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Проверка кредитов
  const { data: profile } = await (supabase as any)
    .from("users")
    .select("credits_balance")
    .eq("id", user.id)
    .single();

  if ((profile?.credits_balance ?? 0) < 1) {
    throw new Error("Недостаточно кредитов");
  }

  // Создаём аудит
  const { data: audit } = await (supabase as any)
    .from("audits")
    .insert({ project_id: projectId, status: "processing" })
    .select()
    .single();

  if (!audit) throw new Error("Не удалось создать аудит");

  // Списание кредитов
  await (supabase as any)
    .from("credit_transactions")
    .insert({
      user_id: user.id,
      amount: -1,
      type: "usage",
      audit_id: audit.id,
    });

  await (supabase as any)
    .from("users")
    .update({ credits_balance: profile.credits_balance - 1 })
    .eq("id", user.id);

  try {
    // Запускаем мок-пайплайн прямо сейчас
    await runAuditPipeline(audit.id, tzDocId, null, "normal");
  } catch (e) {
    // Если ошибка – помечаем failed и пробрасываем исключение
    await (supabase as any)
      .from("audits")
      .update({ status: "failed" })
      .eq("id", audit.id);
    throw e;
  }

  revalidatePath("/dashboard");
  return audit.id;
}