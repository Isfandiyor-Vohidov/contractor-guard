"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadPDFButton({ auditId }: { auditId: string }) {
  const handleDownload = () => {
    window.open(`/projects/audits/${auditId}/report`, "_blank");
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Скачать PDF
    </Button>
  );
}