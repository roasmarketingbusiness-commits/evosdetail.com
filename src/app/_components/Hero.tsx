"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20"
    >
      {/* accent glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 75% 20%, var(--volt-dim) 0%, transparent 60%)",
        }}
      />
      {/* giant background wordmark */}
      <div className="absolute inset-x-0 bottom-[-2vw] pointer-events-none select-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease }}
          className="display outline-text block text-center leading-[0.8] whitespace-nowrap"
          style={{ fontSize: "clamp(120px, 24vw, 420px)" }}
        >
          EVOS
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="font-mono text-[11px] md:text-[12px] tracking-[0.32em] uppercase text-volt mb-6"
        >
          Mobile detailing — Houston, TX
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="display leading-[0.92]"
          style={{ fontSize: "clamp(52px, 8.5vw, 128px)" }}
        >
          Your car, detailed.
          <br />
          <span className="text-volt">Your driveway.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="mt-7 max-w-[54ch] text-[16px] md:text-[18px] text-ink-soft leading-relaxed"
        >
          EVOS brings the full detail to you — home, office, wherever your car
          sits. Based in Pearland, serving 20 miles in every direction. Book
          online in 60 seconds, we handle the rest.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
        >
          <a
            href="#book"
            className="display text-[17px] tracking-[0.06em] bg-volt text-paper px-8 py-4 hover:bg-ink transition-colors glow-volt"
          >
            Book your detail
          </a>
          <a
            href="#packages"
            className="display text-[17px] tracking-[0.06em] border border-hairline-strong px-8 py-4 hover:border-volt hover:text-volt transition-colors"
          >
            See packages
          </a>
        </motion.div>
      </div>
    </section>
  );
}
