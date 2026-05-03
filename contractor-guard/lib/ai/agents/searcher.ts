import { generateObject } from "ai";
import { searcherModel } from "../models";
import { retrieveRelevantChunks } from "../rag/retriever";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

let systemPrompt: string | null = null;
async function loadSystemPrompt(): Promise<string> {
  if (!systemPrompt) {
    const promptPath = path.join(process.cwd(), "prompts", "searcher-system.md");
    systemPrompt = await fs.readFile(promptPath, "utf-8");
  }
  return systemPrompt;
}

export async function searcherAgent(
  requirements: Array<{ id: string; description: string; category?: string }>,
  resultText: string,
  tzDocId: string,
  severity: string
): Promise<Array<{ finding: string; evidence?: string }>> {
  const system = await loadSystemPrompt();
  const findings = [];
  for (const req of requirements) {
    const contextChunks = await retrieveRelevantChunks(req.description, tzDocId);
    const fullContext = contextChunks.join("\n") + "\n\nРезультат работы:\n" + resultText;

    const { object } = await generateObject({
      model: searcherModel,
      schema: z.object({
        finding: z.string(),
        evidence: z.string().optional(),
      }),
      system,
      prompt: `Требование: "${req.description}"\nКатегория: ${req.category || "не указана"}\n\nКонтекст ТЗ:\n${fullContext}\n\nНайди подтверждение или несоответствие.`,
    });
    findings.push(object);
  }
  return findings;
}