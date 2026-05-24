import { InvoiceMindError } from "@/lib/errors";
import type { ExtractionResult } from "./IDocumentTextExtractor";
import { PdfDocumentExtractor } from "./pdfExtractor";
import { TextDocumentExtractor } from "./textExtractor";

const pdfExtractor = new PdfDocumentExtractor();
const textExtractor = new TextDocumentExtractor();

export async function extractDocumentFromFile(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<ExtractionResult> {
  if (pdfExtractor.canHandle(fileName, mimeType)) {
    return pdfExtractor.extract(buffer, fileName);
  }

  if (textExtractor.canHandle(fileName, mimeType)) {
    return textExtractor.extract(buffer, fileName);
  }

  throw new InvoiceMindError(
    "UNSUPPORTED_FORMAT",
    `Unsupported file type: ${fileName}. Use PDF, XML, or plain text.`
  );
}
