export async function generatePDF({ audit, results }: any): Promise<Buffer> {
  // Заглушка – в реальности используем @react-pdf/renderer
  return Buffer.from("PDF placeholder");
}