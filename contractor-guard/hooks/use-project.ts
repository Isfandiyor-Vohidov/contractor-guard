"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (error) setError(error.message);
      else setProject(data);
      setLoading(false);
    };

    if (projectId) fetchProject();
  }, [projectId]);

  return { project, loading, error };
}