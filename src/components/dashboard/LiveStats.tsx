"use client";

/**
 * LiveStats — Ambient stat cards with layered depth
 */

type Props = {
  requestCount: number;
  queuedCount: number;
  eventCount: number;
};

export function LiveStats({ requestCount, queuedCount, eventCount }: Props) {
  const cards = [
    {
      label: "Active Requests",
      value: requestCount,
      accent: "var(--color-action)",
      bg: "var(--color-action-soft)",
      dot: true,
    },
    {
      label: "Awaiting Match",
      value: queuedCount,
      accent: queuedCount > 0 ? "var(--color-hazard)" : "var(--color-ink-tertiary)",
      bg: queuedCount > 0 ? "var(--color-hazard-soft)" : "var(--color-surface-dim)",
      sub: queuedCount > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "Allocations",
      value: eventCount,
      accent: "var(--color-safe)",
      bg: "var(--color-safe-soft)",
      sub: "This session",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Operational statistics">
      {cards.map((c, i) => (
        <div
          key={i}
          className="ro-card flex flex-col justify-between min-h-[130px] transition-all duration-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="ro-overline">{c.label}</p>
            {c.dot && <span className="ro-live-dot" />}
          </div>
          <div className="mt-auto">
            <p
              className="text-4xl font-extrabold tracking-tighter tabular-nums"
              style={{ color: c.accent }}
            >
              {c.value}
            </p>
            {c.sub && (
              <p className="text-[0.6rem] font-medium mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
                {c.sub}
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
