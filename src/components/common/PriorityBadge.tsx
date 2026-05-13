/**
 * PriorityBadge — Severity indicator with graduated intensity
 */

const SEVERITY_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  5: { label: "Critical", color: "#fff",                    bg: "var(--color-critical)" },
  4: { label: "Urgent",   color: "#fff",                    bg: "var(--color-hazard)" },
  3: { label: "Serious",  color: "var(--color-hazard)",     bg: "var(--color-hazard-soft)" },
  2: { label: "Moderate", color: "var(--color-action)",     bg: "var(--color-action-soft)" },
  1: { label: "Stable",   color: "var(--color-ink-tertiary)", bg: "var(--color-surface-dim)" },
};

export function PriorityBadge({ level }: { level: string | number }) {
  const num = typeof level === "number" ? level : parseInt(String(level).replace(/\D/g, ""), 10) || 3;
  const clamped = Math.max(1, Math.min(5, num));
  const config = SEVERITY_CONFIG[clamped];

  return (
    <span
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider"
      style={{ backgroundColor: config.bg, color: config.color }}
      aria-label={`Priority: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
