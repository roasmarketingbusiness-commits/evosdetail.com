"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 3400);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.9, ease }}
            className="relative w-[86vw] max-w-[620px]"
          >
            <Image
              src="/evos-logo.png"
              alt="EVOS Detail"
              width={1536}
              height={1024}
              priority
              className="w-full h-auto"
            />
            {/* light beam traveling through the letterforms — the logo's own
                alpha channel masks the beam so it only exists inside the logo */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "url(/evos-logo.png)",
                WebkitMaskImage: "url(/evos-logo.png)",
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
              }}
            >
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 1.3, delay: 1.7, ease: "easeInOut" }}
                className="absolute inset-y-[-20%] w-[45%]"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.95) 50%, transparent 80%)",
                  filter: "blur(6px)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
