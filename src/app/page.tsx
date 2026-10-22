"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, Circle, Eye,
  Code2, Database, Github, GitBranch, Layers3, Linkedin, Mail, Menu,
  Network, Radio, Server, ShieldCheck, Workflow, Zap
} from "lucide-react";

const tech = ["Node.js", "TypeScript", "Express.js", "PostgreSQL", "MySQL", "MongoDB", "Redis", "AWS", "REST APIs"];

const projects = [
  {
    number: "01",
    label: "CORE SYSTEM",
    title: "Fintech notification platform",
    description: "A notification workflow for loan lifecycle events across email, SMS, and in-app channels.",
    tags: ["Node.js", "TypeScript", "SSE", "MongoDB"],
    icon: Radio,
    href: "#lab",
    note: "Architecture walkthrough"
  },
  {
    number: "02",
    label: "RELIABILITY",
    title: "Document generation",
    description: "Investigating worker-capacity issues in a document-generation workflow and evaluating a Gotenberg proof of concept.",
    tags: ["Node.js", "Document processing", "Reliability"],
    icon: Layers3,
    href: "#case-studies",
    note: "Engineering case study"
  },
  {
    number: "03",
    label: "INTEGRATIONS",
    title: "Payment workflows",
    description: "Payment-related integrations involving Cashfree one-time payments and Digio mandate management.",
    tags: ["Cashfree", "Digio", "API integrations"],
    icon: ShieldCheck,
    href: "#case-studies",
    note: "Integration patterns"
  }
];

type NodeInfo = { name: string; role: string; detail: string };
const architecture: NodeInfo[] = [
  { name: "Internal service", role: "Event producer", detail: "Sends a notification request with an event type and entity reference." },
  { name: "Notification API", role: "Validation & orchestration", detail: "Validates the request, resolves required data, and coordinates the delivery workflow." },
  { name: "Preference & data layer", role: "Data access", detail: "Loads user preferences and relevant entity data before choosing a delivery path." },
  { name: "Delivery providers", role: "External integrations", detail: "Routes messages to email or SMS providers. Provider failures require careful retry and reconciliation logic." },
];


function PortfolioVisitTracker() {
  useEffect(() => {
    // One alert per browser tab per session; refreshing won't spam WhatsApp.
    const key = "portfolio-visit-alert-sent";
    if (sessionStorage.getItem(key)) return;

    const referrer = document.referrer ? new URL(document.referrer).hostname : "Direct / unknown";
    fetch("/api/visitor-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, source: referrer }),
      keepalive: true,
    })
      .then((response) => {
        if (response.ok) sessionStorage.setItem(key, "1");
      })
      .catch(() => { /* Tracking failure must never affect the portfolio experience. */ });
  }, []);

  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Work", "#work"], ["System lab", "#lab"], ["Case studies", "#case-studies"], ["About", "#about"]];
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#090b0a]/85 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between">
        <a href="#" className="flex items-center gap-3" aria-label="Akshat Mishra home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c2f970]/30 bg-[#c2f970]/10 text-sm font-bold text-[#c2f970]">AM</span>
          <span className="text-sm font-semibold tracking-tight">Akshat Mishra<span className="ml-2 text-[#7e897f]">/ Backend</span></span>
        </a>
        <nav className="desktop-nav flex items-center gap-7">
          {links.map(([label, href]) => <a key={label} className="nav-link" href={href}>{label}</a>)}
          <a href="#contact" className="button-primary !px-3 !py-2">Let&apos;s connect <ArrowUpRight size={14} /></a>
        </nav>
        <button className="md:hidden rounded-lg border border-white/10 p-2" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <ChevronDown size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && <nav className="container flex flex-col gap-4 pb-5 md:hidden">{links.map(([label, href]) => <a key={label} className="nav-link" href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-link" href="#contact" onClick={() => setOpen(false)}>Contact</a></nav>}
    </header>
  );
}

