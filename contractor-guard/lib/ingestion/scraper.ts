// Упрощённый веб-скрапинг через Browserless (или Puppeteer)
export async function scrapeWebsite(url: string): Promise<string> {
  if (!process.env.BROWSERLESS_TOKEN) {
    throw new Error("BROWSERLESS_TOKEN not configured");
  }
  const resp = await fetch(`https://chrome.browserless.io/content?token=${process.env.BROWSERLESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      elements: [{ selector: "body" }],
    }),
  });
  if (!resp.ok) throw new Error(`Browserless error: ${resp.statusText}`);
  const result = await resp.json();
  return result.data?.[0]?.results?.[0]?.text || "";
}