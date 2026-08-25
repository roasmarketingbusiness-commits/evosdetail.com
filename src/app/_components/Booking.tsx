"use client";

import { track } from "@vercel/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const PACKAGES: Record<string, { sedan: number; suv: number; van: number }> = {
  "Exterior Detail": { sedan: 69, suv: 89, van: 109 },
  "Interior Detail": { sedan: 119, suv: 149, van: 179 },
  "The Full EVOS": { sedan: 169, suv: 209, van: 249 },
};
const VEHICLES = ["Sedan / Coupe", "SUV / Truck", "3-Row / Van"];
const CONDITIONS = [
  "Lightly lived-in — just needs a refresh",
  "Pretty dirty — it’s been a while",
  "Send help — kids, pets, or serious buildup",
];
// Weekend-only operation: Saturday & Sunday, 8am–8pm.
const TIMES = [
  "Morning (8–11)",
  "Midday (11–2)",
  "Afternoon (2–5)",
  "Evening (5–8)",
];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STEP_COUNT = 7;
const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "w-full bg-transparent border-b border-hairline-strong focus:border-volt outline-none py-3 text-[17px] placeholder:text-ink-mute/50 transition-colors";
const labelClass =
  "font-medium text-[12px] text-ink-mute";

type Status = "idle" | "sending" | "sent" | "error";

interface Answers {
  package: string;
  vehicle: string;
  condition: string;
  date: string;
  timeWindow: string;
  address: string;
  name: string;
  phone: string;
  notes: string;
}

