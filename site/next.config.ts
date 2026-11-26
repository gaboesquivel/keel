import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // The principles became the Library, which is published only when KEEL_LIBRARY is on.
    const libraryOn = /^(?:1|true|on)$/iu.test(process.env.KEEL_LIBRARY ?? "");
    return libraryOn ? [{ source: "/principles", destination: "/library", permanent: true }] : [];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
