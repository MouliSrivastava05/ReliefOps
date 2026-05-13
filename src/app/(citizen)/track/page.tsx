"use client";

import { useState, useEffect } from "react";
import { RequestTimeline } from "@/components/requests/RequestTimeline";
import { StatusChip } from "@/components/common/StatusChip";
import { PriorityBadge } from "@/components/common/PriorityBadge";

/**
 * Track Page — Crisis UX Redesign
 * 
 * - Persistence: Automatically loads last submitted request
 * - Utility: One-tap ID copying
 * - Clarity: Focused status and reassurance
 */

export default function TrackPage() {
  const [id, setId] = useState("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("last_request_id");
    if (saved) {
      setId(saved);
    }
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
    <main className="ro-page max-w-3xl">
      <div className="flex flex-col gap-2">
        <p className="ro-eyebrow">Status Tracking</p>
        <h1 className="ro-title">Where is your help?</h1>
        <p className="ro-lead">
          Track your request in real-time. If you just submitted, it may take a 
          moment to appear in the coordination network.
        </p>
      </div>

      <div className="mt-10 ro-card border-dashed">
        <label className="ro-label">Tracking ID</label>
        <div className="flex flex-col gap-3 sm:flex-row mt-2">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Paste your ID here"
            className="ro-input flex-1 font-mono text-sm bg-surface-dim"
          />
          <button
            onClick={load}
            disabled={loading}
            className="ro-btn-primary px-10"
          >
            {loading ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>
        {id && (
          <button onClick={copyId} className="mt-3 text-[0.6rem] font-bold uppercase tracking-widest text-action hover:underline">
            {copied ? "✓ Copied to clipboard" : "📋 Copy ID"}
          </button>
        )}
      </div>

      {err && (
        <div className="mt-6 ro-alert-error">
          <span>⚠️</span>
          <div>
            <p className="font-bold">Error</p>
            <p className="opacity-90">{err}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="ro-card border-l-4" style={{ borderLeftColor: "var(--color-action)" }}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <StatusChip status={status} />
              <PriorityBadge level={String(data.severity)} />
              <span className="ro-badge border-border text-ink-tertiary">
                TYPE: {String(data.type)}
              </span>
            </div>

            <div className="mt-8 py-6 border-y border-border/50">
              <RequestTimeline current={status} />
            </div>

            <div className="mt-8">
              <p className="ro-label">Request Details</p>
              <p className="text-sm leading-relaxed text-ink-secondary italic">
                &quot;{String(data.description || "No additional details provided.")}&quot;
              </p>
            </div>
          </div>

          <section className="ro-card bg-action-soft border-action/20">
            <h3 className="text-sm font-bold text-ink mb-2">What happens next?</h3>
            <ul className="space-y-3">
              {[
                { step: "Verification", desc: "Our operators confirm your location and need level." },
                { step: "Allocation", desc: "The nearest available volunteer or resource is assigned." },
                { step: "Deployment", desc: "You will receive a notification when help is en route." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <span className="font-bold text-action">{i + 1}.</span>
                  <span className="text-ink-secondary">
                    <strong className="text-ink">{item.step}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}

