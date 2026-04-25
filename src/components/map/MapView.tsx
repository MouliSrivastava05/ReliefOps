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
        className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-canvas-line bg-surface-mute px-5 py-8 text-center"
        data-testid="map-view"
      >
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
          Map preview is off. Add{" "}
          <code className="rounded border border-canvas-line bg-surface px-1.5 py-0.5 font-mono text-xs text-ink">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to <span className="font-mono text-xs">.env.local</span> to enable Google Maps integration.
        </p>
      </div>
    );
  }

  // Calculate center based on the first request, or fallback to a default location
  const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York, NY
  const center = requests.length > 0 ? { lat: requests[0].lat, lng: requests[0].lng } : defaultCenter;

  return (
    <div className="overflow-hidden rounded-lg border border-canvas-line bg-surface-mute shadow-lift aspect-video">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          {requests.map((r) => (
            <Marker 
              key={r.id} 
              position={{ lat: r.lat, lng: r.lng }} 
              title={`${r.type} (Severity: ${r.severity})`} 
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

