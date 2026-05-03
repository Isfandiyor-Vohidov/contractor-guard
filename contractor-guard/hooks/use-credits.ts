"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [tier, setTier] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCredits = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("credits_balance, tier")
        .eq("id", user.id)
        .single();

      if (!error && profile) {
        setCredits(profile.credits_balance);
        setTier(profile.tier);
      }
      setLoading(false);
    };

    fetchCredits();

    // Subscribe to credit changes
    const channel = supabase
      .channel("credits")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          const newUser = payload.new as any;
          setCredits(newUser.credits_balance);
          setTier(newUser.tier);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { credits, tier, loading };
}