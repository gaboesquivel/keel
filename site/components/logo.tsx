import { useId } from "react";

// keel mark: a hull in profile with the keel blade beneath it, the part that resists sideways drift.
// One silhouette, legible at 16 px. The favicon (app/icon.svg) and OG image use the same paths.
export const KEEL_PATHS = {
  hull: "M1.5 7H30.5C28.4 11.6 23.6 13.8 16.5 13.8C9.6 13.8 5 12 2.6 9.4Z",
  keel: "M14.2 13.6H18.4L15.7 24.2C15.5 24.9 15 25.3 14.3 25.3H13C12.4 25.3 12 24.8 12.1 24.2Z",
} as const;

export const PRISM_STOPS = [
  { offset: 0, color: "#9ea6f8" },
  { offset: 0.55, color: "#c6a8f6" },
  { offset: 1, color: "#f0a6cf" },
] as const;

export function LogoMark({ className = "size-7" }: { className?: string }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="2" y1="7" x2="30" y2="25" gradientUnits="userSpaceOnUse">
          {PRISM_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <path d={KEEL_PATHS.hull} />
        <path d={KEEL_PATHS.keel} />
      </g>
    </svg>
  );
}

/** Lowercase wordmark. The mark is optional beside it; the wordmark is the name. */
export function Wordmark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={size === "sm" ? "size-5" : "size-7"} />
      <span className={`wordmark leading-none text-fg ${size === "sm" ? "text-xl" : "text-[1.6rem]"}`}>keel</span>
    </span>
  );
}

/**
 * Hero figure: the keel mark at scale on a single waterline. Below the line the blade fades, the part that
 * works unseen. A few faint lines suggest the water it holds against. Decorative; the caption carries the meaning.
 */
export function KeelFigure({ className }: { className?: string }) {
  const id = useId();
  const fill = `${id}-fill`;
  const fade = `${id}-fade`;
  const line = `${id}-line`;
  const mask = `${id}-mask`;
  // The mark is drawn at 9x on a 32-unit grid; the waterline crosses the hull at y = 11.
  const scale = 9;
  const x = 240 - 16 * scale;
  const y = 30;
  const waterline = y + 11 * scale;
  return (
    <svg viewBox="0 0 480 300" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={fill} x1="2" y1="7" x2="30" y2="25" gradientUnits="userSpaceOnUse">
          {PRISM_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id={fade} x1="0" y1={y} x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset={(waterline - y) / (300 - y)} stopColor="#fff" />
          <stop offset={(waterline - y) / (300 - y) + 0.001} stopColor="#fff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.16" />
        </linearGradient>
        <mask id={mask}>
          <rect x="0" y="0" width="480" height="300" fill={`url(#${fade})`} />
        </mask>
        <linearGradient id={line} x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c9b8ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c9b8ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#c9b8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[22, 48, 80].map((d, i) => (
        <line key={d} x1={60 + i * 30} x2={420 - i * 30} y1={waterline + d} y2={waterline + d} stroke="#3a3350" strokeOpacity={0.9 - i * 0.25} strokeWidth="1" />
      ))}
      <g mask={`url(#${mask})`}>
        <g transform={`translate(${x} ${y}) scale(${scale})`} fill={`url(#${fill})`}>
          <path d={KEEL_PATHS.hull} />
          <path d={KEEL_PATHS.keel} />
        </g>
      </g>
      <line x1="0" x2="480" y1={waterline} y2={waterline} stroke={`url(#${line})`} strokeWidth="1" />
    </svg>
  );
}
