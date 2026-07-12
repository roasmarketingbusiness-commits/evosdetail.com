"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Book online",
    body: "Pick your package, vehicle, and a time window that works. Takes about 60 seconds — we confirm by text.",
  },
  {
    number: "02",
    title: "We come to you",
    body: "Home, office, apartment lot — we bring all the gear. Just need access to a water spigot and an outlet.",
  },
  {
    number: "03",
    title: "Drive off clean",
    body: "Walk the car with us when we're done. If something's not right, we fix it on the spot.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <p className="eyebrow text-volt mb-4">
          02 — How it works
        </p>
        <h2 className="display leading-[0.95] mb-14" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
          No shop. No waiting room.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="border border-hairline p-7 md:p-8"
            >
              <span className="display text-[40px] leading-none outline-text">
                {step.number}
              </span>
              <h3 className="display text-[22px] mt-5">{step.title}</h3>
              <p className="mt-3 text-[14px] text-ink-soft leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
