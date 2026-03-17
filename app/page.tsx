"use client";

import { useState } from "react";

type AuditResult = {
  score: number;
  issues: string[];
  strengths: string[];
  error?: string;
};

export default function Home() {

  // WEBSITE AUDIT STATES
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [requestError, setRequestError] = useState("");

  // LEAD FINDER STATES
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  // -------------------------------
  // WEBSITE AUDIT
  // -------------------------------
  async function handleAudit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setSubmittedUrl(cleanUrl);
    setLoadingAudit(true);
    setRequestError("");
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await res.json();

      setResult({
        score: data.score ?? 0,
        issues: data.issues ?? [],
        strengths: data.strengths ?? [],
        error: data.error,
      });
    } catch {
      setRequestError("Something went wrong while running the audit.");
    } finally {
      setLoadingAudit(false);
    }
  }

  // -------------------------------
  // LEAD FINDER (CONNECTED TO SCRAPER)
  // -------------------------------
  async function handleLeadSearch(e: any) {
    e.preventDefault();

    if (!keyword || !city) return;

    setLoadingLeads(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${keyword} ${city}`,
        }),
      });

      const data = await res.json();

      setLeads(data.leads || []);
    } catch (err) {
      console.error("Lead scrape failed:", err);
    } finally {
      setLoadingLeads(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight">
            CoreBoost SEO Tools
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Find leads and audit websites instantly while cold calling.
          </p>
        </div>

        {/* ========================= */}
        {/* LEAD FINDER */}
        {/* ========================= */}

        <section className="mb-16">

          <h2 className="text-3xl font-semibold mb-4">
            Lead Finder
          </h2>

          <form
            onSubmit={handleLeadSearch}
            className="flex flex-wrap gap-4"
          >

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Service (ex: plumber)"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            />

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (ex: phoenix)"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3"
            />

            <button
              type="submit"
              disabled={loadingLeads}
              className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loadingLeads ? "Finding Leads..." : "Find Leads"}
            </button>

          </form>

          {/* RESULTS */}

          {leads.length > 0 && (
            <div className="mt-6 max-h-[400px] overflow-y-auto space-y-3">

              {leads.map((lead, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="text-lg font-semibold">
                    {lead.position}. {lead.name}
                  </div>

                  <div className="text-sm text-zinc-300">
                    📞 {lead.phone || "No phone"}
                  </div>

                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      className="text-sm text-blue-400 underline"
                    >
                      Website
                    </a>
                  )}
                </div>
              ))}

            </div>
          )}

        </section>

        {/* ========================= */}
        {/* WEBSITE AUDIT */}
        {/* ========================= */}

        <section>

          <h2 className="text-3xl font-semibold mb-4">
            Website Audit
          </h2>

          <form
            onSubmit={handleAudit}
            className="flex flex-col gap-4 sm:flex-row"
          >

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a website URL"
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-white outline-none"
            />

            <button
              type="submit"
              disabled={loadingAudit}
              className="rounded-xl bg-yellow-500 px-8 py-4 font-semibold text-black disabled:opacity-70"
            >
              {loadingAudit ? "Running Audit..." : "Run Audit"}
            </button>

          </form>

          {requestError && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
              {requestError}
            </div>
          )}

          {result && (
            <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-8">

              <div className="mb-6">
                <p className="text-sm uppercase text-zinc-400">
                  Audit Results
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {submittedUrl}
                </h2>
              </div>

              <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-zinc-900 p-6">
                <div className="text-6xl font-bold text-yellow-400">
                  {result.score}
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">

                <div>
                  <h3 className="mb-4 text-xl font-semibold">
                    Issues
                  </h3>

                  <ul className="space-y-3">
                    {result.issues.map((item) => (
                      <li key={item} className="bg-zinc-900 p-3 rounded">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold">
                    Strengths
                  </h3>

                  <ul className="space-y-3">
                    {result.strengths.map((item) => (
                      <li key={item} className="bg-zinc-900 p-3 rounded">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </section>
          )}

        </section>

      </div>
    </main>
  );
}