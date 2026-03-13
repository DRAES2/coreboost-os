"use client";

import { useState } from "react";

type AuditResult = {
  score: number;
  issues: string[];
  strengths: string[];
  error?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  async function handleAudit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setSubmittedUrl(cleanUrl);
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight">CoreBoost SEO Audit</h1>
          <p className="mt-4 text-lg text-zinc-300">
            Run a fast website audit and uncover SEO issues, missed opportunities,
            and next-step fixes.
          </p>
        </div>

        <form onSubmit={handleAudit} className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a website URL"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-yellow-500 px-8 py-4 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </button>
        </form>

        {requestError && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
            {requestError}
          </div>
        )}

        {result && (
          <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
            {result.error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-red-200">
                {result.error}
              </div>
            )}
            <div className="mb-6">
              <p className="text-sm uppercase tracking-wide text-zinc-400">
                Audit Results
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{submittedUrl}</h2>
            </div>

            <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-zinc-900 p-6">
              <p className="text-sm uppercase tracking-wide text-zinc-400">SEO Score</p>
              <div className="mt-2 text-6xl font-bold text-yellow-400">
                {result.score}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Issues Found</h3>
                <ul className="space-y-3 text-zinc-300">
                  {result.issues.map((item) => (
                    <li key={item} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold">Strengths</h3>
                <ul className="space-y-3 text-zinc-300">
                  {result.strengths.map((item) => (
                    <li key={item} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}