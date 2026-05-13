import Link from "next/link";
import Image from "next/image";
import { IconEmergency, IconVolunteer, IconDashboard, IconSearch } from "@/components/common/Icons";

/**
 * HomePage — Command Hub Redesign
 * 
 * Aesthetic: High-fidelity operational utility.
 * Focus: Immediate action for citizens, rapid entry for professionals.
 */

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `radial-gradient(var(--color-ink) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      <div className="ro-page-wide relative z-10 pt-20">
        <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          
          {/* Hero Content */}
          <section className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="ro-live-dot" />
                <p className="ro-eyebrow !text-ink font-black">Active Coordination Network</p>
              </div>
              <h1 className="ro-title text-balance text-6xl sm:text-7xl">
                Unifying response in moments of crisis.
              </h1>
              <p className="ro-lead text-balance max-w-xl">
                ReliefOps is the digital infrastructure for modern disaster response. 
                Connecting citizens in need with volunteers and resources through 
                high-fidelity coordination.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="ro-btn-primary px-10 py-4 text-base">
                Get Started
              </Link>
              <Link href="/login" className="ro-btn-secondary px-10 py-4 text-base">
                System Sign-In
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-10 border-t-2 border-border/50 max-w-md">
              <div>
                <p className="text-3xl font-black text-ink">99.9%</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ink-tertiary mt-1">Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-black text-ink">LAT/LNG</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ink-tertiary mt-1">Precision</p>
              </div>
              <div>
                <p className="text-3xl font-black text-ink">DIRECT</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-ink-tertiary mt-1">Allocation</p>
              </div>
            </div>
          </section>

          {/* Quick Access Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <p className="ro-eyebrow !text-ink font-black">Operational Gateways</p>
              <span className="text-[0.6rem] font-bold text-ink-tertiary">SECURE ACCESS</span>
            </div>
            
            <div className="grid gap-4">
              {/* SOS - Citizen */}
              <Link href="/submit-request" className="group ro-card !p-0 overflow-hidden border-2 border-critical shadow-lg shadow-critical/5 hover:scale-[1.02] transition-all">
                <div className="flex items-stretch">
                  <div className="w-3 bg-critical shrink-0 group-hover:w-5 transition-all" />
                  <div className="p-8 flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-ink uppercase tracking-tight">I Need Urgent Help</h3>
                      <p className="text-xs text-ink-secondary mt-1 font-medium opacity-70">Immediate SOS submission to triage.</p>
                    </div>
                    <IconEmergency size={32} className="text-critical group-hover:rotate-12 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Portal - Volunteer */}
              <Link href="/portal" className="group ro-card !p-0 overflow-hidden border-2 hover:border-action transition-all">
                <div className="flex items-stretch">
                  <div className="w-3 bg-action shrink-0 group-hover:w-5 transition-all" />
                  <div className="p-8 flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-ink uppercase tracking-tight">Field Portal</h3>
                      <p className="text-xs text-ink-secondary mt-1 font-medium opacity-70">Access tasks and deployment status.</p>
                    </div>
                    <IconVolunteer size={32} className="text-action group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Admin - Coordination */}
              <Link href="/dashboard" className="group ro-card !p-0 overflow-hidden border-2 hover:border-trust transition-all">
                <div className="flex items-stretch">
                  <div className="w-3 bg-trust shrink-0 group-hover:w-5 transition-all" />
                  <div className="p-8 flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-ink uppercase tracking-tight">Mission Control</h3>
                      <p className="text-xs text-ink-secondary mt-1 font-medium opacity-70">Resource and personnel management.</p>
                    </div>
                    <IconDashboard size={32} className="text-trust group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Track - Search */}
              <div className="ro-card !p-6 bg-surface-dim/50 border-2 border-dashed border-border-strong">
                <div className="flex items-center gap-2 mb-4">
                  <IconSearch size={14} className="text-ink-tertiary" />
                  <h4 className="text-[0.6rem] font-bold uppercase tracking-widest text-ink-tertiary">Track Active Request</h4>
                </div>
                <Link href="/track" className="flex items-center justify-between p-4 rounded-lg border-2 border-border bg-white hover:border-action transition-colors shadow-sm">
                  <span className="text-xs font-bold text-ink-tertiary">ENTER TRACKING ID...</span>
                  <span className="ro-badge bg-trust text-white px-4 py-1.5 font-black">SEARCH</span>
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* System Visualization */}
        <section className="mt-32 relative rounded-3xl overflow-hidden border-4 border-border shadow-[0_0_80px_-20px_rgba(37,99,235,0.2)]">
          <Image 
            src="/Users/meghna/.gemini/antigravity/brain/79b7d066-0123-4eaa-a0c8-a0d293bd5eda/reliefops_hero_abstract_1778152257564.png"
            alt="ReliefOps Infrastructure"
            width={1600}
            height={900}
            className="w-full object-cover grayscale-[0.4] brightness-[0.8] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-trust via-trust/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="ro-eyebrow !text-white opacity-80">Infrastructure Visualizer</p>
              <h2 className="text-2xl font-black text-white mt-2">Real-time allocation vectors and response nodes.</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white font-black text-2xl">4,120+</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60 mt-1">Nodes Active</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-right">
                <p className="text-white font-black text-2xl">240ms</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60 mt-1">Match Latency</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

