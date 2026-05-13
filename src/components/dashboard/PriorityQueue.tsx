"use client";

import { priorityScore } from "@/utils/priorityScore";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { IconMedical, IconShelter, IconFood, IconEmergency } from "@/components/common/Icons";

const TYPE_ICONS: Record<string, any> = {
  medical: IconMedical,
  shelter: IconShelter,
  food: IconFood,
};

const SEVERITY_COLORS: Record<number, string> = {
  1: "var(--color-steady)",
  2: "var(--color-action)",
  3: "var(--color-caution)",
  4: "var(--color-hazard)",
  5: "var(--color-critical)",
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-ink">Priority Queue</h2>
        <span className="ro-badge bg-surface-dim text-ink-tertiary">
          {queued.length} PENDING
        </span>
      </div>
      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        <ul className="space-y-3">
          {queued.length === 0 ? (
            <li className="rounded-lg border-2 border-dashed border-border px-4 py-12 text-center bg-surface-dim/30">
              <p className="text-xs font-bold text-ink-tertiary uppercase tracking-widest">
                Queue Clear
              </p>
            </li>
          ) : (
            queued.map((r, i) => {
              const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
              const color = SEVERITY_COLORS[r.severity] || "var(--color-border)";
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg border-2 bg-white transition-all hover:border-border-strong group"
                  style={{ borderLeftColor: color, borderLeftWidth: '6px' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="ro-tile-icon !h-8 !w-8 !bg-surface-dim group-hover:!bg-trust group-hover:!text-white">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink leading-none">{r.type.toUpperCase()}</p>
                      <p className="text-[0.6rem] font-mono text-ink-tertiary mt-1">ID: {r.id.slice(-8)}</p>
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
