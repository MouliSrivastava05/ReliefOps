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
        <div className="ro-card mt-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={status} />
            <span className="text-sm text-ink-muted">
              {String(data.type)} · severity {String(data.severity)}
            </span>
          </div>
          <div>
            <p className="ro-eyebrow mb-2">Progress</p>
            <RequestTimeline current={status} />
          </div>
          {data.description ? (
            <div>
              <p className="ro-eyebrow mb-2">Details</p>
              <p className="text-sm leading-relaxed text-ink-muted">
                {String(data.description)}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}
