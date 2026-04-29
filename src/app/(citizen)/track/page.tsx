"use client";

import { useState } from "react";
import { RequestTimeline } from "@/components/requests/RequestTimeline";
import { StatusChip } from "@/components/common/StatusChip";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setData(null);
    if (!id.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${id.trim()}`);
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const status = data ? String(data.status) : "";

  return (
    <main className="ro-page max-w-2xl">
      <p className="ro-eyebrow">Citizen</p>
      <h1 className="ro-title mt-2">Track a request</h1>
      <p className="ro-lead">
        Paste the id you received after submission—no account sharing required
        beyond being signed in.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Request id"
          className="ro-input mt-0 flex-1 font-mono text-sm"
        />
        <button
          id="lookup-btn"
          type="button"
          onClick={load}
          disabled={loading}
          className="ro-btn-primary shrink-0 sm:px-8"
        >
          {loading ? "Loading…" : "Look up"}
        </button>
      </div>
      {err && (
        <p className="mt-6 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
          {err}
        </p>
      )}
      {data && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="overflow-hidden rounded-2xl border border-canvas-line bg-surface/50 shadow-lift backdrop-blur-sm">
            {/* Header / ID Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-line bg-canvas-deep/30 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                <span className="font-mono text-xs font-medium tracking-tight text-ink-muted">
                  ID: {String(data.id)}
                </span>
              </div>
              <div className="flex gap-3">
                 <span className="rounded-full bg-canvas-deep px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">
                   {String(data.type)}
                 </span>
                 <StatusChip status={status} />
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1fr_20rem]">
              {/* Left Column: Details */}
              <div className="space-y-8 p-8">
                <div>
                  <p className="ro-eyebrow mb-4">Request Details</p>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">Severity</p>
                        <p className="mt-1 text-sm font-medium text-ink">Level {String(data.severity)}</p>
                      </div>
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">Submitted</p>
                        <p className="mt-1 text-sm font-medium text-ink">
                          {data.createdAt ? new Date(String(data.createdAt)).toLocaleDateString() : "Unknown"}
                        </p>
                      </div>
                    </div>

                    {!!data.description && (
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint">Description</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {String(data.description)}
                        </p>
                      </div>
                    )}

                    <div className="rounded-xl bg-canvas-deep/40 p-4 border border-canvas-line/50">
                       <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ink-faint mb-2 text-center">Deployment Location</p>
                       <p className="font-mono text-[0.7rem] text-center text-ink-muted tracking-tight">
                         {Number(data.lat).toFixed(4)}°N, {Number(data.lng).toFixed(4)}°W
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline */}
              <div className="border-l border-canvas-line bg-canvas-deep/20 p-8">
                <p className="ro-eyebrow mb-6">Live Progress</p>
                <RequestTimeline current={status} />
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-faint italic">
            Statuses update in real-time as coordinators process your request.
          </p>
        </div>
      )}


    </main>
  );
}
