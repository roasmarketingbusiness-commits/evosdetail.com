"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const ease = [0.65, 0, 0.35, 1] as const;
const DRAW = 1.9;       // pass 1: wireframe draws in
const PAINT_AT = 2.15;  // pass 2: fill paints in behind a second cursor
const PAINT = 1.25;
const EXIT_AT = 4200;   // ms

export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), EXIT_AT);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[999] bg-paper flex items-center justify-center cursor-pointer"
          aria-label="EVOS Detail intro — click to skip"
        >
          <div className="relative w-[88vw] max-w-[680px]">
            {/* pass 1 — wireframe outline draws itself in */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: DRAW, delay: 0.25, ease }}
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
                    "drop-shadow(0 0 5px rgba(255,255,255,0.9)) drop-shadow(0 0 14px rgba(200,166,86,0.5))",
                }}
              />
            </motion.div>

            {/* pass 2 — the real logo paints in over the wireframe */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: PAINT, delay: PAINT_AT, ease }}
              className="absolute inset-0"
            >
              <Image
                src="/evos-logo-solid.png"
                alt="EVOS Detail"
                width={1536}
                height={1024}
                priority
                className="w-full h-auto"
              />
            </motion.div>

            {/* cursor 1 — rides the wireframe draw */}
            <motion.div
              initial={{ left: "0%", opacity: 1 }}
              animate={{ left: "100%", opacity: [1, 1, 0] }}
              transition={{ duration: DRAW, delay: 0.25, ease, times: [0, 0.92, 1] }}
              className="absolute top-[6%] bottom-[6%] w-[3px] bg-white rounded-full"
              style={{ boxShadow: "0 0 22px 6px rgba(200,166,86,0.85)" }}
            />

            {/* cursor 2 — rides the paint pass */}
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: PAINT, delay: PAINT_AT, ease, times: [0, 0.05, 0.92, 1] }}
              className="absolute top-[6%] bottom-[6%] w-[3px] bg-white rounded-full"
              style={{ boxShadow: "0 0 26px 8px rgba(255,255,255,0.9)" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
