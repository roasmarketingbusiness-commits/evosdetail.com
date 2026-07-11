"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const FAQS = [
  {
    q: "Do you need my water or electricity?",
    a: "Nope — we run fully self-contained with our own water and power. All we need is enough space to work around the car, roughly one parking spot of clearance on each side.",
  },
  {
    q: "How long does a detail take?",
    a: "Exterior runs about 1–1.5 hours, interior about 1.5–2, and The Full EVOS usually lands between 2.5–3.5 hours depending on the condition of the car. We'll give you a real estimate when we confirm your booking.",
  },
  {
    q: "Can you detail at my apartment or office?",
    a: "Yes — driveways, office lots, and most apartment complexes are all good. If your complex has rules about car washing on site, check with them first and we'll work around it.",
  },
  {
    q: "How do I pay?",
    a: "Card, cash, Zelle, or Venmo — whatever's easy. You pay when the job's done and you've walked the car with us, not before.",
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
        <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-volt mb-4">
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
