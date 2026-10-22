"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Download, LogOut, LockKeyhole, RefreshCw, Users } from "lucide-react";

type Lead = { id: number; name: string; email: string; reason: string; created_at: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  async function loadLeads() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/leads", { cache: "no-store" });
      if (response.status === 401) { setAuthenticated(false); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load leads.");
      setLeads(data.leads || []); setTotal(data.total || 0); setAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false); setChecking(false);
    }
  }

  useEffect(() => { void loadLeads(); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      setPassword(""); await loadLeads();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
    } finally { setLoading(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false); setLeads([]); setTotal(0);
  }

  const csv = useMemo(() => {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
    return ["Name,Email,Reason,Registered at", ...leads.map(l => [l.name, l.email, l.reason, new Date(l.created_at).toISOString()].map(quote).join(","))].join("\n");
  }, [leads]);

  function downloadCsv() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "portfolio-leads.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#090d0a] px-4 py-12 text-[#eef4ed] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-[#c2f970] hover:underline">← Back to portfolio</a>
        {!authenticated ? (
          <div className="panel mx-auto mt-16 max-w-md p-7 sm:p-9">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c2f970]/10 text-[#c2f970]"><LockKeyhole /></div>
            <p className="eyebrow">Private area</p><h1 className="mt-2 text-3xl font-semibold">Lead dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-[#9ba79e]">Sign in to view voluntary portfolio registrations.</p>
            {checking && <p className="mt-4 text-sm text-[#9ba79e]">Checking session…</p>}
            <form onSubmit={login} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm">Admin password
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#c2f970]" autoComplete="current-password" />
              </label>
              <button className="button-primary w-full justify-center" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
            </form>
            {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="eyebrow">Portfolio connections</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Lead dashboard</h1><p className="mt-2 text-sm text-[#9ba79e]">Private registrations submitted through your portfolio.</p></div>
              <div className="flex gap-2">
                <button onClick={() => void loadLeads()} className="button-secondary"><RefreshCw size={15} /> Refresh</button>
                <button onClick={downloadCsv} disabled={!leads.length} className="button-secondary disabled:opacity-40"><Download size={15} /> Export CSV</button>
                <button onClick={logout} className="button-secondary"><LogOut size={15} /> Log out</button>
              </div>
            </div>
            {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
            <div className="panel mt-8 flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c2f970]/10 text-[#c2f970]"><Users /></div>
              <div><p className="text-sm text-[#9ba79e]">Total registrations</p><p className="text-3xl font-semibold">{total}</p></div>
            </div>
            <div className="panel mt-6 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-[#9ba79e]"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Reason</th><th className="p-4">Registered</th></tr></thead>
                <tbody>{leads.map(lead => <tr key={lead.id} className="border-b border-white/5 last:border-0"><td className="p-4">{lead.name}</td><td className="p-4">{lead.email}</td><td className="p-4">{lead.reason}</td><td className="p-4 text-[#9ba79e]">{new Date(lead.created_at).toLocaleString()}</td></tr>)}</tbody>
              </table>
              {!leads.length && <p className="p-8 text-center text-sm text-[#9ba79e]">{loading ? "Loading registrations…" : "No registrations yet."}</p>}
              {leads.length > 0 && <p className="p-4 text-xs text-[#778279]">Showing the latest {leads.length} records (up to 500).</p>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
