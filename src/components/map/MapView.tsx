"use client";

export function MapView() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const defaultLocation = "New York, NY"; // Fallback location for the operations desk

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

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(defaultLocation)}`;

  return (
    <div className="overflow-hidden rounded-lg border border-canvas-line bg-surface-mute shadow-lift aspect-video">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
        title="Operations Map"
        data-testid="map-view"
      />
    </div>
  );
}

