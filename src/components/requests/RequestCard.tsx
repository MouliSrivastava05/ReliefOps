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

const SEVERITY_BORDERS: Record<number, string> = {
  1: "border-l-steady",
  2: "border-l-action",
  3: "border-l-caution",
  4: "border-l-hazard",
  5: "border-l-critical",
};

export function RequestCard({ id, type, status, severity, description, actions }: Props) {
  const borderClass = SEVERITY_BORDERS[Math.max(1, Math.min(5, severity))] ?? "border-l-border";
  const Icon = TYPE_ICONS[type.toLowerCase()] || TYPE_ICONS.other;

  return (
    <article className={`group ro-card !p-0 overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 ${borderClass}`}>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusChip status={status} />
          <PriorityBadge level={severity} />
          <div className="h-3.5 w-px mx-0.5 bg-border" />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Icon size={14} className="text-ink-tertiary" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>

        <p className="mt-2.5 font-mono text-[0.6rem] text-ink-tertiary">
          ID: {id}
        </p>

        {description && (
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
            {description}
          </p>
        )}

        {actions && (
          <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
            {actions}
          </div>
        )}
      </div>
    </article>
  );
}
