"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles.constants";

export default function PendingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If the user is not a pending volunteer, redirect appropriately
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    // If they somehow got approved and refreshed, send them to the portal
    if (session.user.role === ROLES.VOLUNTEER && session.user.status === "active") {
      router.replace("/portal");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="ro-page flex items-center justify-center">
        <p className="ro-eyebrow text-ink-muted">Checking session…</p>
      </div>
    );
  }

  return (
    <main className="ro-page flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Status icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15">
          <svg
            className="h-10 w-10 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="ro-title">Application Under Review</h1>
          <p className="ro-lead text-ink-muted">
            Your volunteer application has been submitted successfully.
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-6 py-5 text-left space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-ink">Pending admin approval</span>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            A ReliefOps administrator will review your credentials and background
            information. Once approved, you&apos;ll be able to sign in and access the
            volunteer portal.
          </p>
          <p className="text-xs text-ink-faint">
            You&apos;ll need to sign in again after your account is approved.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-ink-faint">
            Signed in as{" "}
            <span className="font-medium text-ink-muted">
              {session?.user?.email}
            </span>
          </p>
          <button
            id="pending-signout-btn"
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ro-btn-ghost mx-auto px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
