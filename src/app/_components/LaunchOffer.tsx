"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function LaunchOffer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("evos-launch-offer-seen")) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("evos-launch-offer-seen", "1");
    }, 5500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[900] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Launch special offer"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[440px] border border-volt bg-paper p-8 text-center shadow-[0_0_120px_-20px_rgba(200,166,86,0.45)] md:p-10"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close offer"
              className="absolute top-3 right-3 p-2 text-ink-mute transition-colors hover:text-ink"
            >
              ✕
            </button>
            <p className="eyebrow text-volt">Launch special</p>
            <h3 className="display mt-4 text-[28px] leading-tight md:text-[32px]">
              $40 off The Full EVOS
            </h3>
            <div className="mt-5 flex items-baseline justify-center gap-3">
              <span className="text-[20px] text-ink-faint line-through">
                $169
              </span>
              <span className="display text-[64px] leading-none text-volt">
                $129
              </span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              Full interior + exterior detail at your driveway. Every vehicle
              size saves $40 — no coupon code, the discount is already applied
              when you book. First 10 bookings only.
            </p>
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="btn-glass-volt mt-7 block w-full px-8 py-4 text-center font-medium text-[13px]"
            >
              Claim my spot
            </a>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 text-[12px] text-ink-mute transition-colors hover:text-ink"
            >
              No thanks, I like the dirt
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
