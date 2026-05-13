import { RequestForm } from "@/components/requests/RequestForm";
import { CitizenRequestLog } from "@/components/requests/CitizenRequestLog";

/**
 * Submit Request Page — Human-centered crisis request
 *
 * No technical pipeline descriptions visible to citizens.
 * Warm, reassuring language. Clear purpose.
 */

export default function SubmitRequestPage() {
  return (
    <main className="ro-page">
      <p className="ro-eyebrow">Request Help</p>
      <h1 className="ro-title mt-2">Tell us what you need</h1>
      <p className="ro-lead">
        Describe your situation and we&apos;ll match you with the nearest
        available resources. Similar requests in your area are automatically
        grouped to speed up response.
      </p>
      <div className="mt-10">
        <RequestForm />
      </div>

      {/* Citizen Request History */}
      <CitizenRequestLog />
    </main>
  );
}
