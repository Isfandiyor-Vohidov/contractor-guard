// quality-analyzer.ts – проверка качества требований (без результата работы)
export async function qualityAnalyzer(
  requirements: Array<{ id: string; description: string; category?: string }>
): Promise<Array<{ requirement: string; finding: string; status: "ok" | "partial" | "fail" }>> {
  return requirements.map((req) => {
    const desc = req.description.toLowerCase();
    let status: "ok" | "partial" | "fail" = "ok";
    let finding = "Требование сформулировано хорошо";

    // Примерные правила для демонстрации
    if (desc.includes("красн")) {
      // если просто "красный", без указания кода – partial
      if (!desc.includes("#") && !desc.includes("hex")) {
        status = "partial";
        finding = "Не указан точный код цвета";
      }
    }
    if (desc.length < 20) {
      status = "partial";
      finding = "Описание слишком короткое, может быть непонятным";
    }
    if (desc.includes("быстро") || desc.includes("моментально")) {
      status = "fail";
      finding = "Субъективная формулировка, требуется количественная метрика";
    }
    if (desc.includes("адаптив")) {
      if (!desc.includes("мобильн") && !desc.includes("планшет")) {
        status = "partial";
        finding = "Не указаны целевые устройства для адаптации";
      }
    }
    return { requirement: req.description, finding, status };
  });
}