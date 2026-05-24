import type { IDocumentTextExtractor, ExtractionResult } from "./IDocumentTextExtractor";
import { detectFormatFromContent } from "./formatDetection";

const TEXT_EXTENSIONS = new Set([
  "txt",
  "xml",
  "ubl",
  "json",
  "csv",
  "html",
  "htm",
]);

export class TextDocumentExtractor implements IDocumentTextExtractor {
  canHandle(fileName: string, mimeType?: string): boolean {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (TEXT_EXTENSIONS.has(ext)) return true;
    if (mimeType?.startsWith("text/")) return true;
    if (mimeType === "application/xml" || mimeType === "text/xml") return true;
    return false;
  }

  async extract(buffer: Buffer, fileName: string): Promise<ExtractionResult> {
    const text = buffer.toString("utf-8");
    const format = detectFormatFromContent(text, fileName);
    return { text, format };
  }
}

export function extractFromPlainText(
  text: string,
  fileName?: string
): ExtractionResult {
  const format = detectFormatFromContent(text, fileName);
  return { text, format };
}
