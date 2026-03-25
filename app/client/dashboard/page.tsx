"use client";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Client Dashboard
      </h1>

      {/* BUSINESS INFO */}
      <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Business Info</h2>
        <p>Name: Example Plumbing</p>
        <p>City: Phoenix</p>
        <p>Service: Plumbing</p>
      </div>

      {/* SCORE */}
      <div className="mb-8 p-6 bg-zinc-900 border border-yellow-500/30 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">SEO Score</h2>
        <p className="text-5xl font-bold text-yellow-400">72</p>
      </div>

      {/* ISSUES */}
      <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Issues Found</h2>
        <ul className="space-y-2">
          <li>Missing meta description</li>
          <li>Low review count</li>
          <li>No recent Google activity</li>
        </ul>
      </div>

      {/* STRENGTHS */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Strengths</h2>
        <ul className="space-y-2">
          <li>Title tag present</li>
          <li>H1 tag present</li>
        </ul>
      </div>

    </main>
  );
}