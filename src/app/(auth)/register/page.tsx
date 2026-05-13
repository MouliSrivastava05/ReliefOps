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
    : err === "config" ? "Database is not configured."
    : err === "fields" ? "Missing required fields."
    : null;

  return (
    <main className="ro-page-narrow">
      <div className="space-y-2">
        <p className="ro-eyebrow">Get Started</p>
        <h1 className="ro-title">Create account</h1>
        <p className="ro-lead">
          Join the coordination network as a citizen, volunteer, or admin.
        </p>
      </div>

      {registered === "volunteer" && (
        <div className="mt-8 ro-alert-warning">
          <div>
            <p className="font-bold">Application submitted</p>
            <p className="mt-0.5 opacity-90 text-xs">
              An admin will review your registration shortly. You'll be able to sign in once approved.
            </p>
          </div>
        </div>
      )}

      {msg && <div className="mt-8 ro-alert-error">{msg}</div>}

      <RegisterForm action={registerAction} />

      <p className="mt-10 text-sm text-ink-secondary text-center">
        Already have an account?{" "}
        <Link href="/login" className="ro-link">Sign in</Link>
      </p>
    </main>
  );
}
