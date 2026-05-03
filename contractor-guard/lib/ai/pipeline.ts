import { supabaseAdmin } from "../supabase/admin";
import { extractorAgent } from "./agents/extractor";
import { qualityAnalyzer } from "./agents/quality-analyzer"; // новый агент
import { maskText } from "../security/data-mask";
import { parseDocument } from "../ingestion/parser";
import type { AuditResult } from "@/types/audit";

export async function runAuditPipeline(
  auditId: string,
  tzDocId: string,
  resultDocId: string | null,
  severity: string
): Promise<AuditResult[]> {
  // 1. Получаем ТЗ
  const { data: tzDoc } = await (supabaseAdmin as any)
    .from("documents")
    .select("raw_text, file_url")
    .eq("id", tzDocId)
    .single();
  if (!tzDoc) throw new Error("ТЗ не найден");

  let tzText = tzDoc.raw_text || "";
  if (!tzText && tzDoc.file_url) {
    tzText = await parseDocument(tzDoc.file_url);
  }
  tzText = maskText(tzText);

  // 2. Извлекаем требования (ручной парсер, без LLM)
  const requirements = await extractorAgent(tzText, severity);

  // 3. Анализ качества требований (мок)
  const results = await qualityAnalyzer(requirements);

  // 4. Сохраняем и считаем баллы
  await (supabaseAdmin as any).from("audit_results").insert(
    results.map((r) => ({
      audit_id: auditId,
      requirement: r.requirement,
      finding: r.finding,
      status: r.status,
    }))
  );

  const ok = results.filter((r) => r.status === "ok").length;
  const partial = results.filter((r) => r.status === "partial").length;
  const total = results.length || 1;
  const score = Math.round(((ok * 1 + partial * 0.5) / total) * 100);
  await (supabaseAdmin as any)
    .from("audits")
    .update({ status: "success", score })
    .eq("id", auditId);

  return results;
}