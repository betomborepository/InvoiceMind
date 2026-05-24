import type { DetectedFormat, InvoiceAnalysisResult } from "@/lib/types/invoice";

export interface IInvoiceAnalysisService {
  analyze(
    content: string,
    hintFormat?: DetectedFormat
  ): Promise<InvoiceAnalysisResult>;
}
