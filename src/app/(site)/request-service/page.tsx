import Image from "next/image";
import { photos } from "@/content/photos";
import { LeadFormBlock } from "@/components/lead/LeadFormBlock";
import { PhoneLink } from "@/components/PhoneLink";
import { availability } from "@/content/site";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Request an Electrician", description: "Send a short request and a licensed electrician who serves your ZIP code will contact you.", path: routes.request, noindex: true });

export default function Page() {
  return (
    <div className="container-x grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_440px]">
      <div>
        <p className="eyebrow mb-3 text-current">Request service</p>
        <h1 className="text-4xl font-bold">Request an electrician</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">Three short steps. Your request goes to up to three independent, licensed electricians who serve your ZIP code, and they contact you to confirm the details and price.</p>
        <div className="mt-8 rounded-xl bg-ink p-6 text-white">
          <p className="font-display text-xl font-bold">Faster by phone</p>
          <p className="mb-4 text-sm text-white/75">{availability}</p>
          <PhoneLink />
        </div>
        <Image src={photos.howItWorks.src} alt={photos.howItWorks.alt} width={photos.howItWorks.width} height={photos.howItWorks.height}
          sizes="(min-width: 1024px) 50vw, 100vw" className="mt-8 hidden aspect-[3/2] w-full rounded-2xl object-cover lg:block" />
      </div>
      <LeadFormBlock />
    </div>
  );
}
