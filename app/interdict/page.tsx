"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function InterdictPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const plans = useMemo(
    () => [
      { id: "solo", name: "Solo", price: "1 agent — $19 / month" },
      { id: "builder", name: "Builder", price: "up to 5 agents — $49 / month" },
      { id: "pro", name: "Pro", price: "up to 20 agents — $149 / month" },
    ],
    []
  );

  const handleActivate = () => {
    if (!selectedPlan) return;
    window.location.href = "/#contact";
  };

  return (
    <main suppressHydrationWarning>
      <header className="border-b border-zinc-200 bg-white">
        <div className="container py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="no-underline flex items-center gap-3">
              <Image
                src="/ssap-logo.png"
                alt="SSAP"
                width={96}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-zinc-900">Interdict</span>
                <span className="text-xs text-zinc-500">by SSAP</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-ghost no-underline">
              Back to SSAP
            </Link>
            <a href="/#contact" className="btn no-underline">
              Activate Interdict
            </a>
          </div>
        </div>
      </header>
      <section className="bg-white">
        <div className="container py-20 md:py-28">
          <div className="flex flex-col gap-10">
            <div className="flex flex-wrap gap-2">
              <span className="pill">Runtime enforcement</span>
              <span className="pill">Fail-open</span>
              <span className="pill">1-line SDK</span>
              <span className="pill">NO_ACTION</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Your agent now knows when not to act.
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-zinc-600">
              Interdict is a runtime decision boundary for autonomous agents. It allows safe actions — and stops the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/#contact" className="btn no-underline">
                Activate Interdict
              </a>
              <Link href="/" className="btn-ghost no-underline">
                Interdict is a module of SSAP →
              </Link>
            </div>
            <div className="muted text-sm">One line. No configuration. Fail-open by default.</div>
          </div>
        </div>
      </section>
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            What goes wrong in production (without Interdict)
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-700">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Hallucinated actions</div>
              <p className="mt-3 text-zinc-600">
                Agents confidently take actions based on incomplete or fabricated context. The output looks plausible,
                passes tests, and fails later in production.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Token waste</div>
              <p className="mt-3 text-zinc-600">
                Models are invoked even when the answer is obvious, cached, or irrelevant. Inference becomes the default
                and cost grows silently.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Over-autonomy</div>
              <p className="mt-3 text-zinc-600">
                Agents act even when uncertainty is high. There is no explicit state for “do not act” — only execution.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Silent failure</div>
              <p className="mt-3 text-zinc-600">
                Nothing crashes. Nothing alerts. You discover the issue through user reports, logs, or billing.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-zinc-200 bg-white">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">What Interdict enforces</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-700">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Action requires permission</div>
              <p className="mt-3 text-zinc-600">
                Inference and actions are no longer the default. They must be explicitly allowed at runtime.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">NO_ACTION is a first-class outcome</div>
              <p className="mt-3 text-zinc-600">
                Interdict introduces a valid “do nothing” decision. This alone prevents a large class of failures.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Fewer calls, same outcomes</div>
              <p className="mt-3 text-zinc-600">
                If an action adds no value, it never runs. Token usage drops without changing agent logic.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold text-zinc-900">Fail-open by design</div>
              <p className="mt-3 text-zinc-600">
                If Interdict is unavailable, agents continue running. No new single points of failure are introduced.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Model-agnostic control</h2>
          <p className="muted mt-3 max-w-2xl">
            Interdict sits outside the model and makes runtime decisions before actions execute. Model choice is
            orthogonal to control: changing models does not change Interdict behavior or its guarantees.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-zinc-700">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                Works with any model — OpenAI, Anthropic, local, or future models.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                Does not depend on prompt structure or model-specific features.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                Operates at runtime, outside the model call path.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                Swapping models does not change Interdict policy outcomes.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                Better models reduce errors but do not eliminate failure modes.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold text-zinc-900">
                Interdict addresses failures that exist across all models.
              </div>
            </div>
          </div>
          <div className="mt-6 text-sm text-zinc-600">
            Model choice is a capability decision. Runtime control is a production invariant.
          </div>
        </div>
      </section>
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="container py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                One-line integration (contextualized)
              </h2>
              <p className="muted mt-3 max-w-xl">
                This single line is where hallucinations, wasted tokens, and unsafe actions stop.
              </p>
              <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
                <div className="text-xs font-semibold text-zinc-500 mb-3">Use</div>
                <div className="font-mono text-sm text-zinc-900 whitespace-pre leading-6">
{`from interdict import boundary
with boundary():
    agent.run()`}
                </div>
              </div>
              <div className="muted text-sm mt-4">
                Interdict does not make agents smarter. It makes them stop when they shouldn’t act.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold text-zinc-900">Pricing (per agent)</div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm" role="radiogroup" aria-label="Pricing plans">
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <label
                      key={plan.id}
                      className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-colors ${
                        isSelected ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pricing"
                        value={plan.id}
                        checked={isSelected}
                        onChange={() => setSelectedPlan(plan.id)}
                        className="sr-only"
                        aria-label={plan.name}
                      />
                      <span className="font-semibold text-zinc-900">{plan.name}</span>
                      <span className="text-zinc-700">{plan.price}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-6">
                <button
                  className={`btn w-full text-center ${selectedPlan ? "" : "opacity-50 cursor-not-allowed"}`}
                  type="button"
                  onClick={handleActivate}
                  disabled={!selectedPlan}
                  data-testid="activate-interdict"
                >
                  Activate Interdict
                </button>
              </div>
              <div className="muted text-xs mt-3">
                Interdict is a runtime module of SSAP.
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="muted text-sm">© {new Date().getFullYear()} SSAP.</div>
          <div className="flex items-center gap-4 text-sm">
            <Link className="no-underline text-zinc-700 hover:text-zinc-900" href="/privacy">
              Privacy
            </Link>
            <Link className="no-underline text-zinc-700 hover:text-zinc-900" href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
