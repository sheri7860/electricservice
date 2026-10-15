import Link from "next/link";

export function Breadcrumbs({ items, light = true }: { items: { name: string; path: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-white/70" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? <span aria-current="page" className={light ? "text-white" : "text-ink"}>{c.name}</span> : <Link href={c.path} className="hover:underline">{c.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
