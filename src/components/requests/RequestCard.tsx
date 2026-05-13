"use client";

import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusChip } from "@/components/common/StatusChip";
import { IconMedical, IconShelter, IconFood, IconEmergency } from "@/components/common/Icons";

type Props = {
  id: string;
  type: string;
  status: string;
  severity: number;
  description?: string;
  actions?: React.ReactNode;
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  medical: IconMedical,
  shelter: IconShelter,
  food: IconFood,
  rescue: IconEmergency,
  other: IconEmergency,
};

const SEVERITY_ACCENTS: Record<number, string> = {
  1: "var(--color-steady)",
  2: "var(--color-action)",
  3: "var(--color-caution)",
  4: "var(--color-hazard)",
  5: "var(--color-critical)",
};

export function RequestCard({ id, type, status, severity, description, actions }: Props) {
  const accent = SEVERITY_ACCENTS[Math.max(1, Math.min(5, severity))] ?? "var(--color-border)";
  const Icon = TYPE_ICONS[type.toLowerCase()] || TYPE_ICONS.other;

  return (
    <article
      className="group ro-card !p-0 overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{ borderLeftWidth: "4px", borderLeftColor: accent }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusChip status={status} />
          <PriorityBadge level={severity} />
          <div className="h-3.5 w-px mx-0.5" style={{ backgroundColor: "var(--color-border)" }} />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-ink)" }}>
            <Icon size={14} style={{ color: "var(--color-ink-tertiary)" }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>

        <p className="mt-2.5 font-mono text-[0.6rem]" style={{ color: "var(--color-ink-tertiary)" }}>
          ID: {id}
        </p>

        {description && (
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
            {description}
          </p>
        )}

        {actions && (
          <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            {actions}
          </div>
        )}
      </div>
    </article>
  );
}
