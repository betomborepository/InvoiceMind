"use client";

import { useState } from "react";
import { ResultSummary } from "@/components/ResultSummary";
import type { InvoiceAnalysisResult } from "@/lib/types/invoice";

interface ResultPanelProps {
  loading: boolean;
  error: string | null;
  result: InvoiceAnalysisResult | null;
}

export function ResultPanel({ loading, error, result }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <aside
      className="flex min-h-[28rem] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:max-h-[calc(100vh-5rem)]"
      aria-label="Analysis results"
    >
      <PanelHeader
        result={result}
        loading={loading}
        copied={copied}
        onCopy={handleCopy}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {loading && (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 text-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            <p className="text-sm font-medium text-brand-800">
              Analyzing document with AI…
            </p>
            <p className="max-w-xs text-xs text-slate-500">
              This may take a few seconds depending on document size.
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {!loading && !error && !result && (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 text-center text-slate-500">
            <svg
              className="h-10 w-10 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium text-slate-600">No results yet</p>
            <p className="max-w-[14rem] text-xs">
              Upload a file or paste content, then run analysis.
            </p>
          </div>
        )}

        {!loading && result && <ResultSummary result={result} />}
      </div>
    </aside>
  );
}

function PanelHeader({
  result,
  loading,
  copied,
  onCopy,
}: {
  result: InvoiceAnalysisResult | null;
  loading: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="shrink-0 border-b border-slate-200 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Results</h2>
          <p className="mt-0.5 text-sm text-slate-500">Extracted invoice fields</p>
        </div>
        {result && !loading && (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
        )}
      </div>
    </div>
  );
}
