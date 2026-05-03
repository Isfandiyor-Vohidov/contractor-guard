import { Badge } from "@/components/ui/badge";

interface RequirementRowProps {
  result: {
    id: string;
    requirement: string;
    finding: string | null;
    status: string;
  };
  onClick: () => void;
}

const statusBadge: Record<string, "success" | "warning" | "destructive"> = {
  ok: "success",
  partial: "warning",
  fail: "destructive",
};

export function RequirementRow({ result, onClick }: RequirementRowProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 border rounded-md mb-2 cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div className="flex-1">
        <p className="font-medium">{result.requirement}</p>
        {result.finding && (
          <p className="text-sm text-muted-foreground truncate">{result.finding}</p>
        )}
      </div>
      <Badge variant={statusBadge[result.status] ?? "secondary"} className="ml-2">
        {result.status === "ok" ? "✅ Вып." : result.status === "partial" ? "⚠️ Част." : "❌ Нет"}
      </Badge>
    </div>
  );
}