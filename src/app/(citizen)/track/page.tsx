"use client";

import { useState, useEffect } from "react";
import { RequestTimeline } from "@/components/requests/RequestTimeline";
import { StatusChip } from "@/components/common/StatusChip";
import { PriorityBadge } from "@/components/common/PriorityBadge";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("last_request_id");
    if (saved) setId(saved);
  }, []);

  async function load() {
    setErr(null);
    setData(null);
    if (!id.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${id.trim()}`);
      if (!res.ok) throw new Error("Could not find a request with that ID.");
      setData(await res.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  function copyId() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const status = data ? String(data.status) : "";

  return (
    <main className="ro-page">
      <div className="space-y-2">
        <p className="ro-eyebrow">Status Tracking</p>
        <h1 className="ro-title">Track your request</h1>
        <p className="ro-lead">
          Enter the tracking ID you received when you submitted your request.
        </p>
      </div>

      <div className="mt-10 ro-card" style={{ borderStyle: "dashed" }}>
        <label className="ro-label">Tracking ID</label>
        <div className="flex flex-col gap-3 sm:flex-row mt-2">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Paste your ID here"
            className="ro-input flex-1 font-mono text-sm"
          />
          <button onClick={load} disabled={loading} className="ro-btn-primary px-8">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {id && (
          <button
            onClick={copyId}
            className="mt-3 text-[0.6rem] font-semibold uppercase tracking-wider transition-colors"
            style={{ color: "var(--color-action)" }}
          >
            {copied ? "✓ Copied" : "Copy ID"}
          </button>
        )}
      </div>

      {err && (
        <div className="mt-6 ro-alert-error">
          <span>⚠</span>
          <div>
            <p className="font-semibold">Not found</p>
            <p className="opacity-80 text-xs mt-0.5">{err}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="mt-10 space-y-6 ro-fade-up">
          <div className="ro-card" style={{ borderLeftWidth: "4px", borderLeftColor: "var(--color-action)" }}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <StatusChip status={status} />
              <PriorityBadge level={String(data.severity)} />
              <span className="ro-badge">{String(data.type)}</span>
            </div>

            <div className="py-5 border-y" style={{ borderColor: "var(--color-border)" }}>
              <RequestTimeline current={status} />
            </div>

            {data.description ? (
              <div className="mt-5">
                <p className="ro-label">Details</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                  {String(data.description)}
                </p>
              </div>
            ) : null}
          </div>

          <div className="ro-card" style={{ backgroundColor: "var(--color-action-soft)" }}>
            <h3 className="ro-section-title mb-3">What happens next?</h3>
            <ul className="space-y-2.5">
              {[
                { step: "Verification", desc: "Operators confirm your location and need." },
                { step: "Matching", desc: "The nearest available resource is assigned." },
                { step: "Response", desc: "Help is dispatched to your location." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <span className="font-bold" style={{ color: "var(--color-action)" }}>{i + 1}.</span>
                  <span style={{ color: "var(--color-ink-secondary)" }}>
                    <strong style={{ color: "var(--color-ink)" }}>{item.step}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
