"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const TICKER = [
  "Interior",
  "Exterior",
  "The Full EVOS",
  "Pearland, TX",
  "We come to you",
  "Book online",
];

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col justify-center pt-24 pb-12">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-mono text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-volt mb-8"
          >
            Mobile detailing — Pearland, TX
          </motion.p>

          <h1 className="display leading-[1.02]" style={{ fontSize: "clamp(48px, 7.5vw, 118px)" }}>
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="block"
            >
              Your car, <em className="text-volt font-normal">detailed.</em>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease }}
              className="block"
            >
              Your driveway.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-9 max-w-[52ch] text-[16px] md:text-[17px] text-ink-soft leading-relaxed"
          >
            EVOS brings the full detail to you — home, office, wherever your
            car sits. Based in Pearland, serving 20 miles in every direction.
            Details from $99, booked online in 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
          >
            <a
              href="#book"
              className="font-mono text-[11px] tracking-[0.28em] uppercase bg-ink text-paper px-10 py-4.5 hover:bg-volt transition-colors duration-300"
            >
              Book your detail
            </a>
            <a
              href="#packages"
              className="font-mono text-[11px] tracking-[0.28em] uppercase border border-hairline-strong px-10 py-4.5 hover:border-volt hover:text-volt transition-colors duration-300"
            >
              View packages
            </a>
          </motion.div>
        </div>
      </div>

      {/* ticker strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="marquee border-t border-hairline py-5"
        aria-hidden
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {TICKER.map((item) => (
                <span key={item} className="inline-flex items-center">
                  <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-ink-mute px-8">
                    {item}
                  </span>
                  <span className="text-volt text-[9px]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
