import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  success: "success",
  failed: "destructive",
  processing: "warning",
  pending: "secondary",
};

export async function ProjectAudits({ projectId }: { projectId: string }) {
  const supabase = await createServerClient();
  
  // Используем as any для избежания ошибок типов
  const { data: audits } = await (supabase as any)
    .from("audits")
    .select("id, status, score, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (!audits || audits.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">История аудитов</h2>
      <div className="space-y-2">
        {audits.map((audit: any) => (
          <Link
            key={audit.id}
            href={`/projects/${projectId}/audits/${audit.id}`}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div>
              <span className="font-mono text-sm">{audit.id.slice(0, 8)}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {formatDate(audit.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[audit.status] ?? "secondary"}>
                {audit.status}
              </Badge>
              {audit.score != null && (
                <span className="text-sm font-semibold">{audit.score}%</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}