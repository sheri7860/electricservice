import Link from "next/link";
import { Logo } from "../Logo";
import { DISCLOSURE, availability, site, telHref } from "@/content/site";
import { categories, servicesIn } from "@/content/services";
import { routes } from "@/lib/routes";
import { coveredStates } from "@/content/locations";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-white/80 lg:pb-0">
      <div className="h-1.5 bg-volt" />
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo full />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">One call connects you with an independent, licensed electrician who serves your ZIP code, in {coveredStates.length - 1} states and Washington, DC.</p>
          <a href={telHref()} data-event="call_click" className="mt-5 inline-block font-display text-2xl font-bold text-volt">{site.phone}</a>
          <p className="mt-1 text-sm">{availability}</p>
          {site.email && <a href={`mailto:${site.email}`} className="mt-1 block text-sm hover:underline">{site.email}</a>}
        </div>
        {categories.slice(0, 2).map((c, i) => (
          <div key={c.slug}>
            <p className="mb-3 font-display font-bold text-white">{i === 0 ? "Services" : "Upgrades & installs"}</p>
            <ul className="space-y-2 text-sm">
              {(i === 0 ? [...servicesIn("repair"), ...servicesIn("panels")] : [...servicesIn("install"), ...servicesIn("safety")]).map((s) => (
                <li key={s.slug}><Link href={routes.service(s.slug)} className="hover:text-volt">{s.name}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="mb-3 font-display font-bold text-white">Company</p>
          <ul className="space-y-2 text-sm">
            {[["All locations", routes.locations], ["Emergency electrician", routes.emergency], ["Guides", routes.resources], ["How it works", routes.about], ["FAQ", routes.faq], ["Contact", routes.contact]].map(([n, h]) => (
              <li key={h}><Link href={h} className="hover:text-volt">{n}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-6 text-xs leading-relaxed text-white/60">
          <p className="max-w-4xl">{DISCLOSURE}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <Link href={routes.privacy} className="hover:text-white">Privacy</Link>
            <Link href={routes.terms} className="hover:text-white">Terms</Link>
            <Link href={routes.accessibility} className="hover:text-white">Accessibility</Link>
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileActionBar(_props: { requestHref?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-2.5 backdrop-blur lg:hidden">
      <a href={telHref()} className="btn btn-primary w-full" data-event="call_click">Call now</a>
    </div>
  );
}
