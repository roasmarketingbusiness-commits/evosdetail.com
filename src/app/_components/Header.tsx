"use client";

import { useEffect, useState } from "react";

const NAV = [
  { label: "Packages", href: "#packages" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Service area", href: "#service-area" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-hairline"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-2" aria-label="EVOS Detail — home">
          <span className="display text-[24px] leading-none">EVOS</span>
          <span className="display text-[24px] leading-none text-volt">
            Detail
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-medium text-[13px] text-ink-mute hover:text-ink transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="font-medium text-[12px] bg-ink text-paper px-6 py-3 hover:bg-volt transition-colors duration-300"
        >
          Book now
        </a>
      </div>
    </header>
  );
}
