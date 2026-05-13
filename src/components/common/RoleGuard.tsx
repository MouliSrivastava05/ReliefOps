"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { ROLES } from "@/constants/roles.constants";

/**
 * NavLink — Active-state-aware navigation link
 */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const path = usePathname();
  const active = href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className="relative px-3 py-1.5 text-[0.8rem] font-medium rounded-lg transition-all duration-200"
      style={{
        color: active ? "var(--color-action)" : "var(--color-ink-secondary)",
        backgroundColor: active ? "var(--color-action-soft)" : "transparent",
      }}
    >
      {children}
    </Link>
  );
}

/**
 * SiteHeader — Premium minimal navigation
 */
export function SiteHeader() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const showCitizen = role === ROLES.CITIZEN;
  const showVolunteer = role === ROLES.VOLUNTEER;
  const showAdmin = role === ROLES.ADMIN || role === ROLES.SHELTER_MANAGER;

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "rgba(226, 232, 240, 0.7)",
        backgroundColor: "rgba(248, 250, 252, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight transition-opacity hover:opacity-70"
            style={{ color: "var(--color-ink)" }}
          >
            Relief<span style={{ color: "var(--color-action)" }}>Ops</span>
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
                <span className="text-xs font-medium truncate max-w-[100px]" style={{ color: "var(--color-ink-secondary)" }}>
                  {session.user.email?.split("@")[0]}
                </span>
                <span
                  className="text-[0.5rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: "var(--color-action-soft)",
                    color: "var(--color-action)",
                  }}
                >
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
          <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
            Verifying access…
          </p>
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