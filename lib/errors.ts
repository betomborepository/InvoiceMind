export type ErrorCode =
  | "EMPTY_FILE"
  | "EMPTY_CONTENT"
  | "AI_ERROR"
  | "INVALID_AI_JSON"
  | "UNSUPPORTED_FORMAT"
  | "CONFIG_ERROR";

export class InvoiceMindError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = "InvoiceMindError";
  }
}
