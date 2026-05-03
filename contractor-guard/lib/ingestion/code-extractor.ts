import JSZip from "jszip";
// Для zip-архивов с кодом
export async function extractCodeFromZip(zipData: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(zipData);
  const files: string[] = [];
  const allowedExtensions = [".js", ".ts", ".tsx", ".jsx", ".py", ".html", ".css", ".json", ".md"];

  const promises: Promise<void>[] = [];
  zip.forEach((relativePath, file) => {
    if (!file.dir) {
      const ext = relativePath.split(".").pop();
      if (ext && allowedExtensions.includes(`.${ext}`)) {
        promises.push(
          file.async("string").then((content) => {
            files.push(`--- ${relativePath} ---\n${content}`);
          })
        );
      }
    }
  });
  await Promise.all(promises);
  return files.join("\n\n");
}