"use client";

import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useRequestsList } from "@/hooks/useRequests";
import { RequestCard } from "@/components/requests/RequestCard";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Interest = { id: string; requestId: string; status: string };

function VolunteerPortalContent() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const { data, isLoading, error } = useRequestsList(false);
  const requests = data?.requests ?? [];

  const { data: interestData } = useQuery({
    queryKey: ["my-interests"],
    queryFn: async () => { const res = await fetch("/api/volunteer-interests"); if (!res.ok) return { interests: [] as Interest[] }; return res.json() as Promise<{ interests: Interest[] }>; },
    enabled: session?.user?.role === ROLES.VOLUNTEER,
  });

  const myInterests = interestData?.interests ?? [];
  const raisedSet = new Set(myInterests.map((i) => i.requestId));
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const raise = useMutation({
    mutationFn: async (req: { id: string; type: string; description?: string; severity: number }) => {
      const res = await fetch("/api/volunteer-interests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: req.id, requestType: req.type, requestDescription: req.description ?? "", requestSeverity: req.severity }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) { if (json.error === "already_raised") throw new Error("already_raised"); throw new Error("Failed to raise interest"); }
      return json;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-interests"] }); },
  });

  const handleRaise = async (r: { id: string; type: string; description?: string; severity: number }) => {
    setLoadingId(r.id);
    try { await raise.mutateAsync(r); setFeedback((prev) => ({ ...prev, [r.id]: "raised" })); }
    catch (e) { const msg = e instanceof Error ? e.message : ""; setFeedback((prev) => ({ ...prev, [r.id]: msg === "already_raised" ? "already" : "error" })); }
    finally { setLoadingId(null); }
  };

  // Sort by severity (highest first) for efficient volunteer scanning
  const sorted = [...requests].sort((a, b) => b.severity - a.severity);

  return (
    <main className="ro-page-wide space-y-8">
      <div className="max-w-2xl">
        <p className="ro-eyebrow">Volunteer</p>
        <h1 className="ro-title mt-2">Active Relief Requests</h1>
        <p className="ro-lead">
          These are people who need help right now. Requests are sorted by
          severity — the most critical cases appear first. Click{" "}
          <strong>&quot;I&apos;ll help&quot;</strong> to let the coordination
          team know you&apos;re available.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="ro-card space-y-3"><div className="flex gap-2"><div className="ro-skeleton h-5 w-20 rounded" /><div className="ro-skeleton h-5 w-24 rounded" /></div><div className="ro-skeleton h-12 w-full rounded" /></div>)}</div>
      )}
      {error && <div className="ro-alert-error">{error instanceof Error ? error.message : "Unable to load requests"}</div>}

      <div className="space-y-4">
        {sorted.map((r) => {
          const alreadyRaised = raisedSet.has(r.id);
          const fb = feedback[r.id];
          const isItemLoading = loadingId === r.id;

          let btnLabel = "🙋 I'll help with this";
          let btnClass = "ro-btn-primary px-4 py-2 text-sm";
          let disabled = isItemLoading;

          if (alreadyRaised || fb === "raised" || fb === "already") {
            btnLabel = "✓ Interest raised";
            btnClass = "px-4 py-2 text-sm rounded-md border font-medium cursor-default border-steady/40 bg-steady-soft text-steady";
            disabled = true;
          } else if (fb === "error") {
            btnLabel = "⚠ Try again";
            btnClass = "ro-btn-ghost px-4 py-2 text-sm text-critical";
          } else if (isItemLoading) {
            btnLabel = "Raising…";
          }

          return (
            <RequestCard
              key={r.id} id={r.id} type={r.type} status={r.status} severity={r.severity} description={r.description}
              actions={
                <button id={`volunteer-help-${r.id}`} disabled={disabled} onClick={() => handleRaise({ id: r.id, type: r.type, description: r.description, severity: r.severity })} className={btnClass}>
                  {btnLabel}
                </button>
              }
            />
          );
        })}
      </div>
    </main>
  );
}

export default function VolunteerPortalPage() {
  return (
    <RoleGuard role={[ROLES.VOLUNTEER, ROLES.ADMIN]}>
      <VolunteerPortalContent />
    </RoleGuard>
  );
}
