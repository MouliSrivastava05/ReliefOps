"use client";

import { useState } from "react";
import { RequestCard } from "@/components/requests/RequestCard";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { RequestForm } from "@/components/requests/RequestForm";
import { useSession } from "next-auth/react";
import { useAllocateRequest, useRequestsList } from "@/hooks/useRequests";

export default function AdminRequestsPage() {
  const { data, isLoading, error, refetch } = useRequestsList(false);
  const { data: session } = useSession();
  const allocate = useAllocateRequest();
  const [msg, setMsg] = useState<string | null>(null);

  const requests = data?.requests ?? [];
  const isManager = session?.user?.role === ROLES.SHELTER_MANAGER;
  const isAdmin = session?.user?.role === ROLES.ADMIN;

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
        <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start">
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
              {isManager ? "My Request History" : "Active Requests"}
            </h2>
            {isLoading && (
              <p className="text-sm text-ink-faint">Loading requests…</p>
            )}
            {error && (
              <p className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
                {error instanceof Error ? error.message : "Failed to load"}
              </p>
            )}
            {!isLoading && requests.length === 0 && (
              <p className="text-sm text-ink-muted italic">No requests found.</p>
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
          </div>

          {isManager && (
            <div className="space-y-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
                Raise a Request
              </h2>
              <RequestForm />
            </div>
          )}
        </div>
      </main>
    </RoleGuard>
  );
}
