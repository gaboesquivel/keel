import { KEEL_PATHS, PRISM_STOPS } from "@/components/logo";

/** The keel mark for ImageResponse (Satori), which cannot share React hooks with the site component. */
export function OgMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="keel-og" x1="2" y1="7" x2="30" y2="25" gradientUnits="userSpaceOnUse">
          {PRISM_STOPS.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <path d={KEEL_PATHS.hull} fill="url(#keel-og)" />
      <path d={KEEL_PATHS.keel} fill="url(#keel-og)" />
    </svg>
  );
}
