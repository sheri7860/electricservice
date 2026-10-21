"use client";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { site, telHref } from "@/content/site";

let cache: Promise<Record<string, [string, string]>> | null = null;
export const loadZips = () => (cache ??= fetch("/data/zips.json").then((r) => r.json()));

export function ZipChecker({ dark = false }: { dark?: boolean }) {
  const [zip, setZip] = useState("");
  const [res, setRes] = useState<null | { ok: boolean; city?: string; st?: string }>(null);
  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) return setRes({ ok: false });
    const hit = (await loadZips())[zip];
    setRes(hit ? { ok: true, city: hit[0], st: hit[1] } : { ok: false });
    (window as unknown as { dataLayer?: object[] }).dataLayer?.push({ event: "location_selected", covered: !!hit });
  };
  return (
    <div>
      <form onSubmit={check} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <label htmlFor="zip-check" className="sr-only">ZIP code</label>
        <input id="zip-check" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="Enter your ZIP code" value={zip} onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setRes(null); }} className="field" />
        <button className="btn btn-primary">Check</button>
      </form>
      <p aria-live="polite" className={`mt-3 min-h-6 text-sm ${dark ? "text-white/85" : "text-ink/80"}`}>
        {res?.ok && (<>✓ Electricians serve <b>{res.city}, {res.st}</b> ({zip}). <a href={telHref()} data-event="call_click" className={dark ? "font-semibold text-volt underline" : "link"}>Call {site.phone}</a></>)}
        {res && !res.ok && (/^\d{5}$/.test(zip) ? <>We don&apos;t have a confirmed electrician for {zip} yet. Call and we&apos;ll check nearby options.</> : <>Enter a 5-digit ZIP code.</>)}
      </p>
    </div>
  );
}