function ArchitectureLab() {
  const [selected, setSelected] = useState(1);
  const [scenario, setScenario] = useState<"normal" | "retry">("normal");
  const selectedNode = architecture[selected];
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold"><Network size={16} className="text-[#c2f970]" /> Notification request flow</div>
        <div className="flex gap-2">
          <button onClick={() => setScenario("normal")} className={`rounded-lg px-3 py-2 text-xs ${scenario === "normal" ? "bg-[#c2f970] text-[#10150d]" : "border border-white/10 text-[#aab4ac]"}`}>Normal flow</button>
          <button onClick={() => setScenario("retry")} className={`rounded-lg px-3 py-2 text-xs ${scenario === "retry" ? "bg-[#c2f970] text-[#10150d]" : "border border-white/10 text-[#aab4ac]"}`}>Provider retry</button>
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid-bg p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[.15em] text-[#79847b]">
            <span>Illustrative architecture</span><span className="flex items-center gap-2"><Circle size={7} fill="#c2f970" className="text-[#c2f970]" /> {scenario === "normal" ? "Request path" : "Failure path"}</span>
          </div>
          <div className="space-y-3">
            {architecture.map((node, i) => (
              <div key={node.name}>
                <button onClick={() => setSelected(i)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected === i ? "border-[#c2f970]/55 bg-[#c2f970]/[.08]" : "border-white/10 bg-[#0d100e]/85 hover:border-white/20"}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected === i ? "bg-[#c2f970] text-[#10150d]" : "bg-white/5 text-[#aab4ac]"}`}>
                    {i === 0 ? <Radio size={17} /> : i === 1 ? <Server size={17} /> : i === 2 ? <Database size={17} /> : <Zap size={17} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{node.name}</span>
                    <span className="mt-1 block text-xs text-[#8d998f]">{node.role}</span>
                  </span>
                  <ArrowUpRight size={15} className="text-[#7f8b81]" />
                </button>
                {i < architecture.length - 1 && <div className="ml-7 flex h-5 items-center"><div className={`h-full border-l border-dashed ${scenario === "retry" && i === 3 ? "border-amber-400" : "border-[#c2f970]/45"}`} /></div>}
              </div>
            ))}
          </div>
          {scenario === "retry" && <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100/80">Design note: retries need bounded attempts, backoff, idempotency where supported, and reconciliation for ambiguous provider outcomes.</div>}
        </div>
        <div className="border-t border-white/8 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <span className="eyebrow">Component detail</span>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">{selectedNode.name}</h3>
          <p className="mt-2 text-sm text-[#9ba79e]">{selectedNode.detail}</p>
          <div className="mt-7 rounded-xl border border-white/8 bg-black/20 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#c2f970]"><Code2 size={14} /> Engineering consideration</div>
            <p className="text-sm leading-6 text-[#c4cdc6]">{selected === 0 ? "Validate event type and required identifiers at the boundary. Avoid coupling callers to provider-specific details." : selected === 1 ? "Keep request validation, orchestration, and delivery concerns distinct. Define what a successful API response actually guarantees." : selected === 2 ? "Batch data access where possible and make missing or stale data behavior explicit." : scenario === "retry" ? "A timeout does not prove that a provider failed to deliver. Avoid blind retries that can create duplicate messages." : "Normalize provider responses and track outcomes so failures can be investigated and reconciled."}</p>
          </div>
          <p className="mt-5 text-[11px] leading-5 text-[#778279]">Illustrative design based on common notification-service patterns. It is not a disclosure of a complete production architecture.</p>
        </div>
      </div>
    </div>
  );
}

function CacheDemo() {
  const [input, setInput] = useState("1, 2, 3");
  const [cache, setCache] = useState<Record<string, number>>({});
  const [calls, setCalls] = useState(0);
  const [last, setLast] = useState<{ result: number; hit: boolean } | null>(null);
  const [error, setError] = useState("");
  const run = () => {
    const nums = input.split(",").map(v => Number(v.trim()));
    if (!input.trim() || nums.some(n => !Number.isFinite(n))) {
      setError("Enter comma-separated numbers, for example: 1, 2, 3");
      setLast(null);
      return;
    }
    setError("");
    const key = JSON.stringify(nums);
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      setLast({ result: cache[key], hit: true });
      return;
    }
    const result = nums.reduce((sum, n) => sum + n, 0);
    setCache(prev => ({ ...prev, [key]: result }));
    setCalls(c => c + 1);
    setLast({ result, hit: false });
  };
  const reset = () => { setCache({}); setCalls(0); setLast(null); setError(""); };
  const entries = useMemo(() => Object.entries(cache), [cache]);
  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><span className="eyebrow">Interactive demo</span><h3 className="mt-2 text-xl font-semibold">Memoization cache</h3><p className="mt-2 max-w-lg text-sm leading-6 text-[#9ba79e]">Run the same input twice. The second call returns the stored result without recalculating the sum.</p></div>
        <span className="rounded-xl bg-[#c2f970]/10 p-3 text-[#c2f970]"><Zap size={20} /></span>
      </div>
      <label htmlFor="numbers" className="mt-6 block text-xs text-[#aab4ac]">Input numbers</label>
      <div className="mt-2 flex gap-2">
        <input id="numbers" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") run(); }} className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none focus:border-[#c2f970]/50" placeholder="1, 2, 3" />
        <button onClick={run} className="button-primary !px-4">Run <ArrowRight size={14} /></button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/8 bg-black/15 p-4"><p className="text-xs text-[#89958c]">Function executions</p><p className="mt-2 text-2xl font-semibold">{calls}</p></div>
        <div className="rounded-xl border border-white/8 bg-black/15 p-4"><p className="text-xs text-[#89958c]">Last result</p><p className="mt-2 text-2xl font-semibold">{last ? last.result : "—"}</p></div>
      </div>
      {last && <div aria-live="polite" className={`mt-3 flex items-center gap-2 rounded-lg border p-3 text-xs ${last.hit ? "border-[#c2f970]/20 bg-[#c2f970]/5 text-[#d6f7b5]" : "border-white/10 bg-white/[.03] text-[#bdc7bf]"}`}><Check size={14} /> {last.hit ? "Cache hit — returned stored result." : "Cache miss — calculated and stored result."}</div>}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-[#c5cec7]">Cache entries</span><button onClick={reset} className="text-xs text-[#aab4ac] underline underline-offset-4 hover:text-white">Reset</button></div>
        {entries.length === 0 ? <p className="rounded-lg border border-dashed border-white/10 p-4 text-xs text-[#778279]">No entries yet. Run a calculation to populate the cache.</p> : <div className="space-y-2">{entries.map(([key, value]) => <div key={key} className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-xs"><code className="text-[#aab4ac]">{key}</code><span className="font-semibold text-[#c2f970]">{value}</span></div>)}</div>}
      </div>
      <p className="mt-4 text-[11px] leading-5 text-[#778279]">This is a browser-only demonstration using a simple in-memory cache. It does not represent a distributed cache or production benchmark.</p>
    </div>
  );
}


function PaymentWebhookLab() {
  type PaymentScenario = "success" | "duplicate" | "timeout" | "out-of-order";
  const [scenario, setScenario] = useState<PaymentScenario>("duplicate");
  const [played, setPlayed] = useState(false);
  const scenarios: Record<PaymentScenario, { title: string; description: string; events: { status: string; text: string; tone: string }[]; result: string; lesson: string }> = {
    success: { title: "Normal payment success", description: "The provider sends a verified event once.", events: [{ status: "01", text: "Receive webhook and verify signature", tone: "ok" }, { status: "02", text: "Check event ID / idempotency record", tone: "ok" }, { status: "03", text: "Apply payment state transition", tone: "ok" }, { status: "04", text: "Persist outcome and acknowledge provider", tone: "ok" }], result: "Payment moves to SUCCEEDED exactly once.", lesson: "Verify authenticity, validate the transition, and persist the event outcome." },
    duplicate: { title: "Duplicate webhook delivery", description: "Providers may retry delivery when acknowledgements are delayed or lost.", events: [{ status: "01", text: "Receive payment.succeeded · event evt_7F2", tone: "ok" }, { status: "02", text: "Idempotency store says event already processed", tone: "warn" }, { status: "03", text: "Skip the second state mutation", tone: "ok" }, { status: "04", text: "Return a successful acknowledgement", tone: "ok" }], result: "One business update; repeated delivery is safely ignored.", lesson: "Use a stable provider event ID or payment reference with a database uniqueness constraint. Do not rely on in-memory deduplication." },
    timeout: { title: "Timeout after processing", description: "The provider times out, but your service may already have committed the payment update.", events: [{ status: "01", text: "Verify webhook and begin transaction", tone: "ok" }, { status: "02", text: "Persist payment as SUCCEEDED", tone: "ok" }, { status: "03", text: "Response is lost / times out", tone: "warn" }, { status: "04", text: "Provider retries; idempotency check prevents reapplying", tone: "ok" }], result: "Retry is safe because the committed operation is idempotent.", lesson: "A timeout does not mean the operation failed. Design for at-least-once delivery and ambiguous outcomes." },
    "out-of-order": { title: "Out-of-order events", description: "A delayed pending event arrives after a success event.", events: [{ status: "01", text: "payment.succeeded arrives and is persisted", tone: "ok" }, { status: "02", text: "Older payment.pending event arrives later", tone: "warn" }, { status: "03", text: "Validate allowed state transition / provider version", tone: "ok" }, { status: "04", text: "Ignore stale event and record audit detail", tone: "ok" }], result: "Final state remains SUCCEEDED; stale events cannot regress it.", lesson: "Model payment states explicitly and use provider sequence/version data when available. Reconcile against the provider for uncertain cases." }
  };
  const current = scenarios[scenario];
  return <div className="panel overflow-hidden">
    <div className="border-b border-white/8 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-[#c2f970]" /> Payment webhook failure simulator</div><p className="mt-2 max-w-xl text-xs leading-5 text-[#89958c]">Explore common payment integration edge cases using synthetic events. No real payment API is called.</p></div><span className="pill !px-2 !py-1">Sandbox</span></div>
      <div className="mt-5 flex flex-wrap gap-2">{([{id:"success", label:"Success"},{id:"duplicate",label:"Duplicate event"},{id:"timeout",label:"Timeout"},{id:"out-of-order",label:"Out of order"}] as {id:PaymentScenario;label:string}[]).map(item => <button key={item.id} onClick={() => {setScenario(item.id);setPlayed(false);}} className={`rounded-lg border px-3 py-2 text-xs transition ${scenario===item.id ? "border-[#c2f970]/50 bg-[#c2f970]/10 text-[#d6f7b5]" : "border-white/10 text-[#aab4ac] hover:border-white/20"}`}>{item.label}</button>)}</div>
    </div>
    <div className="grid lg:grid-cols-[.9fr_1.1fr]"><div className="border-b border-white/8 p-5 sm:p-6 lg:border-b-0 lg:border-r"><p className="eyebrow">Scenario</p><h3 className="mt-3 text-xl font-semibold">{current.title}</h3><p className="mt-2 text-sm leading-6 text-[#9ba79e]">{current.description}</p><button onClick={() => setPlayed(true)} className="button-primary mt-5">{played ? "Replay scenario" : "Run scenario"} <ArrowRight size={14}/></button><div className="mt-6 rounded-xl border border-[#c2f970]/20 bg-[#c2f970]/[.04] p-4"><p className="text-xs font-semibold text-[#c2f970]">Expected outcome</p><p className="mt-2 text-sm leading-6 text-[#c4cdc6]">{played ? current.result : "Run the scenario to see the expected system outcome."}</p></div></div>
      <div className="p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#89958c]">Event timeline</p><span className="text-[10px] text-[#778279]">{played ? "Simulation complete" : "Ready to run"}</span></div><div className="space-y-3">{current.events.map((event,i)=><div key={event.status} className={`flex items-start gap-3 rounded-xl border p-3 transition ${played ? "border-white/10 bg-black/20 opacity-100" : "border-white/5 bg-black/10 opacity-65"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold ${event.tone==="warn" ? "bg-amber-400/10 text-amber-300" : "bg-[#c2f970]/10 text-[#c2f970]"}`}>{played ? <Check size={13}/> : event.status}</span><p className="pt-1 text-xs leading-5 text-[#b7c1b9]">{event.text}</p></div>)}</div>{played && <div className="mt-4 rounded-xl border border-white/8 p-4"><p className="text-xs font-semibold text-[#c2f970]">Design takeaway</p><p className="mt-2 text-sm leading-6 text-[#aab4ac]">{current.lesson}</p></div>}</div>
    </div><p className="border-t border-white/8 px-5 py-3 text-[10px] leading-5 text-[#778279]">Portfolio simulation only. A production implementation needs signature verification, durable storage, transactional state changes, observability, and provider-specific reconciliation.</p>
  </div>;
}

function NotificationReliabilityLab() {
  type Failure = "primary-down" | "timeout" | "all-down" | "success";
  const [failure, setFailure] = useState<Failure>("primary-down");
  const [run, setRun] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const flows: Record<Failure, { title: string; description: string; rows: { label: string; detail: string; state: "ok" | "warn" | "bad" }[]; outcome: string; lesson: string }> = {
    success: { title: "Primary provider succeeds", description: "The first provider accepts the request and returns a clear success response.", rows: [{label:"Validate request & preference",detail:"Check required fields and user channel preferences",state:"ok"},{label:"Send through primary provider",detail:"Provider returns an accepted response",state:"ok"},{label:"Persist delivery attempt",detail:"Store provider response and correlation ID",state:"ok"}], outcome:"Message accepted by primary provider.", lesson:"Track accepted, delivered, and failed as distinct statuses when the provider exposes those signals." },
    "primary-down": { title: "Primary provider unavailable", description: "The SMS provider returns a retryable error, so the fallback path is evaluated.", rows: [{label:"Validate and prepare message",detail:"Resolve destination, template, and user preference",state:"ok"},{label:"Primary provider fails",detail:"Retryable failure; bounded retry policy applies",state:"warn"},{label:"Apply backoff and retry budget",detail:`At most ${attempts} configured attempts before fallback`,state:"warn"},{label:"Fallback provider",detail:"Send via secondary provider and persist outcome",state:"ok"}], outcome:"Fallback provider accepts the message, if it is healthy.", lesson:"Use bounded exponential backoff with jitter, provider timeouts, circuit breakers, and a clear retry budget." },
    timeout: { title: "Provider request times out", description: "The provider may have accepted the message even though your request timed out.", rows: [{label:"Submit to primary provider",detail:"Request is sent but response does not arrive in time",state:"warn"},{label:"Outcome is ambiguous",detail:"A timeout alone cannot confirm whether delivery occurred",state:"bad"},{label:"Check provider capabilities",detail:"Use idempotency keys or status lookup if supported",state:"ok"},{label:"Decide retry vs fallback",detail:"Avoid automatic resend when it may create a duplicate",state:"warn"}], outcome:"Mark the attempt as unknown until reconciled; do not assume definite failure.", lesson:"Blind fallback after an ambiguous timeout can deliver duplicates. Model UNKNOWN separately and reconcile when possible." },
    "all-down": { title: "Both providers unavailable", description: "The primary and fallback provider are failing or rate-limited.", rows: [{label:"Primary attempt fails",detail:"Retryable error is recorded",state:"warn"},{label:"Fallback attempt fails",detail:"No provider is currently accepting requests",state:"bad"},{label:"Persist retryable failure",detail:"Keep correlation ID and attempt history",state:"ok"},{label:"Schedule controlled retry",detail:"Backoff, dead-letter/manual review after retry budget",state:"warn"}], outcome:"No delivery confirmation; retain the event for controlled retry and alerting.", lesson:"Durable retry state, dead-letter handling, metrics, and operational alerts matter more than infinite in-process retries." }
  };
  const current = flows[failure];
  return <div className="panel overflow-hidden">
    <div className="border-b border-white/8 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-semibold"><Radio size={16} className="text-[#c2f970]"/> Notification reliability lab</div><p className="mt-2 max-w-xl text-xs leading-5 text-[#89958c]">Test provider failures, retries, and fallback decisions for email/SMS delivery with mock outcomes.</p></div><span className="pill !px-2 !py-1">Synthetic traffic</span></div>
      <div className="mt-5 flex flex-wrap gap-2">{([{id:"success",label:"Success"},{id:"primary-down",label:"Primary down"},{id:"timeout",label:"Ambiguous timeout"},{id:"all-down",label:"All providers down"}] as {id:Failure;label:string}[]).map(item=><button key={item.id} onClick={()=>{setFailure(item.id);setRun(false);}} className={`rounded-lg border px-3 py-2 text-xs transition ${failure===item.id?"border-[#c2f970]/50 bg-[#c2f970]/10 text-[#d6f7b5]":"border-white/10 text-[#aab4ac] hover:border-white/20"}`}>{item.label}</button>)}</div>
    </div>
    <div className="grid lg:grid-cols-[.85fr_1.15fr]"><div className="border-b border-white/8 p-5 sm:p-6 lg:border-b-0 lg:border-r"><p className="eyebrow">Failure mode</p><h3 className="mt-3 text-xl font-semibold">{current.title}</h3><p className="mt-2 text-sm leading-6 text-[#9ba79e]">{current.description}</p><div className="mt-5 rounded-xl border border-white/8 bg-black/20 p-4"><div className="flex items-center justify-between text-xs"><label htmlFor="retry-count" className="text-[#aab4ac]">Retry budget</label><span className="font-semibold text-[#c2f970]">{attempts} attempts</span></div><input id="retry-count" type="range" min="1" max="5" value={attempts} onChange={e=>{setAttempts(Number(e.target.value));setRun(false);}} className="mt-3 w-full accent-[#c2f970]"/><div className="mt-1 flex justify-between text-[10px] text-[#778279]"><span>1 attempt</span><span>5 attempts</span></div></div><button onClick={()=>setRun(true)} className="button-primary mt-5">Simulate delivery <ArrowRight size={14}/></button><div className="mt-5 rounded-xl border border-[#c2f970]/20 bg-[#c2f970]/[.04] p-4"><p className="text-xs font-semibold text-[#c2f970]">Outcome</p><p className="mt-2 text-sm leading-6 text-[#c4cdc6]">{run?current.outcome:"Choose a failure mode and run the simulation."}</p></div></div>
      <div className="p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.13em] text-[#89958c]">Delivery attempt trace</p><span className="text-[10px] text-[#778279]">{run?"Trace generated":"Awaiting run"}</span></div><div className="space-y-3">{current.rows.map((row,i)=><div key={row.label} className={`rounded-xl border p-3 ${run?"border-white/10 bg-black/20":"border-white/5 bg-black/10 opacity-70"}`}><div className="flex items-start gap-3"><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${row.state==="bad"?"bg-rose-400/10 text-rose-300":row.state==="warn"?"bg-amber-400/10 text-amber-300":"bg-[#c2f970]/10 text-[#c2f970]"}`}>{run?(row.state==="bad"?"!":row.state==="warn"?"↻":"✓"):i+1}</span><div><p className="text-xs font-medium text-[#d2d9d3]">{row.label}</p><p className="mt-1 text-xs leading-5 text-[#89958c]">{row.detail}</p></div></div></div>)}</div>{run&&<div className="mt-4 rounded-xl border border-white/8 p-4"><p className="text-xs font-semibold text-[#c2f970]">Reliability lesson</p><p className="mt-2 text-sm leading-6 text-[#aab4ac]">{current.lesson}</p></div>}</div>
    </div><p className="border-t border-white/8 px-5 py-3 text-[10px] leading-5 text-[#778279]">This demo does not send real email or SMS. Production retry behavior should be based on provider error codes, delivery semantics, and business requirements.</p>
  </div>;
}

function CaseStudies() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const items = [
    { title: "Notification delivery across channels", category: "Fintech · API design", problem: "Loan lifecycle events need to reach users through email, SMS, and in-app channels.", approach: "Describe the actual request lifecycle, provider integrations, validation, worker communication, and failure-handling decisions you personally worked on.", lesson: "A reliable notification service needs clear delivery semantics, observability, and a deliberate strategy for ambiguous provider outcomes." },
    { title: "Document-generation reliability", category: "Reliability · Resource management", problem: "A LibreOffice-based generation flow exhausted Node.js worker capacity after a small number of agreements.", approach: "Document the investigation and Gotenberg proof of concept, separating verified implementation from proposed architecture changes.", lesson: "CPU- and memory-heavy work should be isolated, bounded with timeouts, and monitored independently of latency-sensitive API traffic." },
    { title: "Payment integration patterns", category: "Fintech · Third-party APIs", problem: "Payment and mandate workflows depend on external services with asynchronous status changes and failure modes.", approach: "Use sanitized examples to explain Cashfree one-time payments and Digio mandate management, including webhook verification and state transitions where applicable to your work.", lesson: "External API success, webhook delivery, and final business state are distinct. Idempotency and reconciliation help manage retries and uncertainty." }
  ];
  return <div className="space-y-3">{items.map((item, i) => <div key={item.title} className="panel overflow-hidden"><button onClick={() => setExpanded(expanded === i ? null : i)} className="flex w-full items-center gap-4 p-5 text-left sm:p-6"><span className="text-xs text-[#c2f970]">0{i + 1}</span><span className="min-w-0 flex-1"><span className="block text-base font-semibold">{item.title}</span><span className="mt-1 block text-xs text-[#8e9a90]">{item.category}</span></span><ChevronDown size={17} className={`text-[#9ba79e] transition-transform ${expanded === i ? "rotate-180" : ""}`} /></button>{expanded === i && <div className="grid gap-4 border-t border-white/8 p-5 sm:grid-cols-3 sm:p-6">{[["Problem", item.problem], ["Approach", item.approach], ["Engineering lesson", item.lesson]].map(([heading, body]) => <div key={heading}><p className="text-xs font-semibold text-[#c2f970]">{heading}</p><p className="mt-2 text-sm leading-6 text-[#aab4ac]">{body}</p></div>)}</div>}</div>)}</div>;
}

export default function Home() {
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);

  return (
    <>
      <PortfolioVisitTracker />
      <Header />
      <main>
        <section className="container relative grid min-h-[650px] items-center gap-12 py-20 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div className="absolute left-[8%] top-20 -z-10 h-72 w-72 rounded-full bg-[#c2f970]/[.05] blur-[90px]" />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c2f970]/20 bg-[#c2f970]/[.06] px-3 py-2 text-xs text-[#d6f7b5]"><span className="h-1.5 w-1.5 rounded-full bg-[#c2f970]" /> Backend engineering · Fintech · Systems</div>
            <p className="eyebrow">Hello, I&apos;m Akshat Mishra</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.06em] sm:text-6xl lg:text-[68px]">I build backend systems that <span className="text-[#c2f970]">work in the real world.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#9ba79e]">Backend engineer with 4+ years of experience building APIs, integrating fintech services, and improving the reliability of production workflows.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#work" className="button-primary">Explore my work <ArrowDownRight size={15} /></a><a href="#lab" className="button-secondary">Open system lab <Workflow size={15} /></a><button type="button" onClick={() => setResumePreviewOpen(open => !open)} aria-expanded={resumePreviewOpen} aria-controls="resume-preview" className="button-secondary">{resumePreviewOpen ? "Hide resume" : "Preview resume"} <Eye size={14} /></button></div>
            {resumePreviewOpen && <div id="resume-preview" className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#111611]">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3"><p className="text-sm font-medium">Resume preview</p><button type="button" onClick={() => setResumePreviewOpen(false)} className="text-xs text-[#c2f970] hover:text-white" aria-label="Close resume preview">Close</button></div>
              <iframe title="Akshat Mishra resume preview" src="https://zwlttlbhtfcegvcikogj.supabase.co/storage/v1/object/public/My_resume_Bucket/Akshat-Mishra-4-years-backend.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH" className="h-[70vh] min-h-[420px] w-full bg-white" />
            </div>}
            <div className="mt-10 flex flex-wrap gap-2">{tech.map(t => <span className="pill" key={t}>{t}</span>)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .12 }} className="panel grid-bg relative overflow-hidden p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/8 pb-4"><div><p className="text-sm font-semibold">System overview</p><p className="mt-1 text-xs text-[#7f8b81]">A backend engineer&apos;s playground</p></div><span className="pill !px-2 !py-1"><span className="h-1.5 w-1.5 rounded-full bg-[#c2f970]" /> Interactive</span></div>
            <div className="relative py-8">
              <div className="absolute left-1/2 top-12 h-[75%] border-l border-dashed border-[#c2f970]/35" />
              <div className="relative mx-auto max-w-[290px] rounded-xl border border-[#c2f970]/30 bg-[#c2f970]/[.07] p-4 text-center shadow-[0_0_45px_rgba(194,249,112,.05)]"><Code2 className="mx-auto mb-2 text-[#c2f970]" size={21} /><p className="text-sm font-semibold">API layer</p><p className="mt-1 text-xs text-[#89958c]">Node.js · TypeScript</p></div>
              <div className="relative mx-auto flex max-w-[340px] items-center justify-center gap-2 py-6"><span className="h-px w-10 bg-[#c2f970]/35" /><span className="rounded-full border border-white/10 bg-[#101411] px-3 py-2 text-[10px] text-[#aab4ac]">Validation & orchestration</span><span className="h-px w-10 bg-[#c2f970]/35" /></div>
              <div className="relative grid grid-cols-3 gap-2">
                {[{ name: "Data", icon: Database }, { name: "Cache", icon: Zap }, { name: "Providers", icon: Radio }].map(({ name, icon: Icon }) => <div key={name} className="rounded-xl border border-white/10 bg-[#0c100d]/90 p-3 text-center"><Icon className="mx-auto mb-2 text-[#c2f970]" size={17} /><p className="text-xs font-medium">{name}</p></div>)}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/8 pt-4 text-xs"><span className="text-[#89958c]">Focus: reliability · integrations · scale</span><span className="flex items-center gap-1 text-[#c2f970]"><GitBranch size={13} /> Systems thinking</span></div>
          </motion.div>
        </section>

        <section className="border-y border-white/5 bg-white/[.015]">
          <div className="container grid gap-6 py-6 sm:grid-cols-3">
            {[["4+ years", "Backend engineering"], ["Fintech", "Payments & notifications"], ["Production focus", "Reliability & integrations"]].map(([value, label]) => <div key={label} className="flex items-center gap-4 sm:justify-center"><div className="text-xl font-semibold tracking-tight text-[#c2f970]">{value}</div><div className="text-xs leading-5 text-[#89958c]">{label}</div></div>)}
          </div>
        </section>

        <section id="work" className="section">
          <div className="container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Selected engineering</p><h2 className="section-heading">Work that solves real problems.</h2><p className="max-w-xl text-sm leading-6 text-[#9ba79e]">A selection of backend systems and integration challenges. Each case study focuses on the engineering problem and the decisions behind it.</p></div><a href="#case-studies" className="button-secondary self-start sm:self-auto">Explore case studies <ArrowUpRight size={14} /></a></div>
            <div className="mt-9 grid gap-4 lg:grid-cols-3">{projects.map(project => { const Icon = project.icon; return <a href={project.href} key={project.number} className="panel card-hover flex min-h-[285px] flex-col p-5 sm:p-6"><div className="flex items-start justify-between"><span className="text-xs text-[#7e897f]">{project.number} / {project.label}</span><span className="rounded-xl border border-white/10 p-2 text-[#c2f970]"><Icon size={19} /></span></div><h3 className="mt-7 text-xl font-semibold tracking-tight">{project.title}</h3><p className="mt-3 text-sm leading-6 text-[#9ba79e]">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-md bg-white/[.04] px-2 py-1 text-[10px] text-[#aab4ac]">{tag}</span>)}</div><div className="mt-auto flex items-center justify-between pt-7 text-xs text-[#c2f970]"><span>{project.note}</span><ArrowUpRight size={15} /></div></a>; })}</div>
          </div>
        </section>

        <section id="lab" className="section border-y border-white/5 bg-white/[.015]">
          <div className="container">
            <p className="eyebrow">Explore the systems</p><h2 className="section-heading">Engineering, not just screenshots.</h2><p className="mb-9 max-w-2xl text-sm leading-6 text-[#9ba79e]">Inspect components, follow a request, and explore how retries and caching change system behavior. These are illustrative learning demos using synthetic data.</p>
            <ArchitectureLab />
            <div className="mt-5"><CacheDemo /></div>
            <div className="mt-5"><PaymentWebhookLab /></div>
            <div className="mt-5"><NotificationReliabilityLab /></div>
          </div>
        </section>

        <section id="case-studies" className="section">
          <div className="container grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div><p className="eyebrow">The engineering story</p><h2 className="section-heading">Context. Decisions. Trade-offs.</h2><p className="mt-4 text-sm leading-7 text-[#9ba79e]">Good engineering is more than implementation. It means understanding constraints, investigating failures, and explaining why a particular approach makes sense.</p><div className="mt-6 rounded-xl border border-[#c2f970]/20 bg-[#c2f970]/[.04] p-4"><p className="text-xs font-semibold text-[#c2f970]">Case-study principle</p><p className="mt-2 text-sm leading-6 text-[#bdc7bf]">Use real experience, anonymized details, and verifiable outcomes. Clearly label proposed improvements as proposals.</p></div></div>
            <CaseStudies />
          </div>
        </section>

        <section id="about" className="border-y border-white/5 bg-white/[.015] py-16">
          <div className="container grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-center">
            <div><p className="eyebrow">A little about me</p><h2 className="section-heading">Backend by craft.<br />Systems by mindset.</h2></div>
            <div><p className="text-sm leading-7 text-[#aab4ac]">I work on backend APIs and integrations, with experience across fintech workflows, notification delivery, payment-related services, and production troubleshooting. I care about clear interfaces, reliable behavior, and making engineering trade-offs explicit.</p><div className="mt-5 flex flex-wrap gap-2">{["API design", "Third-party integrations", "Failure handling", "Observability", "System design"].map(skill => <span className="pill" key={skill}>{skill}</span>)}</div></div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="panel relative overflow-hidden p-7 sm:p-12">
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#c2f970]/[.07] blur-[80px]" />
              <div className="relative max-w-2xl"><p className="eyebrow">Have a good engineering problem?</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Let&apos;s build something reliable.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-[#9ba79e]">I&apos;m interested in backend engineering opportunities where thoughtful design, reliable systems, and practical problem-solving matter.</p><div className="mt-7 flex flex-wrap gap-3"><a href="mailto:akshatmishra0098@gmail.com" className="button-primary"><Mail size={15} /> Email me</a><a href="https://github.com/BackendLovesMe" target="_blank" rel="noreferrer" className="button-secondary"><Github size={15} /> GitHub <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/in/akshat-mishra-3b7428181/" target="_blank" rel="noreferrer" className="button-secondary"><Linkedin size={15} /> LinkedIn <ArrowUpRight size={14} /></a></div></div>
            </div>
            <LeadCaptureForm />
          </div>
        </section>
      </main>
      <footer className="border-t border-white/5 py-6">
        <div className="container flex flex-col gap-2 text-xs text-[#778279] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Akshat Mishra</span><span>Designed for clarity. Built for engineering conversations.</span><a href="#" className="flex items-center gap-1 hover:text-[#c2f970]">Back to top <ArrowUpRight size={12} /></a></div>
      </footer>
    </>
  );
}
