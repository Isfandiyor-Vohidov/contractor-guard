"use server";

import { createServerClient } from "@/lib/supabase/server";
import { parseDocument } from "@/lib/ingestion/parser";
import { improveTZText } from "@/lib/ai/agents/improver";

export async function getImprovedTZ(auditId: string): Promise<string> {
  const supabase = await createServerClient();

  // Получаем результаты аудита
  const { data: auditResults } = await (supabase as any)
    .from("audit_results")
    .select("requirement, finding, status")
    .eq("audit_id", auditId);

  // Получаем сам аудит, чтобы узнать project_id
  const { data: audit } = await (supabase as any)
    .from("audits")
    .select("project_id")
    .eq("id", auditId)
    .single();

  if (!audit || !auditResults) throw new Error("Данные аудита не найдены");

  // Находим последний по времени документ типа TZ в этом проекте
  const { data: tzDoc } = await (supabase as any)
    .from("documents")
    .select("raw_text, file_url")
    .eq("project_id", audit.project_id)
    .eq("type", "TZ")
    .order("created_at", { ascending: false })
    .limit(1)
    .single(); // теперь в проекте будет только один документ, т.к. limit 1

  let originalTZ = tzDoc?.raw_text || "";
  if (!originalTZ && tzDoc?.file_url) {
    try {
      originalTZ = await parseDocument(tzDoc.file_url);
    } catch (e) {
      console.error("Не удалось извлечь текст из файла:", e);
    }
  }

  if (!originalTZ) throw new Error("Исходный ТЗ не найден. Загрузите новый файл ТЗ и повторите аудит.");

  return improveTZText(auditResults, originalTZ);
}