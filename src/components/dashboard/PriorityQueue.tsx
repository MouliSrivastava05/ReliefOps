"use client";

import { priorityScore } from "@/utils/priorityScore";

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
    <section className="ro-card">
      <h2 className="font-display text-lg font-medium text-ink">Priority queue</h2>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        Same ordering the severity strategy respects. In production you might
        back this with Redis or a proper heap—here it is honest in-memory sort.
      </p>
      <ul className="mt-5 space-y-2">
        {queued.length === 0 ? (
          <li className="rounded-md border border-dashed border-canvas-line px-3 py-6 text-center text-sm text-ink-faint">
            Nothing queued right now.
          </li>
        ) : (
          queued.map((r, i) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-md border border-canvas-line bg-surface-mute px-3 py-2.5 text-sm"
            >
              <span className="font-mono text-[0.7rem] text-ink-faint">
                {r.id.slice(-8)}
              </span>
              <span className="text-ink-muted">
                <span className="font-medium text-ink">#{i + 1}</span>
                {" · "}
                severity {r.severity} · {r.type}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
