"use client";

const MAIN_PATH = [
  "CREATED",
  "VALIDATED",
  "QUEUED",
  "ALLOCATED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export function RequestTimeline({ current }: { current: string }) {
  if (current === "CANCELLED") {
    return (
      <p className="text-sm font-medium text-danger">Request cancelled.</p>
    );
  }

  const idx = MAIN_PATH.indexOf(current as (typeof MAIN_PATH)[number]);

  return (
    <ol className="flex flex-wrap gap-1.5">
      {MAIN_PATH.map((s, i) => {
        const done = idx >= 0 && i <= idx;
        return (
          <li key={s}>
            <span
              className={
                done
                  ? "inline-block rounded border border-primary/30 bg-primary-soft px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-deep"
                  : "inline-block rounded border border-canvas-line bg-surface-mute px-2 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-ink-faint"
              }
            >
              {s.replace(/_/g, " ")}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
