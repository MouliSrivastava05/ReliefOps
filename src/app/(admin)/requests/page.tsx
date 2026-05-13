"use client";

import { useState } from "react";
import { RequestCard } from "@/components/requests/RequestCard";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { RequestForm } from "@/components/requests/RequestForm";
import { useSession } from "next-auth/react";
import { useAllocateRequest, useRequestsList } from "@/hooks/useRequests";

/**
 * Admin Requests Page — Request management & allocation
 *
 * Clearer allocation buttons with strategy descriptions.
 * Consistent with new design tokens.
 */

export default function AdminRequestsPage() {
  const { data, isLoading, error, refetch } = useRequestsList(false);
  const { data: session } = useSession();
  const allocate = useAllocateRequest();
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const requests = data?.requests ?? [];
  const isManager = session?.user?.role === ROLES.SHELTER_MANAGER;
  const isAdmin = session?.user?.role === ROLES.ADMIN;

  async function runAllocate(id: string, strategy: "greedy" | "severity") {
    setMsg(null);
    try {
      await allocate.mutateAsync({ requestId: id, strategy });
      setMsg({ text: `Allocated using ${strategy} strategy for ${id}`, type: "success" });
      refetch();
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : "Allocation failed", type: "error" });
    }
  }

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-8">
        {msg && (
          <div className={msg.type === "success" ? "ro-alert-success" : "ro-alert-error"} role="status">
            {msg.text}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start">
          <div className="space-y-6">
            <div>
              <p className="ro-eyebrow">
                {isManager ? "My Requests" : "Request Management"}
              </p>
              <h1 className="ro-title mt-2">
                {isManager ? "Request History" : "Active Requests"}
              </h1>
            </div>

            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="ro-card space-y-3">
                    <div className="flex gap-2">
                      <div className="ro-skeleton h-5 w-20 rounded" />
                      <div className="ro-skeleton h-5 w-24 rounded" />
                    </div>
                    <div className="ro-skeleton h-3 w-48 rounded" />
                    <div className="ro-skeleton h-12 w-full rounded" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="ro-alert-error">
                {error instanceof Error ? error.message : "Unable to load requests"}
              </div>
            )}

            {!isLoading && requests.length === 0 && (
              <div className="rounded-lg border px-6 py-8 text-center"
                   style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-dim)" }}>
                <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
                  No requests found.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {requests.map((r: any) => (
                <RequestCard
                  key={r.id}
                  id={r.id}
                  type={r.type}
                  status={r.status}
                  severity={r.severity}
                  description={r.description}
                  actions={
                    isAdmin && r.status === "QUEUED" ? (
                      <>
                        <button
                          type="button"
                          disabled={allocate.isPending}
                          className="ro-btn-primary px-3 py-1.5 text-xs"
                          onClick={() => runAllocate(r.id, "greedy")}
                          title="Match with nearest available resource"
                        >
                          Allocate (Nearest)
                        </button>
                        <button
                          type="button"
                          disabled={allocate.isPending}
                          className="ro-btn-critical px-3 py-1.5 text-xs"
                          onClick={() => runAllocate(r.id, "severity")}
                          title="Prioritize by severity score"
                        >
                          Allocate (Severity)
                        </button>
                      </>
                    ) : null
                  }
                />
              ))}
            </div>
          </div>

          {isManager && (
            <div className="space-y-6">
              <div>
                <p className="ro-eyebrow">New Request</p>
                <h2 className="ro-section-title mt-2">Raise a Request</h2>
              </div>
              <RequestForm />
            </div>
          )}
        </div>
      </main>
    </RoleGuard>
  );
}
