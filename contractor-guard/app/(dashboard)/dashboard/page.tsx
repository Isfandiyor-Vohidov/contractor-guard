import { createServerClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentAudits } from "@/components/dashboard/recent-audits";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Профиль
  const { data: profile } = await (supabase as any)
    .from("users")
    .select("credits_balance, tier")
    .eq("id", user.id)
    .single();

  // Количество проектов
  const { count: projectCount } = await (supabase as any)
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Статистика аудитов
  const { data: audits } = await (supabase as any)
    .from("audits")
    .select("status, project_id, projects!inner(user_id)")
    .eq("projects.user_id", user.id);

  const completed =
    audits?.filter((a: any) => a.status === "success").length ?? 0;
  const failed =
    audits?.filter((a: any) => a.status === "failed").length ?? 0;

  return (
    <div className="space-y-6">
      <StatsCards
        credits={profile?.credits_balance ?? 0}
        projects={projectCount ?? 0}
        completed={completed}
        failed={failed}
        tier={profile?.tier ?? "free"}
      />
      <RecentAudits />
    </div>
  );
}