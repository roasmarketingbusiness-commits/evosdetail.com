"use client";

import { motion } from "framer-motion";

const label = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: "10px",
  letterSpacing: "0.08em",
} as const;

interface Area {
  name: string;
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
  outside?: boolean;
}

const AREAS: Area[] = [
  { name: "DOWNTOWN", x: 312, y: 296 },
  { name: "THE HEIGHTS", x: 268, y: 258, anchor: "end" },
  { name: "GALLERIA", x: 238, y: 322, anchor: "end" },
  { name: "BELLAIRE", x: 262, y: 356 },
  { name: "MEMORIAL", x: 212, y: 288, anchor: "end" },
  { name: "PASADENA", x: 398, y: 344 },
  { name: "PEARLAND", x: 322, y: 434 },
  { name: "SUGAR LAND", x: 182, y: 420, anchor: "end" },
  { name: "HUMBLE", x: 372, y: 168 },
  { name: "KATY", x: 84, y: 296, anchor: "end", outside: true },
  { name: "THE WOODLANDS", x: 330, y: 62, outside: true },
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
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
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
            the zone at standard pricing. A little outside the ring? Flat{" "}
            <span className="text-volt">$20 travel add-on</span>
            {" — no surprise pricing, ever. Drop your zip in the booking form and we'll confirm."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative border border-hairline bg-paper-rise/40"
        >
          <svg
            viewBox="0 0 600 600"
            role="img"
            aria-label="Stylized map of Houston showing the EVOS 20-mile service radius"
            className="block w-full h-auto"
          >
            {/* dot grid */}
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
              </pattern>
              <radialGradient id="zone" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.07" />
                <stop offset="80%" stopColor="var(--volt)" stopOpacity="0.03" />
                <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="600" fill="url(#grid)" />

            {/* highways */}
            <g stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" fill="none">
              {/* I-10 east-west */}
              <path d="M0 305 C 150 295, 450 305, 600 290" />
              {/* I-45 north-south */}
              <path d="M330 0 C 315 150, 295 450, 260 600" />
              {/* US-59 */}
              <path d="M600 130 C 450 220, 250 400, 130 600" />
              {/* 290 to the northwest */}
              <path d="M300 300 C 220 240, 120 150, 0 80" />
              {/* 288 south */}
              <path d="M310 310 C 320 400, 330 500, 345 600" />
            </g>

            {/* loops: 610 + Beltway 8 */}
            <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" fill="none">
              <ellipse cx="300" cy="305" rx="72" ry="62" />
              <ellipse cx="300" cy="302" rx="148" ry="132" />
            </g>
            <text x="300" y="232" textAnchor="middle" fill="var(--ink-mute)" style={label}>
              610
            </text>
            <text x="300" y="158" textAnchor="middle" fill="var(--ink-mute)" style={label}>
              BELTWAY 8
            </text>

            {/* 20-mile service ring */}
            <circle cx="300" cy="300" r="212" fill="url(#zone)" />
            <circle
              cx="300"
              cy="300"
              r="212"
              fill="none"
              stroke="var(--volt)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              opacity="0.9"
            />
            <text x="300" y="530" textAnchor="middle" fill="var(--volt)" style={label}>
              20-MILE RADIUS
            </text>

            {/* center pin with pulse */}
            <motion.circle
              cx="300"
              cy="300"
              r="8"
              fill="none"
              stroke="var(--volt)"
              strokeWidth="1.5"
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              style={{ transformOrigin: "300px 300px" }}
            />
            <circle cx="300" cy="300" r="5" fill="var(--volt)" />

            {/* area markers */}
            {AREAS.map((area) => (
              <g key={area.name} opacity={area.outside ? 0.45 : 1}>
                <circle
                  cx={area.x}
                  cy={area.y}
                  r="3"
                  fill={area.outside ? "var(--ink-mute)" : "var(--ink-soft)"}
                />
                <text
                  x={area.x + (area.anchor === "end" ? -9 : 9)}
                  y={area.y + 3.5}
                  textAnchor={area.anchor ?? "start"}
                  fill={area.outside ? "var(--ink-mute)" : "var(--ink-soft)"}
                  style={label}
                >
                  {area.name}
                </text>
              </g>
            ))}
          </svg>
          <div className="flex items-center justify-between border-t border-hairline px-5 py-3">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute">
              <span className="text-volt">●</span> In the zone — standard pricing
            </span>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-mute">
              ○ Outside — +$20 travel
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
