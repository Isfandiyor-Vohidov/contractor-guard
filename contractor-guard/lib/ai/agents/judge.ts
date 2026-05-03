import { generateObject } from "ai";
import { judgeModel } from "../models";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

let systemPrompt: string | null = null;
async function loadSystemPrompt(): Promise<string> {
  if (!systemPrompt) {
    const promptPath = path.join(process.cwd(), "prompts", "judge-system.md");
    systemPrompt = await fs.readFile(promptPath, "utf-8");
  }
  return systemPrompt;
}

export async function judgeAgent(
  requirements: Array<{ id: string; description: string; category?: string }>,
  findings: Array<{ finding: string; evidence?: string }>,
  severity: string
): Promise<Array<{ requirement: string; finding: string; status: "ok" | "partial" | "fail" }>> {
  const system = await loadSystemPrompt();
  const results = [];
  for (let i = 0; i < requirements.length; i++) {
    const req = requirements[i];
    const f = findings[i];
    const { object } = await generateObject({
      model: judgeModel,
      schema: z.object({
        status: z.enum(["ok", "partial", "fail"]),
        reason: z.string(),
      }),
      system,
      prompt: `Требование: "${req.description}"\nНайдено: "${f.finding}"\nСтрогость: ${severity}`,
    });
    results.push({
      requirement: req.description,
      finding: f.finding,
      status: object.status,
    });
  }
  return results;
}