"use client";

import { useState } from "react";

export default function Onboarding() {
  const [form, setForm] = useState({
    name: "",
    website: "",
    phone: "",
    city: "",
    service: "",
    googleLink: "",
    goals: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("CLIENT DATA:", form);
    alert("Submitted (check console)");
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Client Onboarding
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4"
      >

        <input name="name" placeholder="Business Name"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <input name="website" placeholder="Website URL"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <input name="phone" placeholder="Phone Number"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <input name="city" placeholder="Service Area / City"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <input name="service" placeholder="Main Service (plumbing, roofing, etc.)"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <input name="googleLink" placeholder="Google Business Profile Link"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <textarea name="goals" placeholder="What are your goals?"
          onChange={handleChange}
          className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded" />

        <button
          type="submit"
          className="bg-yellow-500 text-black px-6 py-3 rounded font-semibold"
        >
          Submit
        </button>

      </form>
    </main>
  );
}