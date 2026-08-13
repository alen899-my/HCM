// lib/format.ts
// ─────────────────────────────────────────────────────────────────────────────
// Common formatting utilities shared across features.
// ─────────────────────────────────────────────────────────────────────────────

/** "2026-08-13T12:30:00Z" → "13 Aug 2026, 18:00" (local time). */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** "2026-08-13T12:30:00Z" → "13 Aug 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}