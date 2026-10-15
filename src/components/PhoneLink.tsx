import { site, telHref } from "@/content/site";
import { Icon } from "./icons";

export function PhoneLink({ className = "btn btn-primary", label, ppc = false, emergency = false }: { className?: string; label?: string; ppc?: boolean; emergency?: boolean }) {
  const phone = ppc && site.ppcPhone ? site.ppcPhone : site.phone;
  const e164 = ppc && site.ppcPhone ? "+1" + site.ppcPhone.replace(/\D/g, "").slice(-10) : site.phoneE164;
  return (
    <a href={telHref(e164)} className={className} data-event={emergency ? "emergency_call_click" : "call_click"}>
      <Icon name="phone" className="h-5 w-5" />
      {label ?? `Call ${phone}`}
    </a>
  );
}
