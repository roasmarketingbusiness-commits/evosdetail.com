"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const TICKER = [
  "INTERIOR",
  "EXTERIOR",
  "THE FULL EVOS",
  "PEARLAND, TX",
  "WE COME TO YOU",
  "BOOK ONLINE",
];

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col justify-center pt-24 pb-10">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-[11px] tracking-[0.28em] uppercase text-ink-mute mb-6"
          >
            Mobile detailing — est. Pearland, TX
          </motion.p>

          <h1 className="display leading-[0.86]" style={{ fontSize: "clamp(64px, 12.5vw, 210px)" }}>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="block"
            >
              Your car,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="block chrome-text"
            >
              detailed.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="block text-volt"
              style={{ transform: "skewX(-4deg)" }}
            >
              Your driveway.
            </motion.span>
          </h1>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65, ease }}
                href="#book"
                className="display text-[18px] tracking-[0.06em] bg-volt text-paper px-8 py-4 shadow-hard-ink hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                Book your detail →
              </motion.a>
              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75, ease }}
                href="#packages"
                className="display text-[18px] tracking-[0.06em] border-2 border-ink px-8 py-4 shadow-hard-volt hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                Packages
              </motion.a>
            </div>

            {/* sticker cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ duration: 0.5, delay: 0.9, type: "spring", bounce: 0.5 }}
              className="hidden md:flex flex-col items-center justify-center w-[124px] h-[124px] rounded-full bg-volt text-paper shrink-0 mr-6"
            >
              <span className="font-mono text-[10px] tracking-[0.14em]">FROM</span>
              <span className="display text-[38px] leading-none">$99</span>
              <span className="font-mono text-[9px] tracking-[0.14em] mt-1">NO SHOP VISIT</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ticker strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.05 }}
        className="marquee border-y-2 border-volt bg-paper py-3 -rotate-[0.6deg] scale-[1.01] origin-center"
        aria-hidden
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {TICKER.map((item) => (
                <span key={item} className="inline-flex items-center">
                  <span className="display text-[18px] tracking-[0.1em] text-volt px-6">
                    {item}
                  </span>
                  <span className="text-volt text-[12px]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
