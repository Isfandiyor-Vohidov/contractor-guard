"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface FileUploaderProps {
  onUpload: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUploader({ onUpload, accept, maxSize }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    try {
      await onUpload(acceptedFiles[0]);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragActive ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
      <p className="mt-2 text-sm font-medium">
        {isDragActive ? "Отпустите файл..." : "Перетащите файл сюда или кликните для выбора"}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        PDF, DOCX, TXT (до 20 МБ)
      </p>
      {uploading && <p className="text-sm mt-2">Загрузка...</p>}
    </div>
  );
}