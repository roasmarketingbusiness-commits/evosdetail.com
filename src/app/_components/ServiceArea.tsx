"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Home base: Pearland, TX. Radius: 20 miles in meters.
const PEARLAND: [number, number] = [29.5636, -95.286];
const RADIUS_METERS = 20 * 1609.34;

export function ServiceArea() {
  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;

      map = L.map(mapEl.current, {
        center: PEARLAND,
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

      const zone = L.circle(PEARLAND, {
        radius: RADIUS_METERS,
        color: "#c8a656",
        weight: 2,
        fillColor: "#c8a656",
        fillOpacity: 0.12,
      }).addTo(map);

      L.marker(PEARLAND, {
        icon: L.divIcon({
          className: "",
          html: '<div style="width:18px;height:18px;border-radius:50%;background:#c8a656;border:3px solid #060607;box-shadow:0 0 0 2px #c8a656"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      })
        .addTo(map)
        .bindPopup("<b>EVOS Detail</b><br/>Home base — Pearland, TX");

      map.fitBounds(zone.getBounds(), { padding: [16, 16] });
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
          <p className="font-medium text-[13px] text-volt mb-4">
            03 — Service area
          </p>
          <h2 className="display leading-[0.95]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            Based in Pearland.
            <br />
            20 miles, any direction.
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] md:text-[16px] text-ink-soft leading-relaxed">
            Home base is Pearland — anywhere inside the circle is standard
            pricing. That covers Friendswood, League City, Clear Lake,
            Pasadena, Missouri City, Sugar Land, and Houston up through
            Downtown and the Galleria.
          </p>
          <p className="mt-4 max-w-[46ch] text-[15px] md:text-[16px] text-ink-soft leading-relaxed">
            A little outside the circle?{" "}
            <span className="text-volt">Flat $20 travel add-on</span>
            {" — no surprise pricing, ever. Drop your zip in the booking form and we'll confirm."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="border border-hairline bg-paper-rise/40"
        >
          <div ref={mapEl} className="h-[420px] md:h-[480px] w-full" />
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-5 py-3">
            <span className="font-medium text-[12px] text-ink-mute">
              <span className="text-volt">●</span> In the circle — standard pricing
            </span>
            <span className="font-medium text-[12px] text-ink-mute">
              ○ Outside — +$20 travel
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
