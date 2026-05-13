/**
 * StatusChip — Calm semantic status indicator
 */

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  CREATED:     { label: "Created",     color: "var(--color-steady)",      bg: "var(--color-steady-soft)" },
  VALIDATED:   { label: "Validated",   color: "var(--color-action)",      bg: "var(--color-action-soft)" },
  QUEUED:      { label: "Queued",      color: "var(--color-hazard)",      bg: "var(--color-hazard-soft)" },
  ALLOCATED:   { label: "Allocated",   color: "var(--color-action)",      bg: "var(--color-action-soft)" },
  IN_PROGRESS: { label: "In Progress", color: "var(--color-safe)",        bg: "var(--color-safe-soft)" },
  COMPLETED:   { label: "Completed",   color: "var(--color-safe)",        bg: "var(--color-safe-soft)" },
  CANCELLED:   { label: "Cancelled",   color: "var(--color-ink-tertiary)", bg: "var(--color-surface-dim)" },
};

export function StatusChip({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? {
    label: status,
    color: "var(--color-ink-tertiary)",
    bg: "var(--color-surface-dim)",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider"
      style={{ backgroundColor: entry.bg, color: entry.color }}
      role="status"
      aria-label={`Status: ${entry.label}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: entry.color }}
        aria-hidden="true"
      />
      {entry.label}
    </span>
  );
}
