"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Home() {
  // Contact form state
  const [cEmail, setCEmail] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cMsg, setCMsg] = useState("");
  const [cStatus, setCStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [cError, setCError] = useState<string | null>(null);

  // PDF modal (lead gate) state
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [pdfError, setPdfError] = useState<string | null>(null);

  const contactRef = useRef<HTMLElement | null>(null);

  const goToContact = useCallback(() => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const openPdf = useCallback(() => {
    setPdfOpen(true);
    setPdfStatus("idle");
    setPdfError(null);
  }, []);

  const closePdf = useCallback(() => {
    setPdfOpen(false);
    setPdfEmail("");
    setPdfStatus("idle");
    setPdfError(null);
  }, []);

  const contactPayload = useMemo(() => {
    return {
      email: cEmail.trim(),
      company: cCompany.trim(),
      message: cMsg.trim(),
      source: "ssap.io",
    };
  }, [cEmail, cCompany, cMsg]);

  const sendContact = useCallback(async () => {
    setCError(null);

    if (!isValidEmail(cEmail)) {
      setCError("Please enter a valid email.");
      setCStatus("error");
      return;
    }
    if (!cCompany.trim()) {
      setCError("Please enter your company.");
      setCStatus("error");
      return;
    }
    if (!cMsg.trim()) {
      setCError("Please enter a message.");
      setCStatus("error");
      return;
    }

    try {
      setCStatus("sending");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Request failed");
      }
      setCStatus("sent");
    } catch (e: any) {
      setCStatus("error");
      setCError(e?.message || "Something went wrong.");
    }
  }, [cEmail, cCompany, cMsg, contactPayload]);

  const sendPdf = useCallback(async () => {
    setPdfError(null);

    if (!isValidEmail(pdfEmail)) {
      setPdfError("Please enter a valid email.");
      setPdfStatus("error");
      return;
    }

    try {
      setPdfStatus("sending");
      const res = await fetch("/api/pilot-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pdfEmail.trim(), source: "ssap.io" }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Request failed");
      }
      setPdfStatus("sent");
    } catch (e: any) {
      setPdfStatus("error");
      setPdfError(e?.message || "Something went wrong.");
    }
  }, [pdfEmail]);

  return (
    <main suppressHydrationWarning>
      {/* HEADER */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="container py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/ssap-logo.png"
              alt="SSAP"
              width={96}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-900">SSAP</span>
              <span className="text-xs text-zinc-500">InferenceGate</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-700">
              <a className="no-underline hover:text-zinc-900 font-semibold" href="#interdict">
                Interdict
              </a>
              <a className="no-underline hover:text-zinc-900" href="#problem">
                Problem
              </a>
              <a className="no-underline hover:text-zinc-900" href="#how">
                Architecture
              </a>
              <a className="no-underline hover:text-zinc-900" href="#what">
                Decisions
              </a>
              <a className="no-underline hover:text-zinc-900" href="#what">
                EU AI Act
              </a>
              <a className="no-underline hover:text-zinc-900" href="#contact">
                Contact
              </a>
            </nav>
            <a
              href="https://app.ssap.io"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white bg-white text-zinc-900 hover:bg-zinc-100 transition-colors no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white">
        <div className="container py-20 md:py-28">
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap gap-2">
              <span className="pill">Decision layer</span>
              <span className="pill">EU AI Act</span>
              <span className="pill">Runtime governance</span>
              <span className="pill">Audit-ready</span>
              <span className="pill">Model-agnostic</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Inference is not default.
              <br />
              Inference is permission.
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-zinc-600">
              SSAP is a decision layer that decides <strong>before</strong> every AI call. Run, block,
              escalate — with full audit trail and EU AI Act compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={goToContact} className="btn" type="button">
                Contact us
              </button>
              <a
                href="https://app.ssap.io"
                className="btn-ghost no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Dashboard
              </a>
            </div>
            <div className="muted text-sm">
              Ex-ante decision. NO_INFERENCE as valid outcome. Governance built into runtime.
            </div>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Policy first</div>
              <div className="muted">Decide before any call</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Audit-ready</div>
              <div className="muted">Decision trail by design</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">EU AI Act</div>
              <div className="muted">Compliance surfaces built-in</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Model-agnostic</div>
              <div className="muted">Works across providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Governance is missing from runtime.
              </h2>
              <p className="mt-4 text-zinc-600 max-w-xl">
                Most stacks decide <em>after</em> the model responds. SSAP decides <em>before</em> the
                call — and treats <strong>NO_INFERENCE</strong> as a valid outcome.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-zinc-700">
                <div>• Block low-value inference.</div>
                <div>• Enforce policies across teams.</div>
                <div>• Keep a decision trail for audits.</div>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Decision outcomes</div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="pill">RUN</span>
                  <div className="text-zinc-700">Allow inference and proceed.</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="pill">BLOCK</span>
                  <div className="text-zinc-700">Prevent inference (NO_INFERENCE).</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="pill">ESCALATE</span>
                  <div className="text-zinc-700">Route to human / stricter path.</div>
                </div>
              </div>
              <div className="muted text-sm mt-4">
                Built for policy enforcement, cost control, and compliance.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">How SSAP works</h2>
          <p className="muted mt-3 max-w-2xl">
            SSAP runs as a decision layer that evaluates context and policy before any model call.
            It produces an outcome — including NO_INFERENCE — and logs the decision trail.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">1) Evaluate</div>
              <p className="mt-3 text-zinc-600">
                SSAP inspects the request context and policy signals to determine whether inference is
                justified.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">2) Decide</div>
              <p className="mt-3 text-zinc-600">
                Return RUN, BLOCK, or ESCALATE with reason codes — stable, auditable outcomes.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">3) Enforce</div>
              <p className="mt-3 text-zinc-600">
                Apply decisions at runtime across your stack. Ship governance as an operational layer.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button onClick={openPdf} className="btn" type="button">
              Download one-pager (PDF)
            </button>
            <button onClick={goToContact} className="btn-ghost" type="button">
              Apply for pilot
            </button>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section id="what" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What you get</h2>
          <p className="muted mt-3 max-w-2xl">
            A governance layer that makes inference a permissioned action — with audit trail and
            compliance surfaces built in.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Policy enforcement</div>
              <p className="mt-3 text-zinc-600">
                Centralize policy decisions and enforce them consistently across services and teams.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Decision trail</div>
              <p className="mt-3 text-zinc-600">
                Capture reasoned outcomes for audits, reviews, and operational analysis.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Latency control</div>
              <p className="mt-3 text-zinc-600">
                Avoid unnecessary calls and reduce tail latency by blocking low-value inference.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">EU AI Act surfaces</div>
              <p className="mt-3 text-zinc-600">
                Build towards compliance with clear, auditable decisions and governance hooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILOT PROCESS */}
      <section id="pilot" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Pilot process</h2>
          <p className="muted mt-3 max-w-2xl">
            We start with a short pilot to validate governance outcomes and operational fit, then
            scale up to org-wide enforcement.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">1) Scope</div>
              <p className="mt-3 text-zinc-600">
                Pick one workflow where inference risk or cost is measurable.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">2) Deploy</div>
              <p className="mt-3 text-zinc-600">
                Add SSAP decision checks before model calls. Turn on audit trail.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">3) Evaluate</div>
              <p className="mt-3 text-zinc-600">
                Review outcomes, reason codes, and governance fit. Decide on rollout.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <button onClick={goToContact} className="btn" type="button">
              Contact us
            </button>
            <a href="#how" className="btn-ghost no-underline">
              Learn more →
            </a>
          </div>
        </div>
      </section>

      {/* INTERDICT */}
      <section id="interdict" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-24">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="pill">Interdict</span>
                  <span className="pill">Runtime enforcement</span>
                  <span className="pill">Fail-open</span>
                  <span className="pill">1-line SDK</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Runtime boundary for autonomous agents.
                </h2>
                <p className="mt-4 text-zinc-600 max-w-xl">
                  Interdict makes “do not act” a valid runtime outcome. It stops unsafe actions without changing agent
                  logic.
                </p>
                <div className="mt-6 flex flex-col gap-3 text-zinc-700">
                  <div>Stops agents from acting when they shouldn’t.</div>
                  <div>Runs in production and fails open.</div>
                  <div>Enforced by SSAP decision policies.</div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="/interdict" className="btn no-underline">
                    View Interdict
                  </a>
                  <button onClick={goToContact} className="btn-ghost" type="button">
                    Activate Interdict
                  </button>
                </div>
                <div className="muted text-sm mt-4">
                  No rule editors. No tuning sliders. Just disciplined action.
                </div>
              </div>
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="text-xs font-semibold text-zinc-500 mb-3">
                  Minimal integration
                </div>
                <div className="font-mono text-sm text-zinc-900 whitespace-pre leading-6">
{`from interdict import boundary
with boundary():
    agent.run()`}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="text-xs font-semibold text-zinc-500 mb-3">Interdict</div>
                <div className="flex flex-col gap-3 text-sm text-zinc-700">
                  <div>Runtime decision boundary, independent of model choice.</div>
                  <div>Fail-open by design — no new single point of failure.</div>
                  <div>NO_ACTION is a first-class outcome.</div>
                </div>
              </div>
              <div className="muted text-sm">
                Interdict is a runtime module of SSAP.
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-zinc-200 bg-zinc-50" ref={contactRef as any}>
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Contact us</h2>
          <p className="muted mt-3 max-w-2xl">
            Send us a message. We'll get back to you within 24 hours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Pilot / Enterprise</div>
              <p className="mt-3 text-zinc-600">
                Tell us what you're building and where governance matters most.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <label className="text-sm font-semibold text-zinc-900">
                  Email
                  <input
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    autoComplete="email"
                  />
                </label>
                <label className="text-sm font-semibold text-zinc-900">
                  Company
                  <input
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                    value={cCompany}
                    onChange={(e) => setCCompany(e.target.value)}
                    placeholder="Company name"
                    type="text"
                    autoComplete="organization"
                  />
                </label>
                <label className="text-sm font-semibold text-zinc-900">
                  Message
                  <textarea
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm min-h-[120px]"
                    value={cMsg}
                    onChange={(e) => setCMsg(e.target.value)}
                    placeholder="What are you building? Where does governance matter?"
                  />
                </label>
                <div className="flex items-center gap-3">
                  <button
                    className="btn"
                    type="button"
                    onClick={sendContact}
                    disabled={cStatus === "sending" || cStatus === "sent"}
                  >
                    {cStatus === "sending" ? "Sending..." : cStatus === "sent" ? "Sent" : "Send message"}
                  </button>
                  {cStatus === "error" && cError ? (
                    <span className="text-sm text-red-600">{cError}</span>
                  ) : null}
                  {cStatus === "sent" ? (
                    <span className="text-sm text-green-700">Thanks — we’ll reply soon.</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Contact</div>
              <p className="mt-3 text-zinc-600">
                Prefer email? Reach us at <a className="underline" href="mailto:marko@ssap.io">marko@ssap.io</a>.
              </p>
              <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="text-sm font-semibold text-zinc-900">Download</div>
                <p className="mt-3 text-zinc-600">
                  Get the SSAP one-pager PDF (email gate).
                </p>
                <div className="mt-5">
                  <button className="btn-ghost" type="button" onClick={openPdf}>
                    Download one-pager →
                  </button>
                </div>
              </div>
              <div className="mt-8 muted text-sm">
                SSAP: decision layer for inference governance.<br />
                Interdict: runtime enforcement module.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="muted text-sm">
            © {new Date().getFullYear()} SSAP. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a className="no-underline text-zinc-700 hover:text-zinc-900" href="/privacy">
              Privacy
            </a>
            <a className="no-underline text-zinc-700 hover:text-zinc-900" href="/terms">
              Terms
            </a>
          </div>
        </div>
      </footer>

      {/* PDF MODAL */}
      {pdfOpen ? (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-zinc-900">Download one-pager</div>
                <div className="muted text-sm mt-1">
                  Enter your email to receive the PDF.
                </div>
              </div>
              <button className="btn-ghost" type="button" onClick={closePdf}>
                Close
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <label className="text-sm font-semibold text-zinc-900">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                  value={pdfEmail}
                  onChange={(e) => setPdfEmail(e.target.value)}
                  placeholder="you@company.com"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  className="btn"
                  type="button"
                  onClick={sendPdf}
                  disabled={pdfStatus === "sending" || pdfStatus === "sent"}
                >
                  {pdfStatus === "sending" ? "Sending..." : pdfStatus === "sent" ? "Sent" : "Send me the PDF"}
                </button>
                {pdfStatus === "error" && pdfError ? (
                  <span className="text-sm text-red-600">{pdfError}</span>
                ) : null}
                {pdfStatus === "sent" ? (
                  <span className="text-sm text-green-700">Check your inbox.</span>
                ) : null}
              </div>
              <div className="muted text-xs mt-2">
                We only use your email to send the PDF and follow up about the pilot.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
