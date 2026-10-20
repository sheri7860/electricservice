import type { Faq } from "./types";
import { STATE_COUNT } from "@/content/locations";
import { DISCLOSURE } from "./site";

export const homeFaqs: Faq[] = [
  { q: "Is Brightlane Electric an electrical contractor?", a: "No. Brightlane Electric is a free referral service. Your call or request goes to an independent, licensed electrician who serves your area, and that electrician quotes and performs the work." },
  { q: "How much does it cost to use Brightlane?", a: "Nothing. Calling or sending a request is free. You only pay the electrician if you hire them, at the price you agree on." },
  { q: "Which areas do you cover?", a: `We currently route electrical calls in ${STATE_COUNT} states and Washington, DC, covering thousands of cities and ZIP codes. Use the ZIP checker to confirm your address.` },
  { q: "Can I get help with an electrical emergency?", a: "Yes, call. If there is smoke or flame, leave and call 911 first. For a burning smell, sparks or a buzzing panel, shut off the circuit if it is safe and call." },
  { q: "Will the electrician be licensed?", a: "Requests are routed to electricians and electrical companies that represent themselves as licensed for their area. Always ask for the license number and check it with your state or local licensing board." },
];

export const generalFaqs: Faq[] = [
  ...homeFaqs,
  { q: "What happens after I send a request?", a: "Your request is shared with up to three independent electricians serving your ZIP code. They contact you by phone or text to confirm details and quote the work." },
  { q: "Do you set the prices?", a: "No. Each electrician sets their own prices. Our service pages explain what affects the cost so you can compare quotes." },
  { q: "Do I need a permit for electrical work?", a: "Panel upgrades, new circuits, EV chargers, generators and rewiring almost always need a permit. Licensed electricians usually pull it. Simple like-for-like device swaps often do not." },
  { q: "How do I check an electrician's license?", a: "Ask for the license number and look it up on your state's licensing board website, or your city's in places that license electricians locally." },
  { q: "How is my information used?", a: DISCLOSURE + " See our Privacy Policy for details." },
];
