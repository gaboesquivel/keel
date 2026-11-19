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
