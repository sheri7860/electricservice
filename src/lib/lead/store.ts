import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export async function deliverLead(lead: object): Promise<"webhook" | "file" | "none"> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (url) {
    const body = JSON.stringify(lead);
    const sig = crypto.createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET ?? "").update(body).digest("hex");
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", "x-signature": sig }, body });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return "webhook";
  }
  if (process.env.NODE_ENV !== "production") {
    await fs.mkdir(path.join(process.cwd(), ".data"), { recursive: true });
    await fs.appendFile(path.join(process.cwd(), ".data", "leads.jsonl"), JSON.stringify(lead) + "\n");
    return "file";
  }
  return "none";
}
