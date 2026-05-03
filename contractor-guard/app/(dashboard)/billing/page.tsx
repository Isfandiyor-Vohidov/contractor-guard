import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from "lucide-react";

const plans = [
  { name: "Free", price: "0₽", credits: 10, features: ["3 проверки/мес", "Документы до 10 стр.", "Gemini Flash"] },
  { name: "Pro", price: "1 500₽/мес", credits: 1000, features: ["Безлимитные проверки", "Документы до 100 стр.", "Claude 3.5 Sonnet", "Экспорт в PDF с брендом"] },
];

export default async function BillingPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("tier, credits_balance")
    .eq("id", user?.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Биллинг и подписка</h1>
      <div className="mb-8">
        <p>Текущий тариф: <strong>{profile?.tier === "pro" ? "Pro" : "Free"}</strong></p>
        <p>Остаток кредитов: <strong>{profile?.credits_balance}</strong></p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 ${profile?.tier === plan.name.toLowerCase() ? "ring-2 ring-blue-500" : ""}`}
          >
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-3xl font-bold mt-2">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full" disabled={profile?.tier === plan.name.toLowerCase()}>
              {profile?.tier === plan.name.toLowerCase() ? "Текущий" : "Перейти"}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border p-4">
        <h2 className="font-semibold mb-2">История транзакций</h2>
        <p className="text-sm text-muted-foreground">Функционал в разработке.</p>
      </div>
    </div>
  );
}