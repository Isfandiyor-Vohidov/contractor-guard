import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Профиль</h1>
      <div className="rounded-lg border p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Идентификатор</label>
          <p className="text-muted-foreground text-xs font-mono">{user?.id}</p>
        </div>
        <form action="/logout" method="post">
          <Button variant="outline" type="submit">Выйти</Button>
        </form>
      </div>
    </div>
  );
}