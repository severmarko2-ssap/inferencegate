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
  const [cSubmitting, setCSubmitting] = useState(false);
  const [cErr, setCErr] = useState<string | null>(null);
  const [cOk, setCOk] = useState<string | null>(null);
  const [hp, setHp] = useState(""); // honeypot

  const contactEmailRef = useRef<HTMLInputElement | null>(null);

  const contactEmailOk = useMemo(() => isValidEmail(cEmail), [cEmail]);
  const contactCompanyOk = useMemo(
    () => cCompany.trim().length >= 2,
    [cCompany]
  );
  const contactMsgOk = useMemo(() => cMsg.trim().length >= 10, [cMsg]);

  const contactFormOk = useMemo(
    () => contactEmailOk && contactCompanyOk && contactMsgOk,
    [contactEmailOk, contactCompanyOk, contactMsgOk]
  );

  const goToContact = useCallback(() => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => contactEmailRef.current?.focus(), 250);
    }
  }, []);

  // JSON-LD (SEO)
  const jsonLd = useMemo(() => {
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SSAP",
      url: "https://ssap.io",
      email: "marko@ssap.io",
    };

    const app = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "SSAP InferenceGate",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      url: "https://ssap.io",
      description:
        "SSAP is a decision layer for AI systems. It decides before every inference call — run, block, or escalate. EU AI Act compliant.",
      publisher: {
        "@type": "Organization",
        name: "SSAP",
        url: "https://ssap.io",
      },
    };

    return JSON.stringify([org, app]);
  }, []);

  const submitContact = useCallback(async () => {
    setCErr(null);
    setCOk(null);

    if (hp.trim().length > 0) {
      setCOk("Thanks — message sent.");
      return;
    }

    if (!contactFormOk) {
      setCErr("Please fill all required fields correctly.");
      return;
    }

    setCSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cEmail.trim(),
          company: cCompany.trim(),
          message: cMsg.trim(),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Message failed to send");
      }

      setCOk("Message sent. We'll reply by email.");
      setCEmail("");
      setCCompany("");
      setCMsg("");
      setHp("");
    } catch (e: any) {
      setCErr(e?.message || "Message failed to send.");
    } finally {
      setCSubmitting(false);
    }
  }, [hp, contactFormOk, cEmail, cCompany, cMsg]);

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* NAV */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/ssap-logo.png"
              alt="SS/AP"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-zinc-900">
                SSAP
              </div>
              <div className="text-xs text-zinc-600">InferenceGate</div>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#problem" className="hidden md:inline no-underline hover:underline">
              Problem
            </a>
            <a href="#architecture" className="hidden md:inline no-underline hover:underline">
              Architecture
            </a>
            <a href="#decisions" className="hidden md:inline no-underline hover:underline">
              Decisions
            </a>
            <a href="#eu-ai-act" className="hidden md:inline no-underline hover:underline">
              EU AI Act
            </a>
            <a href="#contact" className="hidden md:inline no-underline hover:underline">
              Contact
            </a>

            <a
              href="https://app.ssap.io"
              className="btn no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dashboard
            </a>
          </nav>
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
              Inference is not default.<br />
              Inference is permission.
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-zinc-600">
              SSAP is a decision layer that decides <strong>before</strong> every AI call.
              Run, block, escalate — with full audit trail and EU AI Act compliance.
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
              <div className="font-semibold text-zinc-900">Ex-ante decisions</div>
              <div className="text-zinc-600">Before every AI call</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-zinc-900">4 Decision paths</div>
              <div className="text-zinc-600">FULL, NO_INFERENCE, ESCALATE, DEGRADED</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-zinc-900">EU AI Act</div>
              <div className="text-zinc-600">Risk classification & Article 12</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-zinc-900">Audit trail</div>
              <div className="text-zinc-600">Every decision logged</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
                Problem
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                Traditional AI systems call models without control
              </h2>
              <p className="muted mt-4 text-lg">
                No control over risk, value, or regulatory implications.
                Every request automatically triggers inference — expensive, risky, non-compliant.
              </p>
            </div>

            <div className="card bg-zinc-50">
              <div className="font-semibold text-lg mb-4">SSAP solution</div>
              <p className="text-zinc-700">
                SSAP introduces a <strong>decision before inference</strong>. Every request passes
                through a decision layer that classifies risk, checks policy, and determines
                whether AI should even run.
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-200">
                <div className="text-sm text-zinc-600">
                  "Managing AI systems as decision systems, not as uncontrolled model calls."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE IDEA */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Core idea
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Four principles of SSAP
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="card">
              <div className="text-3xl font-bold text-zinc-300 mb-3">01</div>
              <div className="font-semibold">Inference is not default</div>
              <div className="muted mt-2 text-sm">
                AI calls are permissions, not automatisms. Must be explicitly approved.
              </div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-zinc-300 mb-3">02</div>
              <div className="font-semibold">Ex-ante decision</div>
              <div className="muted mt-2 text-sm">
                Decision is made before every AI call, not after.
              </div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-zinc-300 mb-3">03</div>
              <div className="font-semibold">NO_INFERENCE is valid</div>
              <div className="muted mt-2 text-sm">
                Blocking inference is a legitimate outcome, not an error.
              </div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-zinc-300 mb-3">04</div>
              <div className="font-semibold">Governance in runtime</div>
              <div className="muted mt-2 text-sm">
                Audit and compliance built into every call, not retroactively.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Runtime architecture
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Four system layers
          </h2>
          <p className="muted mt-3 max-w-3xl">
            SSAP sits between your backend and AI models. Every request passes through the decision layer.
          </p>

          <div className="mt-8">
            <div className="card overflow-hidden">
              <div className="border-b border-zinc-200 bg-white p-6">
                <svg
                  viewBox="0 0 900 200"
                  className="w-full h-auto"
                  role="img"
                  aria-label="SSAP Architecture Diagram"
                >
                  {/* Layer boxes */}
                  <rect x="20" y="20" width="200" height="160" rx="16" fill="#fafafa" stroke="#e4e4e7" strokeWidth="2" />
                  <rect x="240" y="20" width="200" height="160" rx="16" fill="#fafafa" stroke="#e4e4e7" strokeWidth="2" />
                  <rect x="460" y="20" width="200" height="160" rx="16" fill="#18181b" stroke="#18181b" strokeWidth="2" />
                  <rect x="680" y="20" width="200" height="160" rx="16" fill="#fafafa" stroke="#e4e4e7" strokeWidth="2" />

                  {/* Layer labels */}
                  <text x="120" y="60" textAnchor="middle" fontSize="16" fontWeight="600" fill="#18181b">UI</text>
                  <text x="120" y="85" textAnchor="middle" fontSize="12" fill="#71717a">Transparency</text>
                  <text x="120" y="105" textAnchor="middle" fontSize="12" fill="#71717a">Feedback</text>

                  <text x="340" y="60" textAnchor="middle" fontSize="16" fontWeight="600" fill="#18181b">Backend</text>
                  <text x="340" y="85" textAnchor="middle" fontSize="12" fill="#71717a">Enforcement</text>
                  <text x="340" y="105" textAnchor="middle" fontSize="12" fill="#71717a">Fallback</text>

                  <text x="560" y="60" textAnchor="middle" fontSize="16" fontWeight="700" fill="#ffffff">SSAP</text>
                  <text x="560" y="85" textAnchor="middle" fontSize="12" fill="#a1a1aa">Risk</text>
                  <text x="560" y="105" textAnchor="middle" fontSize="12" fill="#a1a1aa">Policy</text>
                  <text x="560" y="125" textAnchor="middle" fontSize="12" fill="#a1a1aa">Decision</text>
                  <text x="560" y="145" textAnchor="middle" fontSize="12" fill="#a1a1aa">Audit</text>

                  <text x="780" y="60" textAnchor="middle" fontSize="16" fontWeight="600" fill="#18181b">AI Models</text>
                  <text x="780" y="85" textAnchor="middle" fontSize="12" fill="#71717a">Only with FULL</text>
                  <text x="780" y="105" textAnchor="middle" fontSize="12" fill="#71717a">decision</text>

                  {/* Arrows */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#71717a" />
                    </marker>
                  </defs>
                  <line x1="220" y1="100" x2="235" y2="100" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <line x1="440" y1="100" x2="455" y2="100" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <line x1="660" y1="100" x2="675" y2="100" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>
              </div>

              <div className="p-6 bg-zinc-50">
                <div className="text-sm text-zinc-600">
                  AI models are called <strong>only</strong> when SSAP decision layer returns a FULL decision.
                  All other decisions (NO_INFERENCE, ESCALATE, DEGRADED) block or redirect the request.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DECISION FLOW */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            End-to-end flow
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How a request flows through the system
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">1</div>
                <div className="font-semibold">Request</div>
              </div>
              <div className="muted text-sm">
                Request arrives at backend from user interface.
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">2</div>
                <div className="font-semibold">Classification</div>
              </div>
              <div className="muted text-sm">
                SSAP classifies risk and checks policy.
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">3</div>
                <div className="font-semibold">Decision path</div>
              </div>
              <div className="muted text-sm">
                Determines decision_path: FULL, NO_INFERENCE, ESCALATE, or DEGRADED.
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">4</div>
                <div className="font-semibold">Execution</div>
              </div>
              <div className="muted text-sm">
                Backend executes or blocks inference based on decision.
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">5</div>
                <div className="font-semibold">UI Status</div>
              </div>
              <div className="muted text-sm">
                User interface displays decision status.
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">6</div>
                <div className="font-semibold">Audit</div>
              </div>
              <div className="muted text-sm">
                Every decision is logged to audit trail.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DECISION PATHS */}
      <section id="decisions" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Decision paths
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Four possible decisions
          </h2>
          <p className="muted mt-3 max-w-3xl">
            Every request results in one of four explicit decisions. No implicit execution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="card border-green-200 bg-green-50/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold text-green-900">FULL</div>
                  <div className="text-green-700 mt-1">Inference allowed</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  Execute
                </span>
              </div>
              <div className="mt-4 text-sm text-green-800">
                Request passed all checks. AI model is called and result is returned to user.
              </div>
            </div>

            <div className="card border-red-200 bg-red-50/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold text-red-900">NO_INFERENCE</div>
                  <div className="text-red-700 mt-1">Inference blocked</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                  Block
                </span>
              </div>
              <div className="mt-4 text-sm text-red-800">
                Request blocked by policy. AI model is not called. Predefined message returned.
              </div>
            </div>

            <div className="card border-amber-200 bg-amber-50/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold text-amber-900">ESCALATE</div>
                  <div className="text-amber-700 mt-1">Human-in-the-loop</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  Review
                </span>
              </div>
              <div className="mt-4 text-sm text-amber-800">
                Request requires human review. Forwarded to operator before execution.
              </div>
            </div>

            <div className="card border-zinc-300 bg-zinc-100/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold text-zinc-900">DEGRADED</div>
                  <div className="text-zinc-700 mt-1">Safe fallback</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-800">
                  Fallback
                </span>
              </div>
              <div className="mt-4 text-sm text-zinc-700">
                Returns limited or predefined response without full AI inference.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EU AI ACT */}
      <section id="eu-ai-act" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Compliance
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            EU AI Act integration
          </h2>
          <p className="muted mt-3 max-w-3xl">
            SSAP is designed with EU AI Act compliance from the ground up. Risk classification, audit trail, and human oversight built into every call.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card">
              <div className="font-semibold text-lg mb-4">Risk Classification</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm"><strong>LOW</strong> — Minimal requirements</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm"><strong>LIMITED</strong> — Transparency obligations</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-sm"><strong>HIGH</strong> — Full compliance requirements</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm"><strong>UNACCEPTABLE</strong> — Prohibited</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="font-semibold text-lg mb-4">Key features</div>
              <ul className="space-y-3 text-sm text-zinc-700">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span><strong>Annex III mapping</strong> — Automatic domain mapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span><strong>Article 12 audit trail</strong> — Every decision logged</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span><strong>Human escalation</strong> — Mandatory human review for high-risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span><strong>Kill-switch</strong> — Instant shutdown capability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* UI TRANSPARENCY */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Transparency
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            UI for three user levels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <div className="font-semibold text-lg mb-2">End-user</div>
              <div className="text-sm text-zinc-600 mb-4">Final user</div>
              <ul className="space-y-2 text-sm text-zinc-700">
                <li>• AI-assisted labels on responses</li>
                <li>• Clear indication when AI was not used</li>
                <li>• Feedback options</li>
              </ul>
            </div>

            <div className="card">
              <div className="font-semibold text-lg mb-2">Operator</div>
              <div className="text-sm text-zinc-600 mb-4">Operations team</div>
              <ul className="space-y-2 text-sm text-zinc-700">
                <li>• Decision details panel</li>
                <li>• Real-time monitoring</li>
                <li>• Escalation queue</li>
              </ul>
            </div>

            <div className="card">
              <div className="font-semibold text-lg mb-2">Admin</div>
              <div className="text-sm text-zinc-600 mb-4">Compliance team</div>
              <ul className="space-y-2 text-sm text-zinc-700">
                <li>• Compliance dashboard</li>
                <li>• Audit export (CSV, JSON)</li>
                <li>• Policy management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BACKEND & OPERATIONS */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Operations
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Backend and infrastructure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="card">
              <div className="font-semibold">Middleware enforcement</div>
              <div className="muted mt-2 text-sm">
                SSAP integrates as middleware into your existing backend stack.
              </div>
            </div>
            <div className="card">
              <div className="font-semibold">Policy-as-code</div>
              <div className="muted mt-2 text-sm">
                All policies versioned in Git. Audit trail of changes.
              </div>
            </div>
            <div className="card">
              <div className="font-semibold">Tenant controls</div>
              <div className="muted mt-2 text-sm">
                Multi-tenant support with policy and data isolation.
              </div>
            </div>
            <div className="card">
              <div className="font-semibold">Budget and latency guards</div>
              <div className="muted mt-2 text-sm">
                Automatic protection against cost and latency overruns.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLLOUT STRATEGY */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Implementation
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Rollout strategy
          </h2>
          <p className="muted mt-3 max-w-3xl">
            Gradual implementation in 4 phases enables safe transition without disruption.
          </p>

          <div className="mt-8">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-0 right-0 top-6 h-0.5 bg-zinc-200"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-semibold z-10">1</div>
                    <div className="font-semibold">Shadow mode</div>
                  </div>
                  <div className="text-sm text-zinc-600">
                    SSAP observes and logs decisions without enforcement. Baseline analysis.
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-semibold z-10">2</div>
                    <div className="font-semibold">Low-risk NO_INFERENCE</div>
                  </div>
                  <div className="text-sm text-zinc-600">
                    Activate blocking for low-risk scenarios. Policy validation.
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-semibold z-10">3</div>
                    <div className="font-semibold">High-risk ESCALATE</div>
                  </div>
                  <div className="text-sm text-zinc-600">
                    Activate escalation for high-risk requests. Human review process.
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-semibold z-10">4</div>
                    <div className="font-semibold">Full enforcement</div>
                  </div>
                  <div className="text-sm text-zinc-600">
                    Full activation of all policies. Production mode.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-4">
            Value
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Why SSAP
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card">
              <div className="text-4xl font-bold text-zinc-300 mb-4">01</div>
              <div className="font-semibold text-xl">Regulatory safety</div>
              <div className="muted mt-2">
                EU AI Act compliance built from the ground up. Risk classification, audit trail, human oversight.
              </div>
            </div>

            <div className="card">
              <div className="text-4xl font-bold text-zinc-300 mb-4">02</div>
              <div className="font-semibold text-xl">Cost and latency control</div>
              <div className="muted mt-2">
                Automatic budget guards and latency controls. Inference only when needed.
              </div>
            </div>

            <div className="card">
              <div className="text-4xl font-bold text-zinc-300 mb-4">03</div>
              <div className="font-semibold text-xl">Provable accountability</div>
              <div className="muted mt-2">
                Every decision logged with full context. Audit export for regulators.
              </div>
            </div>

            <div className="card">
              <div className="text-4xl font-bold text-zinc-300 mb-4">04</div>
              <div className="font-semibold text-xl">Model-agnostic</div>
              <div className="muted mt-2">
                Future-proof layer. Switch models without changing governance logic.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-16">
          <div className="card bg-zinc-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-2xl font-semibold tracking-tight">
                Ready for AI governance?
              </div>
              <div className="mt-2 text-zinc-400">
                Manage AI systems as decision systems.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://app.ssap.io"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white bg-white text-zinc-900 hover:bg-zinc-100 transition-colors no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Dashboard
              </a>
              <button
                onClick={goToContact}
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-zinc-700 bg-transparent text-white hover:border-white transition-colors"
                type="button"
              >
                Contact us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Contact us
          </h2>
          <p className="muted mt-3 max-w-2xl">
            Send us a message. We'll get back to you within 24 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="card">
              <div className="text-sm font-semibold">Contact</div>
              <div className="muted mt-2 text-sm">Or email us directly:</div>
              <a
                href="mailto:marko@ssap.io"
                className="mt-2 inline-block"
              >
                marko@ssap.io
              </a>

              <div className="mt-6 text-sm font-semibold">
                What we can discuss
              </div>
              <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                <li>• Integrating SSAP into your system</li>
                <li>• EU AI Act compliance requirements</li>
                <li>• Custom policy configuration</li>
                <li>• Pricing and deployment options</li>
              </ul>
            </div>

            <div className="card" suppressHydrationWarning>
              {/* honeypot */}
              <div className="hidden">
                <label>
                  Do not fill
                  <input
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    suppressHydrationWarning
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-semibold">Email *</label>
                  <input
                    ref={contactEmailRef}
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                    autoComplete="email"
                    inputMode="email"
                    suppressHydrationWarning
                  />
                  {!contactEmailOk && cEmail.trim().length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      Please enter a valid email address.
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">Company *</label>
                  <input
                    value={cCompany}
                    onChange={(e) => setCCompany(e.target.value)}
                    placeholder="Company name"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                    autoComplete="organization"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Message *</label>
                  <textarea
                    value={cMsg}
                    onChange={(e) => setCMsg(e.target.value)}
                    placeholder="Describe your use case and what you're interested in..."
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                    suppressHydrationWarning
                  />
                  {!contactMsgOk && cMsg.trim().length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      Message must be at least 10 characters.
                    </div>
                  )}
                </div>

                {cErr && <div className="text-sm text-red-600">{cErr}</div>}
                {cOk && <div className="text-sm text-green-700">{cOk}</div>}

                <div className="flex items-center justify-between gap-4">
                  <div className="muted text-xs">
                    We only use your email to reply.
                  </div>
                  <button
                    suppressHydrationWarning
                    onClick={submitContact}
                    disabled={!contactFormOk || cSubmitting}
                    className={[
                      "btn",
                      !contactFormOk || cSubmitting
                        ? "opacity-60 cursor-not-allowed"
                        : "",
                    ].join(" ")}
                  >
                    {cSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container py-10 flex flex-col md:flex-row justify-between gap-4 text-sm text-zinc-600">
          <div>
            <div>© {new Date().getFullYear()} ssap.io</div>
            <div className="mt-1 text-xs text-zinc-500">
              Decision layer for AI systems. EU AI Act compliant.
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="mailto:marko@ssap.io">marko@ssap.io</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
