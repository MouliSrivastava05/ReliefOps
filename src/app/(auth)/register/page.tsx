import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="ro-page-narrow">
      <div className="mb-8 text-center">
        <h1 className="ro-title">ReliefOps</h1>
        <p className="ro-lead mx-auto">Join the crisis coordination network</p>
      </div>
      <RegisterForm />
    </main>
  );
}
