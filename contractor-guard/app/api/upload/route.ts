import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const type = formData.get("type") as "TZ" | "Result";

    if (!file || !projectId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Проверка принадлежности проекта
    const { data: project } = await (supabase as any)
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single();
    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fileExt = file.name.split(".").pop() || "txt";
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${projectId}/${fileName}`;

    // Сохраняем файл в Storage
    const { error: uploadError } = await supabase.storage
      .from("audit-files")
      .upload(filePath, file);
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Извлекаем текст прямо сейчас
    let rawText = "";
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = fileExt.toLowerCase();
      if (ext === "pdf") {
        const data = await pdfParse(buffer);
        rawText = data.text;
      } else if (ext === "docx") {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value;
      } else if (ext === "txt") {
        rawText = new TextDecoder().decode(buffer);
      }
    } catch (e: any) {
      console.error("Ошибка извлечения текста:", e.message);
      // Если не смогли извлечь, оставляем rawText пустым, но запись создаём
    }

    // Вставляем запись в documents
    const { data: document, error: insertError } = await (supabase as any)
      .from("documents")
      .insert({
        project_id: projectId,
        type,
        file_url: filePath,
        raw_text: rawText || "", // всегда строка, не null
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ documentId: document.id });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}