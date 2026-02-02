"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";

const DASHBOARD_URL = "https://app.ssap.io";
const TRIAL_DAYS = 14;

export default function Home() {
  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const useCases = useMemo(
    () => [
      "Support triage",
      "Approvals & compliance",
      "Agent workflows",
      "Tool routing",
      "RAG escalation",
      "Latency SLO protection",
      "Cost stability",
    ],
    []
  );

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Image
              src="/ssap-logo.png"
              alt="SSAP"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <div className="hidden md:block leading-tight">
              <div className="text-sm font-semibold tracking-tight text-zinc-900">
                SSAP
              </div>
              <div className="text-xs text-zinc-600">Decision system</div>
            </div>
          </div>

          <nav className="flex items-center gap-5 text-sm">
            <button
              onClick={() => goTo("how")}
              className="hidden md:inline underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
              type="button"
            >
              How it works
            </button>
            <button
              onClick={() => goTo("pricing")}
              className="hidden md:inline underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
              type="button"
            >
              Trial & pricing
            </button>
            <button
              onClick={() => goTo("faq")}
              className="hidden md:inline underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
              type="button"
            >
              FAQ
            </button>

            <span className="hidden md:inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
              {TRIAL_DAYS}-day trial
            </span>

            <a
              href={DASHBOARD_URL}
              className="btn"
              target="_blank"
              rel="noreferrer"
            >
              Dashboard →
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="pill">Real-time decisions</span>
              <span className="pill">Policy outcomes</span>
              <span className="pill">{TRIAL_DAYS}-day trial</span>
              <span className="pill">Custom pricing</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              SSAP is a traffic light for AI.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-zinc-600">
              For every request, SSAP decides what should happen:
              run AI, try small, or don’t run AI at all — without changing your
              API or UX.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={DASHBOARD_URL}
                className="btn"
                target="_blank"
                rel="noreferrer"
              >
                Open Dashboard →
              </a>
              <button
                onClick={() => goTo("how")}
                className="btn-ghost"
                type="button"
              >
                See how it works
              </button>
            </div>

            <div className="muted mt-4 text-sm">
              {TRIAL_DAYS}-day trial • Pricing is custom • No “demo request” loop
              — the product is the dashboard.
            </div>
          </div>
        </div>
      </section>

      {/* THE 3 OUTCOMES */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-18 md:py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Three outcomes. One simple rule.
          </h2>
          <p className="muted mt-3 max-w-3xl">
            Running AI is a decision. SSAP makes that decision in real time.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Outcome
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                STOP
              </div>
              <div className="muted mt-2">
                Don’t run AI. Return a safe deterministic result.
              </div>
            </div>

            <div className="card">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Outcome
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                TRY SMALL
              </div>
              <div className="muted mt-2">
                Cheap, bounded attempt — controlled risk.
              </div>
            </div>

            <div className="card">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Outcome
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                GO
              </div>
              <div className="muted mt-2">
                Full execution — only when justified.
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
            <span className="font-semibold">Key point:</span>{" "}
            Same API. Same UX. SSAP only decides what happens behind the scenes.
          </div>
        </div>
      </section>

      {/* WHERE IT HELPS (use cases but not “two explicit products”) */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Where it helps
          </h2>
          <p className="muted mt-3 max-w-3xl">
            SSAP isn’t a chatbot. It’s the decision layer that controls when AI
            is allowed to act — across many workflows.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {useCases.map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="font-semibold">Governance</div>
              <div className="muted mt-2 text-sm">
                Policy-driven execution decisions you can audit.
              </div>
            </div>
            <div className="card">
              <div className="font-semibold">Latency control</div>
              <div className="muted mt-2 text-sm">
                Reduce tail-risk and keep SLOs stable.
              </div>
            </div>
            <div className="card">
              <div className="font-semibold">Quality evidence</div>
              <div className="muted mt-2 text-sm">
                Optional sampling QA to detect drift and prove safety.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (minimal) */}
      <section id="how" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="muted mt-3 max-w-3xl">
            SSAP sits between your app and execution. It decides the outcome,
            then your system proceeds normally.
          </p>

          <div className="mt-8 card overflow-hidden">
            <div className="p-6">
              <svg
                viewBox="0 0 1200 220"
                className="w-full h-auto"
                role="img"
                aria-label="Your app to SSAP to execution"
              >
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

                <rect
                  x="60"
                  y="55"
                  width="280"
                  height="90"
                  rx="20"
                  fill="white"
                  stroke="currentColor"
                  opacity="0.18"
                />
                <rect
                  x="460"
                  y="45"
                  width="320"
                  height="110"
                  rx="24"
                  fill="white"
                  stroke="currentColor"
                  opacity="0.28"
                />
                <rect
                  x="900"
                  y="55"
                  width="240"
                  height="90"
                  rx="20"
                  fill="white"
                  stroke="currentColor"
                  opacity="0.18"
                />

                <text
                  x="200"
                  y="95"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="650"
                >
                  Your app
                </text>
                <text
                  x="200"
                  y="125"
                  textAnchor="middle"
                  fontSize="15"
                  opacity="0.65"
                >
                  Same API contract
                </text>

                <text
                  x="620"
                  y="85"
                  textAnchor="middle"
                  fontSize="26"
                  fontWeight="750"
                >
                  SSAP
                </text>
                <text
                  x="620"
                  y="115"
                  textAnchor="middle"
                  fontSize="16"
                  opacity="0.75"
                >
                  STOP / TRY SMALL / GO
                </text>
                <text
                  x="620"
                  y="140"
                  textAnchor="middle"
                  fontSize="14"
                  opacity="0.6"
                >
                  Decisions at runtime
                </text>

                <text
                  x="1020"
                  y="95"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="650"
                  opacity="0.7"
                >
                  Execution
                </text>
                <text
                  x="1020"
                  y="125"
                  textAnchor="middle"
                  fontSize="15"
                  opacity="0.65"
                >
                  LLMs / tools / flows
                </text>

                <line
                  x1="340"
                  y1="100"
                  x2="460"
                  y2="100"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.3"
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />
                <line
                  x1="780"
                  y1="100"
                  x2="900"
                  y2="100"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.3"
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />
              </svg>

              <div className="mt-5 text-xs text-zinc-500">
                Telemetry is structured and audit-friendly by default (no raw
                prompts or completions). Optional shadow QA can be enabled for
                quality evidence.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                The dashboard is the product
              </h2>
              <p className="muted mt-3 max-w-3xl">
                Start the {TRIAL_DAYS}-day trial and see decisions in real time:
                what ran, what didn’t, and why.
              </p>
            </div>
            <a
              href={DASHBOARD_URL}
              className="btn"
              target="_blank"
              rel="noreferrer"
            >
              Open Dashboard →
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-sm font-semibold">Decision feed</div>
              <div className="muted mt-2 text-sm">
                A live stream of STOP / TRY SMALL / GO outcomes.
              </div>
            </div>
            <div className="card">
              <div className="text-sm font-semibold">Policy rules</div>
              <div className="muted mt-2 text-sm">
                What’s allowed, what’s blocked, and what escalates to GO.
              </div>
            </div>
            <div className="card">
              <div className="text-sm font-semibold">Signals</div>
              <div className="muted mt-2 text-sm">
                Latency control + optional quality evidence over time.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING + TRIAL */}
      <section id="pricing" className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Trial & pricing
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="text-sm font-semibold">{TRIAL_DAYS}-day trial</div>
              <div className="muted mt-2 text-sm">
                Start in the dashboard. Measure outcomes. Decide if SSAP belongs
                in production.
              </div>
              <div className="mt-6">
                <a
                  href={DASHBOARD_URL}
                  className="btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Start trial in Dashboard →
                </a>
              </div>
            </div>

            <div className="card">
              <div className="text-sm font-semibold">Pricing: Custom</div>
              <div className="muted mt-2 text-sm">
                Based on volume, policy complexity, and deployment needs.
                We’ll keep it simple and aligned with real usage.
              </div>
              <div className="mt-6 text-sm text-zinc-700">
                Email:{" "}
                <a
                  href="mailto:marko@ssap.io"
                  className="underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950"
                >
                  marko@ssap.io
                </a>
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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="font-semibold">What is SSAP?</div>
              <p className="muted mt-2 text-sm">
                A decision system that controls AI execution in real time — like
                a traffic light for AI.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">How do I start?</div>
              <p className="muted mt-2 text-sm">
                Open the dashboard and start the {TRIAL_DAYS}-day trial.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">Does SSAP store prompts?</div>
              <p className="muted mt-2 text-sm">
                Telemetry is structured and audit-friendly by default (no raw
                prompts or completions).
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">What is STOP / TRY SMALL / GO?</div>
              <p className="muted mt-2 text-sm">
                The three runtime outcomes: don’t run AI, try a cheap bounded
                path, or run full execution.
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">Is pricing public?</div>
              <p className="muted mt-2 text-sm">
                Pricing is custom (volume, policy complexity, deployment).
              </p>
            </div>

            <div className="card">
              <div className="font-semibold">Where does SSAP fit?</div>
              <p className="muted mt-2 text-sm">
                Between your app and execution — it decides what should happen,
                then you proceed normally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container py-10 flex flex-col md:flex-row justify-between gap-4 text-sm text-zinc-600">
          <div>
            <div>© SSAP</div>
            <div className="mt-1 text-xs text-zinc-500">
              Landing explains. Dashboard runs the trial.
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href={DASHBOARD_URL} target="_blank" rel="noreferrer">
              Dashboard
            </a>
            <a href="mailto:marko@ssap.io">marko@ssap.io</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
