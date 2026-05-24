import type { IInvoiceAnalysisService } from "./IInvoiceAnalysisService";
import { createOpenAiInvoiceAnalysisService } from "./openAiInvoiceAnalysisService";

let cached: IInvoiceAnalysisService | null = null;

export function getInvoiceAnalysisService(): IInvoiceAnalysisService {
  if (!cached) {
    cached = createOpenAiInvoiceAnalysisService();
  }
  return cached;
}

/** Reset cache (useful for tests). */
export function resetInvoiceAnalysisService(): void {
  cached = null;
}
