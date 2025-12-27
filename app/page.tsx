"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PILOT_MAIL =
  "mailto:marko@ssap.io?subject=InferenceGate%20Pilot%20Application&body=Hi%20Marko%2C%0A%0AWe%27d%20like%20to%20apply%20for%20the%20InferenceGate%20pilot.%0A%0ACompany%3A%0AUse%20case%3A%0AEndpoints%2Ftraffic%3A%0AProvider%2Fmodels%3A%0ACurrent%20LLM%20spend%3A%0ASuccess%20metric%3A%0A%0AThanks%21";

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

  // JSON-LD (SEO / Trust) — aligned with Inference Governance positioning
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
      name: "InferenceGate",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      url: "https://ssap.io",
      description:
        "InferenceGate turns inference from an uncontrolled side-effect into a governed system — with cost savings as a consequence.",
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
      a.download = "InferenceGate-Pilot-Pricing-Overview.pdf";
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
          spend: cSpend.trim(), // ✅ FIX: backend očekuje "spend"
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
                InferenceGate
              </div>
              <div className="text-xs text-zinc-600">by SSAP</div>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
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
              Download PDF
            </button>

            <a href={PILOT_MAIL} className="btn">
              Apply for pilot
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white">
        <div className="container py-20 md:py-28">
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap gap-2">
              <span className="pill">Inference governance (core)</span>
              <span className="pill">Deterministic decision paths</span>
              <span className="pill">Tail-latency stability</span>
              <span className="pill">SS3 shadow QA</span>
              <span className="pill">Cost savings (baseline)</span>
            </div>

            {/* A4 microcopy (trust layer) */}
            <div className="text-sm text-zinc-600">
              <span className="font-semibold text-zinc-900">
                We don’t optimize inference.
              </span>{" "}
              We govern it.
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Inference governance{" "}
              <span className="text-zinc-600">for production AI.</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-zinc-600">
              InferenceGate turns inference from an uncontrolled side-effect into
              a governed system — policy-driven routing that decides when
              inference may exist, with auditability, stable latency, and
              continuous quality monitoring. Cost savings are the consequence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={PILOT_MAIL} className="btn">
                Apply for pilot — No upfront cost
              </a>
              <button
                suppressHydrationWarning
                onClick={openPdf}
                className="btn-ghost"
              >
                Download one-pager (PDF)
              </button>
            </div>

            {/* METRICS (positioned as governed outcomes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="card">
                <div className="text-3xl font-semibold">15–25%</div>
                <div className="muted mt-1">Target FULL rate (policy-bound)</div>
              </div>
              <div className="card">
                <div className="text-3xl font-semibold">60–75%</div>
                <div className="muted mt-1">
                  PROBE_ACCEPT (governed fast-path)
                </div>
              </div>
              <div className="card">
                <div className="text-3xl font-semibold">5–15%</div>
                <div className="muted mt-1">
                  NO_INFERENCE (first-class outcome)
                </div>
              </div>
            </div>

            {/* PILOT INCLUDES */}
            <div className="mt-8 max-w-3xl">
              <h3 className="text-lg font-semibold tracking-tight">
                Pilot includes
              </h3>

              <ul className="mt-4 space-y-3 text-zinc-700">
                <li className="flex gap-3">
                  <span className="font-semibold">•</span>
                  <span>
                    <strong>Policy-driven inference</strong> — define what may
                    escalate to FULL and when NO_INFERENCE is allowed.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">•</span>
                  <span>
                    <strong>Audit trail</strong> — deterministic decision paths
                    and telemetry (no raw prompts).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">•</span>
                  <span>
                    <strong>Latency stability</strong> — fewer FULL spikes for
                    flatter P95/P99 behavior.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">•</span>
                  <span>
                    <strong>Quality proof</strong> — optional SS3 shadow QA to
                    measure drift without touching UX.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold">•</span>
                  <span>
                    <strong>Clear go / no-go decision</strong> — you keep the KPI
                    report and decide if rollout makes sense.
                  </span>
                </li>
              </ul>

              <div className="muted mt-4 text-sm">
                Of course it saves money — that’s table stakes. InferenceGate’s
                core value is governing when inference happens at all.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A4/A5 TRUST / PROOF STRIP */}
      <section className="border-t border-b border-zinc-200 bg-zinc-50">
        <div className="container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-sm text-zinc-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Policy</span>
              <span>FULL / PROBE_ACCEPT / NO_INFERENCE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Audit</span>
              <span>deterministic paths + telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Latency</span>
              <span>flatter P95/P99 curves</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Quality</span>
              <span>SS3 shadow QA monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Baseline</span>
              <span>cost savings follow</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Auditable, policy-driven inference
            </h2>
            <p className="muted mt-3 max-w-xl">
              Every request produces structured events: what happened, why it was
              allowed to run (or not), and what it cost. No raw prompts. No PII.
              NO_INFERENCE is a legitimate outcome — not an error.
            </p>

            <div className="mt-6">
              <button
                suppressHydrationWarning
                onClick={openPdf}
                className="btn-ghost"
              >
                Download one-pager (PDF)
              </button>
              <div className="muted mt-2 text-sm">
                Email required — we’ll use it only for pilot follow-up.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-semibold mb-3">
              telemetry.jsonl (example)
            </div>
            <pre className="text-xs overflow-x-auto whitespace-pre">
{`{"event":"request","path":"/chat"}
{"event":"ss1_gate","decision":"ALLOW_AP","policy":"support_default"}
{"event":"ap_decision","decision_path":"PROBE_ACCEPT"}
{"event":"final","decision_path":"PROBE_ACCEPT","cost_est_usd":0.0008}`}
            </pre>
            <div className="muted mt-3 text-xs">
              No raw prompts/completions. Structured decisions you can audit.
            </div>
            <div className="muted mt-2 text-xs">
              We prove savings are safe — we don’t assume.
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How it works
          </h2>

          {/* B1: intro -> governance-first */}
          <p className="muted mt-3 max-w-3xl">
            InferenceGate makes inference a policy decision. It governs when
            inference may exist, keeps decision paths deterministic, and flattens
            tail latency — while remaining provider-agnostic.
          </p>

          {/* ARCH DIAGRAM */}
          <div className="mt-8">
            <div className="card overflow-hidden">
              <div className="flex items-start justify-between gap-6 p-6">
                <div>
                  <div className="text-sm font-semibold">Where SSAP fits</div>
                  <div className="muted mt-2 text-sm max-w-xl">
                    InferenceGate (SS/AP) governs inference above providers:
                    policy → routing → outcome, with optional SS3 shadow QA for
                    continuous quality evidence.
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
                  aria-label="Client to InferenceGate (SS/AP) to LLM providers, with telemetry and shadow QA"
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
                    InferenceGate (SS/AP)
                  </text>
                  <text
                    x="630"
                    y="125"
                    textAnchor="middle"
                    fontSize="16"
                    fill="currentColor"
                    opacity="0.7"
                  >
                    Policy → SS → AP → Outcome
                  </text>
                  <text
                    x="630"
                    y="148"
                    textAnchor="middle"
                    fontSize="15"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    FULL / PROBE_ACCEPT / NO_INFERENCE
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
                    LLM Provider(s)
                  </text>
                  <text
                    x="1045"
                    y="135"
                    textAnchor="middle"
                    fontSize="16"
                    fill="currentColor"
                    opacity="0.65"
                  >
                    Your provider(s)
                  </text>

                  {/* Arrows (polished) */}
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
                    Telemetry / KPI (no raw prompts)
                  </text>

                  {/* Shadow QA (optional) */}
                  <path
                    d="M790 88 Q835 58 875 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    opacity="0.16"
                    strokeLinecap="round"
                    strokeDasharray="6 8"
                    markerEnd="url(#arrow)"
                  />
                  {/* wider label box for longer copy */}
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
                    Optional: SS3 Shadow QA (proves savings are safe)
                  </text>
                </svg>

                {/* B1: add 4th card (Model-agnostic) */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm text-zinc-700">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">Inference governance</div>
                    <div className="muted mt-1 text-xs">
                      Decide when inference may exist.
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">Latency stability</div>
                    <div className="muted mt-1 text-xs">
                      Flatter P95/P99 curves by reducing FULL spikes.
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">Quality proof</div>
                    <div className="muted mt-1 text-xs">
                      SS3 monitors drift without UX impact.
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <div className="font-semibold">Model-agnostic</div>
                    <div className="muted mt-1 text-xs">
                      Your policy survives provider/model churn.
                    </div>
                  </div>
                </div>

                {/* Key idea */}
                <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  <span className="font-semibold">Key idea:</span>{" "}
                  <span className="text-zinc-600">
                    Inference is an explicit decision — not a default side
                    effect. NO_INFERENCE is a governed outcome.
                  </span>
                </div>

                {/* B3: future-proof sentence */}
                <div className="mt-3 text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-900">
                    Your inference policy survives model churn.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEPS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="card">
              <div className="text-xs text-zinc-500">Step 1</div>
              <div className="mt-2 font-semibold">SS (Policy Gate)</div>
              <div className="muted mt-2 text-sm">
                Defines when inference is allowed and what escalation is
                permitted.
              </div>
            </div>
            <div className="card">
              <div className="text-xs text-zinc-500">Step 2</div>
              <div className="mt-2 font-semibold">AP (Asymmetric Probe)</div>
              <div className="muted mt-2 text-sm">
                Attempts low-risk paths first under policy constraints.
              </div>
            </div>
            <div className="card">
              <div className="text-xs text-zinc-500">Step 3</div>
              <div className="mt-2 font-semibold">
                Outcome (FULL only if needed)
              </div>
              <div className="muted mt-2 text-sm">
                Escalates only when policy and confidence require it.
              </div>
            </div>
            <div className="card">
              <div className="text-xs text-zinc-500">Step 4</div>
              <div className="mt-2 font-semibold">SS3 (Quality monitor)</div>
              <div className="muted mt-2 text-sm">
                Measures drift and validates quality via shadow sampling, without
                affecting UX.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="card">
              <div className="text-sm font-semibold">What you keep constant</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• Same client contract / response shape</li>
                <li>• Same upstream provider(s) and models</li>
                <li>• Clear go / no-go decision after pilot</li>
              </ul>
            </div>

            <div className="card">
              <div className="text-sm font-semibold">What you gain</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                <li>• Inference governance (policy-driven execution)</li>
                <li>• Deterministic decision paths + audit trail</li>
                <li>• Flatter tail latency (P95/P99 stability)</li>
                <li>• Quality protection via SS3 evidence</li>
                <li>• Provider-agnostic future-proofing</li>
              </ul>
            </div>
          </div>

          {/* B2: Use cases grid */}
          <div className="mt-10">
            <div className="text-sm font-semibold">Where teams use it</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="card">
                <div className="font-semibold">Customer support</div>
                <div className="muted mt-2 text-sm">
                  Stable tail latency + audit trail for high-volume workflows.
                </div>
              </div>
              <div className="card">
                <div className="font-semibold">Real-time apps</div>
                <div className="muted mt-2 text-sm">
                  Fewer FULL spikes → flatter P95/P99 response times.
                </div>
              </div>
              <div className="card">
                <div className="font-semibold">Agentic workflows</div>
                <div className="muted mt-2 text-sm">
                  Controlled escalation and deterministic outcomes in multi-step
                  systems.
                </div>
              </div>
              <div className="card">
                <div className="font-semibold">Compliance / finance</div>
                <div className="muted mt-2 text-sm">
                  Policy-driven execution with evidence and audit-friendly logs.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href={PILOT_MAIL}
              className="inline-block underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
            >
              Apply for pilot →
            </a>
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
            We keep this simple: a short fit check, a scoped pilot, then a clear
            go / no-go decision backed by KPI data. Pricing is shared after we
            confirm pilot fit and success metrics.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <div className="text-xs text-zinc-500">Step 1</div>
              <div className="mt-2 font-semibold">15-minute fit check</div>
              <div className="muted mt-2 text-sm">
                Confirm endpoints, traffic patterns, policy constraints, and what
                “success” means for you.
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-zinc-500">Step 2</div>
              <div className="mt-2 font-semibold">Pilot setup</div>
              <div className="muted mt-2 text-sm">
                Drop-in proxy in front of your provider(s) + deterministic
                decision paths + telemetry. No client code changes.
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-zinc-500">Step 3</div>
              <div className="mt-2 font-semibold">KPI report + decision</div>
              <div className="muted mt-2 text-sm">
                You get a KPI summary (policy outcomes, savings, latency, quality
                signals). Then we discuss rollout only if it makes sense.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href={PILOT_MAIL} className="btn">
              Apply for pilot
            </a>
            <button
              suppressHydrationWarning
              onClick={openPdf}
              className="btn-ghost"
            >
              Download Pilot Overview PDF
            </button>
          </div>

          <div className="muted mt-3 text-sm">
            Note: We share pricing after the fit check, once pilot fit and
            success metrics are clear.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-16">
          <div className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-xl font-semibold tracking-tight">
                Govern inference on real production traffic
              </div>
              <div className="muted mt-2">
                Policy outcomes, stable latency, quality evidence — with savings
                as a consequence.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                suppressHydrationWarning
                onClick={openPdf}
                className="btn-ghost"
              >
                Download PDF
              </button>
              <a href={PILOT_MAIL} className="btn">
                Apply for pilot
              </a>
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
            approximate monthly LLM spend so we can respond with the right pilot
            path.
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
                <li>• Suggested pilot setup &amp; timeline</li>
                <li>• Policy + compliance considerations</li>
                <li>• Expected latency + quality impact</li>
                <li>• Integration notes (drop-in proxy)</li>
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
                    Approx. monthly LLM spend *
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
                    placeholder="Tell us what you’re building and what you want to govern (policy, latency, quality, providers)."
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
              <div className="font-semibold">
                Do we need to change client code?
              </div>
              <p className="muted mt-2 text-sm">
                No. InferenceGate preserves response shape — it sits in front of
                your provider(s).
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
              <div className="font-semibold">What is NO_INFERENCE?</div>
              <p className="muted mt-2 text-sm">
                A first-class governed outcome: policy decides inference should
                not occur, and the system returns a deterministic response shape
                without calling a model.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">Does this still save money?</div>
              <p className="muted mt-2 text-sm">
                Yes — savings are baseline. The core value is governance,
                predictable latency, and evidence-based quality protection.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">
                Can we enforce policies per endpoint or department?
              </div>
              <p className="muted mt-2 text-sm">
                Yes. You can define routing and escalation rules per path/use
                case (e.g., what may reach FULL, when to allow NO_INFERENCE, and
                what requires stricter audit constraints).
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">
                Why is email required to download the PDF?
              </div>
              <p className="muted mt-2 text-sm">
                It helps us share pilot details and follow up only if you want to
                proceed.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">What happens after the pilot?</div>
              <p className="muted mt-2 text-sm">
                You keep the KPI report and decide go / no-go. No pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container py-10 flex flex-col md:flex-row justify-between text-sm text-zinc-600">
          <div>© {new Date().getFullYear()} ssap.io</div>
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
                    Download one-pager (PDF)
                  </div>
                  <div id="pdf-desc" className="muted mt-2 text-sm">
                    Enter your email to get the PDF download instantly.
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
