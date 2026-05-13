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
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="ro-live-dot" />
              <p className="ro-eyebrow">Live Operations</p>
            </div>
            <h1 className="ro-title">Dashboard</h1>
            <p className="ro-lead">
              Monitor active requests, resource allocation, and field status in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="ro-btn-secondary text-xs">Export Report</button>
            <button className="ro-btn-action text-xs">Manual Allocate</button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="ro-skeleton h-[130px] rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="ro-alert-error">
            <span>⚠</span>
            <p>{error instanceof Error ? error.message : "Failed to load operational data."}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <div className="space-y-6">
            <LiveStats
              requestCount={requests.length}
              queuedCount={rows.filter((r) => r.status === "QUEUED").length}
              eventCount={events.length}
            />

            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* Map */}
              <div className="lg:col-span-8">
                <div className="ro-card !p-0 overflow-hidden h-full">
                  <div className="px-5 py-3.5 border-b border-border bg-surface-dim/50 flex items-center justify-between">
                    <h2 className="ro-section-title">Mission Control Map</h2>
                    <span className="ro-overline">Active Tracking</span>
                  </div>
                  <MapView requests={requests} />
                </div>
              </div>

              {/* Queue */}
              <div className="lg:col-span-4 min-h-[400px]">
                <PriorityQueue requests={rows} />
              </div>

              {/* Event Log */}
              <div className="lg:col-span-12">
                <section className="ro-card">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="ro-section-title">Allocation Log</h2>
                    <span className="ro-badge">Recent Events</span>
                  </div>
                  <div className="overflow-auto max-h-60 -mx-6 px-6">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr>
                          {["Time", "Request ID", "Resource ID"].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-2.5 font-semibold uppercase tracking-wider text-[0.6rem] border-b border-border sticky top-0 bg-surface text-ink-tertiary"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {events.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-4 py-12 text-center text-xs text-ink-tertiary">
                              No recent allocation events.
                            </td>
                          </tr>
                        ) : (
                          events.map((e: any, i: number) => (
                            <tr key={i} className="hover:bg-surface-dim/30 transition-colors">
                              <td className="px-4 py-3 font-mono text-ink-tertiary">{e.at}</td>
                              <td className="px-4 py-3 font-mono font-semibold text-action">{e.requestId?.slice(-8)}</td>
                              <td className="px-4 py-3 font-mono font-semibold text-safe">{e.resourceId?.slice(-8)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </RoleGuard>
  );
}
