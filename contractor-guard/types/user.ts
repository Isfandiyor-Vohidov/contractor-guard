import type { Database } from "./database";

export type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export type UserTier = UserProfile["tier"];

export interface CreditBalance {
  balance: number;
  tier: UserTier;
  maxAuditsPerMonth: number;
  maxPagesPerDoc: number;
  model: string;
}