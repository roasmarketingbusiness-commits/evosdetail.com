"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
    <section id="top" className="relative overflow-hidden">
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 pt-36 md:pt-44">
        <div className="relative z-10 mx-auto max-w-[820px] text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-medium text-[12px] md:text-[13px] text-volt mb-8"
          >
            Mobile detailing — Pearland, TX
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="display text-balance leading-[1.04]"
            style={{ fontSize: "clamp(44px, 6.5vw, 92px)" }}
          >
            Your car, <em className="text-volt not-italic">detailed.</em>{" "}
            Your driveway.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            className="mx-auto mt-8 max-w-[52ch] text-[16px] md:text-[17px] text-ink-soft leading-relaxed"
          >
            EVOS brings the full detail to you — home, office, wherever your
            car sits. Based in Pearland, serving 20 miles in every direction.
            Details from $99, booked online in 60 seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
          >
            <a
              href="#book"
              className="font-medium text-[13px] bg-ink text-paper px-10 py-4.5 hover:bg-volt transition-colors duration-300"
            >
              Book your detail
            </a>
            <a
              href="#packages"
              className="font-medium text-[13px] border border-hairline-strong px-10 py-4.5 hover:border-volt hover:text-volt transition-colors duration-300"
            >
              View packages
            </a>
          </motion.div>
        </div>

        {/* tilted showcase — structure from Tailark hero-section-9 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease }}
          className="perspective-distant mt-4 md:mt-0 pl-8 lg:pl-40"
        >
          <div className="rotate-x-20 skew-x-12 mask-b-from-55% mask-b-to-100% mask-r-from-75% pl-6 pt-10">
            <Image
              src="/hero-car.jpg"
              alt="Freshly detailed car at dusk"
              width={1600}
              height={1140}
              priority
              className="rounded-sm border border-hairline-strong shadow-2xl shadow-black/60"
            />
          </div>
        </motion.div>
      </div>

      {/* ticker strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="marquee relative z-10 border-t border-hairline py-5 -mt-10 md:-mt-24 bg-paper/60 backdrop-blur-sm"
        aria-hidden
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center">
              {TICKER.map((item) => (
                <span key={item} className="inline-flex items-center">
                  <span className="font-medium text-[13px] text-ink-mute px-8">
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
