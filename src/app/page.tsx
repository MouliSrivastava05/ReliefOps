import Link from "next/link";
import { IconEmergency, IconVolunteer, IconDashboard, IconSearch } from "@/components/common/Icons";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none opacity-50"
        style={{ background: "radial-gradient(circle at 70% 20%, rgba(13,148,136,0.15) 0%, transparent 60%)" }}
      />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle at 30% 80%, rgba(15,23,42,0.1) 0%, transparent 60%)" }}
      />

      <div className="ro-page-wide relative z-10 pt-8 sm:pt-16">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24">

          {/* Hero */}
          <section className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="ro-live-dot" />
                <span className="ro-eyebrow">Coordination Active</span>
              </div>
              <h1 className="ro-title text-balance" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
                Intelligent response when every second matters.
              </h1>
              <p className="ro-lead text-balance max-w-lg">
                ReliefOps connects citizens, volunteers, and coordinators through
                a unified platform designed for clarity under pressure.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/register" className="ro-btn-primary px-8 py-3.5">
                Get Started
              </Link>
              <Link href="/login" className="ro-btn-secondary px-8 py-3.5">
                Sign In
              </Link>
            </div>

            <div className="pt-10 flex items-center gap-8 border-t border-border">
              {[
                { val: "99.9%", label: "Uptime" },
                { val: "GPS", label: "Precision" },
                { val: "Auto", label: "Matching" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-xl font-bold text-ink">{s.val}</p>
                  <p className="text-[0.6rem] font-medium uppercase tracking-wider mt-0.5 text-ink-tertiary">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gateway Cards */}
          <section className="space-y-4">
            <p className="ro-overline px-1 mb-2">Quick Access</p>

            {/* SOS */}
            <Link href="/submit-request" className="group block ro-card !p-0 overflow-hidden transition-all duration-300 hover:shadow-lg border-critical/20">
              <div className="flex items-stretch">
                <div className="w-1.5 bg-critical shrink-0 transition-all duration-300 group-hover:w-3" />
                <div className="p-6 sm:p-7 flex-1 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink">I Need Help</h3>
                    <p className="text-xs mt-1 text-ink-tertiary">Submit an emergency request for immediate coordination.</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-critical-soft text-critical transition-all duration-300 group-hover:scale-110">
                    <IconEmergency size={20} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Volunteer */}
            <Link href="/portal" className="group block ro-card !p-0 overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="flex items-stretch">
                <div className="w-1.5 bg-action shrink-0 transition-all duration-300 group-hover:w-3" />
                <div className="p-6 sm:p-7 flex-1 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink">Volunteer Portal</h3>
                    <p className="text-xs mt-1 text-ink-tertiary">View assignments and update your field status.</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-action-soft text-action transition-all duration-300 group-hover:scale-110">
                    <IconVolunteer size={20} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Dashboard */}
            <Link href="/dashboard" className="group block ro-card !p-0 overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="flex items-stretch">
                <div className="w-1.5 bg-trust shrink-0 transition-all duration-300 group-hover:w-3" />
                <div className="p-6 sm:p-7 flex-1 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink">Operations Dashboard</h3>
                    <p className="text-xs mt-1 text-ink-tertiary">Resource management and allocation oversight.</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-surface-dim text-ink-secondary transition-all duration-300 group-hover:scale-110">
                    <IconDashboard size={20} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Track */}
            <Link href="/track" className="group block ro-card border-dashed transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-surface-dim">
                  <IconSearch size={16} className="text-ink-tertiary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">Track a Request</p>
                  <p className="text-[0.65rem] mt-0.5 text-ink-tertiary">Enter your tracking ID to check status.</p>
                </div>
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-surface-dim text-ink-tertiary">
                  Search →
                </span>
              </div>
            </Link>
          </section>
        </div>

        {/* Trust bar */}
        <div className="mt-24 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-ink-tertiary">
            Designed for reliability. Built for the moments that matter most.
          </p>
        </div>
      </div>
    </main>
  );
}
