export async function extractorAgent(tzText: string, severity: string): Promise<Array<{ id: string; description: string; category?: string }>> {
  const lines = tzText.split('\n').filter(l => l.trim());
  const reqs: Array<{ id: string; description: string; category?: string }> = [];
  let counter = 1;
  for (const line of lines) {
    const match = line.match(/^\s*(?:\d+[.)]\s*|-\s+)(.*)/);
    if (match) {
      const desc = match[1].trim();
      if (desc) {
        const id = `REQ-${String(counter).padStart(3, '0')}`;
        reqs.push({ id, description: desc });
        counter++;
      }
    }
  }
  return reqs;
}