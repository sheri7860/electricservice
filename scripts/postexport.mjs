// Removes Next.js RSC payload files (index.txt and __next.*.txt) from the static export.
// The site works without them (client navigation falls back to full page loads), and
// dropping them keeps the file count under Cloudflare Pages' 20,000-file limit.
import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "out";
let removed = 0;
let kept = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      if (readdirSync(p).length === 0) rmSync(p, { recursive: true });
    } else if (name === "index.txt" || (name.startsWith("__next.") && name.endsWith(".txt"))) {
      rmSync(p);
      removed++;
    } else kept++;
  }
}

walk(root);
console.log(`postexport: removed ${removed} RSC files, ${kept} files remain in ${root}/`);
