"use client";

import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusChip } from "@/components/common/StatusChip";
import { IconMedical, IconShelter, IconFood, IconEmergency } from "@/components/common/Icons";

/**
 * RequestCard — Triage-optimized request display
 *
 * Left border color encodes severity for instant visual scanning.
 * Information hierarchy: Status + Severity (top) → Type → Description → Actions
 */

type Props = {
  id: string;
  type: string;
  status: string;
  severity: number;
  description?: string;
  actions?: React.ReactNode;
};

const TRIAGE_CLASS: Record<number, string> = {
  1: "ro-triage-1",
  2: "ro-triage-2",
  3: "ro-triage-3",
  4: "ro-triage-4",
  5: "ro-triage-5",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  medical: IconMedical,
  shelter: IconShelter,
  food: IconFood,
  rescue: IconEmergency,
  other: IconEmergency,
};

export function RequestCard({
  id,
  type,
  status,
  severity,
  description,
  actions,
}: Props) {
  const triageClass = TRIAGE_CLASS[Math.max(1, Math.min(5, severity))] ?? "ro-triage-3";

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:shadow-lg hover:scale-[1.005] ${triageClass}`}
      style={{ 
        boxShadow: "var(--shadow-premium)",
      }}
    >
      {/* Inner Glow Overlay */}
      <div className="absolute inset-0 border-t border-white/40 pointer-events-none" />
      
      <div className="p-6 pl-7">
        {/* Row 1: Status + Severity + Type */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip status={status} />
          <PriorityBadge level={severity} />
          <div className="h-3 w-px bg-border mx-1" />
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink">
            {(() => {
              const Icon = TYPE_ICONS[type.toLowerCase()] || TYPE_ICONS.other;
              return <Icon size={14} className="opacity-70" />;
            })()}
            {type}
          </span>
        </div>

        {/* Row 2: ID */}
        <div className="mt-3">
          <span className="font-mono text-[0.6rem] font-bold uppercase tracking-tighter opacity-40">
            Node ID: {id}
          </span>
        </div>

        {/* Row 3: Description */}
        {description ? (
          <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-secondary text-balance">
            {description}
          </p>
        ) : null}

        {/* Row 4: Actions */}
        {actions ? (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border/50 pt-5">
            {actions}
          </div>
        ) : null}
      </div>
    </article>
  );
}
