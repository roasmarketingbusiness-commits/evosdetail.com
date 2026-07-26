"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-xs">
        <p className="eyebrow mb-2 text-ink-mute">Crew access</p>
        <h1 className="display mb-8 text-3xl">Sign in</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
          }}
          placeholder="Password"
          autoFocus
          className="mb-4 w-full border-b border-hairline-strong bg-transparent py-3 text-ink outline-none placeholder:text-ink-mute focus:border-volt"
        />
        {status === "error" && (
          <p className="mb-4 text-sm text-red-400">Wrong password — try again.</p>
        )}
        <button
          type="submit"
          disabled={status === "sending" || !password}
          className="btn-glass-volt w-full px-6 py-3 disabled:opacity-50"
        >
          {status === "sending" ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
