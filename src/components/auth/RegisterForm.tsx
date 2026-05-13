"use client";

import { useState } from "react";
import { ROLES } from "@/constants/roles.constants";

/**
 * RegisterForm — Onboarding with warmth
 *
 * Warm, guiding language throughout.
 * Volunteer application section is clearly delineated.
 * Larger touch targets. Clear checkbox text.
 */

export function RegisterForm({
  action,
}: {
  action: (payload: FormData) => void;
}) {
  const [role, setRole] = useState<string>(ROLES.CITIZEN);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={(data) => {
        setPending(true);
        action(data);
      }}
      className="ro-card mt-8 space-y-6"
    >
      <div className="space-y-4">
        <label className="ro-label">
          Full Name
          <input
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="ro-input"
          />
        </label>

        <label className="ro-label">
          Email
          <input name="email" type="email" required placeholder="you@example.com" className="ro-input" />
        </label>

        <label className="ro-label">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="ro-input"
          />
        </label>

        <label className="ro-label">
          I am registering as
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="ro-select"
          >
            <option value={ROLES.CITIZEN}>Citizen — I need help</option>
            <option value={ROLES.VOLUNTEER}>Volunteer — I want to help</option>
            <option value={ROLES.ADMIN}>Admin — I manage operations</option>
            <option value={ROLES.SHELTER_MANAGER}>Shelter Manager — I manage resources</option>
          </select>
        </label>
      </div>

      {role === ROLES.VOLUNTEER && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="ro-alert-info mb-4">
            <p className="font-medium text-sm">Volunteer Application</p>
            <p className="mt-1 text-xs opacity-80">
              Your application will be reviewed by an administrator before you can
              access the volunteer portal. Please provide your details below.
            </p>
          </div>

          <div
            className="space-y-4 rounded-lg border p-5"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-dim)" }}
          >
            <label className="ro-label">
              Skills{" "}
              <span style={{ color: "var(--color-ink-tertiary)" }}>(comma-separated)</span>
              <input
                name="skills"
                type="text"
                placeholder="First Aid, Search & Rescue, Logistics…"
                className="ro-input"
              />
            </label>

            <label className="ro-label">
              Why do you want to volunteer?
              <textarea
                name="message"
                rows={3}
                placeholder="Briefly describe your motivation and relevant experience…"
                className="ro-input resize-none"
              />
            </label>

            <div className="flex gap-4">
              <label className="ro-label flex-1">
                Emergency Contact Name
                <input
                  name="emergency_contact_name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="ro-input"
                />
              </label>
              <label className="ro-label flex-1">
                Contact Number
                <input
                  name="emergency_contact_phone"
                  type="tel"
                  required
                  placeholder="+1…"
                  className="ro-input"
                />
              </label>
            </div>

            <label className="ro-label">
              Valid ID / Passport Upload
              <input
                name="id_proof"
                type="file"
                required
                accept="image/*,.pdf"
                className="ro-input file:mr-4 file:rounded-md file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:opacity-90"
                style={{ ["--tw-file-bg" as string]: "var(--color-trust)" }}
              />
            </label>

            <div className="my-2 h-px w-full" style={{ backgroundColor: "var(--color-border)" }} />

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded accent-trust"
                />
                <span className="text-xs leading-snug" style={{ color: "var(--color-ink-secondary)" }}>
                  I authorize a complete criminal background and screening check.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded accent-trust"
                />
                <span className="text-xs leading-snug" style={{ color: "var(--color-ink-secondary)" }}>
                  I agree to the Liability Waiver, acknowledging that I operate at
                  my own risk in hazardous areas.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded accent-trust"
                />
                <span className="text-xs leading-snug" style={{ color: "var(--color-ink-secondary)" }}>
                  I confirm that I possess required vaccinations and am physically
                  cleared for disaster relief operations.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="ro-btn-primary mt-2 w-full"
      >
        {pending
          ? "Processing…"
          : role === ROLES.VOLUNTEER
            ? "Submit Application"
            : "Create account"}
      </button>
    </form>
  );
}
