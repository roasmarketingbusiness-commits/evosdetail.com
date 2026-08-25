"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Two home bases: Splendora (home) and Magnolia (the shop). Markers sit
// at town centers on purpose — never pin the actual addresses publicly.
const SPLENDORA: [number, number] = [30.2327, -95.1611];
const MAGNOLIA: [number, number] = [30.2094, -95.7508];

// ONE coverage box, edges set by real driving limits (not radius math):
// west stops at Waller, east stops just past Cleveland so the town is
// inside, south reaches toward Houston, north stays tight. Keep in sync
// with the JSON-LD GeoShape box in layout.tsx.
const COVERAGE_BOUNDS: [[number, number], [number, number]] = [
  [29.89, -95.93], // SW corner — Waller / toward Houston
  [30.43, -95.05], // NE corner — just past Cleveland
];

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

      // "Leaflet" prefix off — attribution itself stays (required)
      map.attributionControl.setPrefix(false);

      // Dark basemap so the map sits inside the site's black theme instead
      // of fighting it
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map);

      const markerIcon = () =>
        L.divIcon({
          className: "",
          html: '<div style="width:16px;height:16px;border-radius:50%;background:#a78bfa;border:3px solid #060607;box-shadow:0 0 0 2px #a78bfa"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

      const zone = L.rectangle(COVERAGE_BOUNDS, {
        color: "#a78bfa",
        weight: 1.5,
        fillColor: "#a78bfa",
        fillOpacity: 0.08,
      }).addTo(map);

      [
        { center: SPLENDORA, label: "<b>EVOS Detail</b><br/>Home base — Splendora, TX" },
        { center: MAGNOLIA, label: "<b>EVOS Detail</b><br/>The shop — Magnolia, TX" },
      ].forEach(({ center, label }) => {
        L.marker(center, { icon: markerIcon() }).addTo(map!).bindPopup(label);
      });

      map.fitBounds(zone.getBounds(), { padding: [24, 24] });
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
            We run out of Splendora and Magnolia — anywhere inside the zone
            is standard pricing. That covers Cleveland, New Caney, Porter,
            Kingwood, Humble, and Atascocita on the east side; Magnolia,
            Tomball, Pinehurst, Hockley, and Waller out west; and The
            Woodlands, Spring, and Conroe in between.
          </p>
          <p className="mt-4 max-w-[46ch] text-[15px] md:text-[16px] text-ink-soft leading-relaxed">
            A little outside the zone?{" "}
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
              <span className="text-volt">■</span> In the zone — standard pricing
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
