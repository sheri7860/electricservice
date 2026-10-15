import Link from "next/link";
import { PhoneLink } from "@/components/PhoneLink";
import { routes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Request Received", description: "Your request was received.", path: routes.thankYou, noindex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const type = (await searchParams).type;
  return (
    <div className="container-x max-w-2xl py-20 text-center">
      <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-volt text-3xl">✓</span>
      <h1 className="text-4xl font-bold">Request received</h1>
      {type === "emergency" ? (
        <p className="mt-4 text-lg text-muted">Because this is urgent, please also call now. If you see smoke or flame, leave the house and call 911.</p>
      ) : type === "out-of-area" ? (
        <p className="mt-4 text-lg text-muted">We don&apos;t have a confirmed electrician for that ZIP code yet. We&apos;ll look for the nearest option; calling is the fastest way to check.</p>
      ) : (
        <p className="mt-4 text-lg text-muted">An independent, licensed electrician who serves your area will contact you by phone or text to confirm the details. Keep your phone nearby.</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PhoneLink emergency={type === "emergency"} className={`btn ${type === "emergency" ? "btn-alert" : "btn-primary"}`} />
        <Link href={routes.resources} className="btn btn-outline">Read our guides</Link>
      </div>
    </div>
  );
}
