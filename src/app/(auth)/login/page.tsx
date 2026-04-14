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
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);

    if (res?.error) {
      // Check if the login failure is because the account is pending/rejected
      try {
        const statusRes = await fetch("/api/auth/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const { status, role } = await statusRes.json() as {
          status: string;
          role: string;
        };
        if (status === "pending" && role === "volunteer") {
          setError(
            "Your volunteer application is pending admin approval. You will be able to sign in once approved.",
          );
          return;
        }
        if (status === "rejected" && role === "volunteer") {
          setError(
            "Your volunteer application was not approved. Please contact an administrator for more information.",
          );
          return;
        }
      } catch {
        // If the status check fails, fall through to generic error
      }
      setError("Invalid email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="ro-page-narrow">
      <p className="ro-eyebrow">Access</p>
      <h1 className="ro-title mt-2">Sign in</h1>
      <p className="ro-lead">
        Use the account you registered—roles unlock different parts of the app.
      </p>
      {registered === "1" && (
        <p className="mt-6 rounded-md border border-ok/30 bg-ok-soft px-3 py-2 text-sm text-ok">
          Account created. You can sign in now.
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      <form onSubmit={onSubmit} className="ro-card mt-8 space-y-5">
        <label className="ro-label">
          Email
          <input name="email" type="email" required className="ro-input" />
        </label>
        <label className="ro-label">
          Password
          <input
            name="password"
            type="password"
            required
            className="ro-input"
          />
        </label>
        <button type="submit" disabled={pending} className="ro-btn-primary w-full">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-8 text-sm text-ink-muted">
        No account?{" "}
        <Link href="/register" className="ro-link">
          Register
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="ro-page-narrow">
          <p className="text-sm text-ink-muted">Loading…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
