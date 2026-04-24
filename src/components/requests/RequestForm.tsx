"use client";

import { useState } from "react";
import { useCreateRequest } from "@/hooks/useRequests";

export function RequestForm() {
  const create = useCreateRequest();
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    const severity = Number(
      (form.elements.namedItem("severity") as HTMLInputElement).value,
    );
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const lat = Number((form.elements.namedItem("lat") as HTMLInputElement).value);
    const lng = Number((form.elements.namedItem("lng") as HTMLInputElement).value);
    try {
      const res = await create.mutateAsync({
        type,
        severity,
        description,
        lat,
        lng,
      });
      setMsg(
        res.duplicate
          ? `Linked to existing request in your area (id: ${res.id}).`
          : `Submitted. Request id: ${res.id}`,
      );
      form.reset();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  return (
    <form onSubmit={onSubmit} className="ro-card max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="ro-label sm:col-span-1">
          Type
          <select name="type" required className="ro-select">
            <option value="medical">Medical</option>
            <option value="shelter">Shelter</option>
            <option value="food">Food</option>
          </select>
        </label>
        <label className="ro-label sm:col-span-1">
          Severity (1–5)
          <input
            name="severity"
            type="number"
            min={1}
            max={5}
            defaultValue={3}
            required
            className="ro-input"
          />
        </label>
      </div>
      <label className="ro-label">
        What do you need?
        <textarea
          name="description"
          rows={4}
          placeholder="Be specific: supplies, mobility, headcount, timing…"
          className="ro-input resize-y"
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="ro-label">
          Latitude
          <input
            name="lat"
            type="number"
            step="any"
            defaultValue={40.7128}
            required
            className="ro-input font-mono text-xs"
          />
        </label>
        <label className="ro-label">
          Longitude
          <input
            name="lng"
            type="number"
            step="any"
            defaultValue={-74.006}
            required
            className="ro-input font-mono text-xs"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={create.isPending}
        className="ro-btn-primary"
      >
        {create.isPending ? "Submitting…" : "Submit request"}
      </button>
      {msg && (
        <p
          className="rounded-md border border-canvas-line bg-surface-mute px-3 py-2 text-sm text-ink-muted"
          role="status"
        >
          {msg}
        </p>
      )}
    </form>
  );
}
