"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Audit {
  id: string;
  status: string;
  score: number | null;
}

export function useAuditStream(auditId: string) {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial state
    supabase
      .from("audits")
      .select("*")
      .eq("id", auditId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setAudit(data);
      });

    // Subscribe to changes
    const channel = supabase
      .channel(`audit-${auditId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "audits",
          filter: `id=eq.${auditId}`,
        },
        (payload) => {
          setAudit(payload.new as Audit);
        }
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          setError("Realtime subscription failed");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auditId]);

  return { audit, error };
}