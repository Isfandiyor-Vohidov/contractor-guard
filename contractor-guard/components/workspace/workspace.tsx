"use client";

import { useRouter } from "next/navigation";
import { startAudit } from "./actions";
import { UploadTZ } from "./upload-tz";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface WorkspaceProps {
  projectId: string;
}

export function Workspace({ projectId }: WorkspaceProps) {
  const router = useRouter();
  const [tzDocId, setTzDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!tzDocId) return;
    setLoading(true);
    try {
      const auditId = await startAudit(projectId, tzDocId);
      router.push(`/projects/${projectId}/audits/${auditId}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка запуска аудита");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Загрузите техническое задание</h3>
        <UploadTZ projectId={projectId} onUploaded={setTzDocId} />
        {tzDocId && <p className="text-xs text-muted-foreground mt-1">Файл загружен. ID: {tzDocId}</p>}
      </div>
      <Button
        onClick={handleRun}
        disabled={!tzDocId || loading}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Запуск..." : "Запустить аудит ТЗ"}
      </Button>
    </div>
  );
}