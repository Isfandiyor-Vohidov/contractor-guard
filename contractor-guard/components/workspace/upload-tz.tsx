"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileText } from "lucide-react";

interface UploadTZProps {
  projectId: string;
  onUploaded: (documentId: string) => void;
}

export function UploadTZ({ projectId, onUploaded }: UploadTZProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("type", "TZ");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { documentId } = await res.json();
      onUploaded(documentId);
    } catch {
      alert("Ошибка загрузки");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      {fileName ? (
        <div className="flex items-center justify-between bg-muted p-2 rounded">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{fileName}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFile} disabled={uploading}>
            Удалить
          </Button>
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center gap-2">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <span className="text-sm font-medium">Загрузить ТЗ</span>
          <span className="text-xs text-muted-foreground">PDF, DOCX, TXT (до 20 МБ)</span>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
      {uploading && <p className="text-sm text-muted-foreground mt-2">Загрузка...</p>}
    </div>
  );
}