import "server-only";
import fs from "node:fs";
import path from "node:path";

let idx: Record<string, [string, string]> | null = null;
export function coverageForZip(zip: string) {
  idx ??= JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "data", "zips.json"), "utf8"));
  return idx![zip] ?? null;
}
