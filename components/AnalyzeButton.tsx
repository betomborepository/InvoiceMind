"use client";

interface AnalyzeButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function AnalyzeButton({
  onClick,
  loading,
  disabled,
}: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Analyzing…
        </>
      ) : (
        "Analyze invoice"
      )}
    </button>
  );
}
