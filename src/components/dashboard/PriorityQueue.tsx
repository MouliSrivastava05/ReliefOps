"use client";

import { priorityScore } from "@/utils/priorityScore";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { IconMedical, IconShelter, IconFood, IconEmergency } from "@/components/common/Icons";

const TYPE_ICONS: Record<string, React.ElementType> = {
  medical: IconMedical,
  shelter: IconShelter,
  food: IconFood,
};

const SEVERITY_COLORS: Record<number, string> = {
  1: "border-l-steady",
  2: "border-l-action",
  3: "border-l-caution",
  4: "border-l-hazard",
  5: "border-l-critical",
};

type Row = { id: string; severity: number; type: string; status: string };

export function PriorityQueue({ requests }: { requests: Row[] }) {
  const queued = requests
    .filter((r) => r.status === "QUEUED")
    .sort(
      (a, b) =>
        priorityScore(b.severity) - priorityScore(a.severity) ||
        a.type.localeCompare(b.type),
    );

  return (
    <section className="ro-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="ro-section-title">Priority Queue</h2>
        <span className="ro-badge">{queued.length} pending</span>
      </div>
      <div className="flex-1 overflow-auto -mr-2 pr-2">
        <ul className="space-y-2.5">
          {queued.length === 0 ? (
            <li className="rounded-xl border-2 border-dashed border-border px-5 py-10 text-center">
              <p className="text-xs font-medium text-ink-tertiary">
                All requests have been matched.
              </p>
            </li>
          ) : (
            queued.map((r) => {
              const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
              const borderClass = SEVERITY_COLORS[r.severity] || "border-l-border";
              return (
                <li
                  key={r.id}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-surface transition-all duration-200 border-l-4 ${borderClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-surface-dim text-ink-secondary">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink leading-none">
                        {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                      </p>
                      <p className="text-[0.6rem] font-mono text-ink-tertiary mt-1">
                        {r.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <PriorityBadge level={r.severity} />
                </li>
              );
            })
          )}
        </ul>
      </div>
    </section>
  );
}
