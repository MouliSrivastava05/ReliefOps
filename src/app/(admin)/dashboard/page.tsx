"use client";

import { LiveStats } from "@/components/dashboard/LiveStats";
import { MapView } from "@/components/map/MapView";
import { PriorityQueue } from "@/components/dashboard/PriorityQueue";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useRequestsList } from "@/hooks/useRequests";

/**
 * Admin Dashboard — Operational Redesign
 * 
 * Bento-style layout for high-fidelity coordination.
 * Focused on real-time data and immediate actionability.
 */

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="ro-live-dot" />
              <p className="ro-eyebrow !text-ink">Live Coordination Hub</p>
            </div>
            <h1 className="ro-title">Mission Overview</h1>
            <p className="ro-lead !text-ink-secondary">
              Real-time monitoring of active requests and resource allocation.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="ro-btn-secondary text-xs py-2">EXPORT REPORT</button>
            <button className="ro-btn-primary text-xs py-2">MANUAL ALLOCATION</button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="ro-card h-32 ro-skeleton" />
            ))}
          </div>
        )}

        {error && (
          <div className="ro-alert-error">
            <span>⚠️</span>
            <p>System Failure: {error instanceof Error ? error.message : "Lookup failed."}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            <LiveStats
              requestCount={requests.length}
              queuedCount={rows.filter((r) => r.status === "QUEUED").length}
              eventCount={events.length}
            />

            {/* Main Bento Grid */}
            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* Map - Main Visual */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="ro-card !p-0 overflow-hidden flex-1 border-2">
                  <div className="bg-surface px-6 py-4 border-b-2 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-ink">Spatial Triage</h2>
                    <span className="text-[0.6rem] font-bold text-ink-tertiary">ZOOM: FIELD LEVEL</span>
                  </div>
                  <MapView requests={requests} />
                </div>
              </div>

              {/* Priority Queue - Side Panel */}
              <div className="lg:col-span-4 h-[500px] lg:h-auto">
                <PriorityQueue requests={rows} />
              </div>

              {/* Allocation Log - Bottom Wide */}
              <div className="lg:col-span-12">
                <section className="ro-card border-2">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-ink">Allocation Event Log</h2>
                      <p className="text-[0.65rem] text-ink-tertiary mt-1">Automatic matching system activity for this session.</p>
                    </div>
                    <span className="ro-badge border-border text-ink-tertiary">REAL-TIME SYNC</span>
                  </div>
                  <div className="overflow-auto max-h-64 custom-scrollbar">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-dim sticky top-0">
                        <tr className="text-ink-tertiary font-bold uppercase tracking-widest">
                          <th className="px-4 py-3 border-b">Timestamp</th>
                          <th className="px-4 py-3 border-b">Request ID</th>
                          <th className="px-4 py-3 border-b">Resource ID</th>
                          <th className="px-4 py-3 border-b">Strategy</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono divide-y divide-border">
                        {events.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-ink-tertiary">No allocation events recorded.</td>
                          </tr>
                        ) : (
                          events.map((e: any, i: number) => (
                            <tr key={i} className="hover:bg-surface-dim transition-colors">
                              <td className="px-4 py-3 text-ink-secondary">{e.at}</td>
                              <td className="px-4 py-3 text-action font-bold">REQ_{e.requestId?.slice(-6)}</td>
                              <td className="px-4 py-3 text-safe font-bold">RES_{e.resourceId?.slice(-6)}</td>
                              <td className="px-4 py-3">
                                <span className="ro-badge bg-surface-dim border-border">{e.strategy}</span>
                              </td>
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

