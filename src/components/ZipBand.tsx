import { ZipChecker } from "./ZipChecker";

/** White band directly under a hero: ZIP checker on the left, coverage stats on the right. */
export function ZipBand({ title, note, stats }: { title: string; note: string; stats: [string, string][] }) {
  return (
    <section aria-label="Check coverage" className="relative z-10 bg-white shadow-sm">
      <div className="container-x grid gap-6 py-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
        <div className="min-w-0">
          <p className="font-display text-xl font-bold sm:text-2xl">{title}</p>
          <p className="mb-4 mt-1 text-muted">{note}</p>
          <ZipChecker />
        </div>
        <dl className={`grid divide-x divide-line rounded-xl bg-paper py-4 text-center ring-1 ring-line ${stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {stats.map(([n, l]) => (
            <div key={l} className="px-2"><dt className="sr-only">{l}</dt><dd className="font-display text-2xl font-bold sm:text-3xl">{n}</dd><dd className="text-xs text-muted sm:text-sm">{l}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
