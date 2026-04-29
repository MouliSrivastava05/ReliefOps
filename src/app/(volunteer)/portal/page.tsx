"use client";

import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useRequestsList } from "@/hooks/useRequests";
import { RequestCard } from "@/components/requests/RequestCard";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Interest = {
  id: string;
  requestId: string;
  status: string;
};

function VolunteerPortalContent() {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const { data, isLoading, error } = useRequestsList(false);
  const requests = data?.requests ?? [];

  // Fetch this volunteer's existing interests so we know which requests they've already signed up for
  const { data: interestData } = useQuery({
    queryKey: ["my-interests"],
    queryFn: async () => {
      const res = await fetch("/api/volunteer-interests");
      if (!res.ok) return { interests: [] as Interest[] };
      return res.json() as Promise<{ interests: Interest[] }>;
    },
    enabled: session?.user?.role === ROLES.VOLUNTEER,
  });
  
  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ["me-volunteer"],
    queryFn: async () => {
      const res = await fetch("/api/volunteers/me");
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json() as Promise<{ available: boolean }>;
    },
    enabled: !!session?.user?.id,
  });

  const toggleAvailability = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/volunteers/me/availability", { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle availability");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me-volunteer"] });
    },
  });

  const myInterests = interestData?.interests ?? [];
  const raisedSet = new Set(myInterests.map((i) => i.requestId));

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const raise = useMutation({
    mutationFn: async (req: { id: string; type: string; description?: string; severity: number }) => {
      const res = await fetch("/api/volunteer-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: req.id,
          requestType: req.type,
          requestDescription: req.description ?? "",
          requestSeverity: req.severity,
        }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) {
        if (json.error === "already_raised") throw new Error("already_raised");
        throw new Error("Failed to raise interest");
      }
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-interests"] });
    },
  });

  const handleRaise = async (r: { id: string; type: string; description?: string; severity: number }) => {
    setLoadingId(r.id);
    try {
      await raise.mutateAsync(r);
      setFeedback((prev) => ({ ...prev, [r.id]: "raised" }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setFeedback((prev) => ({ ...prev, [r.id]: msg === "already_raised" ? "already" : "error" }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="ro-page-wide space-y-8">
      <div className="max-w-2xl">
        <p className="ro-eyebrow">Field</p>
        <h1 className="ro-title mt-2">Volunteer portal</h1>
        <p className="ro-lead">
          Live feed of active relief requests. Click{" "}
          will see your interest and coordinate your assignment.
        </p>
      </div>

      <div className="ro-card flex flex-col sm:flex-row items-center justify-between gap-4 border-primary/20 bg-primary/5">
        <div>
          <h2 className="text-sm font-semibold text-ink">Availability Status</h2>
          <p className="text-xs text-ink-muted">
            Toggle this to show admins if you are currently ready to be deployed.
          </p>
        </div>
        <button
          onClick={() => toggleAvailability.mutate()}
          disabled={meLoading || toggleAvailability.isPending}
          className={`ro-btn flex items-center gap-2 px-6 py-2 transition-all border-2 ${
            meData?.available
              ? "bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
              : "bg-canvas-deep border-canvas-line text-ink-muted hover:bg-canvas-line"
          }`} 
        >
          <span className={`h-2 w-2 rounded-full ${meData?.available ? "bg-green-500 animate-pulse" : "bg-ink-faint"}`} />
          {meLoading ? "Syncing…" : meData?.available ? "I'm Available" : "I'm Off-shift"}
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-ink-faint">Syncing list…</p>
      )}
      {error && (
        <p className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      )}

      <div className="space-y-4">
        {requests.map((r) => {
          const alreadyRaised = raisedSet.has(r.id);
          const fb = feedback[r.id];
          const isLoading = loadingId === r.id;

          let btnLabel = "🙋 I'll help with this";
          let btnClass = "ro-btn-primary px-4 py-1.5 text-xs";
          let disabled = isLoading;

          if (alreadyRaised || fb === "raised" || fb === "already") {
            btnLabel = "✓ Interest raised";
            btnClass = "px-4 py-1.5 text-xs rounded-md border border-ok/40 bg-ok-soft text-ok font-medium cursor-default";
            disabled = true;
          } else if (fb === "error") {
            btnLabel = "⚠ Try again";
            btnClass = "ro-btn-ghost px-4 py-1.5 text-xs text-danger";
          } else if (isLoading) {
            btnLabel = "Raising…";
          }

          return (
            <RequestCard
              key={r.id}
              id={r.id}
              type={r.type}
              status={r.status}
              severity={r.severity}
              description={r.description}
              actions={
                <button
                  id={`volunteer-help-${r.id}`}
                  disabled={disabled}
                  onClick={() => handleRaise({ id: r.id, type: r.type, description: r.description, severity: r.severity })}
                  className={btnClass}
                >
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
