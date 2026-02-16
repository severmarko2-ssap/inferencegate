"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const PROBLEMS = [
  { text: "LLMs generate probabilistic outputs." },
  { text: "Enterprise systems require reproducibility and accountability." },
  { text: "Unverified claims introduce operational and regulatory risk." },
  { text: "AI decisions are difficult to explain post-factum." },
];

const PILLARS = [
  {
    title: "Decision Control",
    subtitle: "SSAP Core",
    features: [
      "Formal execution graph (PROBE → FULL → BLOCK)",
      "Bounded escalation (max 1 retry)",
      "Policy-versioned decision paths",
      "Vendor-agnostic model routing",
    ],
  },
  {
    title: "Claim-Level Integrity",
    subtitle: "Enforcement",
    features: [
      "No unverified claims in Required mode",
      "Evidence-bound output structure",
      "Claim-by-claim verification status",
      "Hard blocking on FAIL",
    ],
  },
  {
    title: "Deterministic Audit",
    subtitle: "Replay",
    features: [
      "Decision path logging",
      "Policy snapshotting",
      "Evidence snapshot references",
      "Replayable execution traces",
    ],
  },
];

const ENTERPRISE_CLAIMS = [
  "Deterministic execution layer over LLM systems",
  "No unverified claims in Required mode",
  "Replayable and audit-ready AI decisions",
  "Vendor-agnostic AI governance",
  "Bounded adaptive risk control",
];

