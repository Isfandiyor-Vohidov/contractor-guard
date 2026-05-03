const SENSITIVE_REGEXES: [RegExp, string][] = [
  [/sk-[a-zA-Z0-9]{24,}/g, "[API_KEY_REDACTED]"],
  [/Bearer\s+[a-zA-Z0-9\-._~+/]+=*/g, "[AUTH_TOKEN_REDACTED]"],
  [/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[CREDIT_CARD_REDACTED]"],
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL_REDACTED]"],
  // Паспорт РФ: серия и номер
  [/\b\d{2}\s?\d{2}\s?\d{6}\b/g, "[PASSPORT_REDACTED]"],
  // Номер телефона
  [/(?:\+7|8)\d{10}\b/g, "[PHONE_REDACTED]"],
];

export function maskText(text: string): string {
  let masked = text;
  for (const [regex, replacement] of SENSITIVE_REGEXES) {
    masked = masked.replace(regex, replacement);
  }
  return masked;
}