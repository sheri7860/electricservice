import type { LandingPage } from "./types";

export const landingPages: LandingPage[] = [
  {
    slug: "emergency-electrician",
    service: "emergency-electrician",
    h1: "Electrical emergency? Talk to a licensed electrician now",
    kw: { "electrician-near-me": "Need an electrician near you? Call now", "burning-smell": "Burning smell from an outlet? Call an electrician", "power-out": "Lost power to part of the house? Call now" },
    bullets: ["Burning smells, sparks and buzzing panels", "Breakers that will not reset", "Partial power loss", "Water near outlets or the panel"],
  },
  {
    slug: "panel-upgrade",
    service: "panel-upgrade",
    h1: "Electrical panel upgrade from a licensed electrician",
    kw: { "200-amp": "200 amp panel upgrade from a licensed electrician", "fuse-box": "Replace your fuse box with a modern panel", "federal-pacific": "Replace a Federal Pacific or Zinsco panel" },
    bullets: ["Load calculation before any quote", "Permit and utility coordination", "Room for EV chargers and heat pumps", "Fuse box, Federal Pacific and Zinsco replacement"],
  },
  {
    slug: "ev-charger",
    service: "ev-charger-installation",
    h1: "Home EV charger installation",
    kw: { "level-2": "Level 2 EV charger installation", tesla: "Wall connector installation for your EV" },
    bullets: ["240V circuit sized to your charger", "Panel capacity check", "Permit and inspection", "Hardwired or NEMA 14-50"],
  },
  {
    slug: "electrical-repair",
    service: "electrical-repair",
    h1: "Electrical repair from a licensed electrician",
    kw: { "outlet-not-working": "Outlet not working? Get it fixed", "breaker-tripping": "Breaker keeps tripping? Get it fixed", "flickering-lights": "Flickering lights? Find the cause" },
    bullets: ["Dead outlets and switches", "Tripping breakers", "Flickering or dimming lights", "Warm plates and burning smells"],
  },
];

export const getLanding = (slug: string) => landingPages.find((l) => l.slug === slug);
