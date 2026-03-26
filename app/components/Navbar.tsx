"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-white font-semibold"
      : "text-zinc-400 hover:text-white";

  return (
    <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center bg-black text-white">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">CoreBoost</h1>

        <button
          onClick={() => router.push("/")}
          className={linkClass("/")}
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/client/onboarding")}
          className={linkClass("/client/onboarding")}
        >
          Client Setup
        </button>

        <button
          onClick={() => router.push("/client")}
          className={linkClass("/client")}
        >
          Clients
        </button>

        <button
          onClick={() => router.push("/client/dashboard")}
          className={linkClass("/client/dashboard")}
        >
          Client View
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