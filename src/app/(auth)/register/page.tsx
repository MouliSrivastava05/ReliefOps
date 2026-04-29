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
  if (!isMongoConfigured()) {
    redirect("/register?error=config");
  }
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? ROLES.CITIZEN);
  const allowed = new Set([
    ROLES.CITIZEN,
    ROLES.VOLUNTEER,
    ROLES.ADMIN,
    ROLES.SHELTER_MANAGER,
  ]);
  if (!email || !password) {
    redirect("/register?error=fields");
  }
  if (!(allowed as Set<string>).has(role)) {
    redirect("/register?error=role");
  }
  await connectMongo();
  const passwordHash = await bcrypt.hash(password, 10);

  // Volunteers start as pending until an admin approves them
  const status = role === ROLES.VOLUNTEER ? "pending" : "active";

  let userId: string;
  try {
    const user = await UserModel.create({ email, passwordHash, role, name, status });
    userId = String(user._id);
  } catch {
    redirect("/register?error=duplicate");
  }

  // For volunteers, create an application record with their skills/message
  if (role === ROLES.VOLUNTEER) {
    const skillsRaw = String(formData.get("skills") ?? "").trim();
    const skills = skillsRaw
      ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const message = String(formData.get("message") ?? "").trim();
    await VolunteerApplicationModel.create({
      userId,
      email,
      name,
      skills,
      message,
      status: "pending",
    });
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
    err === "duplicate"
      ? "Email already registered."
      : err === "config"
        ? "Database is not configured (set MONGODB_URI)."
        : err === "fields"
          ? "Email and password are required."
          : err === "role"
            ? "Invalid role."
            : null;

  return (
    <main className="ro-page-narrow">
      <p className="ro-eyebrow">Onboarding</p>
      <h1 className="ro-title mt-2">Register</h1>
      <p className="ro-lead">
        First admin for a fresh database: choose <strong>Admin</strong> once,
        then use other roles for realistic demos.
      </p>

      {registered === "volunteer" && (
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-4">
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            ✓ Application submitted — pending admin approval
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Your volunteer registration has been received. An admin will review your
            application shortly. You will be able to log in once approved.
          </p>
        </div>
      )}

      {msg && (
        <p className="mt-6 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm text-danger">
          {msg}
        </p>
      )}

      <RegisterForm action={registerAction} />

      <p className="mt-8 text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="ro-link">
          Sign in
        </Link>
      </p>
    </main>
  );
}
