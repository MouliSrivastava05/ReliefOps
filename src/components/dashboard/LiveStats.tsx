"use client";

/**
 * LiveStats — Ambient stat cards
 */

type Props = {
  requestCount: number;
  queuedCount: number;
  eventCount: number;
};

export function LiveStats({ requestCount, queuedCount, eventCount }: Props) {
  const cards = [
    { label: "Active Requests", value: requestCount, color: "text-action", dot: true, sub: "" },
    {
      label: "Awaiting Match",
      value: queuedCount,
      color: queuedCount > 0 ? "text-hazard" : "text-ink-tertiary",
      dot: false,
      sub: queuedCount > 0 ? "Needs attention" : "All clear",
    },
    { label: "Allocations", value: eventCount, color: "text-safe", dot: false, sub: "This session" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Operational statistics">
      {cards.map((c, i) => (
        <div key={i} className="ro-card flex flex-col justify-between min-h-[130px] transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="ro-overline">{c.label}</p>
            {c.dot && <span className="ro-live-dot" />}
          </div>
          <div className="mt-auto">
            <p className={`text-4xl font-extrabold tracking-tighter tabular-nums ${c.color}`}>
              {c.value}
            </p>
            {c.sub && (
              <p className="text-[0.6rem] font-medium mt-1 text-ink-tertiary">{c.sub}</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
