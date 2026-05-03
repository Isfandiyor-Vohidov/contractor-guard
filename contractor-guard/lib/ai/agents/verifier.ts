// verifier.ts – МОК-версия (возвращает детерминированные результаты)
export async function verifierAgent(
  requirements: Array<{ id: string; description: string; category?: string }>,
  resultText: string,
  tzDocId: string,
  severity: string
): Promise<Array<{ requirement: string; finding: string; status: "ok" | "partial" | "fail" }>> {
  return requirements.map(req => {
    const desc = req.description.toLowerCase();
    const result = resultText.toLowerCase();
    let status: "ok" | "partial" | "fail" = "ok";
    let finding = "Соответствует";

    // Простейшие правила для демонстрации
    if (desc.includes("красн") && !result.includes("красн") && result.includes("оранжев")) {
      status = "fail";
      finding = "Кнопка оранжевая, а должна быть красной";
    } else if (desc.includes("телефон") && !result.includes("телефон")) {
      status = "fail";
      finding = "Поле 'Телефон' отсутствует";
    } else if (desc.includes("подзаголовок") && !result.includes("подзаголовок")) {
      status = "fail";
      finding = "Подзаголовок отсутствует";
    } else if (desc.includes("логотип") || desc.includes("клик")) {
      if (!result.includes("логотип") || result.includes("нет ссылки")) {
        status = "fail";
        finding = "Логотип не кликабелен";
      }
    } else if (desc.includes("3 секунд") && result.includes("4.2")) {
      status = "partial";
      finding = "Загрузка 4.2 секунды, что превышает 3 секунды";
    }

    return { requirement: req.description, finding, status };
  });
}