import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const statusVariant: Record<
  string,
  "success" | "warning" | "destructive" | "secondary"
> = {
  success: "success",
  failed: "destructive",
  processing: "warning",
  pending: "secondary",
};

export async function RecentAudits() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: audits } = await (supabase as any)
    .from("audits")
    .select("id, status, score, created_at, project_id, projects!inner(name)")
    .eq("projects.user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!audits || audits.length === 0)
    return <p className="text-muted-foreground">Нет завершённых аудитов.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Проект</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Оценка</TableHead>
          <TableHead>Дата</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audits.map((audit: any) => (
          <TableRow key={audit.id}>
            <TableCell>
              <Link
                href={`/projects/${audit.project_id}`}
                className="hover:underline"
              >
                {audit.projects?.name ?? "—"}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[audit.status] ?? "secondary"}>
                {audit.status}
              </Badge>
            </TableCell>
            <TableCell>
              {audit.score != null ? `${audit.score}%` : "—"}
            </TableCell>
            <TableCell>
              {new Date(audit.created_at).toLocaleDateString("ru-RU")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}