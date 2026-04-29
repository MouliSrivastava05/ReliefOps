"use client";

import { LiveStats } from "@/components/dashboard/LiveStats";
import { MapView } from "@/components/map/MapView";
import { PriorityQueue } from "@/components/dashboard/PriorityQueue";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useRequestsList } from "@/hooks/useRequests";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useRequestsList(true);

  const requests = data?.requests ?? [];
  const events = data?.allocationEvents ?? [];
  const rows = requests.map((r) => ({
    id: r.id,
    severity: r.severity,
    type: r.type,
    status: r.status,
  }));

  return (
    <RoleGuard role={[ROLES.ADMIN]}>
      <main className="ro-page-wide space-y-10">
        <div className="max-w-2xl">
          <p className="ro-eyebrow">Operations</p>
          <h1 className="ro-title mt-2">Dashboard</h1>
          <p className="ro-lead">
            A working snapshot: counts, queue order, map context, and the last
            few allocation events from this running instance (observer pattern,
            not a broadcast bus—fine for a desk demo).
          </p>
        </div>
        {isLoading && (
          <p className="text-sm text-ink-faint">Pulling fresh numbers…</p>
        )}
        {error && (
          <p className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
            {error instanceof Error ? error.message : "Failed to load"}
          </p>
        )}
        {!isLoading && !error && (
          <>
            <LiveStats
              requestCount={requests.length}
              queuedCount={rows.filter((r) => r.status === "QUEUED").length}
              eventCount={events.length}
            />
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <PriorityQueue requests={rows} />
              <div>
                <h2 className="font-display text-lg font-medium text-ink">
                  Geography
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Static preview or placeholder—your data still carries lat/lng.
                </p>
                <div className="mt-4">
                  <MapView requests={requests} />
                </div>
              </div>
            </div>
            {events.length > 0 && (
              <section className="ro-card">
                <h2 className="font-display text-lg font-medium text-ink">
                  Recent allocations
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  From this Node process only—document that in your report if
                  you need strict accuracy.
                </p>
                <ul className="mt-4 max-h-52 space-y-2 overflow-auto font-mono text-[0.7rem] leading-relaxed text-ink-muted">
                  {(events as { requestId?: string; resourceId?: string; strategy?: string; at?: string }[]).map(
                    (e, i) => (
                      <li
                        key={i}
                        className="border-b border-canvas-line/60 pb-2 last:border-0"
                      >
                        <span className="text-ink-faint">{e.at}</span>
                        {" · "}
                        req {e.requestId} → res {e.resourceId}{" "}
                        <span className="text-accent">({e.strategy})</span>
                      </li>
                    ),
                  )}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </RoleGuard>
  );
}
