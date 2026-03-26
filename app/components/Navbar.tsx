"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center bg-black text-white">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">CoreBoost</h1>

        <button onClick={() => router.push("/")} className="text-zinc-400 hover:text-white">
          Dashboard
        </button>

        <button onClick={() => router.push("/client/onboarding")} className="text-zinc-400 hover:text-white">
          Onboarding
        </button>

        <button onClick={() => router.push("/client/dashboard")} className="text-zinc-400 hover:text-white">
          Client
        </button>
      </div>

      {/* RIGHT */}
      <button
        onClick={() => {
          localStorage.removeItem("coreboost_auth");
          window.location.reload();
        }}
        className="text-red-400 text-sm"
      >
        Logout
      </button>

    </div>
  );
}