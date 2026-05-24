import { NextResponse } from "next/server";
import { extractFromPlainText } from "@/lib/document/textExtractor";
import { extractDocumentFromFile } from "@/lib/document/documentService";
import { InvoiceMindError } from "@/lib/errors";
import { getInvoiceAnalysisService } from "@/lib/services/invoiceAnalysisServiceFactory";
import type { ApiErrorResponse, DetectedFormat } from "@/lib/types/invoice";

export const runtime = "nodejs";

type UploadedFile = {
  name: string;
  size: number;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
};

function asUploadedFile(entry: FormDataEntryValue | null): UploadedFile | null {
  if (
    entry === null ||
    typeof entry !== "object" ||
    !("arrayBuffer" in entry) ||
    typeof entry.arrayBuffer !== "function" ||
    !("size" in entry) ||
    typeof entry.size !== "number" ||
    !("name" in entry) ||
    typeof entry.name !== "string"
  ) {
    return null;
  }
  return entry as UploadedFile;
}

function errorResponse(
  code: string,
  message: string,
  status: number
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ error: code, message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");
    const textEntry = formData.get("text");

    const uploaded = asUploadedFile(fileEntry);
    const file = uploaded && uploaded.size > 0 ? uploaded : null;
    const text =
      typeof textEntry === "string" && textEntry.trim().length > 0
        ? textEntry.trim()
        : null;

    if (!file && !text) {
      return errorResponse(
        "EMPTY_CONTENT",
        "Provide a file upload or paste document text/XML.",
        400
      );
    }

    if (uploaded && uploaded.size === 0) {
      return errorResponse("EMPTY_FILE", "The uploaded file is empty.", 400);
    }

    let documentText: string;
    let detectedFormat: DetectedFormat = "Unknown";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.length === 0) {
        return errorResponse("EMPTY_FILE", "The uploaded file is empty.", 400);
      }

      const extracted = await extractDocumentFromFile(
        buffer,
        file.name,
        file.type || undefined
      );
      documentText = extracted.text;
      detectedFormat = extracted.format;
    } else {
      documentText = text!;
      const extracted = extractFromPlainText(documentText);
      detectedFormat = extracted.format;
    }

    if (!documentText.trim()) {
      return errorResponse(
        "EMPTY_CONTENT",
        "No readable content found in the document.",
        400
      );
    }

    const service = getInvoiceAnalysisService();
    const result = await service.analyze(documentText, detectedFormat);

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof InvoiceMindError) {
      return errorResponse(err.code, err.message, err.status);
    }

    console.error("[analyze]", err);
    return errorResponse(
      "AI_ERROR",
      "An unexpected error occurred during analysis.",
      500
    );
  }
}
