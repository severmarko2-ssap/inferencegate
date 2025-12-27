// app/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — SSAP InferenceGate",
  description:
    "Terms of Service for SSAP InferenceGate (ssap.io).",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-zinc-500">Last updated: 2025-12-26</p>

          <p className="mt-8 text-lg text-zinc-700">
            These Terms of Service (“Terms”) govern your use of ssap.io and any
            materials, information, or services provided in connection with
            InferenceGate by SSAP (“we”, “us”, “our”). By accessing the site, you
            agree to these Terms.
          </p>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Use of the website</h2>
            <p className="text-zinc-700">
              You may use the website for lawful purposes only. You agree not to
              misuse the site, attempt unauthorized access, or interfere with
              the site’s operation.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">No warranties</h2>
            <p className="text-zinc-700">
              The website and materials are provided “as is” and “as available”
              without warranties of any kind, express or implied. We do not
              guarantee that the site will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Limitation of liability</h2>
            <p className="text-zinc-700">
              To the maximum extent permitted by law, SSAP will not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages arising from or related to your use of the site or
              materials.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Intellectual property</h2>
            <p className="text-zinc-700">
              All content on this website, including text, graphics, logos, and
              documents, is owned by SSAP or its licensors and is protected by
              applicable intellectual property laws. You may not copy, modify,
              distribute, or create derivative works without prior written
              permission, except as allowed by law.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Third-party services</h2>
            <p className="text-zinc-700">
              The website may reference or link to third-party services. We are
              not responsible for third-party content or practices.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Changes to these Terms</h2>
            <p className="text-zinc-700">
              We may update these Terms from time to time. The “Last updated”
              date reflects the latest version. Continued use of the site after
              changes means you accept the updated Terms.
            </p>
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-zinc-700">
              Questions about these Terms? Contact{" "}
              <a className="underline" href="mailto:marko@ssap.io">
                marko@ssap.io
              </a>
              .
            </p>
          </section>

          <div className="mt-12 flex items-center gap-4 text-sm">
            <Link href="/privacy" className="underline text-zinc-700 hover:text-zinc-900">
              Privacy
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
