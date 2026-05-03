import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AuditReport } from "@/components/report/audit-report";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ auditId: string; projectId: string }>;
}) {
  const { auditId, projectId } = await params;
  const supabase = await createServerClient();

  const { data: audit, error: auditError } = await (supabase as any)
    .from("audits")
    .select("id, status, score")
    .eq("id", auditId)
    .single();

  if (auditError || !audit) notFound();

  const { data: results } = await (supabase as any)
    .from("audit_results")
    .select("id, requirement, finding, status")
    .eq("audit_id", auditId)
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Отчёт аудита</h1>
      <AuditReport
        audit={audit}
        results={results ?? []}
        projectId={projectId}
      />
    </div>
  );
}