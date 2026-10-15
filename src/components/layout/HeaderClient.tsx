"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { routes } from "@/lib/routes";
import { site, telHref } from "@/content/site";

type Group = { name: string; items: { name: string; href: string }[] };

export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`sticky top-0 z-40 border-b bg-ink/95 text-white backdrop-blur transition-shadow ${scrolled ? "border-white/10 shadow-lg shadow-black/30" : "border-white/10"}`}>
      <div className="relative">{children}</div>
    </header>
  );
}

export function MegaMenu({ label, href, groups, feature, wide = false }: { label: string; href: string; groups: Group[]; feature: { title: string; text: string; href: string }; wide?: boolean }) {
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const path = usePathname();
  const active = path.startsWith(href);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const hover = (v: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(v), v ? 90 : 160);
  };
  return (
    <div className="flex" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={`flex items-center gap-1 border-b-[3px] px-3 text-[15px] font-semibold hover:text-volt ${active || open ? "border-volt" : "border-transparent"}`}>
        {label} <span aria-hidden="true" className="text-xs">▾</span>
      </button>
      <div className={`absolute inset-x-0 top-full max-h-[calc(100vh-110px)] overflow-y-auto border-t border-line bg-white text-ink shadow-xl ${open ? "" : "hidden"}`}>
        <div className="container-x grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
          <Link href={feature.href} className="self-start rounded-xl bg-ink p-6 text-white hover:bg-ink-2">
            <p className="font-display text-xl font-bold text-volt">{feature.title}</p>
            <p className="mt-2 text-sm text-white/80">{feature.text}</p>
            <span className="mt-4 inline-block text-sm font-semibold">View all {label.toLowerCase()} →</span>
          </Link>
          <div className={`grid gap-x-6 gap-y-5 ${wide ? "grid-cols-4" : "grid-cols-4"}`}>
            {groups.map((g) => (
              <div key={g.name}>
                <p className="mb-2 border-b border-line pb-1 text-xs font-bold uppercase tracking-wider text-muted">{g.name}</p>
                <ul className="space-y-1">
                  {g.items.map((i) => (
                    <li key={i.href}><Link href={i.href} className="text-sm hover:text-current hover:underline">{i.name}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileNav({ serviceGroups, stateGroups }: { serviceGroups: Group[]; stateGroups: Group[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) panel.current?.querySelector<HTMLElement>("button")?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <>
      <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="grid h-12 w-12 place-items-center rounded-md ring-1 ring-white/25">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {mounted && createPortal(
        <div className={`fixed inset-0 z-50 overflow-hidden ${open ? "" : "invisible"}`} inert={!open}>
          <div className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
          <div ref={panel} role="dialog" aria-modal="true" aria-label="Menu" className={`absolute inset-y-0 right-0 flex w-[min(92vw,400px)] flex-col bg-white text-ink transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex items-center justify-between border-b border-line p-4">
              <span className="font-display text-lg font-bold">Menu</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-md ring-1 ring-line">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <Link href={routes.emergency} className="mb-4 block rounded-xl bg-alert p-4 text-white"><b>Electrical emergency?</b><span className="block text-sm text-white/85">Shut off the circuit, then call {site.phone}</span></Link>
              {[{ title: "Services", groups: serviceGroups }, { title: "States we cover", groups: stateGroups }].map((sec) => (
                <details key={sec.title} className="border-b border-line py-2">
                  <summary className="cursor-pointer py-2 font-display text-lg font-bold">{sec.title}</summary>
                  {sec.groups.map((g) => (
                    <div key={g.name} className="mb-3">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">{g.name}</p>
                      <ul className="grid grid-cols-2 gap-1">
                        {g.items.map((i) => <li key={i.href}><Link href={i.href} className="block py-1.5 text-sm">{i.name}</Link></li>)}
                      </ul>
                    </div>
                  ))}
                </details>
              ))}
              {[["Guides", routes.resources], ["How it works", routes.about], ["FAQ", routes.faq], ["Contact", routes.contact]].map(([n, h]) => (
                <Link key={h} href={h} className="block border-b border-line py-3 font-semibold">{n}</Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <a href={telHref()} className="btn btn-primary" data-event="call_click">Call</a>
              <Link href={routes.request} className="btn btn-secondary">Request</Link>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
