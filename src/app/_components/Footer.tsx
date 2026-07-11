export function Footer() {
  return (
    <footer className="relative border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="display text-[22px] leading-none">
            EVOS <span className="text-volt">DETAIL</span>
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-ink-mute">
            Mobile detailing — Greater Houston, TX
          </p>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="#book"
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-mute hover:text-volt transition-colors"
          >
            Book a detail
          </a>
        </div>
        <p className="font-mono text-[11px] text-ink-mute">
          © {new Date().getFullYear()} EVOS Detail
        </p>
      </div>
    </footer>
  );
}
