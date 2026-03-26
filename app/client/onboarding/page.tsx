"use client";

import { useState } from "react";

export default function ClientSetup() {
  const steps = [
    "Collect client info (name, phone, website)",
    "Run full Google + website audit",
    "Identify main keyword + service area",
    "Analyze top 3 competitors",
    "Optimize Google Business Profile",
    "Start review strategy",
    "Fix citations (NAP consistency)",
    "Begin posting + activity signals",
  ];

  const [completed, setCompleted] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const toggleStep = (index: number) => {
    const updated = [...completed];
    updated[index] = !updated[index];
    setCompleted(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">
        Client Setup Workflow
      </h1>

      <p className="text-zinc-400">
        Follow this process after closing a new client to ensure consistent results.
      </p>

      {/* CHECKLIST */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">

        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-black border border-zinc-700 rounded"
          >
            <span>{step}</span>

            <input
              type="checkbox"
              checked={completed[i]}
              onChange={() => toggleStep(i)}
              className="w-5 h-5"
            />
          </div>
        ))}

      </div>

    </div>
  );
}