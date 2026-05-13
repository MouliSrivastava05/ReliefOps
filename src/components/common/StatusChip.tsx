/**
 * StatusChip — Calm semantic status indicator
 */

const STATUS_MAP: Record<string, { label: string; dotClass: string; bgClass: string; textClass: string }> = {
  CREATED:     { label: "Created",     dotClass: "bg-steady",       bgClass: "bg-steady-soft",   textClass: "text-steady" },
  VALIDATED:   { label: "Validated",   dotClass: "bg-action",       bgClass: "bg-action-soft",   textClass: "text-action" },
  QUEUED:      { label: "Queued",      dotClass: "bg-hazard",       bgClass: "bg-hazard-soft",   textClass: "text-hazard" },
  ALLOCATED:   { label: "Allocated",   dotClass: "bg-action",       bgClass: "bg-action-soft",   textClass: "text-action" },
  IN_PROGRESS: { label: "In Progress", dotClass: "bg-safe",         bgClass: "bg-safe-soft",     textClass: "text-safe" },
  COMPLETED:   { label: "Completed",   dotClass: "bg-safe",         bgClass: "bg-safe-soft",     textClass: "text-safe" },
  CANCELLED:   { label: "Cancelled",   dotClass: "bg-ink-tertiary", bgClass: "bg-surface-dim",   textClass: "text-ink-tertiary" },
};

export function StatusChip({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? {
    label: status,
    dotClass: "bg-ink-tertiary",
    bgClass: "bg-surface-dim",
    textClass: "text-ink-tertiary",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider ${entry.bgClass} ${entry.textClass}`}
      role="status"
      aria-label={`Status: ${entry.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${entry.dotClass}`} aria-hidden="true" />
      {entry.label}
    </span>
  );
}
