import { ImageResponse } from "next/og";

import { OgMark } from "@/lib/og";

export const size = { height: 180, width: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#0e0c15", display: "flex", height: "100%", justifyContent: "center", width: "100%" }}>
      <OgMark size={132} />
    </div>,
    size,
  );
}
