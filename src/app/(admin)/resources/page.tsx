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
    setMsg({ text: "Stock successfully updated.", type: "success" });
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
    setMsg({ text: "Inventory updated.", type: "success" });
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
      description: `Resource Request: ${qty} units. ` + (form.elements.namedItem("desc") as HTMLTextAreaElement).value,
      lat: Number((form.elements.namedItem("lat") as HTMLInputElement).value),
      lng: Number((form.elements.namedItem("lng") as HTMLInputElement).value),
      isResourceRequest: true, qty,
    };
    const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { setMsg({ text: await res.text(), type: "error" }); return; }
    setMsg({ text: "Request sent to central operations.", type: "success" });
    form.reset();
    refetchResourceRequests();
  }

  const resources = data?.resources ?? [];

  return (
    <RoleGuard role={[ROLES.ADMIN, ROLES.SHELTER_MANAGER]}>
      <main className="ro-page-wide space-y-12">
        <div className="max-w-2xl">
          <p className="ro-eyebrow">Supply Chain</p>
          <h1 className="ro-title mt-2">Resources</h1>
          <p className="ro-lead">Manage mission-critical supplies and inventory levels.</p>
        </div>

        {msg && <div className={msg.type === "success" ? "ro-alert-success" : "ro-alert-error"} role="status">{msg.text}</div>}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
          {/* Form */}
          <form onSubmit={role === ROLES.ADMIN ? onSubmit : onRequestSubmit} className="ro-card space-y-5">
            <h2 className="ro-section-title">{role === ROLES.ADMIN ? "Register Stock" : "Request Supplies"}</h2>
            {role === ROLES.ADMIN && <label className="ro-label">Resource Name<input name="name" required className="ro-input mt-1" placeholder="e.g. Trauma Kit Alpha" /></label>}
            <div className="grid grid-cols-2 gap-3">
              <label className="ro-label">Type<select name="type" className="ro-select mt-1"><option value="medical">Medical</option><option value="shelter">Shelter</option><option value="food">Food</option></select></label>
              <label className="ro-label">Units<input name="qty" type="number" min={1} defaultValue={10} className="ro-input mt-1" /></label>
            </div>
            {role !== ROLES.ADMIN && (
              <label className="ro-label">Priority Level<select name="severity" className="ro-select mt-1" defaultValue="3"><option value="1">Stable</option><option value="2">Moderate</option><option value="3">Elevated</option><option value="4">Urgent</option><option value="5">Critical</option></select></label>
            )}
            <div className="grid grid-cols-2 gap-3">
              <label className="ro-label">Lat<input name="lat" type="number" step="any" defaultValue={40.73} className="ro-input mt-1 font-mono text-[0.7rem]" /></label>
              <label className="ro-label">Lng<input name="lng" type="number" step="any" defaultValue={-73.99} className="ro-input mt-1 font-mono text-[0.7rem]" /></label>
            </div>
            {role !== ROLES.ADMIN && <label className="ro-label">Justification<textarea name="desc" className="ro-input mt-1 min-h-[4rem]" placeholder="Why are these units needed?"></textarea></label>}
            <button type="submit" className="ro-btn-primary w-full py-3.5 mt-2">{role === ROLES.ADMIN ? "Add to Inventory" : "Submit Request"}</button>
          </form>

          <section className="space-y-10">
            {/* Pending requests */}
            {resourceRequestsData?.requests?.length ? (
              <div>
                <h2 className="ro-section-title mb-4">Pending Requests</h2>
                <ul className="space-y-3">
                  {resourceRequestsData.requests.map((r) => (
                    <li key={r.id} className="ro-card !p-4 flex items-center justify-between gap-4 border-hazard/20 bg-hazard-soft/30">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shadow-sm text-hazard">
                          {(() => {
                            const Icon = TYPE_ICONS[r.type.toLowerCase()] || IconEmergency;
                            return <Icon size={18} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">{r.type.charAt(0).toUpperCase() + r.type.slice(1)}</p>
                          <p className="text-[0.65rem] text-ink-secondary mt-0.5">{r.unitsNeeded} units requested</p>
                        </div>
                      </div>
                      {role === ROLES.ADMIN && (
                        <button onClick={() => approveResourceRequest(r.id)} className="ro-btn-action !py-1.5 !px-4 text-xs">Approve</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Inventory */}
            <div>
              <h2 className="ro-section-title mb-4">Current Inventory</h2>
              {isLoading && <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="ro-skeleton h-16 w-full" />)}</div>}
              <ul className="grid gap-3 sm:grid-cols-2">
                {resources.map((r) => {
                  const empty = r.quantityAvailable === 0;
                  const low = r.quantityAvailable <= 3 && !empty;
                  return (
                    <li key={r.id} className={`ro-card !p-4 border-l-4 ${empty ? "border-l-critical bg-critical-soft/30" : low ? "border-l-hazard bg-hazard-soft/30" : "border-l-safe"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-ink truncate max-w-[120px]">{r.name}</p>
                        <span className={`text-xs font-black tabular-nums ${empty ? "text-critical" : low ? "text-hazard" : "text-safe"}`}>{r.quantityAvailable}</span>
                      </div>
                      <div className="flex items-center justify-between text-[0.6rem] text-ink-tertiary uppercase tracking-wider font-semibold">
                        <span>{r.type}</span>
                        <span className="font-mono">LOC: {r.lat.toFixed(1)}, {r.lng.toFixed(1)}</span>
                      </div>
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
