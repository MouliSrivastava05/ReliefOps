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
          setError("Your volunteer application is pending admin approval.");
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
      <div className="space-y-2">
        <p className="ro-eyebrow">Welcome back</p>
        <h1 className="ro-title">Sign in</h1>
        <p className="ro-lead">
          Access your account to manage operations or request assistance.
        </p>
      </div>

      {registered === "1" && (
        <div className="mt-8 ro-alert-success">
          Account created successfully. You can sign in now.
        </div>
      )}

      {error && (
        <div className="mt-8 ro-alert-error">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="ro-card mt-10 space-y-5">
        <label className="ro-label">
          Email address
          <input name="email" type="email" required placeholder="you@example.com" className="ro-input mt-1" />
        </label>
        <label className="ro-label">
          Password
          <input name="password" type="password" required placeholder="Your password" className="ro-input mt-1" />
        </label>
        <button type="submit" disabled={pending} className="ro-btn-primary w-full py-4 text-base mt-2">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-10 text-sm text-ink-secondary text-center">
        No account?{" "}
        <Link href="/register" className="ro-link">Create one now</Link>
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
