"use client";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUpload({
  file,
  onFileChange,
  disabled,
}: FileUploadProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="invoice-file"
        className="block text-sm font-medium text-slate-700"
      >
        Upload invoice file
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <label
          className={`inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Choose file
          <input
            id="invoice-file"
            type="file"
            accept=".pdf,.xml,.txt,.ubl"
            className="sr-only"
            disabled={disabled}
            onChange={(e) => {
              const selected = e.target.files?.[0] ?? null;
              onFileChange(selected);
            }}
          />
        </label>
        {file && (
          <span className="text-sm text-slate-600">
            {file.name}{" "}
            <span className="text-slate-400">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </span>
        )}
        {file && !disabled && (
          <button
            type="button"
            className="text-sm text-red-600 hover:text-red-700"
            onClick={() => onFileChange(null)}
          >
            Remove
          </button>
        )}
      </div>
      <p className="text-xs text-slate-500">
        Supported: PDF, XML, UBL, plain text
      </p>
    </div>
  );
}
