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
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  // GBP SCANNER STATES
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loadingGBP, setLoadingGBP] = useState(false);
  const [start, setStart] = useState(0);

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

  async function handleGBPScan(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!keyword || !city) return;

  // reset list when starting new scan
  if (start === 0) {
    setBusinesses([]);
  }

  setLoadingGBP(true);
  try {
    const res = await fetch("/api/gbp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword, city, start }),
    });

    const data = await res.json();

    console.log("GBP response:", data);

    setBusinesses((prev) => [...prev, ...data.businesses]);
    setStart(data.nextStart);

    setBusinesses((prev) => {
      const existing = new Set(prev.map((b) => b.name));
      const filtered = data.businesses.filter((b: any) => !existing.has(b.name));
      return [...prev, ...filtered];
    });
    setStart(data.nextStart);

  } catch {
    console.error("GBP scan failed");
  } finally {
    setLoadingGBP(false);
  }
}

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">

        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight">
            CoreBoost SEO Tools
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Scan Google Business Profiles and websites instantly while cold calling.
          </p>
        </div>

        {/* GBP SCANNER */}

        <section className="mb-16">

          <h2 className="text-3xl font-semibold mb-4">
            GBP Scanner
          </h2>

          <form
            onSubmit={handleGBPScan}
            className="flex flex-wrap gap-4"
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Keyword (ex: plumber)"
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
              disabled={loadingGBP}
              className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loadingGBP ? "Scanning..." : "Scan GBP"}
            </button>
          </form>

          {businesses.length > 0 && (
            <>

              <div className="mt-6 space-y-3 max-h-[400px] overflow-y-auto">

                {businesses.map((biz, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <div className="text-lg font-semibold">
                      {biz.name}
                    </div>

                    <div className="text-sm text-zinc-400">
                      ⭐ {biz.rating} • {biz.reviews} reviews
                    </div>

                  </div>
                ))}

              </div>

              <button
                onClick={(e) => handleGBPScan(e as any)}
                className="mt-4 rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black"
              >
                Load More Businesses
              </button>

            </>
          )}

        

        </section>

        {/* WEBSITE AUDIT */}

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
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-white outline-none placeholder:text-zinc-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-yellow-500 px-8 py-4 font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-70"
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

                <h2 className="mt-2 text-2xl font-semibold">
                  {submittedUrl}
                </h2>
              </div>

              <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-zinc-900 p-6">
                <p className="text-sm uppercase tracking-wide text-zinc-400">
                  SEO Score
                </p>

                <div className="mt-2 text-6xl font-bold text-yellow-400">
                  {result.score}
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">

                <div>
                  <h3 className="mb-4 text-xl font-semibold">
                    Issues Found
                  </h3>

                  <ul className="space-y-3 text-zinc-300">
                    {result.issues.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold">
                    Strengths
                  </h3>

                  <ul className="space-y-3 text-zinc-300">
                    {result.strengths.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                      >
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