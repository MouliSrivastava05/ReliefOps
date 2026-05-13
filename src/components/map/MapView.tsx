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

const SEVERITY_COLORS: Record<number, string> = {
  1: "#0ea5e9", // Stable
  2: "#2563eb", // Moderate
  3: "#f59e0b", // Serious
  4: "#f97316", // Urgent
  5: "#e11d48", // Critical
};

export function MapView({ requests = [] }: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center bg-surface-dim/50"
        data-testid="map-view"
      >
        <p className="max-w-xs text-xs font-bold uppercase tracking-widest text-ink-tertiary">
          Tactical Map Offline
        </p>
        <p className="text-[0.65rem] text-ink-tertiary mt-1">
          Missing Google Maps API Key in configuration.
        </p>
      </div>
    );
  }

  const defaultCenter = { lat: 40.7128, lng: -74.0060 };
  const center = requests.length > 0 ? { lat: requests[0].lat, lng: requests[0].lng } : defaultCenter;

  return (
    <div className="overflow-hidden rounded-xl border-2 border-border shadow-tactical aspect-video relative">
      <div className="absolute top-4 left-4 z-10">
        <span className="ro-badge bg-trust/80 text-white backdrop-blur-sm border-none px-3 py-1">
          LIVE FIELD DATA
        </span>
      </div>
      <APIProvider apiKey={apiKey}>
        <Map defaultCenter={center} defaultZoom={12} gestureHandling="greedy" disableDefaultUI={true}>
          {requests.map((r) => (
            <Marker 
              key={r.id} 
              position={{ lat: r.lat, lng: r.lng }} 
              title={`[S${r.severity}] ${r.type.toUpperCase()}`}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

