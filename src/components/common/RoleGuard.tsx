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
 * Uses trust-navy underline for active state, warm grays for inactive.
 */
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
          ? "border-trust font-medium text-ink"
          : "border-transparent text-ink-secondary hover:border-border-strong hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * SiteHeader — Role-adaptive persistent navigation
 *
 * Clean, minimal header that adapts to the user's role.
 * No developer jargon. Warm institutional feel.
 * Mobile: wraps naturally without hamburger complexity.
 */
export function SiteHeader() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const showCitizen = role === ROLES.CITIZEN;
  const showVolunteer = role === ROLES.VOLUNTEER;
  const showAdmin =
    role === ROLES.ADMIN || role === ROLES.SHELTER_MANAGER;

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl transition-all"
      style={{
        borderColor: "rgba(226, 232, 240, 0.8)",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-sans text-xl font-black tracking-tighter hover:opacity-80 transition-opacity"
            style={{ color: "var(--color-trust)" }}
          >
            RELIEFOPS
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span
            className="hidden text-[0.6rem] font-bold uppercase tracking-[0.3em] opacity-50 sm:inline"
            style={{ color: "var(--color-ink-secondary)" }}
          >
            Tactical Unit
          </span>
        </div>

        {status === "authenticated" && session?.user && (
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4 sm:border-0 sm:pt-0"
            aria-label="Main navigation"
          >
            {showCitizen && (
              <>
                <NavLink href="/submit-request">Request</NavLink>
                <NavLink href="/track">History</NavLink>
              </>
            )}
            {showVolunteer && (
              session.user.status === "active"
                ? <NavLink href="/portal">Field Portal</NavLink>
                : <NavLink href="/pending-approval">Verification</NavLink>
            )}
            {showAdmin && (
              <>
                {role === ROLES.ADMIN && <NavLink href="/dashboard">Command</NavLink>}
                <NavLink href="/requests">Requests</NavLink>
                <NavLink href="/resources">Stock</NavLink>
                <NavLink href="/volunteers">Personnel</NavLink>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4 text-sm">
          {status === "loading" ? (
            <div className="ro-skeleton h-5 w-24" />
          ) : session?.user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[0.65rem] font-bold text-ink truncate max-w-[120px]">
                  {session.user.email?.split('@')[0]}
                </span>
                <span
                  className="text-[0.55rem] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                  style={{
                    backgroundColor: "var(--color-trust)",
                    color: "white",
                  }}
                >
                  {session.user.role}
                </span>
              </div>
              <button
                type="button"
                className="ro-btn-secondary !py-1.5 !px-3 !text-[0.7rem] uppercase tracking-widest"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
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
              <Link href="/login" className="underline">
                sign in
              </Link>{" "}
              with an authorized account, or return{" "}
              <Link href="/" className="underline">
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