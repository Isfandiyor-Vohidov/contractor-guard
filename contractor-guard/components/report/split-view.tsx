import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";   // ← добавлено

interface SplitViewProps {
  requirement: string;
  finding: string;
  status: string;
}

export function SplitView({ requirement, finding, status }: SplitViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-300">Требование (ТЗ)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{requirement}</p>
        </CardContent>
      </Card>
      <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-300">Найдено в результате</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{finding}</p>
          <Badge className="mt-2" variant={status === "fail" ? "destructive" : status === "partial" ? "warning" : "success"}>
            {status === "fail" ? "Нарушение" : status === "partial" ? "Частично" : "Выполнено"}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}