"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "What days do you work?",
    a: "Weekends — Saturday and Sunday, 8am to 8pm. Pick any weekend day in the booking form and we'll confirm your slot by text.",
  },
  {
    q: "Do you need my water or electricity?",
    a: "Yes — we'll need access to a water spigot and a standard outlet, plus enough space to work around the car. If you're not sure your spot works (like some apartment lots), mention it in the booking notes and we'll figure it out before we head over.",
  },
  {
    q: "How long does a detail take?",
    a: "Exterior runs about 1–1.5 hours, interior about 1.5–2, and The Full EVOS usually lands between 2.5–3.5 hours depending on the condition of the car. We'll give you a real estimate when we confirm your booking.",
  },
  {
    q: "Can you detail at my apartment or office?",
    a: "Usually, yes — as long as there's a water spigot and outlet we can reach, and your complex allows car washing on site. Interior-only details are easier anywhere since they don't need water hookups. No hookups at all? You can also drop your car at our shop in Magnolia and we'll handle it there — mention it in the booking notes.",
  },
  {
    q: "How do I pay?",
    a: "Card, cash, Zelle, or Venmo — whatever's easy. You pay when the job's done and you've walked the car with us, not before.",
  },
  {
    q: "I'm outside the service area — can you still come?",
    a: "Usually, yeah. If you're a little past the circles, it's a flat $20 travel add-on on top of your package — that's it. Way out there? Send the booking anyway and we'll be straight with you about whether we can make it work.",
  },
  {
    q: "What if it rains?",
    a: "Houston's gonna Houston. If weather kills your slot, we'll text you and get you rescheduled first — no fees, no hassle.",
  },
  {
    q: "My car is really dirty. Is that a problem?",
    a: "That's the job. Heavy pet hair, stains, or years of buildup might add an add-on or a little time, but we'll tell you up front before we start — never after.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[840px] px-6 md:px-10">
        <p className="eyebrow text-volt mb-4">
          04 — FAQ
        </p>
        <h2 className="display leading-[0.95] mb-12" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
          Quick answers.
        </h2>
        <div className="border-t border-hairline">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="border-b border-hairline">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                >
                  <span className="text-[16px] md:text-[17px] font-medium group-hover:text-volt transition-colors">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="display text-[22px] text-volt shrink-0"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[14px] md:text-[15px] text-ink-soft leading-relaxed max-w-[62ch]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
