import type { InvoiceAnalysisResult } from "@/lib/types/invoice";

export const INVOICE_FIELDS: {
  key: keyof InvoiceAnalysisResult;
  label: string;
}[] = [
  { key: "invoiceNumber", label: "Invoice number" },
  { key: "invoiceDate", label: "Invoice date" },
  { key: "dueDate", label: "Due date" },
  { key: "sellerName", label: "Seller" },
  { key: "sellerSiren", label: "Seller SIREN" },
  { key: "buyerName", label: "Buyer" },
  { key: "buyerSiren", label: "Buyer SIREN" },
  { key: "currency", label: "Currency" },
  { key: "totalExcludingTax", label: "Total excl. tax" },
  { key: "taxAmount", label: "Tax amount" },
  { key: "totalIncludingTax", label: "Total incl. tax" },
  { key: "paymentTerms", label: "Payment terms" },
];

const MISSING_SUFFIX = " (missing)";

export function normalizeFieldName(value: string): string {
  return value.toLowerCase().replace(/[\s._-]/g, "");
}

export function isMissingField(
  missingFields: string[],
  key: string,
  label: string
): boolean {
  const keyNorm = normalizeFieldName(key);
  const labelNorm = normalizeFieldName(label);

  return missingFields.some((field) => {
    const fieldNorm = normalizeFieldName(field);
    return fieldNorm === keyNorm || fieldNorm === labelNorm;
  });
}

export function formatMissingLabel(name: string): string {
  const known = INVOICE_FIELDS.find(
    (field) =>
      normalizeFieldName(field.key) === normalizeFieldName(name) ||
      normalizeFieldName(field.label) === normalizeFieldName(name)
  );
  if (known) return known.label;

  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

export function formatFieldDisplayValue(
  value: string | number,
  missing?: boolean
): string {
  const empty = value === "" || value === 0;
  if (empty && !missing) return "—";
  if (typeof value === "number") {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2 });
  }
  return value;
}

export function maxInvoiceFieldLabelWidth(): number {
  return Math.max(
    ...INVOICE_FIELDS.map(({ label }) =>
      Math.max(label.length, label.length + MISSING_SUFFIX.length)
    )
  );
}

export function formatInvoiceFieldLabel(
  label: string,
  missing: boolean,
  padWidth: number
): string {
  const labelText = missing ? `${label}${MISSING_SUFFIX}` : label;
  return `${labelText.padEnd(padWidth)}:`;
}
