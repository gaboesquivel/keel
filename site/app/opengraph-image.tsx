import { ImageResponse } from "next/og";

import { OgMark } from "@/lib/og";
import { SITE_DESCRIPTOR, SITE_TAGLINE } from "@/lib/site";

export const alt = `keel — ${SITE_TAGLINE} ${SITE_DESCRIPTOR}`;
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "radial-gradient(circle at 85% 10%, rgba(167,139,250,0.32), transparent 45%), radial-gradient(circle at 10% 100%, rgba(240,166,207,0.2), transparent 50%), #0e0c15",
        color: "#f5f3fb",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <OgMark size={64} />
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, letterSpacing: -3 }}>keel</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>
          <div style={{ display: "flex" }}>Move fast.</div>
          <div style={{ backgroundClip: "text", backgroundImage: "linear-gradient(90deg, #9ea6f8, #c6a8f6 55%, #f0a6cf)", color: "transparent", display: "flex" }}>
            Stay on course.
          </div>
        </div>
        <div style={{ color: "#b5afc6", display: "flex", fontSize: 34, lineHeight: 1.35 }}>{SITE_DESCRIPTOR}</div>
      </div>
    </div>,
    size,
  );
}
