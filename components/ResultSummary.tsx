"use client";

import {
  formatFieldDisplayValue,
  formatMissingLabel,
  INVOICE_FIELDS,
  isMissingField,
} from "@/lib/invoiceFields";
import type { InvoiceAnalysisResult } from "@/lib/types/invoice";

interface ResultSummaryProps {
  result: InvoiceAnalysisResult;
}

function Field({
  label,
  value,
  missing,
}: {
  label: string;
  value: string | number;
  missing?: boolean;
}) {
  const display = formatFieldDisplayValue(value, missing);

  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        missing
          ? "border-amber-300 bg-amber-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
        {missing && (
          <span className="ml-1.5 normal-case text-amber-700">(missing)</span>
        )}
      </dt>
      <dd
        className={`mt-0.5 text-sm font-medium ${
          missing ? "text-amber-900" : "text-slate-900"
        }`}
      >
        {display}
      </dd>
    </div>
  );
}

function MissingFieldsBanner({ fields }: { fields: string[] }) {
  if (fields.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
      <h4 className="text-sm font-semibold text-amber-900">Missing fields</h4>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {fields.map((field) => (
          <span
            key={field}
            className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
          >
            {formatMissingLabel(field)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {result.detectedFormat || "Unknown"}
        </span>
      </div>

      <MissingFieldsBanner fields={result.missingFields} />

      <dl className="grid gap-3 sm:grid-cols-2">
        {INVOICE_FIELDS.map(({ key, label }) => (
          <Field
            key={key}
            label={label}
            value={result[key] as string | number}
            missing={isMissingField(result.missingFields, key, label)}
          />
        ))}
      </dl>

      {result.warnings.length > 0 && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
          <h4 className="text-sm font-semibold text-orange-900">Warnings</h4>
          <ul className="mt-2 list-inside list-disc text-sm text-orange-800">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
