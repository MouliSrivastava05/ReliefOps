"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { ROLES } from "@/constants/roles.constants";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-[0.8rem] font-medium rounded-lg transition-all duration-200 ${
        active ? "text-action bg-action-soft" : "text-ink-secondary hover:text-ink hover:bg-surface-dim"
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
  const showAdmin = role === ROLES.ADMIN || role === ROLES.SHELTER_MANAGER;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-ground/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-ink transition-opacity hover:opacity-70">
            Relief<span className="text-action">Ops</span>
          </Link>

          {status === "authenticated" && session?.user && (
            <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
              {showCitizen && (
                <>
                  <NavLink href="/submit-request">Request</NavLink>
                  <NavLink href="/track">Track</NavLink>
                </>
              )}
              {showVolunteer && (
                session.user.status === "active"
                  ? <NavLink href="/portal">Portal</NavLink>
                  : <NavLink href="/pending-approval">Pending</NavLink>
              )}
              {showAdmin && (
                <>
                  {role === ROLES.ADMIN && <NavLink href="/dashboard">Dashboard</NavLink>}
                  <NavLink href="/requests">Requests</NavLink>
                  <NavLink href="/resources">Resources</NavLink>
                  <NavLink href="/volunteers">Volunteers</NavLink>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="ro-skeleton h-8 w-20 rounded-lg" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs font-medium text-ink-secondary truncate max-w-[100px]">
                  {session.user.email?.split("@")[0]}
                </span>
                <span className="text-[0.5rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-action-soft text-action">
                  {session.user.role}
                </span>
              </div>
              <button
                type="button"
                className="ro-btn-ghost !py-1.5 !px-3 text-xs"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="ro-btn-ghost !py-1.5 !px-3 text-xs">
                Log In
              </Link>
              <Link href="/register" className="ro-btn-primary !py-1.5 !px-4 text-xs">
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
        <div className="flex flex-col items-center gap-3">
          <div className="ro-skeleton h-4 w-32 rounded" />
          <p className="text-xs text-ink-tertiary">Verifying access…</p>
        </div>
      </div>
    );
  }
  if (!session?.user?.role || !allowed.includes(session.user.role)) {
    return (
      fallback ?? (
        <div className="ro-page">
          <div className="ro-alert-error max-w-md">
            <p className="font-medium">Access restricted</p>
            <p className="mt-1 text-xs opacity-80">
              You do not have permission to view this area. Please{" "}
              <Link href="/login" className="underline">sign in</Link>{" "}
              with an authorized account, or return{" "}
              <Link href="/" className="underline">home</Link>.
            </p>
          </div>
        </div>
      )
    );
  }
  return <>{children}</>;
}