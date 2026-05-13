"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles.constants";

export default function PendingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) { router.replace("/login"); return; }
    if (session.user.role === ROLES.VOLUNTEER && session.user.status === "active") {
      router.replace("/portal");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="ro-page flex items-center justify-center">
        <div className="ro-skeleton h-4 w-32 rounded" />
      </div>
    );
  }

  return (
    <main className="ro-page flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Status icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: "var(--color-urgent-soft)" }}>
          <svg className="h-10 w-10" style={{ color: "var(--color-urgent)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="ro-title">Application Under Review</h1>
          <p className="ro-lead" style={{ color: "var(--color-ink-secondary)" }}>
            Your volunteer application has been submitted successfully.
          </p>
        </div>

        <div className="ro-alert-warning text-left space-y-3">
          <div className="flex items-center gap-2">
            <div className="ro-live-dot" style={{ backgroundColor: "var(--color-urgent)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>Pending admin approval</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
            A ReliefOps administrator will review your credentials and background
            information. Once approved, you&apos;ll be able to sign in and access the
            volunteer portal.
          </p>
          <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
            You&apos;ll need to sign in again after your account is approved.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
            Signed in as{" "}
            <span className="font-medium" style={{ color: "var(--color-ink-secondary)" }}>{session?.user?.email}</span>
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
