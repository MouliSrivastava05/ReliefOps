"use client";

import { useState } from "react";
import { ROLES } from "@/constants/roles.constants";

/**
 * RegisterForm — Calm and guiding onboarding
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
      className="ro-card mt-10 space-y-6"
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
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="ro-input"
          />
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
          Registration Role
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
        <div className="ro-fade-up space-y-4">
          <div className="ro-alert-info">
            <div>
              <p className="font-bold">Volunteer Application</p>
              <p className="mt-0.5 opacity-90 text-xs">
                Your application will be reviewed by an administrator. Please provide your details to proceed.
              </p>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-border bg-surface-dim/30 p-6">
            <label className="ro-label">
              Skills <span className="text-ink-tertiary normal-case">(comma-separated)</span>
              <input
                name="skills"
                type="text"
                placeholder="First Aid, Search & Rescue, Logistics…"
                className="ro-input mt-1"
              />
            </label>

            <label className="ro-label">
              Motivation
              <textarea
                name="message"
                rows={3}
                placeholder="Why do you want to volunteer?"
                className="ro-input mt-1 resize-none"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="ro-label">
                Emergency Contact
                <input
                  name="emergency_contact_name"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="ro-input mt-1"
                />
              </label>
              <label className="ro-label">
                Contact Number
                <input
                  name="emergency_contact_phone"
                  type="tel"
                  required
                  placeholder="+1…"
                  className="ro-input mt-1"
                />
              </label>
            </div>

            <label className="ro-label">
              ID / Passport Upload
              <input
                name="id_proof"
                type="file"
                required
                accept="image/*,.pdf"
                className="ro-input mt-1 file:mr-4 file:rounded-lg file:border-0 file:bg-trust file:px-3 file:py-1.5 file:text-[0.65rem] file:font-bold file:uppercase file:text-white hover:file:opacity-90"
              />
            </label>

            <div className="pt-2 space-y-3">
              {[
                "I authorize a complete background check.",
                "I agree to the Liability Waiver.",
                "I possess required vaccinations.",
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 rounded border-border text-action focus:ring-action/20 transition-all"
                  />
                  <span className="text-xs text-ink-secondary group-hover:text-ink transition-colors">
                    {text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="ro-btn-primary w-full py-4 text-base"
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
