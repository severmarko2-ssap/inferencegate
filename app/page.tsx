"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Shield,
  GitBranch,
  Activity,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Lock,
  FileSearch,
  RefreshCw,
  XCircle,
  ChevronRight,
  Code,
  Scale,
  Eye,
  LayoutDashboard,
} from "lucide-react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const PROBLEMS = [
  { icon: AlertTriangle, text: "LLMs generate probabilistic outputs." },
  { icon: Scale, text: "Enterprise systems require reproducibility and accountability." },
  { icon: XCircle, text: "Unverified claims introduce operational and regulatory risk." },
  { icon: Eye, text: "AI decisions are difficult to explain post-factum." },
];

const PILLARS = [
  {
    icon: GitBranch,
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
    icon: Shield,
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
    icon: RefreshCw,
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

const SECONDARY_BENEFITS = [
  { label: "Cost Optimization", description: "Side-effect of structured inference control" },
  { label: "Latency Control", description: "Bounded escalation paths" },
  { label: "Risk Adaptation", description: "Thresholding based on domain signals" },
  { label: "Model Portability", description: "Cross-model without governance redesign" },
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
  const [cEmail, setCEmail] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cMsg, setCMsg] = useState("");
  const [cStatus, setCStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [cError, setCError] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [pdfError, setPdfError] = useState<string | null>(null);

  const contactRef = useRef<HTMLElement | null>(null);

  const goToContact = useCallback(() => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const contactPayload = useMemo(() => ({
    email: cEmail.trim(),
    company: cCompany.trim(),
    message: cMsg.trim(),
    source: "ssap.io",
  }), [cEmail, cCompany, cMsg]);

  const sendContact = useCallback(async () => {
    setCError(null);
    if (!isValidEmail(cEmail)) { setCError("Please enter a valid email."); setCStatus("error"); return; }
    if (!cCompany.trim()) { setCError("Please enter your company."); setCStatus("error"); return; }
    if (!cMsg.trim()) { setCError("Please enter a message."); setCStatus("error"); return; }
    try {
      setCStatus("sending");
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactPayload) });
      if (!res.ok) throw new Error((await res.text()) || "Request failed");
      setCStatus("sent");
    } catch (e: any) { setCStatus("error"); setCError(e?.message || "Something went wrong."); }
  }, [cEmail, cCompany, cMsg, contactPayload]);

  const sendPdf = useCallback(async () => {
    setPdfError(null);
    if (!isValidEmail(pdfEmail)) { setPdfError("Please enter a valid email."); setPdfStatus("error"); return; }
    try {
      setPdfStatus("sending");
      const res = await fetch("/api/pilot-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: pdfEmail.trim(), source: "ssap.io" }) });
      if (!res.ok) throw new Error((await res.text()) || "Request failed");
      setPdfStatus("sent");
    } catch (e: any) { setPdfStatus("error"); setPdfError(e?.message || "Something went wrong."); }
  }, [pdfEmail]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/ssap-logo.png" alt="SSAP" width={40} height={40} className="h-10 w-10" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-white">SSAP</span>
              <span className="text-xs text-slate-400">Deterministic AI Governance</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
              <a href="#problem" className="hover:text-white transition-colors">Problem</a>
              <a href="#pillars" className="hover:text-white transition-colors">Governance</a>
              <a href="#execution" className="hover:text-white transition-colors">Execution</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </nav>
            <a href="https://app.ssap.io" className="btn" target="_blank" rel="noopener noreferrer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8">
            <Lock className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-400">Deterministic AI Governance Runtime</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
            Deterministic Governance<br /><span className="text-blue-500">for AI Systems</span>
          </h1>
          <div className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 space-y-2">
            <p>Control when inference happens.</p>
            <p>Verify every critical claim.</p>
            <p>Replay every decision.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goToContact} className="btn text-lg px-8 py-4" type="button">
              Request Governance Brief <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a href="https://app.ssap.io" className="btn-ghost text-lg px-8 py-4" target="_blank" rel="noopener noreferrer">
              <LayoutDashboard className="mr-2 h-5 w-5" /> Open Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Proof Strip */}
      <section className="border-y border-slate-700/50 bg-slate-800/30">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><div className="text-white font-semibold">Decision Control</div><div className="text-sm text-slate-400">When inference happens</div></div>
            <div><div className="text-white font-semibold">Claim Integrity</div><div className="text-sm text-slate-400">What leaves the system</div></div>
            <div><div className="text-white font-semibold">Audit-Ready</div><div className="text-sm text-slate-400">Replayable decisions</div></div>
            <div><div className="text-white font-semibold">Vendor-Agnostic</div><div className="text-sm text-slate-400">Works across providers</div></div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The Problem</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">AI systems in enterprise environments face fundamental governance challenges.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((problem, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-red-500/20">
                <problem.icon className="h-8 w-8 text-red-400 mb-4" />
                <p className="text-slate-300">{problem.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="py-20 bg-slate-800/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Three Governance Pillars</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">SSAP provides a complete governance framework for AI systems.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="card hover:border-blue-500/50 transition-colors">
                <div className="w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <pillar.icon className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{pillar.title}</h3>
                <p className="text-blue-400 text-sm mb-4">{pillar.subtitle}</p>
                <ul className="space-y-3">
                  {pillar.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Graph */}
      <section id="execution" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Execution Graph</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Bounded, deterministic control over every AI decision.</p>
          </div>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 p-8 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="px-4 py-3 bg-blue-500/20 border border-blue-500/40 rounded-lg"><span className="font-mono text-blue-400 font-semibold">PROBE</span></div>
                <ChevronRight className="h-5 w-5 text-slate-500" />
                <div className="px-4 py-3 bg-purple-500/20 border border-purple-500/40 rounded-lg"><span className="font-mono text-purple-400 font-semibold">LLM_PROBE</span></div>
                <ChevronRight className="h-5 w-5 text-slate-500" />
                <div className="px-4 py-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg"><span className="font-mono text-yellow-400 font-semibold">INTEGRITY</span></div>
              </div>
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="px-3 py-2 bg-green-500/20 border border-green-500/40 rounded-lg"><span className="font-mono text-green-400 text-sm">PASS</span></div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                    <div className="px-3 py-2 bg-green-500/30 border border-green-500/50 rounded-lg"><span className="font-mono text-green-300 text-sm font-semibold">RETURN</span></div>
                  </div>
                  <p className="text-xs text-slate-500">Verified response delivered</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-lg"><span className="font-mono text-red-400 text-sm">FAIL</span></div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                    <div className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 rounded-lg"><span className="font-mono text-orange-400 text-sm">ESCALATE</span></div>
                  </div>
                  <p className="text-xs text-slate-500">Bounded retry initiated</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <p className="text-center text-slate-500 text-sm mb-4">Escalation Path (max 1 retry)</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="px-4 py-3 bg-orange-500/20 border border-orange-500/40 rounded-lg"><span className="font-mono text-orange-400 font-semibold">FULL</span></div>
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                  <div className="px-4 py-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg"><span className="font-mono text-yellow-400 font-semibold">INTEGRITY</span></div>
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                  <div className="flex gap-4">
                    <div className="px-3 py-2 bg-green-500/30 border border-green-500/50 rounded-lg"><span className="font-mono text-green-300 text-sm">PASS → RETURN</span></div>
                    <div className="px-3 py-2 bg-red-500/30 border border-red-500/50 rounded-lg"><span className="font-mono text-red-300 text-sm">FAIL → BLOCK</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claim Verification */}
      <section id="integrity" className="py-20 bg-slate-800/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Claim-Level Verification</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Every claim is verified against evidence before leaving the system.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0"><FileSearch className="h-5 w-5 text-blue-500" /></div>
                <div><h3 className="text-lg font-semibold text-white mb-2">Evidence-Bound Output</h3><p className="text-slate-400">Each claim is linked to a specific evidence reference with document ID and section.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"><CheckCircle className="h-5 w-5 text-green-500" /></div>
                <div><h3 className="text-lg font-semibold text-white mb-2">Verification Status</h3><p className="text-slate-400">Claim-by-claim verification with PASS/FAIL status. Hard blocking on unverified claims.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0"><Activity className="h-5 w-5 text-purple-500" /></div>
                <div><h3 className="text-lg font-semibold text-white mb-2">Decision Path Tracing</h3><p className="text-slate-400">Full audit trail with policy version, integrity mode, and execution path.</p></div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700"><Code className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-400">Structured Output Example</span></div>
              <pre className="p-4 text-sm text-slate-300 overflow-x-auto"><code>{CLAIM_EXAMPLE}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Claims */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Enterprise-Grade Governance</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Defensible claims backed by deterministic execution.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {ENTERPRISE_CLAIMS.map((claim, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /><span className="text-slate-300">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Benefits */}
      <section className="py-16 bg-slate-800/30">
        <div className="container">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-slate-400 mb-2">Secondary Benefits</h3>
            <p className="text-slate-500">Additional advantages from structured inference control.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECONDARY_BENEFITS.map((b) => (
              <div key={b.label} className="text-center p-6 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <p className="text-white font-medium mb-1">{b.label}</p><p className="text-sm text-slate-500">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20" ref={contactRef as any}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Request Governance Brief</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Tell us about your AI governance requirements. We'll send you a tailored brief within 24 hours.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Enterprise Inquiry</h3>
              <div className="space-y-4">
                <label className="block"><span className="text-sm font-medium text-slate-300">Email</span><input className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="you@company.com" type="email" /></label>
                <label className="block"><span className="text-sm font-medium text-slate-300">Company</span><input className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" value={cCompany} onChange={(e) => setCCompany(e.target.value)} placeholder="Company name" type="text" /></label>
                <label className="block"><span className="text-sm font-medium text-slate-300">Message</span><textarea className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none min-h-[120px]" value={cMsg} onChange={(e) => setCMsg(e.target.value)} placeholder="Describe your AI governance requirements..." /></label>
                <div className="flex items-center gap-3">
                  <button className="btn" type="button" onClick={sendContact} disabled={cStatus === "sending" || cStatus === "sent"}>{cStatus === "sending" ? "Sending..." : cStatus === "sent" ? "Sent" : "Request Brief"}</button>
                  {cStatus === "error" && cError && <span className="text-sm text-red-400">{cError}</span>}
                  {cStatus === "sent" && <span className="text-sm text-green-400">Thanks — we'll reply within 24 hours.</span>}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Direct Contact</h3>
                <p className="text-slate-400 mb-4">Prefer email? Reach us at <a href="mailto:marko@ssap.io" className="text-blue-400 hover:text-blue-300">marko@ssap.io</a></p>
                <button className="btn-ghost" type="button" onClick={openPdf}>Download Governance PDF →</button>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Open Dashboard</h3>
                <p className="text-slate-400 mb-4">Access real-time metrics, decision logs, and governance reports.</p>
                <a href="https://app.ssap.io" className="btn inline-flex" target="_blank" rel="noopener noreferrer"><LayoutDashboard className="mr-2 h-4 w-4" />Go to Dashboard</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><Image src="/ssap-logo.png" alt="SSAP" width={28} height={28} className="h-7 w-7" /><span className="font-bold text-white">SSAP</span></div>
          <p className="text-sm text-slate-400">SSAP — Deterministic Infrastructure for AI Systems</p>
          <div className="flex items-center gap-4 text-sm text-slate-400"><a href="/privacy" className="hover:text-white transition-colors">Privacy</a><a href="/terms" className="hover:text-white transition-colors">Terms</a></div>
        </div>
      </footer>

      {/* PDF Modal */}
      {pdfOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div><h3 className="text-lg font-semibold text-white">Download Governance Brief</h3><p className="text-sm text-slate-400 mt-1">Enter your email to receive the PDF.</p></div>
              <button className="text-slate-400 hover:text-white" type="button" onClick={closePdf}>✕</button>
            </div>
            <div className="space-y-4">
              <label className="block"><span className="text-sm font-medium text-slate-300">Email</span><input className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" value={pdfEmail} onChange={(e) => setPdfEmail(e.target.value)} placeholder="you@company.com" type="email" /></label>
              <div className="flex items-center gap-3">
                <button className="btn" type="button" onClick={sendPdf} disabled={pdfStatus === "sending" || pdfStatus === "sent"}>{pdfStatus === "sending" ? "Sending..." : pdfStatus === "sent" ? "Sent" : "Send me the PDF"}</button>
                {pdfStatus === "error" && pdfError && <span className="text-sm text-red-400">{pdfError}</span>}
                {pdfStatus === "sent" && <span className="text-sm text-green-400">Check your inbox.</span>}
              </div>
              <p className="text-xs text-slate-500">We only use your email to send the PDF and follow up about governance requirements.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
