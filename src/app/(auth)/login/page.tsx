"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const registered = searchParams.get("registered");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", { email, password, redirect: false });
    setPending(false);

    if (res?.error) {
      try {
        const statusRes = await fetch("/api/auth/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const { status, role } = await statusRes.json() as { status: string; role: string };
        if (status === "pending" && role === "volunteer") {
          setError("Your volunteer application is pending admin approval. You\u2019ll be able to sign in once approved.");
          return;
        }
        if (status === "rejected" && role === "volunteer") {
          setError("Your volunteer application was not approved. Please contact an administrator.");
          return;
        }
      } catch { /* fall through */ }
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="ro-page-narrow">
      <p className="ro-eyebrow">Welcome back</p>
      <h1 className="ro-title mt-2">Sign in</h1>
      <p className="ro-lead">
        Access your account to submit requests, volunteer, or manage operations.
      </p>
      {registered === "1" && (
        <div className="mt-6 ro-alert-success">
          Account created successfully. You can sign in now.
        </div>
      )}
      {error && (
        <div className="mt-6 ro-alert-error">{error}</div>
      )}
      <form onSubmit={onSubmit} className="ro-card mt-8 space-y-5">
        <label className="ro-label">
          Email
          <input name="email" type="email" required placeholder="you@example.com" className="ro-input" />
        </label>
        <label className="ro-label">
          Password
          <input name="password" type="password" required placeholder="Your password" className="ro-input" />
        </label>
        <button type="submit" disabled={pending} className="ro-btn-primary w-full">
          {pending ? "Signing in\u2026" : "Sign in"}
        </button>
      </form>
      <p className="mt-8 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
        No account?{" "}
        <Link href="/register" className="ro-link">Register</Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="ro-page-narrow"><div className="ro-skeleton h-4 w-24 rounded" /></main>}>
      <LoginForm />
    </Suspense>
  );
}
