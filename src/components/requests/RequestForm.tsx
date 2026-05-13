"use client";

import { useState } from "react";
import { useCreateRequest } from "@/hooks/useRequests";
import { IconMedical, IconShelter, IconFood } from "@/components/common/Icons";

/**
 * RequestForm — Crisis UX Redesign
 * 
 * Optimized for high-stress scenarios:
 * - Tile-based selection (no dropdowns)
 * - Large touch targets
 * - Color-coded urgency meter
 * - Simplified location confirmation
 */

const TYPES = [
  { id: "medical", label: "Medical", icon: IconMedical, desc: "Injuries, illness, or medication" },
  { id: "shelter", label: "Shelter", icon: IconShelter, desc: "Safe place to stay or sleep" },
  { id: "food", label: "Food & Water", icon: IconFood, desc: "Supplies for sustenance" },
];

const SEVERITIES = [
  { value: 1, label: "Stable", color: "var(--color-steady)" },
  { value: 2, label: "Moderate", color: "var(--color-caution)" },
  { value: 3, label: "Serious", color: "var(--color-hazard)" },
  { value: 4, label: "Urgent", color: "var(--color-hazard)" },
  { value: 5, label: "Critical", color: "var(--color-critical)" },
];

export function RequestForm() {
  const create = useCreateRequest();
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [selectedType, setSelectedType] = useState("medical");
  const [selectedSeverity, setSelectedSeverity] = useState(3);
  const [lat, setLat] = useState("40.7128");
  const [lng, setLng] = useState("-74.006");
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMsg({ text: "Location services not supported.", type: "error" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        setMsg({ text: "Could not detect location automatically.", type: "error" });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

    try {
      const res = await create.mutateAsync({
        type: selectedType,
        severity: selectedSeverity,
        description,
        lat: Number(lat),
        lng: Number(lng),
      });
      setMsg({
        text: res.duplicate
          ? `Linked to existing request: ${res.id}`
          : `Request submitted successfully. ID: ${res.id}`,
        type: "success",
      });
      // Save ID to local storage for persistence
      localStorage.setItem("last_request_id", res.id);
      form.reset();
    } catch (err) {
      setMsg({
        text: err instanceof Error ? err.message : "Submission failed. Please try again.",
        type: "error",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* 1. Need Selection */}
      <section>
        <p className="ro-label">1. What do you need most?</p>
        <div className="ro-tile-grid mt-4">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`ro-tile ${selectedType === t.id ? "ro-tile-selected" : ""}`}
            >
              <div className="ro-tile-icon">
                <t.icon size={24} />
              </div>
              <div>
                <p className="font-bold text-ink">{t.label}</p>
                <p className="text-[0.65rem] text-ink-tertiary mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Urgency Meter */}
      <section>
        <p className="ro-label">2. How urgent is your situation?</p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {SEVERITIES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSelectedSeverity(s.value)}
              className={`h-12 rounded-lg border-2 transition-all flex items-center justify-center font-bold text-xs ${
                selectedSeverity === s.value 
                  ? "border-trust bg-trust text-white scale-105 shadow-md" 
                  : "border-border bg-white text-ink-tertiary hover:border-border-strong"
              }`}
              style={{ 
                backgroundColor: selectedSeverity === s.value ? s.color : undefined,
                borderColor: selectedSeverity === s.value ? s.color : undefined 
              }}
            >
              {s.value}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[0.65rem] font-bold text-ink-tertiary uppercase tracking-widest">
          <span>Stable</span>
          <span>Life-Threatening</span>
        </div>
      </section>

      {/* 3. Details */}
      <section>
        <label className="ro-label">3. Describe your situation (Optional)</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Number of people, specific medical needs, etc."
          className="ro-input mt-2"
        />
      </section>

      {/* 4. Location Confirmation */}
      <section className="ro-card border-dashed bg-surface-dim/30">
        <p className="ro-label">4. Confirm your location</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="ro-btn-secondary flex-1"
          >
            {locating ? "📍 Detecting..." : "📍 Use GPS Location"}
          </button>
          <div className="flex gap-2 flex-1">
            <div className="flex-1">
              <span className="text-[0.6rem] font-bold text-ink-tertiary uppercase">Lat</span>
              <input readOnly value={lat} className="ro-input bg-surface-dim font-mono text-xs mt-1" />
            </div>
            <div className="flex-1">
              <span className="text-[0.6rem] font-bold text-ink-tertiary uppercase">Lng</span>
              <input readOnly value={lng} className="ro-input bg-surface-dim font-mono text-xs mt-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={create.isPending}
          className="ro-btn-sos w-full"
        >
          {create.isPending ? "SENDING SOS..." : "SUBMIT REQUEST"}
        </button>
      </div>

      {/* Feedback Alerts */}
      {msg && (
        <div className={msg.type === "success" ? "ro-alert-success" : "ro-alert-error"} role="alert">
          <div className="mt-0.5">
            {msg.type === "success" ? "✅" : "⚠️"}
          </div>
          <div>
            <p className="font-bold">{msg.type === "success" ? "Sent" : "Error"}</p>
            <p className="opacity-90">{msg.text}</p>
          </div>
        </div>
      )}
    </form>
  );
}

