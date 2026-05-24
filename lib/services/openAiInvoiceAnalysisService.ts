import {
  INVOICE_ANALYSIS_SYSTEM_PROMPT,
  MAX_DOCUMENT_CHARS,
} from "@/lib/prompts/invoiceAnalysisPrompt";
import { InvoiceMindError } from "@/lib/errors";
import type { DetectedFormat, InvoiceAnalysisResult } from "@/lib/types/invoice";
import { parseAiJsonResponse } from "@/lib/validation/parseAiJson";
import type { IInvoiceAnalysisService } from "./IInvoiceAnalysisService";

interface OpenAiConfig {
  apiKey: string;
  model: string;
}

function truncateContent(content: string): string {
  if (content.length <= MAX_DOCUMENT_CHARS) return content;
  return (
    content.slice(0, MAX_DOCUMENT_CHARS) +
    "\n\n[... document truncated for analysis ...]"
  );
}

export class OpenAiInvoiceAnalysisService implements IInvoiceAnalysisService {
  constructor(private readonly config: OpenAiConfig) {}

  async analyze(
    content: string,
    hintFormat?: DetectedFormat
  ): Promise<InvoiceAnalysisResult> {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new InvoiceMindError("EMPTY_CONTENT", "Document content is empty.");
    }

    const userMessage = [
      hintFormat ? `Detected format hint: ${hintFormat}` : null,
      "",
      "Document content:",
      truncateContent(trimmed),
    ]
      .filter((line) => line !== null)
      .join("\n");

    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          temperature: 0.1,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: INVOICE_ANALYSIS_SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
        }),
      });
    } catch (err) {
      throw new InvoiceMindError(
        "AI_ERROR",
        `Failed to reach OpenAI: ${err instanceof Error ? err.message : "network error"}`,
        502
      );
    }

    if (!response.ok) {
      let detail = response.statusText;
      try {
        const body = (await response.json()) as {
          error?: { message?: string };
        };
        detail = body.error?.message ?? detail;
      } catch {
        /* ignore */
      }
      throw new InvoiceMindError(
        "AI_ERROR",
        `OpenAI API error (${response.status}): ${detail}`,
        502
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const rawContent = payload.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new InvoiceMindError(
        "AI_ERROR",
        "OpenAI returned an empty response.",
        502
      );
    }

    const result = parseAiJsonResponse(rawContent, hintFormat);

    if (
      hintFormat &&
      (!result.detectedFormat || result.detectedFormat === "Unknown")
    ) {
      result.detectedFormat = hintFormat;
    }

    return result;
  }
}

export function createOpenAiInvoiceAnalysisService(): OpenAiInvoiceAnalysisService {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model =
    process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  if (!apiKey) {
    throw new InvoiceMindError(
      "CONFIG_ERROR",
      "OPENAI_API_KEY is not configured. Add it to .env.local (see README).",
      500
    );
  }

  return new OpenAiInvoiceAnalysisService({ apiKey, model });
}
