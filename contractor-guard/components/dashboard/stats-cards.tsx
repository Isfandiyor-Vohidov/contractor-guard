import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  credits: number;
  projects: number;
  completed: number;
  failed: number;
  tier: string;
}

export function StatsCards({ credits, projects, completed, failed, tier }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Кредиты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{credits}</div>
          <p className="text-xs text-muted-foreground">{tier === "free" ? "Бесплатный" : "Pro"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Проекты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Успешно</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Провалено</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{failed}</div>
        </CardContent>
      </Card>
    </div>
  );
}