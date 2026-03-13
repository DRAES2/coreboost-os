"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | {
    score: number;
    issues: string[];
    wins: string[];
  }>(null);

  function handleAudit(e: React.FormEvent) {
    e.preventDefault();

    if (!url.trim()) return;

    setResult({
      score: 72,
      issues: [
        "Meta description is missing",
        "Page speed needs improvement",
        "Internal linking is weak",
      ],
      wins: [
        "Homepage is indexed",
        "Title tag exists",
        "Site is reachable",
      ],
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">CoreBoost SEO Audit</h1>
          <p className="mt-3 text-zinc-300 text-lg">
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
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400"
          >
            Run Audit
          </button>
        </form>

        {result && (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold">Audit Results</h2>
            <p className="mt-2 text-zinc-300">URL: {url}</p>

            <div className="mt-6">
              <div className="text-5xl font-bold text-yellow-400">{result.score}</div>
              <div className="text-zinc-400">SEO Score</div>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Issues Found</h3>
                <ul className="space-y-2 text-zinc-300">
                  {result.issues.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">What’s Working</h3>
                <ul className="space-y-2 text-zinc-300">
                  {result.wins.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}