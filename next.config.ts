import type { NextConfig } from "next";

/**
 * Static export for Cloudflare Pages. The site is call-only, so there is no server code:
 * every page is prerendered to HTML in out/. Security headers live in public/_headers and
 * redirects in public/_redirects (Cloudflare Pages formats); the www -> apex redirect is a
 * Cloudflare rule on the zone.
 */
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};
export default config;
