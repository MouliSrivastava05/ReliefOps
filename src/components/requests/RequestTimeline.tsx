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
      <div className="flex items-center gap-3 rounded-lg bg-danger-soft/30 p-4 border border-danger/20">
        <div className="h-2 w-2 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <p className="text-sm font-medium text-danger">This request has been cancelled.</p>
      </div>
    );
  }

  const idx = MAIN_PATH.indexOf(current as (typeof MAIN_PATH)[number]);

  return (
    <div className="relative space-y-6 pl-2">
      {/* Vertical line connector */}
      <div className="absolute left-[0.4375rem] top-2 h-[calc(100%-1.5rem)] w-0.5 bg-canvas-line/60" />

      {MAIN_PATH.map((s, i) => {
        const done = idx >= 0 && i <= idx;
        const isCurrent = s === current;

        return (
          <div key={s} className="relative flex items-center gap-4 transition-all duration-500">
            {/* Circle indicator */}
            <div
              className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                done
                  ? "border-primary bg-white shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]"
                  : "border-canvas-line bg-canvas-deep"
              }`}
            >
              {isCurrent && (
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              )}
            </div>

            <div className="flex flex-col">
              <span
                className={`text-[0.65rem] font-bold uppercase tracking-[0.1em] transition-colors ${
                  done ? "text-ink" : "text-ink-faint"
                }`}
              >
                {s.replace(/_/g, " ")}
              </span>
              {isCurrent && (
                <span className="text-[0.6rem] text-primary-deep font-medium italic mt-0.5">
                  Current Status
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
