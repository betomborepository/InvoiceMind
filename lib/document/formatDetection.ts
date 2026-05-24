import type { DetectedFormat } from "@/lib/types/invoice";

export function detectFormatFromContent(
  content: string,
  fileName?: string
): DetectedFormat {
  const lower = content.toLowerCase();
  const ext = fileName?.split(".").pop()?.toLowerCase();

  if (
    lower.includes("factur-x") ||
    lower.includes("facturx") ||
    lower.includes("fx:") ||
    lower.includes("urn:factur-x")
  ) {
    return "Factur-X";
  }

  if (
    lower.includes("crossindustryinvoice") ||
    lower.includes("rsm:crossindustryinvoice") ||
    lower.includes("urn:un:unece:uncefact:data:standard:crossindustryinvoice")
  ) {
    return "CII";
  }

  if (
    lower.includes("urn:oasis:names:specification:ubl") ||
    lower.includes(":invoice>") ||
    lower.includes("ubl:invoice") ||
    lower.includes("<invoice ")
  ) {
    return "UBL";
  }

  if (
    content.trimStart().startsWith("<?xml") ||
    content.trimStart().startsWith("<")
  ) {
    if (ext === "xml" || lower.includes("<?xml")) {
      return "XML";
    }
  }

  if (ext === "pdf") {
    return "PDF";
  }

  if (ext === "xml") {
    return "XML";
  }

  if (content.trim().length > 0) {
    return "Text";
  }

  return "Unknown";
}
