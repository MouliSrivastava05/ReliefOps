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
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-hazard-soft/50 shadow-inner">
          <svg className="h-10 w-10 text-hazard" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="ro-title">Review in Progress</h1>
          <p className="ro-lead">
            Your volunteer application is currently being verified.
          </p>
        </div>

        <div className="ro-alert-warning text-left space-y-3">
          <div className="flex items-center gap-2">
            <div className="ro-live-dot !bg-hazard" />
            <span className="text-sm font-bold text-ink">Verification Pending</span>
          </div>
          <p className="text-xs leading-relaxed text-ink-secondary">
            A ReliefOps administrator is reviewing your credentials and background
            check. This process ensures field integrity and safety for all responders.
          </p>
          <p className="text-xs text-ink-tertiary">
            You will receive access once the validation is complete.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-ink-tertiary">
            Signed in as <span className="font-bold text-ink-secondary">{session?.user?.email}</span>
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
