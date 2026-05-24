# InvoiceMind

V1 web app that analyzes invoices and business documents with AI and returns structured JSON (invoice number, parties, amounts, format detection, missing fields, warnings).

**Stack:** Next.js 15, React, TypeScript, Tailwind CSS, OpenAI API (server-side only).

## Features

- Upload PDF / XML / text or paste content in a textarea
- `POST /api/invoices/analyze` — multipart `file` and/or `text`
- OpenAI extraction with a strict JSON schema (no invented data)
- Readable summary + formatted JSON in the UI
- Simple PDF text extraction (`pdf-parse`); scanned PDFs → clear error + TODO for OCR

## Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure OpenAI

Copy the example env file and add your key:

```bash
copy .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

Never commit `.env.local` or expose the API key in client-side code.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

## API

### `POST /api/invoices/analyze`

**Content-Type:** `multipart/form-data`

| Field  | Type   | Description                    |
|--------|--------|--------------------------------|
| `file` | File   | Optional — PDF, XML, text      |
| `text` | string | Optional — pasted XML or text  |

At least one of `file` or `text` is required. If both are sent, the file is used.

**Success (200):** `InvoiceAnalysisResult` JSON

**Errors (4xx/5xx):**

```json
{ "error": "EMPTY_CONTENT", "message": "..." }
```

| Code               | Meaning                          |
|--------------------|----------------------------------|
| `EMPTY_FILE`       | Uploaded file has no content     |
| `EMPTY_CONTENT`    | No file and no text              |
| `UNSUPPORTED_FORMAT` | Unsupported type or PDF issue |
| `AI_ERROR`         | OpenAI/network failure           |
| `INVALID_AI_JSON`  | Model returned invalid JSON      |
| `CONFIG_ERROR`     | Missing `OPENAI_API_KEY`         |

## Project structure

```
app/
  page.tsx                          # Main UI
  api/invoices/analyze/route.ts     # API endpoint
lib/
  types/invoice.ts                  # Shared types
  services/                         # IInvoiceAnalysisService + OpenAI
  document/                         # PDF/text extractors
  validation/parseAiJson.ts         # Normalize AI JSON
components/                         # Upload, textarea, results
```

## Test examples

### Paste XML (textarea)

Paste a minimal UBL/XML invoice snippet and click **Analyze invoice**.

### cURL with text

```bash
curl -X POST http://localhost:3000/api/invoices/analyze ^
  -F "text=<?xml version=\"1.0\"?><Invoice><ID>INV-001</ID></Invoice>"
```

### cURL with file

```bash
curl -X POST http://localhost:3000/api/invoices/analyze ^
  -F "file=@./sample-invoice.pdf"
```

### Empty content (expect 400)

```bash
curl -X POST http://localhost:3000/api/invoices/analyze
```

## Replacing OpenAI

Implement `IInvoiceAnalysisService` (e.g. Azure OpenAI) and register it in `lib/services/invoiceAnalysisServiceFactory.ts`.

## PDF limitations (V1)

- Text-based PDFs work via `pdf-parse`
- Image-only / scanned PDFs need OCR — see `TODO` in `lib/document/pdfExtractor.ts`

## License

Private / demo project — adjust as needed.
