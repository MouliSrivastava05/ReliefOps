"use client";

/**
 * LiveStats — Operational overview stat cards
 */

type Props = {
  requestCount: number;
  queuedCount: number;
  eventCount: number;
};

export function LiveStats({ requestCount, queuedCount, eventCount }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Operational statistics">
      <div className="ro-card bg-trust text-white flex flex-col justify-between min-h-[120px] border-none shadow-lg">
        <div className="flex items-center justify-between opacity-80">
          <p className="ro-eyebrow text-white">Active Pipeline</p>
          <span className="ro-live-dot" />
        </div>
        <div>
          <p className="text-4xl font-black tracking-tighter tabular-nums">{requestCount}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60">Total Open Requests</p>
        </div>
      </div>

      <div className={`ro-card flex flex-col justify-between min-h-[120px] ${queuedCount > 0 ? "bg-hazard text-white border-none shadow-lg" : "bg-surface text-ink"}`}>
        <p className={`ro-eyebrow ${queuedCount > 0 ? "text-white" : ""}`}>Triage Queue</p>
        <div>
          <p className="text-4xl font-black tracking-tighter tabular-nums">{queuedCount}</p>
          <p className={`text-[0.6rem] font-bold uppercase tracking-widest opacity-60 ${queuedCount > 0 ? "text-white" : ""}`}>
            {queuedCount > 0 ? "Awaiting Allocation" : "Pipeline Clear"}
          </p>
        </div>
      </div>

      <div className="ro-card bg-safe text-white flex flex-col justify-between min-h-[120px] border-none shadow-lg">
        <p className="ro-eyebrow text-white">Velocity</p>
        <div>
          <p className="text-4xl font-black tracking-tighter tabular-nums">{eventCount}</p>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60">Allocations Completed</p>
        </div>
      </div>
    </section>
  );
}
