import { google } from "@ai-sdk/google";

// Используем актуальную модель из списка
export const defaultModel = google("gemini-2.5-flash");
export const extractorModel = google("gemini-2.5-flash");
export const searcherModel = google("gemini-2.5-flash");
export const judgeModel = google("gemini-2.5-flash");
export const premiumModel = google("gemini-2.5-flash");

export function getModelForSeverity(severity: string) {
  if (severity === "strict") return premiumModel;
  return defaultModel;
}