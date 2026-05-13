/**
 * PriorityBadge — Severity-scaled visual indicator
 *
 * S5 (Critical) DEMANDS attention. S1 (Low) recedes.
 */

const SEVERITY_CONFIG: Record<number, { label: string; className: string; color: string }> = {
  5: { label: "CRITICAL", className: "bg-critical text-white", color: "var(--color-critical)" },
  4: { label: "URGENT",   className: "bg-hazard text-white",   color: "var(--color-hazard)" },
  3: { label: "SERIOUS",  className: "bg-caution text-white",  color: "var(--color-caution)" },
  2: { label: "MODERATE", className: "bg-action text-white",   color: "var(--color-action)" },
  1: { label: "STABLE",   className: "bg-steady text-white",   color: "var(--color-steady)" },
};

export function PriorityBadge({ level }: { level: string | number }) {
  const num = typeof level === "number" ? level : parseInt(String(level).replace(/\D/g, ""), 10) || 3;
  const clamped = Math.max(1, Math.min(5, num));
  const config = SEVERITY_CONFIG[clamped];

  return (
    <span 
      className={`ro-badge px-3 py-1 font-black ${config.className}`} 
      aria-label={`Priority: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
