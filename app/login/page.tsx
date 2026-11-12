"use client";

import { useState } from "react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-[26px] border border-border bg-card p-6 shadow-2xl shadow-black/20">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">DeskBot · Zentrix IT</p>
        <h1 className="mt-2 text-xl font-semibold">Enter team passcode</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to get help with workplace IT issues.</p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="mt-5 min-h-11 w-full rounded-xl border border-border bg-background px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Passcode"
          autoFocus
        />
        {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading || !passcode}
          className="mt-4 min-h-11 w-full rounded-xl bg-accent px-3 py-3 font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </main>
  );
}
