import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AuditReport } from "@/components/report/audit-report";

export default async function AuditPage({
  params,
}: {
  params: { auditId: string };
}) {
  const supabase = createServerClient();
  const { data: audit } = await supabase
    .from("audits")
    .select("*, projects!inner(user_id)")
    .eq("id", params.auditId)
    .single();

  if (!audit) {
    notFound();
  }

  const { data: results } = await supabase
    .from("audit_results")
    .select("*")
    .eq("audit_id", params.auditId)
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Отчёт аудита</h1>
      <AuditReport audit={audit} results={results ?? []} />
    </div>
  );
}