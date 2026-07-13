"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3000);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="relative w-[88vw] max-w-[680px]"
          >
            <Image
              src="/evos-logo-solid.png"
              alt="EVOS Detail"
              width={1536}
              height={1024}
              priority
              className="w-full h-auto"
            />
            {/* one pass of light through the letterforms */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "url(/evos-logo-solid.png)",
                WebkitMaskImage: "url(/evos-logo-solid.png)",
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
              }}
            >
              <motion.div
                initial={{ x: "-140%", opacity: 0 }}
                animate={{ x: "240%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.1, delay: 1.15, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
                className="absolute inset-y-[-15%] w-[34%]"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 18%, rgba(255,255,255,0.85) 50%, transparent 82%)",
                  filter: "blur(2px)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
