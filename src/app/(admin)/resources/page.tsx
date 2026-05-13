"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ROLES } from "@/constants/roles.constants";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { IconMedical, IconShelter, IconFood, IconEmergency } from "@/components/common/Icons";

const TYPE_ICONS: Record<string, React.ElementType> = { medical: IconMedical, shelter: IconShelter, food: IconFood };

export default function AdminResourcesPage() {
  const qc = useQueryClient();
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const { data: session } = useSession();
  const role = session?.user?.role;

  const { data, isLoading, error } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const res = await fetch("/api/resources");
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ resources: Array<{ id: string; name: string; type: string; quantityAvailable: number; lat: number; lng: number }> }>;
    },
  });

  const { data: resourceRequestsData, refetch: refetchResourceRequests } = useQuery({
    queryKey: ["resource-requests"],
    queryFn: async () => {
      const res = await fetch("/api/resource-requests");
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<{ requests: Array<{ id: string; type: string; status: string; severity: number; unitsNeeded: number; lat: number; lng: number }> }>;
    },
    enabled: role === ROLES.ADMIN || role === ROLES.SHELTER_MANAGER,
  });

  async function approveResourceRequest(id: string) {
    setMsg(null);
    const res = await fetch(`/api/resource-requests/${id}/approve`, { method: "POST" });
    if (!res.ok) { setMsg({ text: await res.text(), type: "error" }); return; }
    setMsg({ text: "Resource request approved and stock added.", type: "success" });
    refetchResourceRequests();
    qc.invalidateQueries({ queryKey: ["resources"] });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      quantityAvailable: Number((form.elements.namedItem("qty") as HTMLInputElement).value),
      lat: Number((form.elements.namedItem("lat") as HTMLInputElement).value),
      lng: Number((form.elements.namedItem("lng") as HTMLInputElement).value),
      shelterTag: (form.elements.namedItem("tag") as HTMLInputElement).value,
    };
    const res = await fetch("/api/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { setMsg({ text: await res.text(), type: "error" }); return; }
    setMsg({ text: "Resource added to inventory.", type: "success" });
    form.reset();
    qc.invalidateQueries({ queryKey: ["resources"] });
  }

  async function onRequestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const form = e.currentTarget;
    const qty = (form.elements.namedItem("qty") as HTMLInputElement).value;
    const body = {
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      severity: Number((form.elements.namedItem("severity") as HTMLSelectElement).value),
      description: `Resource Request: ${qty} units needed. ` + (form.elements.namedItem("desc") as HTMLTextAreaElement).value,
      lat: Number((form.elements.namedItem("lat") as HTMLInputElement).value),
      lng: Number((form.elements.namedItem("lng") as HTMLInputElement).value),
      isResourceRequest: true, qty,
    };
    const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { setMsg({ text: await res.text(), type: "error" }); return; }
    setMsg({ text: "Resource request submitted.", type: "success" });
    form.reset();
    refetchResourceRequests();
  }

  const resources = data?.resources ?? [];

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-12">
        <div className="max-w-2xl">
          <p className="ro-eyebrow">Inventory</p>
          <h1 className="ro-title mt-2">Resources</h1>
          <p className="ro-lead">Track available supplies. Stock updates atomically when allocations are made.</p>
        </div>

        {msg && <div className={msg.type === "success" ? "ro-alert-success" : "ro-alert-error"} role="status">{msg.text}</div>}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start">
          {/* Form */}
          <form onSubmit={role === ROLES.ADMIN ? onSubmit : onRequestSubmit} className="ro-card space-y-4">
            {role === ROLES.ADMIN ? (
              <>
                <h2 className="ro-section-title">Add Stock</h2>
                <label className="ro-label">Name<input name="name" required className="ro-input" placeholder="e.g. Medical Kit A" /></label>
                <label className="ro-label">Type<select name="type" className="ro-select"><option value="medical">Medical</option><option value="shelter">Shelter</option><option value="food">Food</option></select></label>
                <label className="ro-label">Units<input name="qty" type="number" min={0} defaultValue={10} className="ro-input" /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="ro-label">Lat<input name="lat" type="number" step="any" defaultValue={40.73} className="ro-input font-mono text-xs" /></label>
                  <label className="ro-label">Lng<input name="lng" type="number" step="any" defaultValue={-73.99} className="ro-input font-mono text-xs" /></label>
                </div>
                <label className="ro-label">Shelter tag <span className="text-ink-tertiary">(optional)</span><input name="tag" className="ro-input" /></label>
                <button type="submit" className="ro-btn-primary w-full">Save Resource</button>
              </>
            ) : (
              <>
                <h2 className="ro-section-title">Request Resource</h2>
                <label className="ro-label">Type<select name="type" className="ro-select"><option value="medical">Medical</option><option value="shelter">Shelter</option><option value="food">Food</option></select></label>
                <label className="ro-label">Units Needed<input name="qty" type="number" min={1} defaultValue={10} required className="ro-input" /></label>
                <label className="ro-label">Severity<select name="severity" className="ro-select" defaultValue="3"><option value="1">1 — Low</option><option value="2">2 — Moderate</option><option value="3">3 — Elevated</option><option value="4">4 — Urgent</option><option value="5">5 — Critical</option></select></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="ro-label">Lat<input name="lat" type="number" step="any" defaultValue={40.73} className="ro-input font-mono text-xs" /></label>
                  <label className="ro-label">Lng<input name="lng" type="number" step="any" defaultValue={-73.99} className="ro-input font-mono text-xs" /></label>
                </div>
                <label className="ro-label">Details<textarea name="desc" className="ro-input min-h-[4rem]" placeholder="Specific requirements…"></textarea></label>
                <button type="submit" className="ro-btn-primary w-full">Submit Request</button>
              </>
            )}
          </form>

          <section className="space-y-8">
            {/* Shelter Manager resource requests */}
            {role === ROLES.SHELTER_MANAGER && resourceRequestsData?.requests?.length ? (
              <div>
                <h2 className="ro-section-title">My Resource Requests</h2>
                <ul className="mt-4 space-y-2">
                  {resourceRequestsData.requests.map((r) => (
                    <li key={r.id} className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="flex items-center gap-2 font-bold text-ink">
                          {(() => {
                            const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
                            return <Icon size={14} className="opacity-70" />;
                          })()}
                          {r.type.charAt(0).toUpperCase() + r.type.slice(1)}{" "}
                          <span className="text-ink-secondary font-normal">({r.unitsNeeded} units)</span>
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${r.status === "RESOLVED" ? "bg-steady-soft text-steady" : "bg-urgent-soft text-urgent"}`}>{r.status === "QUEUED" ? "PENDING" : r.status}</span>
                      </div>
                      <span className="text-xs text-ink-tertiary">Severity: {r.severity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Admin pending resource requests */}
            {role === ROLES.ADMIN && resourceRequestsData?.requests?.length ? (
              <div>
                <h2 className="ro-section-title">Pending Resource Requests</h2>
                <ul className="mt-4 space-y-2">
                  {resourceRequestsData.requests.map((r) => (
                    <li key={r.id} className="flex flex-col gap-2 rounded-lg border border-urgent/30 bg-urgent-soft px-4 py-3 text-sm shadow-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="flex items-center gap-2 font-bold text-ink">
                          {(() => {
                            const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
                            return <Icon size={14} className="opacity-70" />;
                          })()}
                          {r.type.charAt(0).toUpperCase() + r.type.slice(1)}{" "}
                          <span className="text-ink-secondary font-normal">({r.unitsNeeded} units)</span>
                        </span>
                        <button onClick={() => approveResourceRequest(r.id)} className="ro-btn-primary px-3 py-1 text-xs">Approve &amp; Add Stock</button>
                      </div>
                      <span className="text-xs text-ink-secondary">Severity: {r.severity} · <span className="font-mono">{r.lat.toFixed(2)}, {r.lng.toFixed(2)}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Inventory */}
            <div>
              <h2 className="ro-section-title">Current Inventory</h2>
              {isLoading && <div className="mt-4 space-y-2">{[1, 2, 3].map((i) => <div key={i} className="ro-skeleton h-14 w-full rounded-lg" />)}</div>}
              {error && <div className="mt-3 ro-alert-error">{error instanceof Error ? error.message : "Error"}</div>}
              <ul className="mt-4 space-y-2">
                {resources.map((r) => {
                  const low = r.quantityAvailable <= 3 && r.quantityAvailable > 0;
                  const empty = r.quantityAvailable === 0;
                  return (
                    <li key={r.id} className={`flex flex-wrap items-baseline justify-between gap-2 rounded-lg border bg-surface px-4 py-3 text-sm shadow-sm ${empty ? "border-critical/30 bg-critical-soft" : low ? "border-urgent/30 bg-urgent-soft" : "border-border"}`}>
                      <span className="flex items-center gap-2 font-bold text-ink">
                        {(() => {
                          const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
                          return <Icon size={14} className="opacity-70" />;
                        })()}
                        {r.name}
                      </span>
                      <span className="text-ink-secondary">
                        {r.type} · <span className={`tabular-nums font-semibold ${empty ? "text-critical" : low ? "text-urgent" : "text-ink"}`}>{r.quantityAvailable}</span> units · <span className="font-mono text-xs text-ink-tertiary">{r.lat.toFixed(2)}, {r.lng.toFixed(2)}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </RoleGuard>
  );
}
