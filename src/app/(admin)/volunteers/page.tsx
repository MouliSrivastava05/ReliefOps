"use client";

import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Application = { id: string; userId: string; email: string; name: string; skills: string[]; message: string; status: string; createdAt: string };
type Volunteer = { id: string; userId: string; email: string; skills: string[]; lat: number; lng: number; available: boolean };
type Interest = { id: string; volunteerId: string; volunteerEmail: string; requestId: string; requestType: string; requestDescription: string; requestSeverity: number; status: string; createdAt: string };

function ApplicationCard({ app, onApprove, onReject }: { app: Application; onApprove: (id: string) => Promise<void>; onReject: (id: string) => Promise<void> }) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  return (
    <li className="ro-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-ink truncate">{app.name || app.email}</p>
          {app.name && <p className="text-[0.65rem] text-ink-secondary truncate uppercase tracking-wider">{app.email}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-hazard-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-hazard">Pending</span>
      </div>
      
      {app.message && (
        <p className="text-xs leading-relaxed text-ink-secondary line-clamp-3 bg-surface-dim/40 p-3 rounded-lg border border-border/50">{app.message}</p>
      )}

      {app.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {app.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-surface-dim px-2.5 py-1 text-[0.65rem] font-semibold text-ink-secondary border border-border/30">{skill}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button onClick={async () => { setLoading("approve"); await onApprove(app.id); setLoading(null); }} disabled={loading !== null} className="ro-btn-primary flex-1 py-2 text-[0.7rem] uppercase tracking-wider">
          {loading === "approve" ? "Processing…" : "Approve"}
        </button>
        <button onClick={async () => { setLoading("reject"); await onReject(app.id); setLoading(null); }} disabled={loading !== null} className="ro-btn-ghost flex-1 py-2 text-[0.7rem] uppercase tracking-wider text-critical hover:bg-critical-soft">
          {loading === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </li>
  );
}

function InterestBadge({ status }: { status: string }) {
  return status === "assigned"
    ? <span className="rounded-full bg-safe-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-safe border border-safe/20">Assigned</span>
    : <span className="rounded-full bg-trust-soft px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-trust border border-trust/20">Available</span>;
}

export default function AdminVolunteersPage() {
  const queryClient = useQueryClient();

  const { data: volData, isLoading: volLoading } = useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => { const res = await fetch("/api/volunteers"); if (!res.ok) throw new Error(await res.text()); return res.json() as Promise<{ volunteers: Volunteer[] }>; },
  });

  const { data: appData, isLoading: appLoading, error: appError } = useQuery({
    queryKey: ["volunteer-applications"],
    queryFn: async () => { const res = await fetch("/api/volunteer-applications"); if (!res.ok) throw new Error(await res.text()); return res.json() as Promise<{ applications: Application[] }>; },
  });

  const { data: interestData, isLoading: interestLoading } = useQuery({
    queryKey: ["volunteer-interests"],
    queryFn: async () => { const res = await fetch("/api/volunteer-interests"); if (!res.ok) return { interests: [] as Interest[] }; return res.json() as Promise<{ interests: Interest[] }>; },
  });

  const volunteers = volData?.volunteers ?? [];
  const applications = appData?.applications ?? [];
  const interests = interestData?.interests ?? [];
  const interestsByVolunteer = interests.reduce<Record<string, Interest[]>>((acc, i) => { if (!acc[i.volunteerId]) acc[i.volunteerId] = []; acc[i.volunteerId].push(i); return acc; }, {});

  const handleApprove = async (id: string) => { await fetch(`/api/volunteer-applications/${id}/approve`, { method: "POST" }); await queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] }); await queryClient.invalidateQueries({ queryKey: ["volunteers"] }); };
  const handleReject = async (id: string) => { await fetch(`/api/volunteer-applications/${id}/reject`, { method: "POST" }); await queryClient.invalidateQueries({ queryKey: ["volunteer-applications"] }); };

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-16">
        {/* Pending Applications */}
        <section className="space-y-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <p className="ro-eyebrow">Personnel</p>
              {applications.length > 0 && <span className="rounded-full bg-hazard px-2 py-0.5 text-[0.65rem] font-bold text-white shadow-glow">{applications.length}</span>}
            </div>
            <h1 className="ro-title mt-2">Volunteer Onboarding</h1>
            <p className="ro-lead">Review credentials and background checks for new relief workers.</p>
          </div>
          
          {appLoading && <div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map(i => <div key={i} className="ro-card space-y-3"><div className="ro-skeleton h-4 w-32 rounded" /><div className="ro-skeleton h-20 w-full rounded" /></div>)}</div>}
          
          {!appLoading && applications.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-surface-dim/30 px-6 py-12 text-center text-sm text-ink-tertiary">
              No pending applications. Current field strength is stable.
            </div>
          )}
          
          {applications.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => <ApplicationCard key={app.id} app={app} onApprove={handleApprove} onReject={handleReject} />)}
            </ul>
          )}
        </section>

        {/* Volunteer Coordination */}
        <section className="space-y-8">
          <div className="max-w-2xl">
            <p className="ro-eyebrow">Field Engagement</p>
            <h2 className="ro-title mt-2">Active Interests</h2>
            <p className="ro-lead">Volunteers who have expressed interest in specific emergency responses.</p>
          </div>
          
          {interestLoading && <div className="ro-skeleton h-24 w-full" />}
          
          {!interestLoading && interests.length === 0 && (
            <div className="rounded-2xl border border-border bg-surface-dim/20 px-6 py-8 text-center text-xs text-ink-tertiary">
              No active volunteer interests detected.
            </div>
          )}
          
          {interests.length > 0 && (
            <div className="ro-card !p-0 overflow-hidden">
              <ul className="divide-y divide-border/50">
                {interests.map((i) => (
                  <li key={i.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-surface-dim/30 transition-colors">
                    <div>
                      <p className="font-bold text-sm text-ink">{i.volunteerEmail}</p>
                      <p className="text-xs text-ink-secondary mt-1">
                        Interested in: <span className="font-semibold text-action">{i.requestType}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <InterestBadge status={i.status} />
                      <span className="text-[0.65rem] font-medium text-ink-tertiary font-mono">{new Date(i.createdAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Personnel Registry */}
        <section className="space-y-8">
          <div className="max-w-2xl">
            <p className="ro-eyebrow">Personnel Registry</p>
            <h2 className="ro-title mt-2">Active Field Crew</h2>
            <p className="ro-lead">Full registry of approved personnel and current deployment status.</p>
          </div>
          
          <ul className="grid gap-6 sm:grid-cols-2">
            {volunteers.map((v) => {
              const theirInterests = interestsByVolunteer[v.userId] ?? [];
              return (
                <li key={v.id} className="ro-card space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-ink">{v.email}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${v.available ? "bg-safe shadow-glow shadow-safe/40" : "bg-ink-tertiary"}`} />
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-secondary">
                          {v.available ? "On Shift" : "Off Shift"}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[0.6rem] text-ink-ghost tracking-tighter">POS: {v.lat.toFixed(2)}, {v.lng.toFixed(2)}</span>
                  </div>
                  
                  {v.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {v.skills.map((skill) => <span key={skill} className="rounded-full bg-surface-dim px-2.5 py-0.5 text-[0.65rem] font-bold text-ink-secondary border border-border/50 uppercase">{skill}</span>)}
                    </div>
                  )}
                  
                  {theirInterests.length > 0 && (
                    <div className="pt-4 border-t border-border/50 space-y-3">
                      <p className="text-[0.6rem] font-black uppercase tracking-widest text-ink-tertiary">Assignments ({theirInterests.length})</p>
                      <div className="space-y-2">
                        {theirInterests.map((i) => (
                          <div key={i.id} className="flex items-center justify-between gap-3 bg-surface-dim/40 p-3 rounded-xl border border-border/30">
                            <span className="text-xs font-bold text-ink capitalize">{i.requestType}</span>
                            <InterestBadge status={i.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </RoleGuard>
  );
}
