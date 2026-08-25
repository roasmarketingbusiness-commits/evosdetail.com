"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Two home bases: Splendora (home) and Magnolia (the shop).
// Coverage circles are 18 miles, centered ~4 miles SOUTH of each base —
// most customers are toward Houston, so reach skews down, not up.
const SPLENDORA: [number, number] = [30.2327, -95.1611];
const MAGNOLIA: [number, number] = [30.2094, -95.7508];
const SOUTH_BIAS_DEG = 0.058; // ~4 miles of latitude
const HALF_SIDE_MILES = 18; // square zones, 18 miles out from center

const zoneCenter = ([lat, lon]: [number, number]): [number, number] => [
  lat - SOUTH_BIAS_DEG,
  lon,
];

// Square bounds around a center: same miles in every direction, with
// longitude degrees stretched to stay true miles at this latitude.
function zoneBounds([lat, lon]: [number, number]): [
  [number, number],
  [number, number],
] {
  const latDelta = HALF_SIDE_MILES / 69.172;
  const lonDelta = HALF_SIDE_MILES / (69.172 * Math.cos((lat * Math.PI) / 180));
  return [
    [lat - latDelta, lon - lonDelta],
    [lat + latDelta, lon + lonDelta],
  ];
}

export function ServiceArea() {
  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;

      map = L.map(mapEl.current, {
        center: SPLENDORA,
        zoom: 9,
        scrollWheelZoom: false,
        dragging: true,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = () =>
        L.divIcon({
          className: "",
          html: '<div style="width:18px;height:18px;border-radius:50%;background:#c8a656;border:3px solid #060607;box-shadow:0 0 0 2px #c8a656"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

      const zones = [
        { center: SPLENDORA, label: "<b>EVOS Detail</b><br/>Home base — Splendora, TX" },
        { center: MAGNOLIA, label: "<b>EVOS Detail</b><br/>The shop — Magnolia, TX" },
      ].map(({ center, label }) => {
        const zone = L.rectangle(zoneBounds(zoneCenter(center)), {
          color: "#c8a656",
          weight: 2,
          fillColor: "#c8a656",
          fillOpacity: 0.12,
        }).addTo(map!);
        L.marker(center, { icon: markerIcon() }).addTo(map!).bindPopup(label);
        return zone;
      });

      const bounds = zones[0].getBounds().extend(zones[1].getBounds());
      map.fitBounds(bounds, { padding: [16, 16] });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

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
          <p className="eyebrow text-volt mb-4">
            03 — Service area
          </p>
          <h2 className="display leading-[0.95]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Two home bases.
            <br />
            All of North Houston.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] md:text-[16px] text-ink-soft leading-relaxed">
            We run out of Splendora and Magnolia — anywhere inside either
            zone is standard pricing. That covers Cleveland, New Caney,
            Porter, Kingwood, Humble, and Atascocita on the east side;
            Magnolia, Tomball, Pinehurst, and Hockley out west; and The
            Woodlands and Spring in between.
          </p>
          <p className="mt-4 max-w-[46ch] text-[15px] md:text-[16px] text-ink-soft leading-relaxed">
            A little outside the zones?{" "}
            <span className="text-volt">Flat $20 travel add-on</span>
            {" — no surprise pricing, ever. Drop your zip in the booking form and we'll confirm."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="isolate border border-hairline bg-paper-rise/40"
        >
          <div ref={mapEl} className="h-[420px] md:h-[480px] w-full" />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-5 py-3">
            <span className="font-medium text-[12px] text-ink-mute">
              <span className="text-volt">■</span> In the zones — standard pricing
            </span>
            <span className="font-medium text-[12px] text-ink-mute">
              □ Outside — +$20 travel
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
