"use client";
import { useEffect } from "react";

/** First-party attribution (30 days) + click events to dataLayer + optional GTM after interactive. */
export function Tracking({ gtmId }: { gtmId?: string }) {
  useEffect(() => {
    const w = window as unknown as { dataLayer: object[] };
    w.dataLayer = w.dataLayer || [];
    try {
      const q = new URLSearchParams(location.search);
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "msclkid"];
      const found = Object.fromEntries(keys.filter((k) => q.get(k)).map((k) => [k, q.get(k)!.slice(0, 200)]));
      const old = JSON.parse(localStorage.getItem("bl_attr") ?? "null");
      if (Object.keys(found).length || !old || Date.now() - (Number(old.ts) || 0) > 30 * 864e5) {
        const channel = found.gclid || found.gbraid || found.wbraid ? "paid_search" : found.utm_medium ?? (document.referrer ? "referral" : "direct");
        localStorage.setItem("bl_attr", JSON.stringify({ ...found, channel, landing: location.pathname, referrer: document.referrer.slice(0, 200), device: matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop", ts: String(Date.now()) }));
      }
    } catch {}
    const click = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-event]");
      if (el) w.dataLayer.push({ event: el.dataset.event, page: location.pathname });
    };
    document.addEventListener("click", click);
    if (gtmId) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      document.head.appendChild(s);
    }
    return () => document.removeEventListener("click", click);
  }, [gtmId]);
  return null;
}
