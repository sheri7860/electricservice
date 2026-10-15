import Image from "next/image";
import type { Photo } from "@/content/photos";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import type { IconName } from "@/content/types";

export function SectionHeading({ eyebrow, title, lead, center = false }: { eyebrow?: string; title: string; lead?: ReactNode; center?: boolean }) {
  return (
    <div className={`mb-8 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3 text-current">{eyebrow}</p>}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      {lead && <p className="mt-3 text-lg text-muted">{lead}</p>}
    </div>
  );
}

export function ServiceCard({ href, icon, title, text, image }: { href: string; icon: IconName; title: string; text: string; image?: Photo }) {
  return (
    <Link href={href} className="card-top group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      {image && (
        <span className="relative block aspect-[16/10] overflow-hidden">
          <Image src={image.src} alt="" fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </span>
      )}
      <span className={`flex flex-1 flex-col p-6 ${image ? "pt-0" : ""}`}>
        <span className={`mb-4 grid h-12 w-12 place-items-center rounded-lg bg-ink text-volt ${image ? "relative -mt-6 ring-4 ring-white" : ""}`}><Icon name={icon} /></span>
        <h3 className="text-xl font-bold group-hover:text-current">{title}</h3>
        <p className="mt-2 flex-1 text-muted">{text}</p>
        <span className="mt-4 text-sm font-semibold text-current">Learn more →</span>
      </span>
    </Link>
  );
}
