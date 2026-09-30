"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/");
      router.refresh();
    } else {
      setError("Incorrect password. Try again.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-5xl text-cream mb-2">THE CRESCENT</h1>
          <p className="font-script text-gold text-3xl">Admin Panel</p>
        </div>
        <form
          onSubmit={submit}
          className="bg-wine border-2 border-gold/40 rounded-2xl p-8 shadow-2xl"
        >
          <label className="block text-cream/80 text-sm font-semibold mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-full bg-cream text-cocoa border-2 border-gold focus:border-burgundy focus:outline-none mb-4"
            placeholder="Enter password"
          />
          {error && <p className="text-terracotta text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-burgundy text-cream py-3 rounded-full font-bold hover:bg-terracotta transition-colors border-2 border-gold/50 disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-cream/40 text-xs mt-4">
            Demo password: crescent@123
          </p>
        </form>
      </div>
    </main>
  );
}