"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { ContentTextarea } from "@/components/ContentTextarea";
import { FileUpload } from "@/components/FileUpload";
import { ResultPanel } from "@/components/ResultPanel";
import type { ApiErrorResponse, InvoiceAnalysisResult } from "@/lib/types/invoice";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = Boolean(file || text.trim());

  async function handleAnalyze() {
    if (!canAnalyze) {
      setError("Upload a file or paste document content.");
      return;
    }

    track("Invoice Analyze Clicked", {
      hasFile: Boolean(file),
      hasPastedText: Boolean(text.trim()),
    });

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text.trim()) formData.append("text", text.trim());

    try {
      const response = await fetch("/api/invoices/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const err = data as ApiErrorResponse;
        setError(err.message || "Analysis failed.");
        return;
      }

      setResult(data as InvoiceAnalysisResult);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          InvoiceMind
        </h1>
        <p className="mt-2 text-slate-600">
        Upload your invoice — InvoiceMind extracts, checks, and organizes the details.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <section className="space-y-6">
            <FileUpload
              file={file}
              onFileChange={setFile}
              disabled={loading}
            />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">or</span>
              </div>
            </div>
            <ContentTextarea
              value={text}
              onChange={setText}
              disabled={loading}
            />
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <AnalyzeButton
              onClick={handleAnalyze}
              loading={loading}
              disabled={!canAnalyze}
            />
          </div>
        </div>

        <ResultPanel loading={loading} error={error} result={result} />
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500">
          © 2026 InvoiceMind. AI-powered invoice analysis. All rights reserved.
      </footer>
    </main>
  );
}
