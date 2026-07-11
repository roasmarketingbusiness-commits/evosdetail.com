"use client";

import { motion } from "framer-motion";

const AREAS = [
  "Downtown",
  "The Heights",
  "Montrose",
  "River Oaks",
  "Galleria / Uptown",
  "Memorial",
  "Bellaire",
  "West University",
  "Midtown",
  "EaDo",
  "Spring Branch",
  "Meyerland",
];

export function ServiceArea() {
  return (
    <section id="service-area" className="relative py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 15% 60%, var(--volt-dim) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <p className="font-mono text-[11px] tracking-[0.32em] uppercase text-volt mb-4">
            03 — Service area
          </p>
          <h2 className="display leading-[0.95]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Greater Houston,
            <br />
            20-mile radius.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] md:text-[16px] text-ink-soft leading-relaxed">
            If you&rsquo;re within about 20 miles of central Houston, you&rsquo;re in
            the zone. Drop your zip in the booking form and we&rsquo;ll confirm —
            outside the radius we&rsquo;ll tell you straight instead of hitting you
            with a surprise travel fee.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2.5 md:pt-16"
        >
          {AREAS.map((area) => (
            <span
              key={area}
              className="font-mono text-[12px] tracking-[0.08em] border border-hairline px-4 py-2 text-ink-soft"
            >
              {area}
            </span>
          ))}
          <span className="font-mono text-[12px] tracking-[0.08em] border border-volt px-4 py-2 text-volt">
            + everywhere in between
          </span>
        </motion.div>
      </div>
    </section>
  );
}
