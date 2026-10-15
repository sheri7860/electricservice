import type { NextConfig } from "next";

const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];
const noindex = [{ key: "X-Robots-Tag", value: "noindex, follow" }];

const config: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"], deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920], qualities: [75, 85] },
  async headers() {
    return [
      { source: "/:path*", headers: security },
      { source: "/lp/:path*", headers: noindex },
      { source: "/thank-you/", headers: noindex },
      { source: "/request-service/", headers: noindex },
      { source: "/api/:path*", headers: noindex },
      { source: "/data/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400" }] },
      { source: "/photos/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.brightlaneelectric.com" }], destination: "https://brightlaneelectric.com/:path*", permanent: true }];
  },
};
export default config;
