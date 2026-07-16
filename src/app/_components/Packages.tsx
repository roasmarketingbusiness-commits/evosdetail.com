"use client";

import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useState } from "react";

type VehicleSize = "sedan" | "suv" | "van";

interface Package {
  name: string;
  tagline: string;
  price: Record<VehicleSize, number>;
  features: string[];
  popular?: boolean;
}

const PACKAGES: Package[] = [
  {
    name: "Exterior Detail",
    tagline: "Showroom shine, street-ready.",
    price: { sedan: 69, suv: 89, van: 109 },
    features: [
      "Foam cannon hand wash",
      "Wheels, tires & wheel wells",
      "Bug removal",
      "Tire shine & trim dressing",
      "Streak-free exterior glass",
    ],
  },
  {
    name: "The Full EVOS",
    tagline: "Interior + exterior. The works.",
    price: { sedan: 169, suv: 209, van: 249 },
    features: [
      "Everything in Exterior Detail",
      "Everything in Interior Detail",
      "Door jambs & seals",
      "Air freshener finish",
      "Walkaround inspection with you",
    ],
    popular: true,
  },
  {
    name: "Interior Detail",
    tagline: "Deep clean, back to day one.",
    price: { sedan: 119, suv: 149, van: 179 },
    features: [
      "Full vacuum — seats, trunk, crevices",
      "Hand spot-clean, seats & carpets",
      "Leather clean & condition",
      "Dash, console & vents detailed",
      "Interior glass & mirrors",
    ],
  },
];

const LAUNCH_DISCOUNT = 40;

const ADDONS = [
  { name: "Pet hair removal", price: 39 },
  { name: "Engine bay detail", price: 39 },
  { name: "Headlight restoration", price: 49 },
];

const ease = [0.22, 1, 0.36, 1] as const;

function RevealHeading({ text }: { text: string }) {
  return (
    <h2
      className="display leading-[0.95] flex flex-wrap gap-x-[0.28em]"
      style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
      aria-label={text}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden className="overflow-hidden inline-flex">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

function VehicleSwitch({
  value,
  onChange,
}: {
  value: VehicleSize;
  onChange: (v: VehicleSize) => void;
}) {
  return (
    <div className="relative flex w-fit border border-hairline-strong p-1 self-start">
      {(
        [
          ["sedan", "Sedan / Coupe"],
          ["suv", "SUV / Truck"],
          ["van", "3-Row / Van"],
        ] as const
      ).map(([size, label]) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={`relative z-10 px-5 py-2.5 font-medium text-[13px] transition-colors duration-200 ${
            value === size ? "text-paper" : "text-ink-mute hover:text-ink"
          }`}
        >
          {value === size && (
            <motion.span
              layoutId="vehicle-switch-pill"
              className="absolute inset-0 bg-volt"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
};

export function Packages() {
  const [size, setSize] = useState<VehicleSize>("sedan");

  return (
    <section id="packages" className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <p className="eyebrow text-volt mb-4">01 — Packages</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <RevealHeading text="Pick your detail." />
          <VehicleSwitch value={size} onChange={setSize} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardVariants}
              className={`relative flex flex-col p-7 md:p-8 border ${
                pkg.popular
                  ? "border-volt bg-paper-rise shadow-[0_-20px_120px_-30px_rgba(200,166,86,0.35)]"
                  : "border-hairline bg-paper-rise/50"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 eyebrow text-volt bg-paper px-4">
                  Most booked
                </span>
              )}
              <h3 className="display text-[24px] leading-tight">{pkg.name}</h3>
              <p className="mt-1 text-[14px] text-ink-mute">{pkg.tagline}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-medium text-[12px] text-ink-mute">from</span>
                {pkg.popular && (
                  <span className="text-[20px] text-ink-faint line-through">
                    ${pkg.price[size]}
                  </span>
                )}
                <span className="display text-[46px] leading-none text-volt">
                  $
                  <NumberFlow
                    value={pkg.price[size] - (pkg.popular ? LAUNCH_DISCOUNT : 0)}
                    className="display text-[46px] leading-none text-volt"
                  />
                </span>
              </div>
              {pkg.popular && (
                <p className="mt-2 text-[12px] text-volt">
                  Launch special — first 10 bookings
                </p>
              )}
              <ul className="mt-6 space-y-2.5 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[14px] text-ink-soft">
                    <span className="text-volt mt-px">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                className={`mt-8 font-medium text-[13px] text-center px-6 py-4 ${
                  pkg.popular ? "btn-glass-volt" : "btn-glass"
                }`}
              >
                Book this
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border border-hairline px-6 py-5">
          <span className="eyebrow text-ink-mute">Add-ons</span>
          {ADDONS.map((addon) => (
            <span key={addon.name} className="text-[14px] text-ink-soft">
              {addon.name} <span className="text-volt">+${addon.price}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
