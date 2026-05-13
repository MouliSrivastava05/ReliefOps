"use client";

const MAIN_PATH = ["CREATED", "VALIDATED", "QUEUED", "ALLOCATED", "IN_PROGRESS", "COMPLETED"] as const;

const STEP_LABELS: Record<string, string> = {
  CREATED: "Received",
  VALIDATED: "Confirmed",
  QUEUED: "Queued",
  ALLOCATED: "Matched",
  IN_PROGRESS: "En Route",
  COMPLETED: "Resolved",
};

export function RequestTimeline({ current }: { current: string }) {
  if (current === "CANCELLED") {
    return (
      <div className="ro-alert-warning">
        <span>—</span>
        <div>
          <p className="font-semibold">Request cancelled</p>
          <p className="text-xs opacity-75 mt-0.5">This request is no longer active.</p>
        </div>
      </div>
    );
  }

  const idx = MAIN_PATH.indexOf(current as (typeof MAIN_PATH)[number]);

  return (
    <ol className="flex flex-wrap items-center gap-y-4" aria-label="Request progress">
      {MAIN_PATH.map((step, i) => {
        const isCompleted = idx >= 0 && i < idx;
        const isCurrent = idx >= 0 && i === idx;
        const isFuture = idx < 0 || i > idx;

        return (
          <li key={step} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold transition-all ${
                  isCompleted
                    ? "bg-safe text-white"
                    : isCurrent
                      ? "bg-action text-white shadow-[0_0_0_4px_rgba(13,148,136,0.1)]"
                      : "bg-surface-dim text-ink-tertiary"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <div className="flex flex-col">
                <span className={`text-[0.6rem] uppercase tracking-wider leading-none font-semibold ${
                  isCompleted || isCurrent ? "text-ink" : "text-ink-tertiary"
                }`}>
                  {STEP_LABELS[step] ?? step}
                </span>
                {isCurrent && (
                  <span className="text-[0.5rem] font-semibold mt-1 text-action">Current</span>
                )}
              </div>
            </div>
            {i < MAIN_PATH.length - 1 && (
              <div className={`mx-3 w-5 sm:w-8 ${
                isFuture ? "border-t-2 border-dashed border-border" : "h-0.5 bg-safe"
              }`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
