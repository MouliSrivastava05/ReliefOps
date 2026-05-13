"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface RequestRow {
  id: string;
  lat: number;
  lng: number;
  severity: number;
  type: string;
}

interface MapViewProps {
  requests?: RequestRow[];
}

export function MapView({ requests = [] }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-dim)" }}
        data-testid="map-view"
      >
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
          style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink-tertiary)" }}
        >
          🗺
        </div>
        <p className="text-xs font-medium" style={{ color: "var(--color-ink-tertiary)" }}>
          Map unavailable — add <code className="font-mono text-[0.65rem] px-1 py-0.5 rounded" style={{ backgroundColor: "var(--color-surface)" }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable.
        </p>
      </div>
    );
  }

  const defaultCenter = { lat: 40.7128, lng: -74.006 };
  const center = requests.length > 0 ? { lat: requests[0].lat, lng: requests[0].lng } : defaultCenter;

  return (
    <div className="overflow-hidden rounded-2xl border aspect-[16/10] relative" style={{ borderColor: "var(--color-border)" }}>
      <APIProvider apiKey={apiKey}>
        <Map defaultCenter={center} defaultZoom={12} gestureHandling="greedy" disableDefaultUI={true}>
          {requests.map((r) => (
            <Marker
              key={r.id}
              position={{ lat: r.lat, lng: r.lng }}
              title={`${r.type} — Severity ${r.severity}`}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
