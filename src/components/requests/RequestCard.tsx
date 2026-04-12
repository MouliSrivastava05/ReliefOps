"use client";

import { PriorityBadge } from "@/components/common/PriorityBadge";
import { StatusChip } from "@/components/common/StatusChip";

type Props = {
  id: string;
  type: string;
  status: string;
  severity: number;
  description?: string;
  actions?: React.ReactNode;
};

export function RequestCard({
  id,
  type,
  status,
  severity,
  description,
  actions,
}: Props) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-canvas-line bg-surface shadow-lift transition hover:border-canvas-deep">
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/80 opacity-0 transition group-hover:opacity-100" />
      <div className="p-5 pl-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.7rem] text-ink-faint">{id}</span>
          <StatusChip status={status} />
          <PriorityBadge level={`S${severity}`} />
          <span className="text-sm font-medium capitalize text-ink">{type}</span>
        </div>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-canvas-line/80 pt-4">
            {actions}
          </div>
        ) : null}
      </div>
    </article>
  );
}