const EMPTY: Answers = {
  package: "",
  vehicle: "",
  condition: "",
  date: "",
  timeWindow: "",
  address: "",
  name: "",
  phone: "",
  notes: "",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Weekend-only operation: the picker offers ONLY the next few Saturdays
// and Sundays — no month grid, no grayed-out weekdays.
function upcomingWeekendDates(count: number): Date[] {
  const dates: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // bookings start tomorrow at the earliest
  while (dates.length < count) {
    if (d.getDay() === 0 || d.getDay() === 6) dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function WeekendPicker({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: string) => void;
}) {
  const options = upcomingWeekendDates(8);
  return (
    <div className="grid grid-cols-2 gap-2.5 max-w-[420px]">
      {options.map((date) => {
        const key = toKey(date);
        const label = `${DAY_SHORT[date.getDay()]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`font-medium text-[13px] px-4 py-2.5 border transition-colors ${
              value === key
                ? "border-volt bg-volt text-paper"
                : "border-hairline-strong text-ink-soft hover:border-volt"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Chips({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`text-left font-medium text-[12px] px-5 py-4 border transition-colors duration-200 ${
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

export function Booking() {
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [stepError, setStepError] = useState("");

  const set = (patch: Partial<Answers>) =>
    setAnswers((a) => ({ ...a, ...patch }));

  const price =
    answers.package && answers.vehicle
      ? PACKAGES[answers.package][
          answers.vehicle === "SUV / Truck"
            ? "suv"
            : answers.vehicle === "3-Row / Van"
              ? "van"
              : "sedan"
        ]
      : null;

  const LAUNCH_DISCOUNT = 40;
  const isLaunchDeal = answers.package === "The Full EVOS";
  const finalPrice =
    price !== null && isLaunchDeal ? price - LAUNCH_DISCOUNT : price;

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStepError("");
    setStep(next);
  }

  function validate(current: number): string {
    switch (current) {
      case 0:
        return answers.package ? "" : "Pick a package to keep going.";
      case 1:
        return answers.vehicle ? "" : "Pick your vehicle type.";
      case 2:
        return answers.condition ? "" : "Pick a level — no judgment.";
      case 3:
        return answers.date && answers.timeWindow
          ? ""
          : "Pick a Saturday or Sunday and a time window.";
      case 4:
        return answers.address.trim().length >= 8
          ? ""
          : "Enter the address where the car will be parked.";
      case 5:
        return answers.name.trim() && answers.phone.trim().length >= 7
          ? ""
          : "We need a name and a phone number to confirm your booking.";
      default:
        return "";
    }
  }

  function next() {
    const error = validate(step);
    if (error) {
      setStepError(error);
      return;
    }
    goTo(step + 1);
  }

  function selectAndAdvance(patch: Partial<Answers>) {
    set(patch);
    setStepError("");
    setTimeout(() => {
      setDirection(1);
      setStep((s) => s + 1);
    }, 250);
  }

  async function submit() {
    if (status === "sending") return;
    setStatus("sending");
    try {
      // Straight from the browser: FormSubmit blocks datacenter IPs, so a
      // server-side relay (e.g. through our own API route) never delivers.
      // The random alias keeps the destination inbox out of the page source.
      const res = await fetch("https://formsubmit.co/ajax/11151ef754bd28b6ca6db1c46862bf07", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `EVOS booking: ${answers.package} — ${answers.name}`,
          _template: "table",
          name: answers.name,
          phone: answers.phone,
          address: answers.address,
          package: answers.package,
          vehicle: answers.vehicle,
          condition: answers.condition,
          preferred_day: answers.date,
          time_window: answers.timeWindow,
          notes: answers.notes || "—",
        }),
      });
      // FormSubmit returns HTTP 200 even on refusal — check the body
      const body = await res.json().catch(() => null);
      if (!res.ok || !body || String(body.success) !== "true") {
        throw new Error(body?.message || `status ${res.status}`);
      }
      // best-effort Telegram ping to the crew — email above is the
      // system of record, so a Telegram hiccup never fails the booking
      fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, date: prettyDate, company: "" }),
      }).catch(() => {});
      // best-effort CRM capture — keeps the ISO date, unlike Telegram above
      fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, finalPrice, company: "" }),
      }).catch(() => {});
      // conversion tracking — Vercel Analytics + GA4 (feeds Google Ads)
      track("booking_submitted", {
        package: answers.package,
        vehicle: answers.vehicle,
        value: finalPrice ?? 0,
      });
      window.gtag?.("event", "generate_lead", {
        package: answers.package,
        vehicle: answers.vehicle,
        value: finalPrice ?? 0,
        currency: "USD",
      });
      // Google Ads conversion — needs NEXT_PUBLIC_AW_ID (AW-XXXXXXXXXX)
      // and NEXT_PUBLIC_AW_BOOKING_LABEL from the conversion action's
      // "install the tag yourself" snippet in Google Ads
      if (
        process.env.NEXT_PUBLIC_AW_ID &&
        process.env.NEXT_PUBLIC_AW_BOOKING_LABEL
      ) {
        // enhanced conversions: gtag hashes these in the browser before
        // sending; raw values never leave the page. Phone must be E.164.
        const digits = answers.phone.replace(/\D/g, "");
        const e164 =
          digits.length === 10
            ? `+1${digits}`
            : digits.length === 11 && digits.startsWith("1")
              ? `+${digits}`
              : null;
        const [firstName, ...rest] = answers.name.trim().split(/\s+/);
        const zip = answers.address.match(/\b\d{5}\b/)?.[0];
        if (e164) {
          window.gtag?.("set", "user_data", {
            phone_number: e164,
            ...(firstName && rest.length && zip
              ? {
                  address: {
                    first_name: firstName,
                    last_name: rest.join(" "),
                    postal_code: zip,
                    country: "US",
                  },
                }
              : {}),
          });
        }
        window.gtag?.("event", "conversion", {
          send_to: `${process.env.NEXT_PUBLIC_AW_ID}/${process.env.NEXT_PUBLIC_AW_BOOKING_LABEL}`,
          value: finalPrice ?? 0,
          currency: "USD",
        });
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && step < STEP_COUNT - 1) {
      e.preventDefault();
      next();
    }
  }

  const prettyDate = (() => {
    if (!answers.date) return "";
    const [y, m, d] = answers.date.split("-").map(Number);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[m - 1]} ${d}, ${y}`;
  })();

  const summaryRows: Array<[string, string]> = [
    ["Package", answers.package || "—"],
    ["Vehicle", answers.vehicle || "—"],
    ["Condition", answers.condition ? answers.condition.split(" — ")[0] : "—"],
    [
      "When",
      prettyDate
        ? `${prettyDate}${answers.timeWindow ? " · " + answers.timeWindow : ""}`
        : "—",
    ],
    ["Address", answers.address || "—"],
  ];

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
          <p className="eyebrow text-volt mb-4">
            05 — Book
          </p>
          <h2 className="display leading-[0.95]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Lock in
            <br />
            your detail.
          </h2>
          <p className="mt-6 max-w-[42ch] text-[15px] text-ink-soft leading-relaxed">
            Seven quick questions. We confirm your slot by text — usually
            within a couple hours. No payment until the job&rsquo;s done.
          </p>
          <p className="mt-3 max-w-[42ch] text-[15px] text-ink-soft leading-relaxed">
            Prefer to talk? Call or text{" "}
            <a href="tel:+18323875145" className="text-volt hover:underline">
              (832) 387-5145
            </a>
            .
          </p>

          {/* running summary */}
          <div className="mt-10 border border-hairline bg-paper-rise/40 p-6">
            <p className="eyebrow text-ink-mute mb-5">
              Your detail
            </p>
            <dl className="space-y-3">
              {summaryRows.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-6">
                  <dt className="font-medium text-[13px] text-ink-mute">
                    {label}
                  </dt>
                  <dd
                    className={`text-[14px] text-right ${
                      value === "—" ? "text-ink-faint" : "text-ink"
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <AnimatePresence>
              {price !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 pt-5 border-t border-hairline flex items-baseline justify-between">
                    <span className="font-medium text-[13px] text-ink-mute">
                      Starting at
                    </span>
                    <span className="flex items-baseline gap-2">
                      {isLaunchDeal && (
                        <span className="text-[16px] text-ink-faint line-through">
                          ${price}
                        </span>
                      )}
                      <span className="display text-[34px] leading-none text-volt">
                        ${finalPrice}
                      </span>
                    </span>
                  </div>
                  {isLaunchDeal && (
                    <p className="mt-2 text-right text-[12px] text-volt">
                      Launch special applied — first 10 bookings
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-volt p-8 md:p-10"
            >
              <h3 className="display text-[28px] text-volt">Request received.</h3>
              <p className="mt-4 text-[15px] text-ink-soft leading-relaxed">
                We got it. Expect a confirmation text shortly — if your slot&rsquo;s
                taken we&rsquo;ll offer the closest one.
              </p>
            </motion.div>
          ) : (
            <div
              onKeyDown={onKeyDown}
              className="border border-hairline bg-paper-rise/50 p-7 md:p-9 min-h-[420px] flex flex-col"
            >
              {/* progress */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[12px] text-ink-mute">
                  {String(step + 1).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
                </span>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="font-medium text-[12px] text-ink-mute hover:text-volt transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </div>
              <div className="h-px bg-hairline mb-8 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-volt"
                  animate={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
                  transition={{ duration: 0.4, ease }}
                />
              </div>

              <div className="relative flex-1">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: 44 * direction }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -44 * direction }}
                    transition={{ duration: 0.35, ease }}
                  >
                    {step === 0 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          Which detail are we doing?
                        </h3>
                        <Chips
                          options={Object.keys(PACKAGES)}
                          value={answers.package}
                          onSelect={(v) => selectAndAdvance({ package: v })}
                        />
                      </div>
                    )}
                    {step === 1 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          What are you driving?
                        </h3>
                        <Chips
                          options={VEHICLES}
                          value={answers.vehicle}
                          onSelect={(v) => selectAndAdvance({ vehicle: v })}
                        />
                      </div>
                    )}
                    {step === 2 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          How dirty are we talking?
                        </h3>
                        <Chips
                          options={CONDITIONS}
                          value={answers.condition}
                          onSelect={(v) => selectAndAdvance({ condition: v })}
                        />
                      </div>
                    )}
                    {step === 3 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          When works for you?
                        </h3>
                        <span className={labelClass}>Preferred day</span>
                        <p className="mt-2 text-[13px] text-ink-mute">
                          We detail on weekends — Saturdays &amp; Sundays,
                          8am–8pm.
                        </p>
                        <div className="mt-3 mb-7">
                          <WeekendPicker
                            value={answers.date}
                            onSelect={(v) => set({ date: v })}
                          />
                        </div>
                        <span className={labelClass}>Time window</span>
                        <div className="flex flex-wrap gap-2.5 pt-3">
                          {TIMES.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => set({ timeWindow: t })}
                              className={`font-medium text-[13px] px-4 py-2.5 border transition-colors ${
                                answers.timeWindow === t
                                  ? "border-volt bg-volt text-paper"
                                  : "border-hairline-strong text-ink-soft hover:border-volt"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {step === 4 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          Where&rsquo;s the car parked?
                        </h3>
                        <label htmlFor="address" className={labelClass}>
                          Address
                        </label>
                        <input
                          id="address"
                          type="text"
                          autoComplete="street-address"
                          value={answers.address}
                          onChange={(e) => set({ address: e.target.value })}
                          placeholder="14035 FM 2090, Splendora, TX 77372"
                          autoFocus
                          className={inputClass}
                        />
                        <p className="mt-4 text-[13px] text-ink-mute leading-relaxed">
                          Inside the zone on our service-area map is standard
                          pricing — a little outside adds a flat $20 travel
                          fee. We&rsquo;ll confirm either way.
                        </p>
                      </div>
                    )}
                    {step === 5 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          How do we reach you?
                        </h3>
                        <label htmlFor="name" className={labelClass}>
                          Name
                        </label>
                        <input
                          id="name"
                          value={answers.name}
                          onChange={(e) => set({ name: e.target.value })}
                          autoComplete="name"
                          autoFocus
                          className={`${inputClass} mb-7`}
                        />
                        <label htmlFor="phone" className={labelClass}>
                          Phone
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={answers.phone}
                          onChange={(e) => set({ phone: e.target.value })}
                          autoComplete="tel"
                          className={inputClass}
                        />
                      </div>
                    )}
                    {step === 6 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          Anything we should know?
                        </h3>
                        <textarea
                          rows={3}
                          value={answers.notes}
                          onChange={(e) => set({ notes: e.target.value })}
                          placeholder="Pet hair, kid chaos, gate code process… (optional)"
                          autoFocus
                          className={`${inputClass} resize-none`}
                        />
                        {status === "error" && (
                          <p className="mt-4 text-[13px] text-red-400">
                            Something broke on our end — give it another shot
                            in a minute.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {stepError && (
                <p className="mt-4 text-[13px] text-red-400">{stepError}</p>
              )}

              <div className="mt-8">
                {step >= 3 && step < STEP_COUNT - 1 && (
                  <button
                    type="button"
                    onClick={next}
                    className="btn-glass-volt font-medium text-[13px] px-10 py-4 w-full sm:w-auto"
                  >
                    Next
                  </button>
                )}
                {step === STEP_COUNT - 1 && (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={status === "sending"}
                    className="btn-glass-volt font-medium text-[13px] px-10 py-4 disabled:opacity-60 w-full sm:w-auto"
                  >
                    {status === "sending" ? "Sending…" : "Request booking"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
