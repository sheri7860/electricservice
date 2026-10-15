import type { Faq } from "@/content/types";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line rounded-xl bg-white ring-1 ring-line">
      {faqs.map((f) => (
        <details key={f.q} className="group p-5" open>
          <summary className="flex min-w-0 cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold">
            <span className="min-w-0">{f.q}</span>
            <span aria-hidden="true" className="mt-1 text-current transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 leading-relaxed text-ink/80">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
