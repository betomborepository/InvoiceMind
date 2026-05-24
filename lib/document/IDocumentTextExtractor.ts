import type { DetectedFormat } from "@/lib/types/invoice";

export interface ExtractionResult {
  text: string;
  format: DetectedFormat;
}

export interface IDocumentTextExtractor {
  canHandle(fileName: string, mimeType?: string): boolean;
  extract(buffer: Buffer, fileName: string): Promise<ExtractionResult>;
}
