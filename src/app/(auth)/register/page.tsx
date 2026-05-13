import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { ROLES } from "@/constants/roles.constants";
import { UserModel } from "@/domain/models/UserModel";
import { VolunteerApplicationModel } from "@/domain/models/VolunteerApplicationModel";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";

async function registerAction(formData: FormData) {
  "use server";
  if (!isMongoConfigured()) redirect("/register?error=config");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? ROLES.CITIZEN);
  const allowed = new Set([ROLES.CITIZEN, ROLES.VOLUNTEER, ROLES.ADMIN, ROLES.SHELTER_MANAGER]);
  if (!email || !password) redirect("/register?error=fields");
  if (!(allowed as Set<string>).has(role)) redirect("/register?error=role");
  await connectMongo();
  const passwordHash = await bcrypt.hash(password, 10);
  const status = role === ROLES.VOLUNTEER ? "pending" : "active";
  let userId: string;
  try {
    const user = await UserModel.create({ email, passwordHash, role, name, status });
    userId = String(user._id);
  } catch {
    redirect("/register?error=duplicate");
  }
  if (role === ROLES.VOLUNTEER) {
    const skillsRaw = String(formData.get("skills") ?? "").trim();
    const skills = skillsRaw ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const message = String(formData.get("message") ?? "").trim();
    await VolunteerApplicationModel.create({ userId, email, name, skills, message, status: "pending" });
    redirect("/register?registered=volunteer");
  }
  redirect("/login?registered=1");
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string }>;
}) {
  const sp = await searchParams;
  const err = sp.error;
  const registered = sp.registered;

  const msg =
    err === "duplicate" ? "An account with this email already exists."
    : err === "config" ? "Database is not configured. Please contact an administrator."
    : err === "fields" ? "Email and password are required."
    : err === "role" ? "Invalid role selected."
    : null;

  return (
    <main className="ro-page-narrow">
      <p className="ro-eyebrow">Get Started</p>
      <h1 className="ro-title mt-2">Create your account</h1>
      <p className="ro-lead">
        Choose your role to access the right tools. Citizens can request help,
        volunteers can offer assistance, and administrators manage operations.
      </p>

      {registered === "volunteer" && (
        <div className="mt-6 ro-alert-warning">
          <p className="font-medium text-sm">✓ Application submitted — pending admin approval</p>
          <p className="mt-1 text-xs opacity-80">
            Your volunteer registration has been received. An admin will review
            your application shortly. You&apos;ll be able to sign in once approved.
          </p>
        </div>
      )}

      {msg && <div className="mt-6 ro-alert-error">{msg}</div>}

      <RegisterForm action={registerAction} />

      <p className="mt-8 text-sm" style={{ color: "var(--color-ink-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" className="ro-link">Sign in</Link>
      </p>
    </main>
  );
}
