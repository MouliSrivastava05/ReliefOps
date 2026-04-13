"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminResourcesPage() {
  const qc = useQueryClient();
  const [msg, setMsg] = useState<string | null>(null);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const { data, isLoading, error } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const res = await fetch("/api/resources");
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{
        resources: Array<{
          id: string;
          name: string;
          type: string;
          quantityAvailable: number;
          lat: number;
          lng: number;
        }>;
      }>;
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      quantityAvailable: Number(
        (form.elements.namedItem("qty") as HTMLInputElement).value,
      ),
      lat: Number((form.elements.namedItem("lat") as HTMLInputElement).value),
      lng: Number((form.elements.namedItem("lng") as HTMLInputElement).value),
      shelterTag: (form.elements.namedItem("tag") as HTMLInputElement).value,
    };
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setMsg(await res.text());
      return;
    }
    setMsg("Saved to inventory.");
    form.reset();
    qc.invalidateQueries({ queryKey: ["resources"] });
  }

  const resources = data?.resources ?? [];

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-12">
        <div className="max-w-2xl">
          <p className="ro-eyebrow">Inventory</p>
          <h1 className="ro-title mt-2">Resources</h1>
          <p className="ro-lead">
            Stock ticks down atomically when an allocation sticks—two admins
            clicking at once should not oversell the same line item.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
          <form onSubmit={onSubmit} className="ro-card space-y-4">
            <h2 className="font-display text-lg font-medium text-ink">
              Add stock
            </h2>
            <label className="ro-label">
              Name
              <input name="name" required className="ro-input" />
            </label>
            <label className="ro-label">
              Type
              <select name="type" className="ro-select">
                <option value="medical">Medical</option>
                <option value="shelter">Shelter</option>
                <option value="food">Food</option>
              </select>
            </label>
            <label className="ro-label">
              Units available
              <input
                name="qty"
                type="number"
                min={0}
                defaultValue={10}
                className="ro-input"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="ro-label">
                Lat
                <input
                  name="lat"
                  type="number"
                  step="any"
                  defaultValue={40.73}
                  className="ro-input font-mono text-xs"
                />
              </label>
              <label className="ro-label">
                Lng
                <input
                  name="lng"
                  type="number"
                  step="any"
                  defaultValue={-73.99}
                  className="ro-input font-mono text-xs"
                />
              </label>
            </div>
            <label className="ro-label">
              Shelter tag (optional)
              <input name="tag" className="ro-input" />
            </label>
            <button type="submit" className="ro-btn-primary w-full">
              Save resource
            </button>
            {msg && (
              <p className="text-center text-sm text-ink-muted">{msg}</p>
            )}
          </form>

          {/* Inventory List */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-medium text-ink">
              Current Inventory
            </h2>
            {isLoading && (
              <p className="text-sm text-ink-muted">Loading inventory...</p>
            )}
            {error && (
              <p className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
                Failed to load inventory.
              </p>
            )}
            {!isLoading && !error && resources.length === 0 && (
              <p className="text-sm text-ink-muted bg-surface-mute p-4 rounded-lg border border-canvas-line">
                No resources found in current inventory. Add stock on the left.
              </p>
            )}
            {!isLoading && !error && resources.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {resources.map((r: any) => (
                  <div key={r.id} className="ro-card-quiet flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className="ro-eyebrow">{r.type}</span>
                        <span className="text-xs font-mono bg-canvas-line px-2 py-0.5 rounded text-ink-muted mt-[-2px]">
                          {r.quantityAvailable} units
                        </span>
                      </div>
                      <h3 className="font-medium text-ink truncate" title={r.name}>{r.name}</h3>
                      <div className="mt-2 text-xs font-mono text-ink-faint">
                        {Number(r.lat || 0).toFixed(4)}, {Number(r.lng || 0).toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}
