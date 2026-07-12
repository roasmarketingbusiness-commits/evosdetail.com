"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type VehicleSize = "sedan" | "suv";

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
    price: { sedan: 99, suv: 129 },
    features: [
      "Foam cannon hand wash",
      "Wheels, tires & wheel wells",
      "Bug & tar removal",
      "Spray wax / sealant protection",
      "Exterior glass & trim dressing",
    ],
  },
  {
    name: "The Full EVOS",
    tagline: "Interior + exterior. The works.",
    price: { sedan: 189, suv: 239 },
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
    price: { sedan: 129, suv: 159 },
    features: [
      "Full vacuum — seats, trunk, crevices",
      "Carpet & upholstery shampoo",
      "Leather clean & condition",
      "Dash, console & trim detail",
      "Interior glass & mirrors",
    ],
  },
];

const ADDONS = [
  { name: "Pet hair removal", price: 39 },
  { name: "Engine bay detail", price: 29 },
  { name: "Headlight restoration", price: 49 },
];

export function Packages() {
  const [size, setSize] = useState<VehicleSize>("sedan");

  return (
    <section id="packages" className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <p className="font-medium text-[13px] text-volt mb-4">
          01 — Packages
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <h2 className="display leading-[0.95]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Pick your detail.
          </h2>
          <div
            className="inline-flex border border-hairline-strong self-start"
            role="group"
            aria-label="Vehicle size"
          >
            {(
              [
                ["sedan", "Sedan / Coupe"],
                ["suv", "SUV / Truck"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSize(value)}
                className={`font-medium text-[13px] px-5 py-3 transition-colors ${
                  size === value
                    ? "bg-volt text-paper"
                    : "text-ink-mute hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col p-7 md:p-8 border ${
                pkg.popular
                  ? "border-volt bg-paper-rise"
                  : "border-hairline bg-paper-rise/50"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 font-medium text-[13px] text-volt bg-paper px-4">
                  Most booked
                </span>
              )}
              <h3 className="display text-[24px] leading-tight">{pkg.name}</h3>
              <p className="mt-1 text-[14px] text-ink-mute">{pkg.tagline}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-medium text-[12px] text-ink-mute">from</span>
                <span className="display text-[46px] leading-none text-volt">
                  ${pkg.price[size]}
                </span>
              </div>
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
                className={`mt-8 font-medium text-[13px] text-center px-6 py-4 transition-colors duration-300 ${
                  pkg.popular
                    ? "bg-volt text-paper hover:bg-ink"
                    : "border border-hairline-strong hover:border-volt hover:text-volt"
                }`}
              >
                Book this
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border border-hairline px-6 py-5">
          <span className="font-medium text-[13px] text-ink-mute">
            Add-ons
          </span>
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
