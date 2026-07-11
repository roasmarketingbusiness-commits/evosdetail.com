"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const PACKAGE_OPTIONS = ["Exterior Detail", "Interior Detail", "The Full EVOS"];
const VEHICLE_OPTIONS = ["Sedan / Coupe", "SUV / Truck"];
const TIME_OPTIONS = ["Morning (8–11)", "Midday (11–2)", "Afternoon (2–6)"];

const inputClass =
  "w-full bg-transparent border-b border-hairline-strong focus:border-volt outline-none py-2.5 text-[15px] placeholder:text-ink-mute/60 transition-colors";
const labelClass =
  "font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute";

type Status = "idle" | "sending" | "sent" | "error";

export function Booking() {
  const [status, setStatus] = useState<Status>("idle");
  const [pkg, setPkg] = useState(PACKAGE_OPTIONS[2]);
  const [vehicle, setVehicle] = useState(VEHICLE_OPTIONS[0]);
  const [timeWindow, setTimeWindow] = useState(TIME_OPTIONS[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, package: pkg, vehicle, timeWindow }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function Chips({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`font-mono text-[11px] tracking-[0.1em] px-4 py-2 border transition-colors ${
              value === option
                ? "border-volt bg-volt text-paper"
                : "border-hairline-strong text-ink-soft hover:border-volt"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  return (
    <section id="book" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 80% 80%, var(--volt-dim) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16 items-start">
        <div>
          <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-volt mb-4">
            05 — Book
          </p>
          <h2 className="display leading-[0.95]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Lock in
            <br />
            your detail.
          </h2>
          <p className="mt-6 max-w-[42ch] text-[15px] text-ink-soft leading-relaxed">
            Send the request and we&rsquo;ll confirm your slot by text — usually
            within a couple hours. No payment until the job&rsquo;s done.
          </p>
        </div>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-volt p-8 md:p-10"
          >
            <h3 className="display text-[28px] text-volt">
              Request received.
            </h3>
            <p className="mt-4 text-[15px] text-ink-soft leading-relaxed">
              We got it. Expect a confirmation text shortly — if your slot&rsquo;s
              taken we&rsquo;ll offer the closest one.
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="border border-hairline bg-paper-rise/50 p-7 md:p-9 space-y-7 relative"
          >
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-7">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name *
                </label>
                <input id="name" name="name" required autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="zip" className={labelClass}>
                  Zip code *
                </label>
                <input
                  id="zip"
                  name="zip"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="date" className={labelClass}>
                  Preferred day *
                </label>
                <input id="date" name="date" type="date" required className={inputClass} />
              </div>
            </div>

            <div>
              <span className={labelClass}>Package</span>
              <Chips options={PACKAGE_OPTIONS} value={pkg} onChange={setPkg} />
            </div>
            <div>
              <span className={labelClass}>Vehicle</span>
              <Chips options={VEHICLE_OPTIONS} value={vehicle} onChange={setVehicle} />
            </div>
            <div>
              <span className={labelClass}>Time window</span>
              <Chips options={TIME_OPTIONS} value={timeWindow} onChange={setTimeWindow} />
            </div>

            <div>
              <label htmlFor="notes" className={labelClass}>
                Anything we should know?
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="Pet hair, kid chaos, apartment gate code process…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {status === "error" && (
              <p className="text-[13px] text-red-400">
                Something broke on our end — give it another shot in a minute.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="font-mono text-[11px] tracking-[0.28em] uppercase bg-ink text-paper px-10 py-4.5 hover:bg-volt transition-colors duration-300 disabled:opacity-60 w-full sm:w-auto"
            >
              {status === "sending" ? "Sending…" : "Request booking"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
