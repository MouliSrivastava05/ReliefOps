"use client";

import { priorityScore } from "@/utils/priorityScore";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { IconMedical, IconShelter, IconFood, IconEmergency } from "@/components/common/Icons";

const TYPE_ICONS: Record<string, React.ElementType> = {
  medical: IconMedical,
  shelter: IconShelter,
  food: IconFood,
};

const SEVERITY_ACCENTS: Record<number, string> = {
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
      <div className="flex items-center justify-between mb-5">
        <h2 className="ro-section-title">Priority Queue</h2>
        <span className="ro-badge">{queued.length} pending</span>
      </div>
      <div className="flex-1 overflow-auto -mr-2 pr-2">
        <ul className="space-y-2.5">
          {queued.length === 0 ? (
            <li
              className="rounded-xl border-2 border-dashed px-5 py-10 text-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--color-ink-tertiary)" }}>
                All requests have been matched.
              </p>
            </li>
          ) : (
            queued.map((r) => {
              const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
              const accent = SEVERITY_ACCENTS[r.severity] || "var(--color-border)";
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 group"
                  style={{
                    borderColor: "var(--color-border)",
                    borderLeftWidth: "4px",
                    borderLeftColor: accent,
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                      style={{ backgroundColor: "var(--color-surface-dim)", color: "var(--color-ink-secondary)" }}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-none" style={{ color: "var(--color-ink)" }}>
                        {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                      </p>
                      <p className="text-[0.6rem] font-mono mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
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
