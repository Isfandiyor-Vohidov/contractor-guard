import { supabaseAdmin } from "@/lib/supabase/admin";

export async function addCredits(userId: string, amount: number) {
  return supabaseAdmin.rpc("add_credits", { user_id: userId, amount });
}

export async function deductCredits(userId: string, amount: number) {
  return supabaseAdmin.rpc("deduct_credits", { user_id: userId, amount });
}