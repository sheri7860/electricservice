import Link from "next/link";
import { coveredStates } from "@/content/locations";
import { routes } from "@/lib/routes";

// Standard US tile-grid layout: [code, col, row]
const tiles: [string, number, number][] = [
  ["AK", 0, 0], ["ME", 11, 0],
  ["VT", 10, 1], ["NH", 11, 1],
  ["WA", 1, 2], ["ID", 2, 2], ["MT", 3, 2], ["ND", 4, 2], ["MN", 5, 2], ["IL", 6, 2], ["WI", 7, 2], ["MI", 8, 2], ["NY", 9, 2], ["RI", 10, 2], ["MA", 11, 2],
  ["OR", 1, 3], ["NV", 2, 3], ["WY", 3, 3], ["SD", 4, 3], ["IA", 5, 3], ["IN", 6, 3], ["OH", 7, 3], ["PA", 8, 3], ["NJ", 9, 3], ["CT", 10, 3],
  ["CA", 1, 4], ["UT", 2, 4], ["CO", 3, 4], ["NE", 4, 4], ["MO", 5, 4], ["KY", 6, 4], ["WV", 7, 4], ["VA", 8, 4], ["MD", 9, 4], ["DE", 10, 4],
  ["AZ", 2, 5], ["NM", 3, 5], ["KS", 4, 5], ["AR", 5, 5], ["TN", 6, 5], ["NC", 7, 5], ["SC", 8, 5], ["DC", 9, 5],
  ["OK", 4, 6], ["LA", 5, 6], ["MS", 6, 6], ["AL", 7, 6], ["GA", 8, 6],
  ["HI", 0, 7], ["TX", 4, 7], ["FL", 9, 7],
];

export function StateTileMap() {
  const byCode = new Map(coveredStates.map((s) => [s.code, s]));
  return (
    <div className="grid grid-cols-12 gap-1 sm:gap-1.5" role="list" aria-label="States with electrician coverage">
      {tiles.map(([code, col, row]) => {
        const s = byCode.get(code);
        const style = { gridColumnStart: col + 1, gridRowStart: row + 1 };
        return s ? (
          <Link key={code} role="listitem" href={routes.state(s.slug)} title={s.name} style={style} className="grid aspect-square place-items-center rounded-md bg-ink text-[10px] font-bold text-volt transition-colors hover:bg-current hover:text-white sm:text-sm">
            {code}
          </Link>
        ) : (
          <span key={code} role="listitem" style={style} title={`${code}: no coverage yet`} className="grid aspect-square place-items-center rounded-md bg-paper-deep text-[10px] font-semibold text-muted/70 sm:text-sm">{code}</span>
        );
      })}
    </div>
  );
}
