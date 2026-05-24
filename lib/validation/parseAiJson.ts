import type { DetectedFormat, InvoiceAnalysisResult } from "@/lib/types/invoice";
import { DETECTED_FORMATS, emptyInvoiceAnalysisResult } from "@/lib/types/invoice";
import { InvoiceMindError } from "@/lib/errors";

function stripMarkdownFences(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  return text.trim();
}

function toString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter(Boolean);
}

function normalizeDetectedFormat(value: unknown): DetectedFormat | string {
  const str = toString(value);
  if (DETECTED_FORMATS.includes(str as DetectedFormat)) {
    return str as DetectedFormat;
  }
  return str || "Unknown";
}

export function parseAiJsonResponse(
  raw: string,
  fallbackFormat?: DetectedFormat
): InvoiceAnalysisResult {
  const cleaned = stripMarkdownFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new InvoiceMindError(
      "INVALID_AI_JSON",
      "The AI returned invalid JSON. Please try again.",
      502
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new InvoiceMindError(
      "INVALID_AI_JSON",
      "The AI response is not a JSON object.",
      502
    );
  }

  const data = parsed as Record<string, unknown>;
  const base = emptyInvoiceAnalysisResult(
    (fallbackFormat ?? "Unknown") as DetectedFormat
  );

  return {
    invoiceNumber: toString(data.invoiceNumber),
    invoiceDate: toString(data.invoiceDate),
    sellerName: toString(data.sellerName),
    sellerSiren: toString(data.sellerSiren),
    buyerName: toString(data.buyerName),
    buyerSiren: toString(data.buyerSiren),
    currency: toString(data.currency),
    totalExcludingTax: toNumber(data.totalExcludingTax),
    taxAmount: toNumber(data.taxAmount),
    totalIncludingTax: toNumber(data.totalIncludingTax),
    dueDate: toString(data.dueDate),
    paymentTerms: toString(data.paymentTerms),
    detectedFormat:
      normalizeDetectedFormat(data.detectedFormat) ||
      base.detectedFormat,
    missingFields: toStringArray(data.missingFields),
    warnings: toStringArray(data.warnings),
  };
}
