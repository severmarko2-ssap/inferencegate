// app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — SSAP InferenceGate",
  description:
    "Privacy Policy for SSAP InferenceGate (ssap.io). Learn what data we collect and how we use it.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200/70">
        <div className="px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold hover:opacity-80">
            ← Back to home
          </Link>
          <a
            href="mailto:marko@ssap.io"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            marko@ssap.io
          </a>
        </div>
      </header>

      <main className="px-8 py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-zinc-500">Last updated: 2025-12-26</p>

          <p className="mt-8 text-lg text-zinc-700">
            This Privacy Policy explains how SSAP (“we”, “us”, “our”) collects,
            uses, and protects information when you visit ssap.io and interact
            with InferenceGate materials (including PDF downloads and demo/pilot
            inquiries).
          </p>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Information we collect</h2>

            <div className="space-y-3 text-zinc-700">
              <p>
                <span className="font-medium">Contact information:</span> If you
                submit your email (e.g., to download a one-pager) or contact us
                by email, we may collect your email address and any information
                you include in your message.
              </p>
              <p>
                <span className="font-medium">Usage data:</span> We may collect
                basic, aggregated usage information about site performance and
                interactions (e.g., page views) to improve the website.
              </p>
              <p>
                <span className="font-medium">Cookies:</span> We may use
                essential cookies and analytics cookies (if enabled) to operate
                and understand the site. You can control cookies through your
                browser settings.
              </p>
            </div>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">How we use information</h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-700">
              <li>To provide access to requested materials (e.g., PDFs).</li>
              <li>To respond to demo/pilot inquiries and support requests.</li>
              <li>To improve the website and user experience.</li>
              <li>To maintain security and prevent abuse.</li>
            </ul>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Legal basis (where applicable)</h2>
            <p className="text-zinc-700">
              We process personal data based on your consent (e.g., providing
              your email), our legitimate interests (e.g., improving and securing
              the site), and to communicate with you upon request.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Sharing</h2>
            <p className="text-zinc-700">
              We do not sell your personal information. We may share limited
              information with service providers that help us operate the
              website (e.g., hosting/analytics), only as necessary and subject to
              appropriate safeguards.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Data retention</h2>
            <p className="text-zinc-700">
              We retain contact information only as long as needed to respond to
              your request, maintain business records, or comply with legal
              obligations.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Your rights</h2>
            <p className="text-zinc-700">
              Depending on your location, you may have rights to access, correct,
              delete, or restrict the processing of your personal data. To make
              a request, contact us at{" "}
              <a className="underline" href="mailto:marko@ssap.io">
                marko@ssap.io
              </a>
              .
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-zinc-700">
              We use reasonable safeguards to protect information, but no method
              of transmission or storage is 100% secure.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-zinc-700">
              For privacy questions, email{" "}
              <a className="underline" href="mailto:marko@ssap.io">
                marko@ssap.io
              </a>
              .
            </p>
          </section>

          <div className="mt-12 flex items-center gap-4 text-sm">
            <Link href="/terms" className="underline text-zinc-700 hover:text-zinc-900">
              Terms
            </Link>
            <span className="text-zinc-400">·</span>
            <Link href="/" className="underline text-zinc-700 hover:text-zinc-900">
              Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
