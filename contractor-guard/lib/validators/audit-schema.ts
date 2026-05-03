import { z } from "zod";

export const startAuditSchema = z.object({
  projectId: z.string().uuid(),
  tzDocId: z.string().uuid(),
  resultDocId: z.string().uuid(),
  severity: z.enum(["soft", "normal", "strict"]),
});

export const auditResultSchema = z.object({
  id: z.string(),
  auditId: z.string(),
  requirement: z.string(),
  finding: z.string(),
  status: z.enum(["ok", "partial", "fail"]),
  evidenceSnippet: z.string().optional(),
});

export type StartAuditInput = z.infer<typeof startAuditSchema>;
export type AuditResult = z.infer<typeof auditResultSchema>;