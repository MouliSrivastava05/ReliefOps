"use client";

/**
 * RequestTimeline — Connected progress visualization
 */

const MAIN_PATH = [
  "CREATED",
  "VALIDATED",
  "QUEUED",
  "ALLOCATED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

const STEP_LABELS: Record<string, string> = {
  CREATED: "Received",
  VALIDATED: "Confirmed",
  QUEUED: "Queued",
  ALLOCATED: "Matched",
  IN_PROGRESS: "On Way",
  COMPLETED: "Resolved",
};

export function RequestTimeline({ current }: { current: string }) {
  if (current === "CANCELLED") {
    return (
      <div className="ro-alert-error bg-surface-dim border-dashed">
        <span className="text-lg">✖</span>
        <div>
          <p className="font-bold">Request Cancelled</p>
          <p className="text-xs opacity-75">This request is no longer active.</p>
        </div>
      </div>
    );
  }

  const idx = MAIN_PATH.indexOf(current as (typeof MAIN_PATH)[number]);

  return (
    <ol className="flex flex-wrap items-center gap-y-6" aria-label="Request progress">
      {MAIN_PATH.map((step, i) => {
        const isCompleted = idx >= 0 && i < idx;
        const isCurrent = idx >= 0 && i === idx;
        const isFuture = idx < 0 || i > idx;

        return (
          <li key={step} className="flex items-center">
            {/* Step indicator */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                  isCompleted
                    ? "bg-safe text-white"
                    : isCurrent
                      ? "bg-action text-white ring-4 ring-action/20"
                      : "bg-surface-dim text-ink-tertiary border-2 border-border"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[0.65rem] uppercase tracking-widest leading-none ${
                    isCompleted || isCurrent ? "font-black text-ink" : "font-bold text-ink-tertiary"
                  }`}
                >
                  {STEP_LABELS[step] ?? step}
                </span>
                {isCurrent && (
                  <span className="text-[0.6rem] font-bold text-action animate-pulse mt-1">
                    CURRENT STEP
                  </span>
                )}
              </div>
            </div>
            {/* Connector */}
            {i < MAIN_PATH.length - 1 && (
              <div
                className={`mx-4 h-0.5 w-6 sm:w-10 ${
                  isFuture ? "border-t-2 border-dashed border-border" : "bg-safe"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
