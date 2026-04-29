import { RequestForm } from "@/components/requests/RequestForm";
import { CitizenRequestLog } from "@/components/requests/CitizenRequestLog";

export default function SubmitRequestPage() {
  return (
    <main className="ro-page">
      <p className="ro-eyebrow">Citizen</p>
      <h1 className="ro-title mt-2">Submit a crisis request</h1>
      <p className="ro-lead">
        We dedupe similar submissions within 24 hours for the same area and
        request type—so spikes do not flood the queue. Your case still moves
        through{" "}
        <span className="whitespace-nowrap font-mono text-xs text-ink-muted">
          CREATED → VALIDATED → QUEUED
        </span>{" "}
        before matching.
      </p>
      <div className="mt-10">
        <RequestForm />
      </div>

      {/* Citizen Request History */}
      <CitizenRequestLog />
    </main>
  );
}
