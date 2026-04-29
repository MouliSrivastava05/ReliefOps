"use client";

import { useEffect, useState } from "react";
import { RequestCard } from "@/components/requests/RequestCard";

type RequestItem = {
  id: string;
  type: string;
  status: string;
  severity: number;
  description?: string;
  lat: number;
  lng: number;
};

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
    return <div className="text-sm text-ink-muted mt-8 animate-pulse">Loading your requests...</div>;
  }

  if (error) {
    return (
      <div className="mt-8 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="mt-12 text-sm text-ink-muted">
        <h2 className="ro-eyebrow mb-2">Your Request History</h2>
        <p>You have not raised any requests yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-canvas-line pt-8">
      <h2 className="ro-eyebrow mb-4">Your Request History</h2>
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
