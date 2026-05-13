/**
 * StatusChip — Semantic request state indicator
 *
 * Each status gets a distinct visual treatment so operators
 * can triage at a glance without reading text.
 */

const STATUS_MAP: Record<string, { label: string; className: string; color: string }> = {
  CREATED:     { label: "Created",     className: "border-trust text-trust",     color: "var(--color-trust)" },
  VALIDATED:   { label: "Validated",   className: "border-action text-action",   color: "var(--color-action)" },
  QUEUED:      { label: "Queued",      className: "border-caution text-caution", color: "var(--color-caution)" },
  ALLOCATED:   { label: "Allocated",   className: "border-steady text-steady",   color: "var(--color-steady)" },
  IN_PROGRESS: { label: "In Progress", className: "border-safe text-safe",       color: "var(--color-safe)" },
  COMPLETED:   { label: "Completed",  className: "border-safe text-safe bg-safe/10", color: "var(--color-safe)" },
  CANCELLED:   { label: "Cancelled",  className: "border-border text-ink-tertiary", color: "var(--color-border)" },
};

export function StatusChip({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? {
    label: status,
    className: "border-border text-ink-tertiary",
    color: "var(--color-border)",
  };

  return (
    <span 
      className={`ro-badge gap-1.5 ${entry.className}`}
      role="status" 
      aria-label={`Status: ${entry.label}`}
    >
      <span className="ro-status-dot" style={{ backgroundColor: entry.color }} aria-hidden="true" />
      {entry.label}
    </span>
  );
}
