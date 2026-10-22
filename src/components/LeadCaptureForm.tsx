"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type Status = { kind: "idle" | "success" | "error"; message: string };

export default function LeadCaptureForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Recruitment");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus({ kind: "idle", message: "" });
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, reason, consent, website }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Couldn't submit your details.");
      setStatus({ kind: "success", message: "Thanks for connecting! Your details have been saved." });
      setName(""); setEmail(""); setReason("Recruitment"); setConsent(false);
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel mt-8 p-6 sm:p-8">
      <div className="mb-5">
        <p className="eyebrow">Optional · takes less than a minute</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">Enjoyed the portfolio?</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#9ba79e]">Leave your details if you&apos;d like to connect. This is optional and won&apos;t block access to the site.</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-[#dce5dc]">Name
          <input required maxLength={100} value={name} onChange={e => setName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#c2f970]" placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm text-[#dce5dc]">Email
          <input required type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#c2f970]" placeholder="you@company.com" />
        </label>
        <label className="grid gap-2 text-sm text-[#dce5dc] sm:col-span-2">I&apos;m visiting for
          <select value={reason} onChange={e => setReason(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#111611] px-4 py-3 text-sm text-white outline-none focus:border-[#c2f970]">
            <option>Recruitment</option><option>Networking</option><option>Engineering</option><option>Other</option>
          </select>
        </label>
        <label className="hidden" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label>
        <label className="flex items-start gap-3 text-xs leading-5 text-[#9ba79e] sm:col-span-2">
          <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 accent-[#c2f970]" />
          <span>I agree that my name, email, and selected reason may be stored so Akshat can understand and follow up on portfolio connections. Please see the site&apos;s privacy notice before submitting.</span>
        </label>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button disabled={busy} type="submit" className="button-primary disabled:cursor-not-allowed disabled:opacity-60">{busy ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}{busy ? "Saving..." : "Let's connect"}</button>
          {status.message && <p role="status" className={`text-sm ${status.kind === "error" ? "text-rose-300" : "text-[#c2f970]"}`}>{status.kind === "success" && <CheckCircle2 className="mr-1 inline" size={15} />}{status.message}</p>}
        </div>
      </form>
    </div>
  );
}
