"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const TICKER = [
  "$40 off — first 10 bookings",
  "Interior",
  "Exterior",
  "The Full EVOS",
  "Pearland, TX",
  "We come to you",
  "Book online",
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* full-bleed background photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute inset-0"
        aria-hidden
      >
        <Image
          src="/hero-car-suds.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-paper/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/80 via-paper/30 to-paper" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[92svh] max-w-[1200px] items-center justify-center px-6 md:px-10 pt-36 md:pt-44 pb-20 md:pb-28">
        <div className="relative z-10 mx-auto max-w-[820px] text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow text-volt mb-8"
          >
            Launch special — Mobile detailing, Pearland TX
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="display text-balance leading-[1.04]"
            style={{ fontSize: "clamp(44px, 6.5vw, 92px)" }}
          >
            A real detail at your driveway.{" "}
            <span
              className="text-ink-faint line-through"
              style={{ fontSize: "0.55em" }}
            >
              $169
            </span>{" "}
            <em className="text-volt not-italic">$129.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            className="mx-auto mt-8 max-w-[52ch] text-[16px] md:text-[17px] text-ink-soft leading-relaxed"
          >
            Not a gas station vacuum — the full interior + exterior, seats to
            paint. First 10 bookings save $40 on any vehicle size, anywhere in
            the Pearland area.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <a
              href="#book"
              className="btn-glass-volt font-medium text-[13px] px-10 py-4.5"
            >
              Book for $129
            </a>
            <a
              href="#packages"
              className="btn-glass font-medium text-[13px] px-10 py-4.5"
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
        transition={{ duration: 0.8, delay: 1.1 }}
        className="marquee relative z-10 border-t border-hairline py-5 bg-paper/60 backdrop-blur-sm"
        aria-hidden
      >
        <div className="marquee-track">
          {[0, 1, 2, 3, 4, 5].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {TICKER.map((item) => (
                <span key={item} className="inline-flex items-center">
                  <span className="eyebrow text-ink-mute px-8">
                    {item}
                  </span>
                  <span className="text-volt text-[13px]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
