import type { IDocumentTextExtractor, ExtractionResult } from "./IDocumentTextExtractor";
import { detectFormatFromContent } from "./formatDetection";
import { InvoiceMindError } from "@/lib/errors";

/**
 * V1: basic text extraction via pdf-parse.
 * TODO: scanned/image PDFs need OCR (e.g. Azure Document Intelligence, Tesseract).
 */
export class PdfDocumentExtractor implements IDocumentTextExtractor {
  canHandle(fileName: string, mimeType?: string): boolean {
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ext === "pdf" || mimeType === "application/pdf";
  }

  async extract(buffer: Buffer, fileName: string): Promise<ExtractionResult> {
    let pdfParse: (data: Buffer) => Promise<{ text: string }>;

    try {
      const mod = await import("pdf-parse");
      pdfParse = mod.default;
    } catch {
      throw new InvoiceMindError(
        "UNSUPPORTED_FORMAT",
        "PDF parser is not available. Install pdf-parse or use pasted text/XML instead."
      );
    }

    try {
      const result = await pdfParse(buffer);
      const text = result.text?.trim() ?? "";

      if (!text) {
        throw new InvoiceMindError(
          "UNSUPPORTED_FORMAT",
          "No text could be extracted from this PDF. It may be a scanned image — OCR is not yet implemented (see TODO in pdfExtractor.ts)."
        );
      }

      const contentFormat = detectFormatFromContent(text, fileName);
      const format = contentFormat !== "Text" ? contentFormat : "PDF";

      return { text, format };
    } catch (err) {
      if (err instanceof InvoiceMindError) throw err;
      throw new InvoiceMindError(
        "UNSUPPORTED_FORMAT",
        `Failed to read PDF: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }
}
