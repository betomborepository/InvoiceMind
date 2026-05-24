"use client";

interface ContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ContentTextarea({
  value,
  onChange,
  disabled,
}: ContentTextareaProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="invoice-text"
        className="block text-sm font-medium text-slate-700"
      >
        Or paste XML / text content
      </label>
      <textarea
        id="invoice-text"
        rows={10}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Paste invoice XML, UBL, or plain text here...'
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50"
      />
    </div>
  );
}
