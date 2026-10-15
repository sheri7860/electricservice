import Link from "next/link";
import { Logo } from "../Logo";
import { PhoneLink } from "../PhoneLink";
import { availability, site } from "@/content/site";
import { routes } from "@/lib/routes";
import { serviceGroups, stateGroups, stateCount } from "./nav";
import { MegaMenu, HeaderShell, MobileNav } from "./HeaderClient";

export function Header() {
  return (
    <>
      <div className="border-b border-white/10 bg-ink text-[13px] text-white/80">
        <div className="container-x flex min-h-9 items-center justify-between gap-4">
          <p className="truncate"><span className="font-semibold text-volt">Nationwide</span> · Licensed electricians in {stateCount - 1} states + DC</p>
          <p className="hidden truncate md:block">{availability}</p>
        </div>
      </div>
      <HeaderShell>
        <div className="container-x flex h-[80px] items-center">
          <Logo />
          <nav aria-label="Main" className="ml-8 hidden h-full items-stretch gap-1 lg:flex xl:ml-12">
            <MegaMenu label="Services" href={routes.services} groups={serviceGroups} feature={{ title: "Electrical emergency?", text: "Burning smell, sparks or a buzzing panel: shut off the circuit and call.", href: routes.emergency }} />
            <MegaMenu label="Locations" href={routes.locations} groups={stateGroups} wide feature={{ title: `${stateCount - 1} states + DC`, text: "Check your ZIP code to confirm an electrician serves your address.", href: routes.locations }} />
            <Link href={routes.resources} className="flex items-center px-3 text-[15px] font-semibold hover:text-volt">Guides</Link>
            <Link href={routes.about} className="flex items-center px-3 text-[15px] font-semibold hover:text-volt">How it works</Link>
            <Link href={routes.contact} className="hidden items-center px-3 text-[15px] font-semibold hover:text-volt xl:flex">Contact</Link>
          </nav>
          <div className="ml-auto hidden items-center gap-4 lg:flex">
            <div className="hidden text-right leading-tight xl:block">
              <span className="block text-xs text-white/60">Talk to an electrician</span>
              <a href={`tel:${site.phoneE164}`} data-event="call_click" className="font-display text-lg font-bold hover:text-volt">{site.phone}</a>
            </div>
            <Link href={routes.request} className="btn btn-primary">Request service</Link>
          </div>
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <PhoneLink className="btn btn-primary px-4 text-sm" label="Call" />
            <MobileNav serviceGroups={serviceGroups} stateGroups={stateGroups} />
          </div>
        </div>
      </HeaderShell>
    </>
  );
}
