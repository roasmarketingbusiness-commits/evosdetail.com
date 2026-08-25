"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Two home bases: Splendora (home) and Magnolia (the shop).
// ONE clean coverage box spans both, reaching 18 miles out from centers
// biased ~4 miles SOUTH of the bases — most customers are toward Houston,
// so reach skews down, not up. Keep in sync with the JSON-LD GeoShape box
// in layout.tsx.
const SPLENDORA: [number, number] = [30.2327, -95.1611];
const MAGNOLIA: [number, number] = [30.2094, -95.7508];
const SOUTH_BIAS_DEG = 0.058; // ~4 miles of latitude
const HALF_SIDE_MILES = 18;

// Single box = union extremes of an 18-mile square around each biased
// center (lon degrees stretched to stay true miles at this latitude).
function coverageBounds(): [[number, number], [number, number]] {
  const corners = [SPLENDORA, MAGNOLIA].flatMap(([lat, lon]) => {
    const cLat = lat - SOUTH_BIAS_DEG;
    const latDelta = HALF_SIDE_MILES / 69.172;
    const lonDelta =
      HALF_SIDE_MILES / (69.172 * Math.cos((cLat * Math.PI) / 180));
    return [
      [cLat - latDelta, lon - lonDelta],
      [cLat + latDelta, lon + lonDelta],
    ];
  });
  const lats = corners.map((c) => c[0]);
  const lons = corners.map((c) => c[1]);
  return [
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)],
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

      const zone = L.rectangle(coverageBounds(), {
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
            Tomball, Pinehurst, and Hockley out west; and The Woodlands,
            Spring, and Conroe in between.
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
