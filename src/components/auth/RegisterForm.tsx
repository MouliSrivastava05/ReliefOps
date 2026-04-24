"use client";

import { useState } from "react";
import { ROLES } from "@/constants/roles.constants";

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
          <input name="email" type="email" required className="ro-input" />
        </label>

        <label className="ro-label">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="ro-input"
          />
        </label>

        <label className="ro-label">
          Role
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="ro-select"
          >
            <option value={ROLES.CITIZEN}>Citizen</option>
            <option value={ROLES.VOLUNTEER}>Volunteer</option>
            <option value={ROLES.ADMIN}>Admin</option>
            <option value={ROLES.SHELTER_MANAGER}>Shelter manager</option>
          </select>
        </label>
      </div>

      {role === ROLES.VOLUNTEER && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="mb-4 text-xs leading-relaxed text-ink-muted">
            <p className="font-semibold text-ink">Volunteer Application</p>
            <p className="mt-1">
              Your request will be reviewed by an admin before you can access
              the volunteer portal. Please provide your details below.
            </p>
          </div>

          <div className="space-y-4 rounded-md border border-canvas-line/80 bg-surface-mute/50 p-4 shadow-inset">
            <label className="ro-label">
              Skills{" "}
              <span className="text-ink-faint">(comma-separated, e.g. First Aid, Search &amp; Rescue)</span>
              <input
                name="skills"
                type="text"
                placeholder="First Aid, Search & Rescue, Logistics..."
                className="ro-input"
              />
            </label>

            <label className="ro-label">
              Why do you want to volunteer?
              <textarea
                name="message"
                rows={3}
                placeholder="Briefly describe your motivation and relevant experience..."
                className="ro-input resize-none"
              />
            </label>

            <div className="flex gap-4">
              <label className="ro-label flex-1">
                Emergency Contact (Name)
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
                  placeholder="+1..."
                  className="ro-input"
                />
              </label>
            </div>

            <label className="ro-label">
              Valid ID/Passport Upload
              <input
                name="id_proof"
                type="file"
                required
                accept="image/*,.pdf"
                className="ro-input file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-surface hover:file:bg-primary-hover"
              />
            </label>

            <div className="my-2 h-px w-full bg-canvas-line" />

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-canvas-line text-primary focus:ring-primary"
                />
                <span className="text-xs leading-snug text-ink-muted">
                  I authorize a complete criminal background and screening check.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-canvas-line text-primary focus:ring-primary"
                />
                <span className="text-xs leading-snug text-ink-muted">
                  I agree to the Liability Waiver, validating that I operate at
                  my own risk in hazardous areas.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-canvas-line text-primary focus:ring-primary"
                />
                <span className="text-xs leading-snug text-ink-muted">
                  I possess required vaccinations and am physically cleared for
                  Disaster Relief Operation (DRO) demands.
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
          ? "Processing..."
          : role === ROLES.VOLUNTEER
            ? "Submit Application"
            : "Create account"}
      </button>
    </form>
  );
}
