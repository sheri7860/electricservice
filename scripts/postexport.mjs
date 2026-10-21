// After `next build` (output: "export"): drop the per-page RSC payloads (index.txt, __next.*.txt).
// They are several files per page and would push the deploy past Cloudflare Pages' 20,000-file
// limit; without them, links simply do a normal page load.
import { readdirSync, rmSync } from "node:fs";
import path from "node:path";

let removed = 0;
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.txt" || (e.name.startsWith("__next.") && e.name.endsWith(".txt"))) { rmSync(p); removed++; }
  }
};
walk("out");
console.log("RSC payload files removed:", removed);
