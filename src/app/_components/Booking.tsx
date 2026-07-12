"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const PACKAGES: Record<string, { sedan: number; suv: number }> = {
  "Exterior Detail": { sedan: 99, suv: 129 },
  "Interior Detail": { sedan: 129, suv: 159 },
  "The Full EVOS": { sedan: 189, suv: 239 },
};
const VEHICLES = ["Sedan / Coupe", "SUV / Truck"];
const TIMES = ["Morning (8–11)", "Midday (11–2)", "Afternoon (2–6)"];

const STEP_COUNT = 6;
const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "w-full bg-transparent border-b border-hairline-strong focus:border-volt outline-none py-3 text-[17px] placeholder:text-ink-mute/50 transition-colors";
const labelClass =
  "font-medium text-[12px] text-ink-mute";

type Status = "idle" | "sending" | "sent" | "error";

interface Answers {
  package: string;
  vehicle: string;
  date: string;
  timeWindow: string;
  zip: string;
  name: string;
  phone: string;
  notes: string;
}

const EMPTY: Answers = {
  package: "",
  vehicle: "",
  date: "",
  timeWindow: "",
  zip: "",
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function Calendar({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (v: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initial = value ? new Date(value + "T00:00:00") : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const atCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  const cells: Array<Date | null> = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  return (
    <div className="border border-hairline bg-paper p-4 max-w-[340px]">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={atCurrentMonth}
          aria-label="Previous month"
          className="px-3 py-1 text-ink-mute hover:text-volt transition-colors disabled:opacity-30 disabled:hover:text-ink-mute"
        >
          ‹
        </button>
        <span className="font-medium text-[14px]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="px-3 py-1 text-ink-mute hover:text-volt transition-colors"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-center text-[11px] text-ink-faint py-1">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const key = toKey(date);
          const isPast = date < today;
          const isSelected = value === key;
          const isToday = key === toKey(today);
          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(key)}
              className={`aspect-square text-[13px] transition-colors ${
                isSelected
                  ? "bg-volt text-paper font-medium"
                  : isPast
                    ? "text-ink-faint/50 cursor-not-allowed"
                    : `text-ink-soft hover:bg-paper-rise hover:text-ink ${
                        isToday ? "border border-hairline-strong" : ""
                      }`
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
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
          answers.vehicle === "SUV / Truck" ? "suv" : "sedan"
        ]
      : null;

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
        return answers.date && answers.timeWindow
          ? ""
          : "Pick a day and a time window.";
      case 3:
        return /^\d{5}$/.test(answers.zip) ? "" : "Enter a 5-digit zip code.";
      case 4:
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
          zip: answers.zip,
          package: answers.package,
          vehicle: answers.vehicle,
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
    [
      "When",
      prettyDate
        ? `${prettyDate}${answers.timeWindow ? " · " + answers.timeWindow : ""}`
        : "—",
    ],
    ["Zip", answers.zip || "—"],
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
            Six quick questions. We confirm your slot by text — usually within
            a couple hours. No payment until the job&rsquo;s done.
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
                    <span className="display text-[34px] leading-none text-volt">
                      ${price}
                    </span>
                  </div>
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
                          When works for you?
                        </h3>
                        <span className={labelClass}>Preferred day</span>
                        <div className="mt-3 mb-7">
                          <Calendar
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
                    {step === 3 && (
                      <div>
                        <h3 className="display text-[26px] mb-6">
                          Where&rsquo;s the car parked?
                        </h3>
                        <label htmlFor="zip" className={labelClass}>
                          Zip code
                        </label>
                        <input
                          id="zip"
                          inputMode="numeric"
                          pattern="[0-9]{5}"
                          maxLength={5}
                          value={answers.zip}
                          onChange={(e) =>
                            set({ zip: e.target.value.replace(/\D/g, "") })
                          }
                          placeholder="77584"
                          autoFocus
                          className={inputClass}
                        />
                        <p className="mt-4 text-[13px] text-ink-mute leading-relaxed">
                          Inside 20 miles of Pearland is standard pricing — a
                          little outside adds a flat $20 travel fee. We&rsquo;ll
                          confirm either way.
                        </p>
                      </div>
                    )}
                    {step === 4 && (
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
                    {step === 5 && (
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
                {step >= 2 && step < STEP_COUNT - 1 && (
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
