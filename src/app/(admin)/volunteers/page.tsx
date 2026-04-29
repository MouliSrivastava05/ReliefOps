"use client";

import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRequestsList, useAllocateRequest } from "@/hooks/useRequests";
import { RequestCard } from "@/components/requests/RequestCard";
import { RequestForm } from "@/components/requests/RequestForm";
import { useState } from "react";

type Application = {
  id: string;
  userId: string;
  email: string;
  name: string;
  skills: string[];
  message: string;
  status: string;
  createdAt: string;
};

type Volunteer = {
  id: string;
  userId: string;
  email: string;
  skills: string[];
  lat: number;
  lng: number;
  available: boolean;
};

type Interest = {
  id: string;
  volunteerId: string;
  volunteerEmail: string;
  requestId: string;
  requestType: string;
  requestDescription: string;
  requestSeverity: number;
  status: string;
  createdAt: string;
};

function ApplicationCard({
  app,
  onApprove,
  onReject,
}: {
  app: Application;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  return (
    <li className="ro-card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-ink truncate">
            {app.name || app.email}
          </div>
          {app.name && (
            <div className="text-xs text-ink-muted truncate">{app.email}</div>
          )}
          <div className="mt-0.5 text-xs text-ink-faint">
            Applied {new Date(app.createdAt).toLocaleDateString()}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          Pending
        </span>
      </div>

      {app.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {app.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-canvas-line bg-canvas-deep px-2 py-0.5 text-xs text-ink-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {app.message && (
        <p className="text-xs leading-relaxed text-ink-muted line-clamp-3 border-l-2 border-canvas-line pl-3">
          {app.message}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          id={`approve-${app.id}`}
          onClick={async () => {
            setLoading("approve");
            await onApprove(app.id);
            setLoading(null);
          }}
          disabled={loading !== null}
          className="ro-btn-primary flex-1 py-1.5 text-xs"
        >
          {loading === "approve" ? "Approving…" : "✓ Approve"}
        </button>
        <button
          id={`reject-${app.id}`}
          onClick={async () => {
            setLoading("reject");
            await onReject(app.id);
            setLoading(null);
          }}
          disabled={loading !== null}
          className="ro-btn-ghost flex-1 py-1.5 text-xs text-danger hover:bg-danger-soft"
        >
          {loading === "reject" ? "Rejecting…" : "✕ Reject"}
        </button>
      </div>
    </li>
  );
}

function InterestBadge({ status }: { status: string }) {
  if (status === "assigned") {
    return (
      <span className="rounded-full bg-ok/15 px-2 py-0.5 text-[0.65rem] font-medium text-ok">
        Assigned
      </span>
    );
  }
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary">
      Open
    </span>
  );
}

export default function AdminVolunteersPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === ROLES.ADMIN;
  const isManager = session?.user?.role === ROLES.SHELTER_MANAGER;

  const { data, isLoading, error } = useRequestsList(false);
  const requests = data?.requests ?? [];
  const allocate = useAllocateRequest();
  const [allocMsg, setAllocMsg] = useState<string | null>(null);

  async function handleAllocate(id: string) {
    setAllocMsg(null);
    try {
      await allocate.mutateAsync({ requestId: id, strategy: "greedy" });
      setAllocMsg(`Volunteer allotted to request ${id}`);
    } catch (e) {
      setAllocMsg(e instanceof Error ? e.message : "Allocation failed");
    }
  }

  const { data: volData, isLoading: volLoading } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const res = await fetch("/api/volunteers");
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ volunteers: Volunteer[] }>;
    },
  });

  const { data: appData, isLoading: appLoading, error: appError } = useQuery({
    queryKey: ["volunteer-applications"],
    queryFn: async () => {
      const res = await fetch("/api/volunteer-applications");
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ applications: Application[] }>;
    },
    enabled: isAdmin,
  });

  const { data: interestData, isLoading: interestLoading } = useQuery({
    queryKey: ["volunteer-interests"],
    queryFn: async () => {
      const res = await fetch("/api/volunteer-interests");
      if (!res.ok) return { interests: [] as Interest[] };
      return res.json() as Promise<{ interests: Interest[] }>;
    },
  });

  const volunteers = volData?.volunteers ?? [];
  const applications = appData?.applications ?? [];
  const interests = interestData?.interests ?? [];

  // Group interests by volunteerId for quick lookup
  const interestsByVolunteer = interests.reduce<Record<string, Interest[]>>(
    (acc, i) => {
      if (!acc[i.volunteerId]) acc[i.volunteerId] = [];
      acc[i.volunteerId].push(i);
      return acc;
    },
    {},
  );

  const handleApprove = async (id: string) => {
    await fetch(`/api/volunteer-applications/${id}/approve`, { method: "POST" });
    await queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
    await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/volunteer-applications/${id}/reject`, { method: "POST" });
    await queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] });
  };

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-12">
        {isManager ? (
          /* ── Shelter Manager Focused View ── */
          <div className="grid gap-12 lg:grid-cols-[1fr_26rem] lg:items-start">
            <div className="space-y-8">
              <div className="max-w-2xl">
                <p className="ro-eyebrow">Assistance</p>
                <h1 className="ro-title mt-2">Request Volunteers</h1>
                <p className="ro-lead">
                  Need extra hands for field operations? Submit a request here.
                  Our automated matching engine will look for available volunteers
                  with matching skills in your area.
                </p>
              </div>
              <RequestForm fixedType="volunteer" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-faint">
                  Volunteer Request History
                </h2>
                {isLoading && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              </div>
              
              {!isLoading && requests.filter(r => r.type === "volunteer").length === 0 && (
                <div className="rounded-lg border border-canvas-line bg-surface-mute/30 px-6 py-8 text-center text-xs text-ink-faint">
                  No volunteer requests raised yet.
                </div>
              )}

              <div className="space-y-4">
                {requests
                  .filter((r) => r.type === "volunteer")
                  .map((r: any) => (
                    <RequestCard
                      key={r.id}
                      id={r.id}
                      type={r.type}
                      status={r.status}
                      severity={r.severity}
                      description={r.description}
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Admin Full View ── */
          <>
            {/* ── Pending Volunteer Requests (New Section) ── */}
            {isAdmin && (
              <section className="space-y-6">
                <div className="max-w-2xl">
                  <p className="ro-eyebrow">Operational Needs</p>
                  <h1 className="ro-title mt-2">Volunteer Requests</h1>
                  <p className="ro-lead">
                    Requests for personnel raised by shelter managers. Use "Allot Nearest" to automatically assign the closest available volunteer.
                  </p>
                </div>

                {isLoading && <p className="text-sm text-ink-faint">Loading requests…</p>}
                {!isLoading && requests.filter(r => r.type === "volunteer" && r.status === "QUEUED").length === 0 && (
                  <div className="rounded-lg border border-canvas-line bg-surface-mute/30 px-6 py-8 text-center text-sm text-ink-faint">
                    No pending volunteer requests — all personnel are deployed or none requested ✓
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {requests
                    .filter((r) => r.type === "volunteer" && r.status === "QUEUED")
                    .map((r) => (
                      <RequestCard
                        key={r.id}
                        id={r.id}
                        type={r.type}
                        status={r.status}
                        severity={r.severity}
                        description={r.description}
                        actions={
                          <button
                            onClick={() => handleAllocate(r.id)}
                            disabled={allocate.isPending}
                            className="ro-btn-primary w-full py-2 text-xs"
                          >
                            {allocate.isPending ? "Allotting..." : "Allot Nearest Volunteer"}
                          </button>
                        }
                      />
                    ))}
                </div>
                {allocMsg && <p className="text-sm text-ink-muted text-center italic">{allocMsg}</p>}
              </section>
            )}

            {/* ── Pending Applications ── */}
            {isAdmin && (
              <section className="space-y-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <p className="ro-eyebrow">Action Required</p>
                    {applications.length > 0 && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                        {applications.length}
                      </span>
                    )}
                  </div>
                  <h1 className="ro-title mt-2">Pending Applications</h1>
                  <p className="ro-lead">
                    Review volunteer applications. Approved applicants can immediately
                    sign in and access the volunteer portal.
                  </p>
                </div>

                {appLoading && <p className="text-sm text-ink-faint">Loading applications…</p>}
                {appError && (
                  <p className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
                    {appError instanceof Error ? appError.message : "Error"}
                  </p>
                )}
                {!appLoading && applications.length === 0 && (
                  <div className="rounded-lg border border-canvas-line bg-surface-mute/30 px-6 py-8 text-center text-sm text-ink-faint">
                    No pending applications — all caught up ✓
                  </div>
                )}
                {applications.length > 0 && (
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {applications.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        app={app}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* ── Active Volunteers Directory ── */}
            <section className="space-y-6">
              <div className="max-w-2xl">
                <p className="ro-eyebrow">People</p>
                <h2 className="ro-title mt-2">Active Volunteers</h2>
                <p className="ro-lead">
                  Approved field crew with their skills and availability status.
                </p>
              </div>

              {volLoading && <p className="text-sm text-ink-faint">Loading directory…</p>}

              {!volLoading && volunteers.length === 0 && (
                <div className="rounded-lg border border-canvas-line bg-surface-mute/30 px-6 py-8 text-center text-sm text-ink-faint">
                  No active volunteers yet — approve applications above to populate
                  this list.
                </div>
              )}

              <ul className="grid gap-4 sm:grid-cols-2">
                {volunteers.map((v) => {
                  const theirInterests = interestsByVolunteer[v.userId] ?? [];
                  return (
                    <li key={v.id} className="ro-card space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-ink">{v.email}</div>
                          <div className="mt-0.5 text-xs text-ink-muted">
                            {v.available ? (
                              <span className="text-green-600 dark:text-green-400 font-bold">● Available</span>
                            ) : (
                              <span className="text-ink-faint">○ Off shift</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {v.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {v.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-canvas-line bg-canvas-deep px-2 py-0.5 text-xs text-ink-muted"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {theirInterests.length > 0 && (
                        <div className="border-t border-canvas-line/60 pt-3 space-y-2">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-faint">
                            Help requests raised ({theirInterests.length})
                          </p>
                          {theirInterests.map((i) => (
                            <div
                              key={i.id}
                              className="flex items-center justify-between gap-2 rounded-md bg-canvas-deep/50 px-2.5 py-1.5"
                            >
                              <div className="min-w-0">
                                <span className="text-xs capitalize font-medium text-ink">
                                  {i.requestType}
                                </span>
                                {i.requestDescription && (
                                  <span className="ml-1 text-xs text-ink-faint truncate">
                                    — {i.requestDescription.slice(0, 40)}
                                    {i.requestDescription.length > 40 ? "…" : ""}
                                  </span>
                                )}
                              </div>
                              <InterestBadge status={i.status} />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="font-mono text-[0.65rem] text-ink-faint">
                        {v.lat}, {v.lng}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </main>
    </RoleGuard>
  );
}
