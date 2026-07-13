"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
        <a href="#top" className="flex items-center" aria-label="EVOS Detail — home">
          <Image
            src="/evos-logo-main.png"
            alt="EVOS Detail"
            width={1536}
            height={1024}
            priority
            className="h-11 md:h-14 w-auto"
          />
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
          className="btn-glass-volt font-medium text-[12px] px-6 py-3"
        >
          Book now
        </a>
      </div>
    </header>
  );
}
