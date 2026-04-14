"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROLES } from "@/constants/roles.constants";

export function RegisterForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.CITIZEN as string,
    motivation: "",
    skills: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const msg = data.status === "pending" 
        ? "Account created successfully! An administrator must approve your account before you can log in."
        : "Account created successfully! Routing you to login...";
      
      setSuccessMsg(msg);
      
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (successMsg) {
    return (
      <div className="ro-card text-center space-y-4 py-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
          <svg className="h-6 w-6 text-primary-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-ink">Success</h2>
        <p className="text-sm text-ink-muted">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="ro-card">
      <h2 className="text-xl font-medium text-ink mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="mb-4 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="ro-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="ro-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="ro-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="ro-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="ro-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="ro-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="ro-label" htmlFor="role">Account Role</label>
          <select
            id="role"
            name="role"
            className="ro-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value={ROLES.CITIZEN}>Citizen (Find/Request Help)</option>
            <option value={ROLES.VOLUNTEER}>Volunteer (Provide Help)</option>
            <option value={ROLES.SHELTER_MANAGER}>Shelter Manager</option>
            <option value={ROLES.ADMIN}>Administrator</option>
          </select>
          {formData.role !== ROLES.CITIZEN && (
            <p className="mt-1.5 text-xs text-ink-faint">
              * Note: {formData.role} accounts require admin approval before you can access the portal.
            </p>
          )}
        </div>

        {formData.role === ROLES.VOLUNTEER && (
          <>
            <div>
              <label className="ro-label" htmlFor="skills">Skills (comma separated)</label>
              <input
                id="skills"
                name="skills"
                type="text"
                className="ro-input"
                value={formData.skills}
                onChange={handleChange}
                placeholder="First Aid, Search & Rescue"
              />
            </div>
            <div>
              <label className="ro-label" htmlFor="motivation">Why do you want to volunteer?</label>
              <textarea
                id="motivation"
                name="motivation"
                required
                rows={3}
                className="ro-input resize-none"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="I want to help my community..."
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="ro-btn-primary w-full mt-2"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-ink-muted border-t border-canvas-line pt-4">
        Already have an account?{" "}
        <Link href="/login" className="ro-link">
          Log in instead
        </Link>
      </div>
    </div>
  );
}
