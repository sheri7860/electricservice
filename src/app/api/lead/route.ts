import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead/schema";
import { limited } from "@/lib/lead/rateLimit";
import { deliverLead } from "@/lib/lead/store";
import { coverageForZip } from "@/lib/zips";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!req.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "json only" }, { status: 415 });
  const raw = await req.text();
  if (raw.length > 10_000) return NextResponse.json({ error: "too large" }, { status: 413 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  const ipHash = crypto.createHash("sha256").update((process.env.LEAD_IP_SALT ?? "brightlane") + ip).digest("hex").slice(0, 16);
  if (limited(ipHash)) return NextResponse.json({ error: "Too many requests. Please call instead." }, { status: 429 });

  let json: unknown;
  try { json = JSON.parse(raw); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 422 });
  const lead = parsed.data;

  // Bots: honeypot filled or submitted too fast → silent success.
  if (lead.website || (lead.startedAt && Date.now() - lead.startedAt < 2500)) return NextResponse.json({ ok: true });

  const covered = coverageForZip(lead.zip);
  const record = { ...lead, website: undefined, covered: !!covered, coveredCity: covered?.[0] ?? null, coveredState: covered?.[1] ?? null, ipHash, receivedAt: new Date().toISOString() };
  try {
    const dest = await deliverLead(record);
    if (dest === "none") return NextResponse.json({ error: "Online requests are unavailable. Please call." }, { status: 503 });
    console.info("lead", { dest, service: lead.service, covered: !!covered });
    return NextResponse.json({ ok: true, covered: !!covered });
  } catch (e) {
    console.error("lead delivery failed", (e as Error).message);
    return NextResponse.json({ error: "Please call instead." }, { status: 502 });
  }
}
