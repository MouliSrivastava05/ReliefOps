"use client";

import { useEffect, useState } from "react";
import { RequestCard } from "@/components/requests/RequestCard";

/**
 * CitizenRequestLog — Personal request history
 *
 * Loading: skeleton cards (not text — reduces perceived wait under stress)
 * Empty: encouraging message (not passive)
 * Error: compassionate with retry guidance
 */

type RequestItem = {
  id: string;
  type: string;
  status: string;
  severity: number;
  description?: string;
  lat: number;
  lng: number;
};

function SkeletonCard() {
  return (
    <div className="ro-card space-y-3">
      <div className="flex gap-2">
        <div className="ro-skeleton h-5 w-20" />
        <div className="ro-skeleton h-5 w-24" />
      </div>
      <div className="ro-skeleton h-3 w-32" />
      <div className="ro-skeleton h-10 w-full" />
    </div>
  );
}

export function CitizenRequestLog() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch("/api/requests");
        if (!res.ok) throw new Error("Failed to load request history");
        const data = await res.json();
        // reverse to show newest first, assuming backend returns natural order
        setRequests((data.requests || []).reverse());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading history");
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 border-t border-border pt-8">
        <h2 className="ro-eyebrow mb-4">Request History</h2>
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 ro-alert-error">
        <p className="font-medium">Unable to load your request history</p>
        <p className="mt-1 text-xs opacity-80">
          {error}. Please refresh the page to try again.
        </p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="mt-12 border-t border-border pt-8">
        <h2 className="ro-eyebrow mb-3">Request History</h2>
        <div className="rounded-xl border border-border bg-surface-dim/30 px-6 py-12 text-center">
          <p className="text-sm font-medium text-ink-secondary">
            No previous requests found.
          </p>
          <p className="mt-1 text-xs text-ink-tertiary">
            When you need help, use the form above to alert coordinates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="ro-eyebrow mb-4">Request History</h2>
      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <RequestCard
            key={req.id}
            id={req.id}
            type={req.type}
            status={req.status}
            severity={req.severity}
            description={req.description}
          />
        ))}
      </div>
    </div>
  );
}
