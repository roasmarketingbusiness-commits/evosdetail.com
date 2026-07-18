/**
 * Top-view line-art car with a buffer pad tracing the body outline,
 * a glowing "just polished" trail behind it, a sheen sweep, and
 * sparkle pulses. Pure SVG/SMIL — no JS, loops forever, ~2 KB.
 */

const BODY =
  "M180 22 C244 22 288 52 296 116 C302 158 305 200 305 250 L305 520 " +
  "C305 602 300 660 287 694 C271 730 226 742 180 742 C134 742 89 730 73 694 " +
  "C60 660 55 602 55 520 L55 250 C55 200 58 158 64 116 C72 52 116 22 180 22 Z";

const LOOP = "16s";

export function HeroCarAnimation() {
  return (
    <svg
      viewBox="-30 0 420 760"
      fill="none"
      className="w-full h-auto"
      aria-hidden
    >
      <defs>
        <path id="detail-path" d={BODY} pathLength={1} />
        <clipPath id="car-clip">
          <path d={BODY} />
        </clipPath>
        <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.08" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="pad-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="trail-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* static body outline */}
      <path d={BODY} stroke="var(--ink)" strokeOpacity="0.11" strokeWidth="1.5" />

      {/* mirrors */}
      <path
        d="M55 226 C44 228 38 234 36 244 M305 226 C316 228 322 234 324 244"
        stroke="var(--ink)"
        strokeOpacity="0.11"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* hood line, windshield, roof, rear window */}
      <g stroke="var(--ink)" strokeOpacity="0.08" strokeWidth="1.5" strokeLinecap="round">
        <path d="M120 84 C150 70 210 70 240 84" />
        <path d="M96 220 C134 200 226 200 264 220" />
        <path d="M112 276 C144 260 216 260 248 276" />
        <rect x="106" y="296" width="148" height="182" rx="30" />
        <path d="M108 510 C140 528 220 528 252 510" />
      </g>

      {/* moving pieces — hidden for reduced-motion users, outline stays */}
      <g className="motion-reduce:hidden">
        {/* sheen sweeping down the paint */}
        <g clipPath="url(#car-clip)">
          <rect x="30" width="300" height="190" fill="url(#sheen)">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -220; 0 980; 0 980"
              keyTimes="0; 0.55; 1"
              dur="7s"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        {/* polished trail chasing the pad — blurred glow + crisp line */}
        <path
          d={BODY}
          pathLength={1}
          stroke="var(--volt)"
          strokeOpacity="0.3"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="0.16 0.84"
          filter="url(#trail-glow)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0.16"
            to="-0.84"
            dur={LOOP}
            repeatCount="indefinite"
          />
        </path>
        <path
          d={BODY}
          pathLength={1}
          stroke="var(--volt)"
          strokeOpacity="0.65"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.16 0.84"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0.16"
            to="-0.84"
            dur={LOOP}
            repeatCount="indefinite"
          />
        </path>

        {/* buffer pad riding the outline */}
        <g>
          <circle r="20" fill="var(--volt)" fillOpacity="0.5" filter="url(#pad-glow)" />
          <circle r="11" fill="var(--paper)" stroke="var(--volt)" strokeOpacity="0.9" strokeWidth="2" />
          <circle r="4" fill="var(--volt)" />
          <animateMotion dur={LOOP} repeatCount="indefinite" rotate="auto">
            <mpath href="#detail-path" xlinkHref="#detail-path" />
          </animateMotion>
        </g>

        {/* sparkle pulses on the freshly polished panels */}
        {[
          { x: 180, y: 128, begin: "0s" },
          { x: 146, y: 388, begin: "1.4s" },
          { x: 214, y: 592, begin: "2.8s" },
        ].map((s) => (
          <path
            key={s.begin}
            d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z"
            fill="var(--volt)"
            opacity="0"
            transform={`translate(${s.x} ${s.y})`}
          >
            <animate
              attributeName="opacity"
              values="0; 0.8; 0"
              keyTimes="0; 0.5; 1"
              dur="4.2s"
              begin={s.begin}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>
    </svg>
  );
}
