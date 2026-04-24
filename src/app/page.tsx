import Link from "next/link";

export default function HomePage() {
  return (
    <main className="ro-page-wide">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
        <div>
          <p className="ro-eyebrow">Field operations</p>
          <h1 className="ro-title mt-2 max-w-xl">
            Coordinate relief without losing the thread.
          </h1>
          <p className="ro-lead">
            Prioritized requests, honest inventory, and allocation you can
            explain—built for demos that still feel like a real ops desk.
          </p>
          <div className="ro-divider my-10" />
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="ro-btn-primary">
              Sign in
            </Link>
            <Link href="/register" className="ro-btn-secondary">
              Create an account
            </Link>
          </div>
        </div>

        <div className="space-y-4 lg:pb-2">
          <p className="ro-eyebrow">Shortcuts</p>
          <ul className="space-y-0 divide-y divide-canvas-line rounded-lg border border-canvas-line bg-surface shadow-lift">
            <li>
              <Link
                href="/submit-request"
                className="flex items-center justify-between gap-4 px-4 py-4 text-sm text-ink transition hover:bg-surface-mute"
              >
                <span className="font-medium">Submit a crisis request</span>
                <span className="text-ink-faint" aria-hidden>
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/track"
                className="flex items-center justify-between gap-4 px-4 py-4 text-sm text-ink transition hover:bg-surface-mute"
              >
                <span className="font-medium">Track an existing request</span>
                <span className="text-ink-faint" aria-hidden>
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center justify-between gap-4 px-4 py-4 text-sm text-ink transition hover:bg-surface-mute"
              >
                <span className="font-medium">Admin dashboard</span>
                <span className="text-xs text-ink-faint">ops</span>
              </Link>
            </li>
            <li>
              <Link
                href="/portal"
                className="flex items-center justify-between gap-4 px-4 py-4 text-sm text-ink transition hover:bg-surface-mute"
              >
                <span className="font-medium">Volunteer portal</span>
                <span className="text-xs text-ink-faint">field</span>
              </Link>
            </li>
          </ul>
          <p className="pl-1 text-xs leading-relaxed text-ink-faint">
            Use the header once you are signed in—navigation adapts to your role.
          </p>
        </div>
      </div>
    </main>
  );
}
