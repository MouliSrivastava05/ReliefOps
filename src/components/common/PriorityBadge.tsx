/**
 * PriorityBadge — Severity indicator with graduated intensity
 */

const SEVERITY_CONFIG: Record<number, { label: string; classes: string }> = {
  5: { label: "Critical", classes: "bg-critical text-white" },
  4: { label: "Urgent",   classes: "bg-hazard text-white" },
  3: { label: "Serious",  classes: "bg-hazard-soft text-hazard" },
  2: { label: "Moderate", classes: "bg-action-soft text-action" },
  1: { label: "Stable",   classes: "bg-surface-dim text-ink-tertiary" },
};

export function PriorityBadge({ level }: { level: string | number }) {
  const num = typeof level === "number" ? level : parseInt(String(level).replace(/\D/g, ""), 10) || 3;
  const clamped = Math.max(1, Math.min(5, num));
  const config = SEVERITY_CONFIG[clamped];

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${config.classes}`}
      aria-label={`Priority: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
