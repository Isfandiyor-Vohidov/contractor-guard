"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Link as LinkIcon } from "lucide-react";

interface UploadResultProps {
  projectId: string;
  onUploaded: (documentId: string) => void;
}

export function UploadResult({ projectId, onUploaded }: UploadResultProps) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("type", "Result");

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

  const handleUrlSubmit = () => {
    alert("Функция проверки по URL будет доступна позже.");
  };

  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">Файл</TabsTrigger>
        <TabsTrigger value="url">Ссылка</TabsTrigger>
      </TabsList>
      <TabsContent value="file" className="border-2 border-dashed rounded-lg p-6 mt-2 text-center">
        {fileName ? (
          <div className="flex items-center justify-between bg-muted p-2 rounded">
            <span className="text-sm">{fileName}</span>
            <Button variant="ghost" size="sm" onClick={clearFile} disabled={uploading}>
              Удалить
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <span className="text-sm font-medium">Загрузить результат</span>
            <span className="text-xs text-muted-foreground">PDF, DOCX, ZIP, TXT</span>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.zip"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
        {uploading && <p className="text-sm text-muted-foreground mt-2">Загрузка...</p>}
      </TabsContent>
      <TabsContent value="url" className="p-4 mt-2">
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleUrlSubmit} disabled={!url}>
            <LinkIcon className="h-4 w-4 mr-2" /> Проверить
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}