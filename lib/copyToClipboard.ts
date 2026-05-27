/**
 * Copies text to the clipboard. Uses the Clipboard API when available
 * (HTTPS or localhost), otherwise falls back to execCommand — needed for
 * custom dev hostnames like http://local.invoicemind (not a secure context).
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof document === "undefined") return false;

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* try fallback */
    }
  }

  return copyWithExecCommand(text);
}

function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;outline:none;opacity:0;";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return ok;
}
