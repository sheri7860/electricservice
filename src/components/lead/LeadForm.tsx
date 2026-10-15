"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { site, telHref } from "@/content/site";
import { loadZips } from "../ZipChecker";

type Opt = { slug: string; name: string };
type Errors = Record<string, string>;

const push = (event: string, data: object = {}) => (window as unknown as { dataLayer?: object[] }).dataLayer?.push({ event, ...data });

function attribution() {
  try { return JSON.parse(localStorage.getItem("bl_attr") ?? "{}"); } catch { return {}; }
}

export function LeadForm({ services, defaultService = "", defaultZip = "", id = "lead-form" }: { services: Opt[]; defaultService?: string; defaultZip?: string; id?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [urgent, setUrgent] = useState<boolean | null>(null);
  const [v, setV] = useState({ service: defaultService, zip: defaultZip, timing: "", name: "", phone: "", email: "", notes: "", consent: false, website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [zipNote, setZipNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState("");
  const startedAt = useRef<number>(0);
  const root = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setV((o) => ({ ...o, service: q.get("service") && services.some((s) => s.slug === q.get("service")) ? q.get("service")! : o.service, zip: /^\d{5}$/.test(q.get("zip") ?? "") ? q.get("zip")! : o.zip }));
  }, [services]);

  useEffect(() => {
    if (!/^\d{5}$/.test(v.zip)) return setZipNote("");
    loadZips().then((m) => setZipNote(m[v.zip] ? `✓ Electricians serve ${m[v.zip][0]}, ${m[v.zip][1]}` : "No confirmed electrician for this ZIP yet. You can still send a request."));
  }, [v.zip]);

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!startedAt.current) { startedAt.current = Date.now(); push("form_start"); }
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setV((o) => ({ ...o, [k]: val }));
    if (k === "service") push("service_selected", { service: val });
  };

  const focusError = (errs: Errors) => {
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) { push("form_error", { field: first }); setTimeout(() => root.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(), 0); }
    return !first;
  };

  const validate = (s: number) => {
    const e: Errors = {};
    if (s === 1) {
      if (!v.service) e.service = "Choose a service";
      if (urgent === null) e.urgent = "Choose yes or no";
    }
    if (s === 2 && !/^\d{5}$/.test(v.zip)) e.zip = "Enter a 5-digit ZIP code";
    if (s === 3) {
      if (urgent && !/^\d{5}$/.test(v.zip)) e.zip = "Enter a 5-digit ZIP code";
      if (v.name.trim().length < 2) e.name = "Enter your name";
      if (!/^1?[2-9]\d{2}[2-9]\d{6}$/.test(v.phone.replace(/\D/g, ""))) e.phone = "Enter a valid US phone number";
      if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
      if (!v.consent) e.consent = "Please agree so an electrician can contact you";
    }
    return focusError(e);
  };

  const next = () => {
    if (!validate(step)) return;
    const n = step === 1 && urgent ? 3 : step + 1;
    setStep(n);
    push("form_step", { step: n });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return next();
    if (!validate(3)) return;
    setBusy(true); setFail("");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...v, urgent: !!urgent, startedAt: startedAt.current || undefined, attribution: attribution() }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        push("form_submit", { service: v.service, urgent: !!urgent });
        router.push(`/thank-you/?type=${urgent ? "emergency" : data.covered === false ? "out-of-area" : "standard"}`);
        return;
      }
      if (res.status === 422 && data.issues) {
        const errs: Errors = {};
        for (const i of data.issues) errs[i.path] = i.message;
        focusError(errs);
        if (errs.zip || errs.service) setStep(errs.service ? 1 : 2);
      } else setFail(data.error ?? "Something went wrong. Please call instead.");
    } catch {
      setFail("Network error. Please call instead.");
    } finally {
      setBusy(false);
    }
  };

  const err = (k: string) => errors[k] && <p id={`${id}-${k}-err`} className="mt-1 text-sm font-medium text-alert">{errors[k]}</p>;
  const a11y = (k: string) => ({ name: k, id: `${id}-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });
  const total = urgent ? 2 : 3;
  const shown = urgent && step === 3 ? 2 : step;

  return (
    <form id={id} ref={root} onSubmit={submit} noValidate className="card-top scroll-mt-28 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-display text-xl font-bold">Request an electrician</p>
        <p className="shrink-0 text-sm text-muted">Step {shown} of {total}</p>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-paper-deep"><div className="h-full bg-volt transition-all" style={{ width: `${(shown / total) * 100}%` }} /></div>

      <div className="hidden" aria-hidden="true"><label>Website <input tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} name="website" /></label></div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor={`${id}-service`} className="field-label">What do you need?</label>
            <select {...a11y("service")} className="field" value={v.service} onChange={set("service")}>
              <option value="">Choose a service</option>
              {services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              <option value="other">Something else</option>
            </select>
            {err("service")}
          </div>
          <fieldset>
            <legend className="field-label">Burning smell, sparks, or power out to part of the house?</legend>
            <div className="grid grid-cols-2 gap-2">
              {[["Yes", true], ["No", false]].map(([l, b]) => (
                <label key={String(l)} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-md border-2 font-semibold ${urgent === b ? "border-ink bg-ink text-white" : "border-line bg-white"}`}>
                  <input type="radio" name="urgent" className="sr-only" checked={urgent === b} onChange={() => { setUrgent(b as boolean); setErrors((e) => ({ ...e, urgent: "" })); }} />
                  {l as string}
                </label>
              ))}
            </div>
            {err("urgent")}
          </fieldset>
          {urgent && (
            <div className="rounded-lg bg-alert-tint p-4 text-sm">
              <p className="font-semibold text-alert">Shut off that circuit at the panel if it is safe. If there is smoke or flame, leave and call 911.</p>
              <a href={telHref()} className="btn btn-alert mt-3 w-full" data-event="emergency_call_click">Call {site.phone} now</a>
              <p className="mt-2 text-muted">Or continue for a fast callback.</p>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor={`${id}-zip`} className="field-label">ZIP code of the property</label>
            <input {...a11y("zip")} className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={v.zip} onChange={set("zip")} />
            {err("zip")}
            {zipNote && <p className="mt-1.5 text-sm text-current">{zipNote}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-timing`} className="field-label">When do you need it?</label>
            <select {...a11y("timing")} className="field" value={v.timing} onChange={set("timing")}>
              <option value="">Choose timing</option>
              <option>As soon as possible</option>
              <option>This week</option>
              <option>In the next few weeks</option>
              <option>Just getting a quote</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {urgent && (
            <div>
              <label htmlFor={`${id}-zip`} className="field-label">ZIP code</label>
              <input {...a11y("zip")} className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={v.zip} onChange={set("zip")} />
              {err("zip")}
            </div>
          )}
          <div>
            <label htmlFor={`${id}-name`} className="field-label">Your name</label>
            <input {...a11y("name")} className="field" autoComplete="name" value={v.name} onChange={set("name")} />
            {err("name")}
          </div>
          <div>
            <label htmlFor={`${id}-phone`} className="field-label">Phone</label>
            <input {...a11y("phone")} className="field" type="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} />
            {err("phone")}
          </div>
          {!urgent && (
            <>
              <div>
                <label htmlFor={`${id}-email`} className="field-label">Email <span className="font-normal text-muted">(optional)</span></label>
                <input {...a11y("email")} className="field" type="email" autoComplete="email" value={v.email} onChange={set("email")} />
                {err("email")}
              </div>
              <div>
                <label htmlFor={`${id}-notes`} className="field-label">Anything the electrician should know? <span className="font-normal text-muted">(optional)</span></label>
                <textarea {...a11y("notes")} className="field min-h-24 py-2" maxLength={1000} value={v.notes} onChange={set("notes")} />
              </div>
            </>
          )}
          <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
            <input {...a11y("consent")} type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#0f766e]" checked={v.consent} onChange={set("consent")} />
            <span>I agree that {site.name} may share my request with up to three independent, licensed electricians serving my area, and that they and {site.name} may call or text me about it at the number above, including by automated means. Consent is not a condition of purchase. Message and data rates may apply.</span>
          </label>
          {err("consent")}
        </div>
      )}

      {fail && <p role="alert" className="mt-4 rounded-md bg-alert-tint p-3 text-sm text-alert">{fail} <a href={telHref()} className="font-semibold underline">{site.phone}</a></p>}

      <div className="mt-5 flex gap-2">
        {step > 1 && <button type="button" className="btn btn-outline" onClick={() => setStep(step === 3 && urgent ? 1 : step - 1)}>Back</button>}
        <button type="submit" disabled={busy} className="btn btn-primary flex-1 disabled:opacity-60">{step < 3 ? "Continue" : busy ? "Sending…" : "Send request"}</button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Free to use · No obligation</p>
    </form>
  );
}
