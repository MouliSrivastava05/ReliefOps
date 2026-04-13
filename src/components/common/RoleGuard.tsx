"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { ROLES } from "@/constants/roles.constants";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const active =
    href === "/"
      ? path === "/"
      : path === href || path.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`whitespace-nowrap border-b-2 pb-0.5 text-sm transition ${
        active
          ? "border-primary font-medium text-ink"
          : "border-transparent text-ink-muted hover:border-canvas-line hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const showCitizen = role === ROLES.CITIZEN;
  const showVolunteer = role === ROLES.VOLUNTEER;
  const showAdmin =
    role === ROLES.ADMIN || role === ROLES.SHELTER_MANAGER;

  return (
    <header className="sticky top-0 z-40 border-b border-canvas-line bg-surface/90 shadow-inset backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-baseline gap-3">
          <Link
            href="/"
            className="font-display text-lg font-medium tracking-tight text-ink"
          >
            ReliefOps
          </Link>
          <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ink-faint sm:inline">
            coordination
          </span>
        </div>

        {status === "authenticated" && session?.user && (
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-canvas-line/60 pt-3 sm:border-0 sm:pt-0">
            {showCitizen && (
              <>
                <NavLink href="/submit-request">Request</NavLink>
                <NavLink href="/track">Track</NavLink>
              </>
            )}
            {showVolunteer && (
              session.user.status === "active"
                ? <NavLink href="/portal">Volunteer</NavLink>
                : <NavLink href="/pending-approval">⏳ Pending Approval</NavLink>
            )}
            {showAdmin && (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/requests">Requests</NavLink>
                <NavLink href="/resources">Resources</NavLink>
                <NavLink href="/volunteers">Volunteers</NavLink>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3 text-sm text-ink-muted">
          {status === "loading" ? (
            <span className="text-ink-faint">…</span>
          ) : session?.user ? (
            <>
              <span className="hidden max-w-[10rem] truncate text-xs sm:inline sm:max-w-[14rem]">
                {session.user.email}
              </span>
              <span className="rounded-sm bg-canvas-deep px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted">
                {session.user.role}
              </span>
              <button
                type="button"
                className="ro-btn-ghost px-2 py-1 text-xs"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="ro-btn-secondary px-3 py-1.5 text-xs">
                Sign in
              </Link>
              <Link href="/register" className="ro-btn-primary px-3 py-1.5 text-xs">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}

type RoleGuardProps = {
  role: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGuard({ role, children, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const allowed = Array.isArray(role) ? role : [role];

  if (status === "loading") {
    return (
      <div className="ro-page flex items-center justify-center">
        <p className="ro-eyebrow text-ink-muted">Checking session…</p>
      </div>
    );
  }
  if (!session?.user?.role || !allowed.includes(session.user.role)) {
    return (
      fallback ?? (
        <div className="ro-page">
          <div className="ro-card-quiet max-w-md border-danger/20 bg-danger-soft/30">
            <p className="text-sm font-medium text-danger">
              You do not have access to this area.
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Sign in with an account that has the right role, or return{" "}
              <Link href="/" className="ro-link">
                home
              </Link>
              .
            </p>
          </div>
        </div>
      )
    );
  }
  return <>{children}</>;
}