const CLAIM_EXAMPLE = `{
  "decision_path": "PROBE_ESCALATED_FULL",
  "claims": [
    {
      "claim_id": "c1",
      "text": "Interest rate is 3.25%",
      "evidence_ref": "DOC_2026_TARIFF_V3#section4",
      "verification_status": "PASS"
    }
  ],
  "policy_version": "FIN_PACK_v1.2",
  "integrity_mode": "REQUIRED"
}`;

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
              <span className="text-xs text-zinc-500">Deterministic AI Governance</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-700">
              <a className="no-underline hover:text-zinc-900" href="#problem">
                Problem
              </a>
              <a className="no-underline hover:text-zinc-900" href="#pillars">
                Governance
              </a>
              <a className="no-underline hover:text-zinc-900" href="#execution">
                Execution
              </a>
              <a className="no-underline hover:text-zinc-900" href="#integrity">
                Integrity
              </a>
              <a className="no-underline hover:text-zinc-900" href="#contact">
                Contact
              </a>
            </nav>
            <a
              href="https://app.ssap.io"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors no-underline"
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
              <span className="pill">Deterministic</span>
              <span className="pill">Governance</span>
              <span className="pill">Audit-ready</span>
              <span className="pill">Vendor-agnostic</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Deterministic Governance
              <br />
              for AI Systems.
            </h1>
            <div className="max-w-2xl text-lg md:text-xl text-zinc-600 space-y-2">
              <p>Control when inference happens.</p>
              <p>Verify every critical claim.</p>
              <p>Replay every decision.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={goToContact} className="btn" type="button">
                Request Governance Brief
              </button>
              <a
                href="#execution"
                className="btn-ghost no-underline"
              >
                View Execution Model
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Decision Control</div>
              <div className="muted">When inference happens</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Claim Integrity</div>
              <div className="muted">What leaves the system</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Audit-Ready</div>
              <div className="muted">Replayable decisions</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-zinc-900 font-semibold">Vendor-Agnostic</div>
              <div className="muted">Works across providers</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            The Problem
          </h2>
          <p className="muted mt-3 max-w-2xl">
            AI systems in enterprise environments face fundamental governance challenges.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROBLEMS.map((problem, index) => (
              <div key={index} className="rounded-xl border border-red-100 bg-red-50/50 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-semibold flex-shrink-0">
                    !
                  </div>
                  <p className="text-zinc-700">{problem.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE GOVERNANCE PILLARS */}
      <section id="pillars" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Three Governance Pillars
          </h2>
          <p className="muted mt-3 max-w-2xl">
            SSAP provides a complete governance framework for AI systems.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-xl border border-zinc-200 bg-white p-6">
                <div className="text-sm font-semibold text-zinc-900">{pillar.title}</div>
                <div className="text-xs text-zinc-500 mt-1">{pillar.subtitle}</div>
                <ul className="mt-4 space-y-2">
                  {pillar.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-zinc-600">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXECUTION GRAPH */}
      <section id="execution" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Execution Graph
          </h2>
          <p className="muted mt-3 max-w-2xl">
            Bounded, deterministic control over every AI decision.
          </p>
          <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-8 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Main Flow */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-lg">
                  <span className="font-mono text-blue-700 font-semibold text-sm">PROBE</span>
                </div>
                <span className="text-zinc-400">→</span>
                <div className="px-4 py-2 bg-purple-100 border border-purple-200 rounded-lg">
                  <span className="font-mono text-purple-700 font-semibold text-sm">LLM_PROBE</span>
                </div>
                <span className="text-zinc-400">→</span>
                <div className="px-4 py-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                  <span className="font-mono text-yellow-700 font-semibold text-sm">INTEGRITY</span>
                </div>
              </div>

              {/* Branch paths */}
              <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="px-3 py-1.5 bg-green-100 border border-green-200 rounded-lg">
                      <span className="font-mono text-green-700 text-xs">PASS</span>
                    </div>
                    <span className="text-zinc-400">→</span>
                    <div className="px-3 py-1.5 bg-green-200 border border-green-300 rounded-lg">
                      <span className="font-mono text-green-800 text-xs font-semibold">RETURN</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">Verified response delivered</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="px-3 py-1.5 bg-red-100 border border-red-200 rounded-lg">
                      <span className="font-mono text-red-700 text-xs">FAIL</span>
                    </div>
                    <span className="text-zinc-400">→</span>
                    <div className="px-3 py-1.5 bg-orange-100 border border-orange-200 rounded-lg">
                      <span className="font-mono text-orange-700 text-xs">ESCALATE</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">Bounded retry initiated</p>
                </div>
              </div>

              {/* Escalation Flow */}
              <div className="pt-6 border-t border-zinc-200">
                <p className="text-center text-zinc-500 text-xs mb-4">Escalation Path (max 1 retry)</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="px-4 py-2 bg-orange-100 border border-orange-200 rounded-lg">
                    <span className="font-mono text-orange-700 font-semibold text-sm">FULL</span>
                  </div>
                  <span className="text-zinc-400">→</span>
                  <div className="px-4 py-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                    <span className="font-mono text-yellow-700 font-semibold text-sm">INTEGRITY</span>
                  </div>
                  <span className="text-zinc-400">→</span>
                  <div className="flex gap-3">
                    <div className="px-3 py-1.5 bg-green-200 border border-green-300 rounded-lg">
                      <span className="font-mono text-green-800 text-xs">PASS → RETURN</span>
                    </div>
                    <div className="px-3 py-1.5 bg-red-200 border border-red-300 rounded-lg">
                      <span className="font-mono text-red-800 text-xs">FAIL → BLOCK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLAIM-LEVEL VERIFICATION */}
      <section id="integrity" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Claim-Level Verification
          </h2>
          <p className="muted mt-3 max-w-2xl">
            Every claim is verified against evidence before leaving the system.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Evidence-Bound Output</div>
                  <p className="mt-1 text-sm text-zinc-600">Each claim is linked to a specific evidence reference with document ID and section.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Verification Status</div>
                  <p className="mt-1 text-sm text-zinc-600">Claim-by-claim verification with PASS/FAIL status. Hard blocking on unverified claims in Required mode.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 text-sm font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Decision Path Tracing</div>
                  <p className="mt-1 text-sm text-zinc-600">Full audit trail with policy version, integrity mode, and execution path for every request.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
              <div className="px-4 py-3 bg-zinc-100 border-b border-zinc-200">
                <span className="text-xs font-semibold text-zinc-500">Structured Output Example</span>
              </div>
              <pre className="p-4 text-xs text-zinc-700 overflow-x-auto">
                <code>{CLAIM_EXAMPLE}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE CLAIMS */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Enterprise-Grade Governance
          </h2>
          <p className="muted mt-3 max-w-2xl">
            Defensible claims backed by deterministic execution.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ENTERPRISE_CLAIMS.map((claim, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-zinc-700">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECONDARY BENEFITS */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-16">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-zinc-500">Secondary Benefits</h3>
            <p className="text-sm text-zinc-400 mt-1">Additional advantages from structured inference control.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-sm font-medium text-zinc-700">Cost Optimization</div>
              <div className="text-xs text-zinc-500 mt-1">Side-effect of structured control</div>
            </div>
            <div className="text-center p-4">
              <div className="text-sm font-medium text-zinc-700">Latency Control</div>
              <div className="text-xs text-zinc-500 mt-1">Bounded escalation paths</div>
            </div>
            <div className="text-center p-4">
              <div className="text-sm font-medium text-zinc-700">Risk Adaptation</div>
              <div className="text-xs text-zinc-500 mt-1">Domain-based thresholding</div>
            </div>
            <div className="text-center p-4">
              <div className="text-sm font-medium text-zinc-700">Model Portability</div>
              <div className="text-xs text-zinc-500 mt-1">Cross-model governance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-zinc-200 bg-white" ref={contactRef as any}>
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Request Governance Brief</h2>
          <p className="muted mt-3 max-w-2xl">
            Tell us about your AI governance requirements. We'll send you a tailored brief within 24 hours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Enterprise Inquiry</div>
              <p className="mt-3 text-zinc-600 text-sm">
                Describe your governance challenges and requirements.
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
                    placeholder="Describe your AI governance requirements..."
                  />
                </label>
                <div className="flex items-center gap-3">
                  <button
                    className="btn"
                    type="button"
                    onClick={sendContact}
                    disabled={cStatus === "sending" || cStatus === "sent"}
                  >
                    {cStatus === "sending" ? "Sending..." : cStatus === "sent" ? "Sent" : "Request Brief"}
                  </button>
                  {cStatus === "error" && cError ? (
                    <span className="text-sm text-red-600">{cError}</span>
                  ) : null}
                  {cStatus === "sent" ? (
                    <span className="text-sm text-green-700">Thanks — we'll reply within 24 hours.</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Direct Contact</div>
              <p className="mt-3 text-zinc-600 text-sm">
                Prefer email? Reach us at <a className="underline" href="mailto:marko@ssap.io">marko@ssap.io</a>.
              </p>
              <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
                <div className="text-sm font-semibold text-zinc-900">Documentation</div>
                <p className="mt-3 text-zinc-600 text-sm">
                  Download the SSAP governance overview (PDF).
                </p>
                <div className="mt-5">
                  <button className="btn-ghost" type="button" onClick={openPdf}>
                    Download PDF →
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="https://app.ssap.io"
                  className="btn no-underline inline-flex"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">
            SSAP — Deterministic Infrastructure for AI Systems
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
                <div className="text-lg font-semibold text-zinc-900">Download Governance Brief</div>
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
                We only use your email to send the PDF and follow up about governance requirements.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
