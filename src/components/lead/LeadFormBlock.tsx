import { availability, site } from "@/content/site";
import { PhoneLink } from "../PhoneLink";

/** Call-only contact box. Online requests are turned off; every page points to the phone line. */
export function LeadFormBlock({ id }: { defaultService?: string; id?: string }) {
  return (
    <div id={id} className="rounded-2xl bg-white p-6 text-ink shadow-xl ring-1 ring-line">
      <p className="font-display text-2xl font-bold">Talk to an electrician</p>
      <p className="mt-2 text-ink/75">Call and we connect you with a licensed, independent electrician who serves your ZIP code. {availability}</p>
      <PhoneLink className="btn btn-primary mt-5 min-h-13 w-full text-base" />
      <p className="mt-3 text-center text-sm text-muted">{site.phone}</p>
    </div>
  );
}
