import { z } from "zod";

// Атомарное требование, извлечённое агентом
export const atomicRequirementSchema = z.object({
  id: z.string().regex(/^REQ-\d{3}$/, "ID must be like REQ-001"),
  description: z.string().min(3),
  category: z.enum(["functional", "visual", "content", "security", "performance"]),
});

export type AtomicRequirement = z.infer<typeof atomicRequirementSchema>;

// Результат поиска соответствия
export const searchFindingSchema = z.object({
  finding: z.string(),
  evidence: z.string().optional(),
});

export type SearchFinding = z.infer<typeof searchFindingSchema>;

// Вердикт судьи
export const verdictSchema = z.object({
  status: z.enum(["ok", "partial", "fail"]),
  reason: z.string(),
});

export type Verdict = z.infer<typeof verdictSchema>;

// Итоговый результат аудита для одного требования
export const auditResultSchema = z.object({
  requirement: z.string(),
  finding: z.string(),
  status: z.enum(["ok", "partial", "fail"]),
});

export type AuditResult = z.infer<typeof auditResultSchema>;

// Тип для строки из audit_results таблицы (с id)
export interface AuditResultRow extends AuditResult {
  id: string;
  audit_id: string;
  created_at: string;
}