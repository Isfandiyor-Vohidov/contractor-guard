import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function parseDocument(filePath: string): Promise<string> {
  // 1. Скачивание из Supabase Storage
  // Убедись, что бакет "audit-files" создан и он приватный
  const { data, error } = await supabaseAdmin.storage
    .from("audit-files")
    .download(filePath);

  if (error || !data) {
    console.error("Supabase Storage Error:", error);
    throw new Error(`Не удалось скачать файл: ${error?.message || "Файл отсутствует"}`);
  }

  // 2. Превращаем Blob в Buffer один раз
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const ext = filePath.split(".").pop()?.toLowerCase();

  try {
    switch (ext) {
      case "pdf":
        // Опция: можно добавить pagerender, если нужны только первые страницы
        const pdfData = await pdfParse(buffer);
        return pdfData.text.trim();

      case "docx":
        const result = await mammoth.extractRawText({ buffer });
        return result.value.trim();

      case "txt":
        return new TextDecoder().decode(arrayBuffer).trim();

      default:
        throw new Error(`Тип файла .${ext} пока не поддерживается`);
    }
  } catch (err) {
    console.error("Parsing Error:", err);
    throw new Error("Ошибка при чтении содержимого файла. Возможно, он защищен паролем или поврежден.");
  }
}