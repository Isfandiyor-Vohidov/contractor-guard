export async function improveTZText(
  auditResults: Array<{ requirement: string; finding?: string; status: string }>,
  originalTZ: string
): Promise<string> {
  const lines = originalTZ.split('\n');
  const resultLines: string[] = [];

  // Строим быстрый доступ: описание требования → { finding, status }
  const reqMap = new Map<string, { finding?: string; status: string }>();
  for (const r of auditResults) {
    reqMap.set(r.requirement.trim(), { finding: r.finding, status: r.status });
  }

  for (const line of lines) {
    const trimmed = line.trim();
    // Определяем, является ли строка требованием (начинается с цифры + точка/скобка или с дефиса)
    const requirementMatch = trimmed.match(/^(?:\d+[.)]\s*|-\s+)\s*(.+)/);
    if (requirementMatch) {
      const reqText = requirementMatch[1].trim();
      const audit = reqMap.get(reqText);
      if (audit && audit.status !== 'ok') {
        // Генерируем исправленный вариант требования
        const improvedDescription = generateImprovedRequirement(reqText, audit.finding || '');
        const prefix = trimmed.match(/^(?:\d+[.)]\s*|-\s+)/)?.[0] || '';
        resultLines.push(`${prefix}${improvedDescription}`);
        continue;
      }
    }
    // Оставляем строку без изменений
    resultLines.push(line);
  }

  return resultLines.join('\n');
}

function generateImprovedRequirement(original: string, finding: string): string {
  const lowerFinding = finding.toLowerCase();

  if (lowerFinding.includes('оранжев')) {
    return original
      .replace(/оранжев(?:ый|ая|ое|ые|ого|ой)/gi, 'красный')
      .replace('оранжевого', 'красного')
      .replace('оранжевой', 'красной')
      .replace('оранжевая', 'красная')
      .replace('оранжевое', 'красное')
      .replace('оранжевые', 'красные');
  }
  if (lowerFinding.includes('отсутствует')) {
    const what = finding.match(/отсутствует[:\s]*(.+)/i)?.[1] || 'необходимый элемент';
    return `${original} (добавлено: ${what})`;
  }
  if (lowerFinding.includes('не кликабелен') || lowerFinding.includes('нет ссылки')) {
    return original
      .replace('клик на логотип', 'клик на логотип (ведущий на главную)')
      .replace('переход', 'переход на главную');
  }
  if (lowerFinding.includes('превышает') || lowerFinding.includes('секунд')) {
    return original.replace(/\d+(\.\d+)?\s*секунд/, '2 секунды');
  }
  // Общий случай – просто дописываем исправление
  return `${original} [Исправлено: ${finding}]`;
}