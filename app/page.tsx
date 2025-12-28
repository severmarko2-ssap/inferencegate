"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PILOT_MAIL =
  "mailto:marko@ssap.io?subject=SSAP%20Pilot%20Application&body=Hi%20Marko%2C%0A%0AWe%27d%20like%20to%20apply%20for%20an%20SSAP%20pilot.%0A%0ACompany%3A%0AUse%20case%3A%0AEndpoints%2Ftraffic%3A%0AProvider%2Fmodels%3A%0ACurrent%20LLM%20spend%3A%0ASuccess%20metric%3A%0A%0AThanks%21";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidMonthlySpend(v: string) {
  const s = v.trim();
  if (!s) return false;
  if (s.length > 40) return false;
  return /\d/.test(s);
}

export default function Home() {
  // PDF modal state
  const [pdfOpen, setPdfOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Contact form state
  const [cEmail, setCEmail] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cSpend, setCSpend] = useState("");
  const [cMsg, setCMsg] = useState("");
  const [cSubmitting, setCSubmitting] = useState(false);
  const [cErr, setCErr] = useState<string | null>(null);
  const [cOk, setCOk] = useState<string | null>(null);
  const [hp, setHp] = useState(""); // honeypot

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Contact email ref (for "Apply for pilot" → scroll + focus)
  const contactEmailRef = useRef<HTMLInputElement | null>(null);

  const emailOk = useMemo(() => isValidEmail(email), [email]);

  const contactEmailOk = useMemo(() => isValidEmail(cEmail), [cEmail]);
  const contactCompanyOk = useMemo(
    () => cCompany.trim().length >= 2,
    [cCompany]
  );
  const contactSpendOk = useMemo(() => isValidMonthlySpend(cSpend), [cSpend]);
  const contactMsgOk = useMemo(() => cMsg.trim().length >= 10, [cMsg]);

  const contactFormOk = useMemo(
    () => contactEmailOk && contactCompanyOk && contactSpendOk && contactMsgOk,
    [contactEmailOk, contactCompanyOk, contactSpendOk, contactMsgOk]
  );

  const openPdf = useCallback(() => setPdfOpen(true), []);
  const closePdf = useCallback(() => setPdfOpen(false), []);

  const goToContact = useCallback(() => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => contactEmailRef.current?.focus(), 250);
    }
  }, []);

  // JSON-LD (SEO / Trust) — SSAP as platform decision system
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
      name: "SSAP Decision System",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      url: "https://ssap.io",
      description:
        "SSAP is a decision system for modern AI: it decides when AI should act, when to try cheaply, and when not to act at all. Built for governance: no raw prompts or completions stored by default.",
      publisher: {
        "@type": "Organization",
        name: "SSAP",
        url: "https://ssap.io",
      },
    };

    return JSON.stringify([org, app]);
  }, []);

  // ESC closes modal + remember/restore focus
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePdf();
    }
    if (pdfOpen) {
      lastFocusRef.current = document.activeElement as HTMLElement | null;
      window.addEventListener("keydown", onKeyDown);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pdfOpen, closePdf]);

  // Lock background scroll while modal open
  useEffect(() => {
    if (!pdfOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      lastFocusRef.current?.focus?.();
    };
  }, [pdfOpen]);

  const downloadPdf = useCallback(async () => {
    setErr(null);

    if (!emailOk) {
      setErr("Please enter a valid email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pilot-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "SSAP-Technical-Overview.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      closePdf();
      setEmail("");
    } catch (e: any) {
      setErr(e?.message || "Download failed.");
    } finally {
      setSubmitting(false);
    }
  }, [closePdf, email, emailOk]);

  const submitContact = useCallback(async () => {
    setCErr(null);
    setCOk(null);

    if (hp.trim().length > 0) {
      // bots fill hidden field; pretend success
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
          spend: cSpend.trim(),
          message: cMsg.trim(),
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Message failed to send");
      }

      setCOk("Message sent. We’ll reply by email.");
      setCEmail("");
      setCCompany("");
      setCSpend("");
      setCMsg("");
      setHp("");
    } catch (e: any) {
      setCErr(e?.message || "Message failed to send.");
    } finally {
      setCSubmitting(false);
    }
  }, [hp, contactFormOk, cEmail, cCompany, cSpend, cMsg]);

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* NAV */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          {/* FULL BRAND LOCKUP */}
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
              <div className="text-xs text-zinc-600">Decision system</div>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#ways" className="hidden md:inline">
              Ways to use
            </a>
            <a href="#how" className="hidden md:inline">
              How it works
            </a>
            <a href="#faq" className="hidden md:inline">
              FAQ
            </a>
            <a href="#contact" className="hidden md:inline">
              Contact
            </a>

            <button
              suppressHydrationWarning
              onClick={openPdf}
              className="hidden md:inline underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
            >
              Download technical overview
            </button>

            <button onClick={goToContact} className="btn" type="button">
              Apply for pilot
            </button>
          </nav>
        </div>
      </header>

      {/* HERO (no technicallities) */}
      <section className="bg-white">
        <div className="container py-20 md:py-28">
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap gap-2">
              <span className="pill">Decision paths</span>
              <span className="pill">Governance</span>
              <span className="pill">Latency control</span>
              <span className="pill">Quality monitoring</span>
              <span className="pill">Cost stability</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              A decision system for modern AI.
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-zinc-600">
              Decides when AI should act, when to try cheaply, and when not to
              act at all.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={goToContact} className="btn" type="button">
                Apply for pilot
              </button>
              <button
                suppressHydrationWarning
                onClick={openPdf}
                className="btn-ghost"
                type="button"
              >
                Download technical overview
              </button>
            </div>

            <div className="muted text-sm">
              Built for governance: no raw prompts or completions stored by
              default.{" "}
              <a
                href={PILOT_MAIL}
                className="underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
              >
                Or email a pilot request
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WAYS TO USE SSAP */}
      <section id="ways" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Ways to use SSAP
          </h2>
          <p className="muted mt-3 max-w-3xl">
            InferenceGate and SupportGate are concrete decision surfaces — not
            separate products. Same SSAP underneath, different inputs and
            constraints.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* InferenceGate */}
            <div className="card" id="inferencegate">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Use case
                  </div>
                  <h3 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.05] text-zinc-900">
                    InferenceGate
                  </h3>
                  <div className="mt-2 text-base md:text-lg text-zinc-600">
                    Decision control for AI inference
                  </div>
                </div>

                <span className="mt-1 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                  Production
                </span>
              </div>

              <ul className="mt-6 space-y-2.5 text-sm text-zinc-700">
                <li>• Controls when full inference is justified</li>
                <li>• Prevents unnecessary or risky AI execution</li>
                <li>• Stabilizes cost, latency, and behavior</li>
              </ul>

              <div className="mt-7">
                <a
                  href="#how"
                  className="inline-block underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
                >
                  Learn more →
                </a>
              </div>
            </div>

            {/* SupportGate */}
            <div className="card" id="supportgate">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Use case
                  </div>
                  <h3 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.05] text-zinc-900">
                    SupportGate
                  </h3>
                  <div className="mt-2 text-base md:text-lg text-zinc-600">
                    Decision layer for AI-powered support
                  </div>
                </div>

                <span className="mt-1 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                  Support
                </span>
              </div>

              <ul className="mt-6 space-y-2.5 text-sm text-zinc-700">
                <li>• Decides which tickets need full AI</li>
                <li>• Reduces AI usage without changing UX</li>
                <li>• Designed for production support flows</li>
              </ul>

              <div className="mt-7">
                <a
                  href="#how"
                  className="inline-block underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How SSAP works (high-level)
          </h2>

          <p className="muted mt-3 max-w-3xl">
            SSAP is a decision architecture: it makes an explicit call about
            execution — when AI should act, when a cheap attempt is enough, and
            when no action is the correct outcome.
          </p>

          {/* ARCH DIAGRAM */}
          <div className="mt-8">
            <div className="card overflow-hidden">
              <div className="flex items-start justify-between gap-6 p-6">
                <div>
                  <div className="text-sm font-semibold">Where SSAP fits</div>
                  <div className="muted mt-2 text-sm max-w-xl">
                    SSAP sits above execution. InferenceGate / SupportGate are
                    two common surfaces, but the decision system is the same:
                    policy → decision → outcome.
                  </div>
                </div>
                <div className="hidden md:block text-xs text-zinc-500">
                  High-level view
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-white p-6">
                <svg
                  viewBox="0 0 1200 260"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Clients to SSAP to execution, with telemetry and optional shadow QA"
                >
                  {/* Boxes */}
                  <rect
                    x="40"
                    y="70"
                    width="260"
                    height="90"
                    rx="18"
                    fill="white"
                    stroke="currentColor"
                    opacity="0.18"
                  />
                  <rect
                    x="470"
                    y="55"
                    width="320"
                    height="120"
                    rx="22"
                    fill="white"
                    stroke="currentColor"
                    opacity="0.24"
                  />
                  <rect
                    x="930"
                    y="70"
                    width="230"
                    height="90"
                    rx="18"
                    fill="white"
                    stroke="currentColor"
                    opacity="0.18"
                  />

                  {/* Labels */}
                  <text
                    x="170"
                    y="105"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="600"
                    fill="currentColor"
                  >
                    Your App / Clients
                  </text>
                  <text
                    x="170"
                    y="135"
                    textAnchor="middle"
                    fontSize="16"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    Same API contract
                  </text>

                  <text
                    x="630"
                    y="95"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="700"
                    fill="currentColor"
                  >
                    SSAP
                  </text>
                  <text
                    x="630"
                    y="125"
                    textAnchor="middle"
                    fontSize="16"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    Decide → Try cheap → Or don’t act
                  </text>
                  <text
                    x="630"
                    y="148"
                    textAnchor="middle"
                    fontSize="15"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    NO_ACTION / LIGHT / FULL
                  </text>

                  <text
                    x="1045"
                    y="105"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="600"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    Execution
                  </text>
                  <text
                    x="1045"
                    y="135"
                    textAnchor="middle"
                    fontSize="16"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    LLMs / tools / flows
                  </text>

                  {/* Arrows */}
                  <defs>
                    <marker
                      id="arrow"
                      viewBox="0 0 10 10"
                      refX="10"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path
                        d="M0 0 L10 5 L0 10 Z"
                        fill="currentColor"
                        opacity="0.45"
                      />
                    </marker>
                  </defs>

                  <line
                    x1="300"
                    y1="115"
                    x2="470"
                    y2="115"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.30"
                    strokeLinecap="round"
                    markerEnd="url(#arrow)"
                  />
                  <line
                    x1="790"
                    y1="115"
                    x2="930"
                    y2="115"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.30"
                    strokeLinecap="round"
                    markerEnd="url(#arrow)"
                  />

                  {/* Telemetry line down */}
                  <line
                    x1="630"
                    y1="175"
                    x2="630"
                    y2="202"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.22"
                    strokeLinecap="round"
                    markerEnd="url(#arrow)"
                  />
                  <rect
                    x="470"
                    y="210"
                    width="320"
                    height="40"
                    rx="14"
                    fill="white"
                    stroke="currentColor"
                    opacity="0.18"
                  />
                  <text
                    x="630"
                    y="236"
                    textAnchor="middle"
                    fontSize="15"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    Telemetry & governance (no raw prompts)
                  </text>

                  {/* Shadow QA (optional) */}
                  <line
                    x1="790"
                    y1="115"
                    x2="820"
                    y2="30"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    opacity="0.18"
                    strokeLinecap="round"
                    markerEnd="url(#arrow)"
                  />
                  <rect
                    x="820"
                    y="10"
                    width="360"
                    height="40"
                    rx="14"
                    fill="white"
                    stroke="currentColor"
                    opacity="0.14"
                  />
                  <text
                    x="1000"
                    y="36"
                    textAnchor="middle"
                    fontSize="14"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    Optional: Shadow QA (quality evidence)
                  </text>
                </svg>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-zinc-700">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">NO_ACTION</div>
                    <div className="muted mt-1 text-xs">
                      Don’t run AI. Return deterministic output.
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">LIGHT</div>
                    <div className="muted mt-1 text-xs">
                      Try cheaply first (bounded risk).
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">FULL</div>
                    <div className="muted mt-1 text-xs">
                      Escalate only when justified.
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">Governance</div>
                    <div className="muted mt-1 text-xs">
                      Structured telemetry you can audit.
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  <span className="font-semibold">Web vs PDF:</span>{" "}
                  <span className="text-zinc-600">
                    This page explains what SSAP decides. The PDF explains how
                    it decides (SS → AP), decision paths, telemetry, and
                    deployment.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEPS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <div className="text-xs text-zinc-500">Decision 1</div>
              <div className="mt-2 font-semibold">Should AI act at all?</div>
              <div className="muted mt-2 text-sm">
                Policy allows NO_ACTION as a first-class outcome.
              </div>
            </div>
            <div className="card">
              <div className="text-xs text-zinc-500">Decision 2</div>
              <div className="mt-2 font-semibold">Can we try cheaply first?</div>
              <div className="muted mt-2 text-sm">
                LIGHT attempts are bounded and auditable.
              </div>
            </div>
            <div className="card">
              <div className="text-xs text-zinc-500">Decision 3</div>
              <div className="mt-2 font-semibold">When is FULL justified?</div>
              <div className="muted mt-2 text-sm">
                Escalate only when policy and confidence demand it.
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              suppressHydrationWarning
              onClick={openPdf}
              className="btn-ghost"
              type="button"
            >
              Download technical overview
            </button>
            <div className="muted mt-2 text-sm">
              The PDF covers SS → AP, decision paths, telemetry, and deployment.
            </div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS AFTER YOU APPLY */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            What happens after you apply
          </h2>

          <p className="muted mt-3 max-w-3xl">
            A short fit check, a scoped pilot, then a clear go / no-go decision
            backed by telemetry. Pricing is shared after we confirm pilot fit and
            success metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <div className="text-xs text-zinc-500">Step 1</div>
              <div className="mt-2 font-semibold">15-minute fit check</div>
              <div className="muted mt-2 text-sm">
                Confirm your surface (InferenceGate / SupportGate), traffic,
                constraints, and success criteria.
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-zinc-500">Step 2</div>
              <div className="mt-2 font-semibold">Pilot setup</div>
              <div className="muted mt-2 text-sm">
                Drop-in decision layer with deterministic decision paths and
                telemetry. Minimal disruption.
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-zinc-500">Step 3</div>
              <div className="mt-2 font-semibold">KPI report + decision</div>
              <div className="muted mt-2 text-sm">
                You get a report (outcomes, latency, quality signals, governance).
                Then you decide if rollout makes sense.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={goToContact} className="btn" type="button">
              Apply for pilot
            </button>
            <button
              suppressHydrationWarning
              onClick={openPdf}
              className="btn-ghost"
              type="button"
            >
              Download technical overview
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-16">
          <div className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-xl font-semibold tracking-tight">
                Make AI execution an explicit decision
              </div>
              <div className="muted mt-2">
                Govern when AI acts, when it tries cheaply, and when it shouldn’t
                act at all.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                suppressHydrationWarning
                onClick={openPdf}
                className="btn-ghost"
                type="button"
              >
                Download technical overview
              </button>
              <button onClick={goToContact} className="btn" type="button">
                Apply for pilot
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Send a message
          </h2>
          <p className="muted mt-3 max-w-2xl">
            Send a direct note. Please include your email, company, and your
            approximate monthly AI/LLM spend so we can respond with the right
            pilot path.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="card">
              <div className="text-sm font-semibold">Contact details</div>
              <div className="muted mt-2 text-sm">Or email directly:</div>
              <a
                href="mailto:marko@ssap.io"
                className="mt-2 inline-block underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
              >
                marko@ssap.io
              </a>

              <div className="mt-6 text-sm font-semibold">
                What we reply with
              </div>
              <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                <li>• Suggested pilot surface (InferenceGate / SupportGate)</li>
                <li>• Governance + compliance considerations</li>
                <li>• Latency + quality impact expectations</li>
                <li>• Integration notes (drop-in)</li>
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
                      Please enter a valid email.
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
                  <label className="text-sm font-semibold">
                    Approx. monthly AI/LLM spend *
                  </label>
                  <input
                    value={cSpend}
                    onChange={(e) => setCSpend(e.target.value)}
                    placeholder="e.g. $5k/mo, €20k/mo, 10–20k USD"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                    suppressHydrationWarning
                  />
                  {!contactSpendOk && cSpend.trim().length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      Please enter an approximate number (e.g. 5k/mo).
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">Message *</label>
                  <textarea
                    value={cMsg}
                    onChange={(e) => setCMsg(e.target.value)}
                    placeholder="What are you building? Which surface (InferenceGate / SupportGate) is most relevant? What matters most: governance, latency, quality, cost stability?"
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                    suppressHydrationWarning
                  />
                  {!contactMsgOk && cMsg.trim().length > 0 && (
                    <div className="mt-2 text-xs text-red-600">
                      Please write at least 10 characters.
                    </div>
                  )}
                </div>

                {cErr && <div className="text-sm text-red-600">{cErr}</div>}
                {cOk && <div className="text-sm text-green-700">{cOk}</div>}

                <div className="flex items-center justify-between gap-4">
                  <div className="muted text-xs">
                    We’ll use your email only to reply.
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
                    {cSubmitting ? "Sending…" : "Send message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            FAQ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="card">
              <div className="font-semibold">What does SSAP decide?</div>
              <p className="muted mt-2 text-sm">
                It decides whether AI should act, whether to try a cheap path
                first, or whether no action is the correct outcome.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">
                Are InferenceGate and SupportGate separate products?
              </div>
              <p className="muted mt-2 text-sm">
                No — they’re two common decision surfaces. Same SSAP underneath,
                different inputs and constraints.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">Is any prompt content stored?</div>
              <p className="muted mt-2 text-sm">
                No raw prompts or completions by default. Telemetry is structured
                and audit-friendly.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">What is NO_ACTION?</div>
              <p className="muted mt-2 text-sm">
                A first-class outcome: the decision system returns a deterministic
                response shape without invoking a model.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">Why is the PDF gated by email?</div>
              <p className="muted mt-2 text-sm">
                The PDF is opt-in depth, and we use the email only to deliver the
                document and reply if you request a pilot.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">What happens after the pilot?</div>
              <p className="muted mt-2 text-sm">
                You keep the KPI report and decide go / no-go.
              </p>
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
              Built for governance: no raw prompts or completions stored by
              default.
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="mailto:marko@ssap.io">marko@ssap.io</a>
          </div>
        </div>
      </footer>

      {/* PDF MODAL */}
      {pdfOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/40"
            onClick={closePdf}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-title"
            aria-describedby="pdf-desc"
            className="relative mx-auto mt-24 w-[92%] max-w-lg"
          >
            <div className="card shadow-xl" suppressHydrationWarning>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    id="pdf-title"
                    className="text-lg font-semibold tracking-tight"
                  >
                    SSAP Technical Overview
                  </div>
                  <div id="pdf-desc" className="muted mt-2 text-sm">
                    Decision architecture for controlled AI execution.
                  </div>
                </div>

                <button
                  suppressHydrationWarning
                  onClick={closePdf}
                  className="rounded-lg border border-zinc-200 px-3 py-1 text-sm hover:border-zinc-950 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="mt-6">
                <label htmlFor="pdf-email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="pdf-email"
                  ref={inputRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                  autoComplete="email"
                  inputMode="email"
                  suppressHydrationWarning
                />

                {err && (
                  <div className="mt-3 text-sm text-red-600">{err}</div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="muted text-xs">
                    We’ll use your email only for pilot follow-up.
                  </div>

                  <button
                    suppressHydrationWarning
                    onClick={downloadPdf}
                    disabled={!emailOk || submitting}
                    className={[
                      "btn",
                      !emailOk || submitting
                        ? "opacity-60 cursor-not-allowed"
                        : "",
                    ].join(" ")}
                  >
                    {submitting ? "Preparing…" : "Download PDF"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
