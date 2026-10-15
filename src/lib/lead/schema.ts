import { z } from "zod";

const clean = (max: number) => z.string().trim().max(max).transform((s) => s.replace(/[<>]/g, ""));

export const leadSchema = z.object({
  service: clean(80).pipe(z.string().min(1, "Choose a service")),
  urgent: z.boolean(),
  zip: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code"),
  timing: clean(40).optional().default(""),
  name: clean(80).pipe(z.string().min(2, "Enter your name")),
  phone: z.string().trim().transform((s) => s.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")).pipe(z.string().regex(/^[2-9]\d{2}[2-9]\d{6}$/, "Enter a valid US phone number")),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional().default(""),
  notes: clean(1000).optional().default(""),
  consent: z.literal(true, { message: "Please agree so an electrician can contact you" }),
  website: z.string().optional().default(""),
  startedAt: z.number().optional(),
  attribution: z.record(z.string(), z.string().max(300)).optional(),
});
export type Lead = z.infer<typeof leadSchema>;
