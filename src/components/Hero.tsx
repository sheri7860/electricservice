import Link from "next/link";
import Image from "next/image";
import type { Photo } from "@/content/photos";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { PhoneLink } from "./PhoneLink";
import { Icon } from "./icons";
import { routes } from "@/lib/routes";

/** Graphite hero. With an aside (form or ZIP checker) the photo fills the right half behind it; otherwise it is shown framed on the right. */
export function Hero({ crumbs, eyebrow, title, lead, facts, aside, photo, bleed = false, requestHref = routes.request, emergency = false }: {
  crumbs?: { name: string; path: string }[];
  eyebrow?: string;
  title: string;
  lead: ReactNode;
  facts?: string[];
  aside?: ReactNode;
  /** Stock photo (see public/photos/CREDITS.md). */
  photo?: Photo;
  /** Photo fills the right side and fades into the background, with its warm light spilling behind the title. */
  bleed?: boolean;
  requestHref?: string;
  emergency?: boolean;
}) {
  const framed = photo && !aside && !bleed;
  const twoCol = aside || framed;
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {photo && bleed && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
            <Image src={photo.src} alt="" fill priority quality={85} sizes="(min-width: 1024px) 64vw, 100vw" className="object-cover object-[70%_center]" />
          </div>
          <div className="absolute inset-0 bg-ink/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-ink lg:from-[36%] lg:via-ink/75 lg:via-[55%] lg:to-ink/10" />
          <div className="absolute left-[-10%] top-[-20%] h-[90%] w-[75%] bg-[radial-gradient(closest-side,rgba(255,194,26,0.16),rgba(255,194,26,0.05)_55%,transparent)]" />
        </div>
      )}
      {photo && aside && (
        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[48%] lg:block">
          <Image src={photo.src} alt="" fill priority sizes="48vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-ink/10" />
        </div>
      )}
      <div className={`container-x grid gap-10 py-9 sm:py-16 xl:py-20 ${twoCol ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-14" : ""}`}>
        <div className={`min-w-0 ${bleed ? "lg:max-w-[560px] xl:max-w-[620px]" : ""}`}>
          {crumbs && <div className="mb-4 sm:mb-6"><Breadcrumbs items={crumbs} /></div>}
          {eyebrow && <p className="eyebrow mb-3 text-volt sm:mb-5">{eyebrow}</p>}
          <h1 className="max-w-3xl text-[2.1rem] font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[2.75rem] xl:text-[3.5rem]">{title}</h1>
          <div className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg">{lead}</div>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <PhoneLink className={`btn ${emergency ? "btn-alert" : "btn-primary"} min-h-13 px-6 text-base shadow-lg shadow-black/20`} emergency={emergency} />
            <Link href={requestHref} className="btn btn-outline-light min-h-13 px-6 text-base">Request service online</Link>
          </div>
          {facts && (
            <ul className="mt-8 flex flex-wrap gap-2 text-sm text-white/85">
              {facts.map((f) => (
                <li key={f} className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 ring-1 ring-white/10">
                  <Icon name="check" className="h-4 w-4 text-volt" />{f}
                </li>
              ))}
            </ul>
          )}
        </div>
        {aside && <div className="min-w-0 lg:drop-shadow-2xl">{aside}</div>}
        {framed && (
          <figure className="relative hidden min-w-0 md:block">
            <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-2/3 w-2/3 rounded-2xl border-2 border-volt/70" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
            </div>
          </figure>
        )}
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-volt via-volt/50 to-transparent" />
    </section>
  );
}

export function CtaBand({ title = "Need an electrician?", text = "Call now, or send a request and a licensed electrician who serves your ZIP code will contact you." }: { title?: string; text?: string }) {
  return (
    <section className="bg-volt">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 max-w-2xl text-ink/80">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <PhoneLink className="btn btn-secondary" />
          <Link href={routes.request} className="btn btn-outline">Request service</Link>
        </div>
      </div>
    </section>
  );
}
