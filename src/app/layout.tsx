import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { Tracking } from "@/components/Tracking";
import { siteGraph } from "@/lib/schema";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  verification: {
    ...(site.googleVerification ? { google: site.googleVerification } : {}),
    ...(site.bingVerification ? { other: { "msvalidate.01": site.bingVerification } } : {}),
  },
};

export const viewport: Viewport = { themeColor: "#15171c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="antialiased">
        {children}
        <JsonLd data={siteGraph()} />
        <Tracking gtmId={site.gtmId || undefined} />
      </body>
    </html>
  );
}
