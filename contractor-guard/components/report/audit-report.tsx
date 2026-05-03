"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreGauge } from "./score-gauge";
import { RequirementRow } from "./requirement-row";
import { SplitView } from "./split-view";
import { DownloadPDFButton } from "./export-pdf-button";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface AuditReportProps {
  audit: { id: string; status: string; score: number | null };
  results: Array<{
    id: string;
    requirement: string;
    finding: string | null;
    status: string;
  }>;
  projectId: string;
}

export function AuditReport({
  audit,
  results = [],
  projectId,
}: AuditReportProps) {
  const [selected, setSelected] = useState<
    AuditReportProps["results"][0] | null
  >(null);
  const router = useRouter();

  const handleImprove = () => {
    router.push(`/projects/${projectId}/audits/${audit.id}/improve`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Результаты аудита</h2>
        <div className="flex gap-2">
          <Button onClick={handleImprove} variant="outline">
            <Wand2 className="mr-2 h-4 w-4" />
            Улучшить ТЗ
          </Button>
          <DownloadPDFButton auditId={audit.id} />
        </div>
      </div>

      {audit.score != null && <ScoreGauge score={audit.score} />}

      <div>
        {results.length === 0 && (
          <p className="text-muted-foreground">Нет данных по проверке.</p>
        )}
        {results.map((res) => (
          <RequirementRow
            key={res.id}
            result={res}
            onClick={() => setSelected(res)}
          />
        ))}
      </div>

      {selected && (
        <SplitView
          requirement={selected.requirement}
          finding={selected.finding ?? "Нет данных"}
          status={selected.status}
        />
      )}
    </div>
  );
}