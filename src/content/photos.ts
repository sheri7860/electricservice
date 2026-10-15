/**
 * Site photos (see public/photos/CREDITS.md): AI-generated images supplied by the owner (.webp)
 * and licensed Pexels stock photos (.jpg). Illustrations only, never jobs done by the network.
 */
export type Photo = { src: string; alt: string; width: number; height: number };

const p = (file: string, alt: string, width = 1600, height = 1067): Photo => ({ src: `/photos/${file}.jpg`, alt, width, height });
const w = (file: string, alt: string, width = 1600, height = 1067): Photo => ({ src: `/photos/${file}.webp`, alt, width, height });

export const photos = {
  // Owner-supplied images
  hero: p("electrician-installing-ceiling-light", "An electrician on a ladder installing a ceiling light fixture", 2400, 1600),
  repair: w("repair-troubleshooting", "Testing an outlet with a multimeter"),
  outletRepair: w("outlet-switch-repair", "Installing a new wall outlet with a screwdriver"),
  emergency: w("emergency-electrician", "An electrician working at an electrical panel at night with a headlamp", 1600, 1600),
  panels: w("panel-upgrade", "A gloved hand working inside a new breaker panel"),
  rewiring: w("home-rewiring", "An electrician running new wiring through open wall studs", 1600, 852),
  circuits: w("dedicated-circuits", "Rows of breakers with neatly landed circuit wiring", 1600, 720),
  ev: w("ev-charger-installation", "A wall-mounted EV charger charging a car in a home garage"),
  lighting: w("lighting-installation", "A living room with new recessed ceiling lights"),
  pendants: w("pendant-lights-card", "Glass pendant lights over a kitchen counter", 1600, 852),
  ceilingFan: w("ceiling-fan-installation", "An electrician installing a ceiling fan"),
  generator: w("generator-installation", "A standby generator on a concrete pad beside a house"),
  howItWorks: w("how-it-works", "An electrician talking with a homeowner at her front door"),
  van: w("service-van", "An electrician's work van with its rear doors open, stocked with tools"),
  portrait: w("electrician-portrait", "An electrician wearing a tool belt outside a home"),
  // Pexels stock
  safety: p("ceiling-fire-alarm", "A ceiling-mounted fire alarm"),
  lightning: p("lightning-over-power-lines", "Lightning striking near utility poles at night"),
  locations: p("suburban-street-homes", "Two-story homes along a suburban street"),
  storm: p("power-lines-storm-clouds", "Power lines under towering storm clouds"),
  oldFuseBox: p("old-fuse-box", "An old, rusted fuse box with exposed wiring"),
  oldLamp: p("old-hanging-lamp", "An old single-bulb hanging lamp"),
  garage: p("garage-doors", "Closed garage doors"),
  outlet: p("us-wall-outlet", "A US duplex wall outlet on a brick wall"),
};

/** Common upgrades shown as example before/after pairs. Illustrations, not jobs done by the network. */
export const upgradePairs = [
  { title: "Fuse box to modern breaker panel", text: "Old fuse boxes and undersized panels are replaced with a breaker panel sized for today's loads, usually with a permit and a utility disconnect.", before: photos.oldFuseBox, after: photos.panels, href: "/electrical-services/panel-upgrade/" },
  { title: "Dated fixture to new lighting", text: "Swapping old fixtures for new pendants or recessed lights often means a new box rated for the fixture's weight and a dimmer suited to LED bulbs.", before: photos.oldLamp, after: photos.pendants, href: "/electrical-services/lighting-installation/" },
  { title: "Plain garage to EV-ready garage", text: "A Level 2 charger needs a dedicated 240-volt circuit, and a load calculation to confirm the panel can carry it.", before: photos.garage, after: photos.ev, href: "/electrical-services/ev-charger-installation/" },
];

/** Photo for each service category slug in services.ts. */
export const categoryPhoto: Record<string, Photo> = {
  repair: photos.repair,
  panels: photos.panels,
  install: photos.pendants,
  safety: photos.safety,
};

/** One photo per service, falling back to its category photo. */
const servicePhotoMap: Record<string, Photo> = {
  "emergency-electrician": photos.emergency,
  "electrical-repair": photos.repair,
  "outlet-switch-repair": photos.outletRepair,
  "panel-upgrade": photos.panels,
  "home-rewiring": photos.rewiring,
  "dedicated-circuits": photos.circuits,
  "ev-charger-installation": photos.ev,
  "lighting-installation": photos.lighting,
  "ceiling-fan-installation": photos.ceilingFan,
  "generator-installation": photos.generator,
  "surge-protection": photos.lightning,
  "gfci-afci-protection": photos.outlet,
  "smoke-detector-installation": photos.safety,
  "electrical-inspection": photos.portrait,
};
export const servicePhoto = (slug: string, category?: string): Photo => servicePhotoMap[slug] ?? (category ? categoryPhoto[category] : undefined) ?? photos.hero;

/** One distinct photo per guide, so guide cards never repeat. */
const guidePhotoMap: Record<string, Photo> = {
  "breaker-keeps-tripping": photos.repair,
  "outlet-not-working": photos.outletRepair,
  "signs-you-need-a-panel-upgrade": photos.oldFuseBox,
  "ev-charger-at-home": photos.ev,
  "gfci-vs-afci": photos.outlet,
  "generator-safety": photos.generator,
  "smoke-alarm-replacement": photos.safety,
  "burning-smell-from-outlet": photos.emergency,
};
export const guidePhoto = (slug: string, services: string[] = []): Photo => guidePhotoMap[slug] ?? servicePhoto(services[0] ?? "");
