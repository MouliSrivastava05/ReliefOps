"use client";

type Props = {
  requestCount: number;
  queuedCount: number;
  eventCount: number;
};

export function LiveStats({ requestCount, queuedCount, eventCount }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="ro-card-quiet border-canvas-line">
        <p className="ro-eyebrow">Open pipeline</p>
        <p className="mt-2 font-display text-3xl font-medium tabular-nums text-ink">
          {requestCount}
        </p>
        <p className="mt-1 text-xs text-ink-faint">Total requests visible to you</p>
      </div>
      <div className="ro-card-quiet border-warn/25 bg-warn-soft/40">
        <p className="ro-eyebrow text-warn">Awaiting match</p>
        <p className="mt-2 font-display text-3xl font-medium tabular-nums text-warn">
          {queuedCount}
        </p>
        <p className="mt-1 text-xs text-ink-muted">In queue for allocation</p>
      </div>
      <div className="ro-card-quiet border-primary/20 bg-primary-soft/50">
        <p className="ro-eyebrow text-primary-deep">This session</p>
        <p className="mt-2 font-display text-3xl font-medium tabular-nums text-primary-deep">
          {eventCount}
        </p>
        <p className="mt-1 text-xs text-ink-muted">Allocations logged (observer)</p>
      </div>
    </section>
  );
}
