"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const ease = [0.65, 0, 0.35, 1] as const;
const DRAW = 2.1; // seconds the outline takes to draw itself in

export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[999] bg-paper flex items-center justify-center cursor-pointer"
          aria-label="EVOS Detail intro — click to skip"
        >
          <div className="relative w-[88vw] max-w-[680px]">
            {/* 1 — the outline draws itself in, left to right */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0.12 }}
              transition={{ delay: DRAW + 0.9, duration: 0.9, ease }}
            >
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: DRAW, delay: 0.3, ease }}
              >
                <Image
                  src="/evos-logo-edges.png"
                  alt=""
                  width={1536}
                  height={1024}
                  priority
                  className="w-full h-auto"
                  style={{
                    filter:
                      "drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 16px rgba(200,166,86,0.55))",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* glowing cursor riding the draw frontier */}
            <motion.div
              initial={{ left: "0%", opacity: 1 }}
              animate={{ left: "100%", opacity: [1, 1, 0] }}
              transition={{ duration: DRAW, delay: 0.3, ease, times: [0, 0.92, 1] }}
              className="absolute top-[6%] bottom-[6%] w-[3px] bg-white rounded-full"
              style={{ boxShadow: "0 0 26px 7px rgba(200,166,86,0.85)" }}
            />

            {/* 2 — the real logo blooms in over the wireframe */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: DRAW + 0.5, duration: 1, ease }}
              className="absolute inset-0"
            >
              <Image
                src="/evos-logo.png"
                alt="EVOS Detail"
                width={1536}
                height={1024}
                priority
                className="w-full h-auto"
              />
            </motion.div>

            {/* 3 — a final pass of light travels along the letter edges */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "url(/evos-logo-edges.png)",
                WebkitMaskImage: "url(/evos-logo-edges.png)",
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
              }}
            >
              <motion.div
                initial={{ x: "-130%", opacity: 0 }}
                animate={{ x: "230%", opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 1.15,
                  delay: DRAW + 1.5,
                  ease: "easeInOut",
                  times: [0, 0.1, 0.9, 1],
                }}
                className="absolute inset-y-[-20%] w-[38%]"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 15%, rgba(255,255,255,1) 50%, transparent 85%)",
                  filter: "blur(3px)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
