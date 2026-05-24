export type DetectedFormat =
  | "PDF"
  | "XML"
  | "UBL"
  | "CII"
  | "Factur-X"
  | "Text"
  | "Unknown";

export interface InvoiceAnalysisResult {
  invoiceNumber: string;
  invoiceDate: string;
  sellerName: string;
  sellerSiren: string;
  buyerName: string;
  buyerSiren: string;
  currency: string;
  totalExcludingTax: number;
  taxAmount: number;
  totalIncludingTax: number;
  dueDate: string;
  paymentTerms: string;
  detectedFormat: DetectedFormat | string;
  missingFields: string[];
  warnings: string[];
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}

export const DETECTED_FORMATS: DetectedFormat[] = [
  "PDF",
  "XML",
  "UBL",
  "CII",
  "Factur-X",
  "Text",
  "Unknown",
];

export function emptyInvoiceAnalysisResult(
  detectedFormat: DetectedFormat = "Unknown"
): InvoiceAnalysisResult {
  return {
    invoiceNumber: "",
    invoiceDate: "",
    sellerName: "",
    sellerSiren: "",
    buyerName: "",
    buyerSiren: "",
    currency: "",
    totalExcludingTax: 0,
    taxAmount: 0,
    totalIncludingTax: 0,
    dueDate: "",
    paymentTerms: "",
    detectedFormat,
    missingFields: [],
    warnings: [],
  };
}
