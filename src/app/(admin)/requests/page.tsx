"use client";

import { useState } from "react";
import { RequestCard } from "@/components/requests/RequestCard";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useAllocateRequest, useRequestsList } from "@/hooks/useRequests";

export default function AdminRequestsPage() {
  const { data, isLoading, error, refetch } = useRequestsList(false);
  const allocate = useAllocateRequest();
  const [msg, setMsg] = useState<string | null>(null);

  const requests = data?.requests ?? [];

  async function runAllocate(id: string, strategy: "greedy" | "severity") {
    setMsg(null);
    try {
      await allocate.mutateAsync({ requestId: id, strategy });
      setMsg(`Allocated (${strategy}) for ${id}`);
      refetch();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Allocation failed");
    }
  }

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-8">
        <div className="max-w-2xl">
          <p className="ro-eyebrow">Matching</p>
          <h1 className="ro-title mt-2">Requests</h1>
          <p className="ro-lead">
            <strong className="font-medium text-ink">Greedy</strong> picks the
            nearest compatible stock.
            <strong className="font-medium text-ink"> Severity queue</strong>{" "}
            only allows the head of the queue—good for explaining fairness vs
            pure distance.
          </p>
        </div>
        {msg && (
          <p className="max-w-2xl rounded-md border border-canvas-line bg-surface-mute px-4 py-3 text-sm text-ink-muted">
            {msg}
          </p>
        )}
        {isLoading && (
          <p className="text-sm text-ink-faint">Loading requests…</p>
        )}
        {error && (
          <p className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
            {error instanceof Error ? error.message : "Failed to load"}
          </p>
        )}
        <div className="space-y-4">
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              id={r.id}
              type={r.type}
              status={r.status}
              severity={r.severity}
              description={r.description}
              actions={
                r.status === "QUEUED" ? (
                  <>
                    <button
                      type="button"
                      disabled={allocate.isPending}
                      className="ro-btn-primary px-3 py-1.5 text-xs"
                      onClick={() => runAllocate(r.id, "greedy")}
                    >
                      Greedy
                    </button>
                    <button
                      type="button"
                      disabled={allocate.isPending}
                      className="ro-btn-warn px-3 py-1.5 text-xs"
                      onClick={() => runAllocate(r.id, "severity")}
                    >
                      Severity queue
                    </button>
                  </>
                ) : null
              }
            />
          ))}
        </div>
      </main>
    </RoleGuard>
  );
}
