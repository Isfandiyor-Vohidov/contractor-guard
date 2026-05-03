export interface ParsedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    title?: string;
  };
}