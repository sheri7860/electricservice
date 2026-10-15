import type { Faq } from "./types";

/**
 * Additional page-specific questions and key terms for each service page.
 * Merged after the service's own FAQs. Every answer is specific to its service;
 * do not copy answers between services. Code references are to the National
 * Electrical Code (NEC) and NFPA guidance; local adoption varies.
 */
export type ServiceExtra = { faqs: Faq[]; terms: { term: string; def: string }[] };

export const serviceExtras: Record<string, ServiceExtra> = {
  "emergency-electrician": {
    faqs: [
      { q: "What counts as an electrical emergency?", a: "A burning or hot-plastic smell, smoke or sparks from an outlet or panel, a buzzing or crackling panel, a warm wall plate, water touching wiring, a downed service drop, or loss of power to part of the home with no tripped breaker. If there is smoke or flame, leave and call 911 first." },
      { q: "What should I do while I wait for the electrician?", a: "If it is safe to reach the panel with dry hands while standing on a dry surface, switch off the affected circuit or the main breaker. Unplug nearby devices, keep people and pets away, and do not open the panel cover or touch damaged wiring." },
      { q: "Can an emergency electrician come at night or on a weekend?", a: "Availability depends on the independent electricians who cover your ZIP code. Call and describe the problem; if no one can come right away, make the area safe by shutting off the circuit and keeping people clear until they can." },
      { q: "Can a tripped breaker be an emergency?", a: "A breaker that trips once after a heavy load usually is not. A breaker that trips again immediately after reset, feels hot, or trips with a burning smell can signal a short or a failing connection and should be checked promptly." },
      { q: "Is a flickering light an emergency?", a: "Flicker in one fixture is usually a bulb or switch issue. Flicker across several rooms, especially when large appliances start, can point to a loose neutral or service connection, which can damage electronics and should be checked the same day." },
      { q: "What information helps an emergency electrician most?", a: "What you saw, smelled or heard, which rooms or circuits are affected, whether a breaker tripped, the approximate age of the home, and whether there has been recent storm, water or renovation work." },
    ],
    terms: [
      { term: "Short circuit", def: "An unintended low-resistance path between conductors that causes a sudden surge of current and usually trips the breaker." },
      { term: "Arcing", def: "Electricity jumping across a gap in a loose or damaged connection; it produces heat and is a common cause of electrical fires." },
      { term: "Service drop", def: "The overhead wires running from the utility pole to the house, usually owned by the utility." },
    ],
  },
  "electrical-repair": {
    faqs: [
      { q: "How does an electrician find an electrical problem?", a: "By narrowing it down: checking which circuits are affected, testing voltage at outlets and switches, inspecting connections at the panel, and tracing the circuit to the failed device or loose splice." },
      { q: "Why does my breaker keep tripping?", a: "The usual causes are too much load on one circuit, a short in a device or cord, a ground fault in a GFCI-protected area, or a failing breaker. Repeated tripping is a protection device doing its job and should be traced, not bypassed." },
      { q: "Why does half of an outlet or a room have no power?", a: "Often a tripped GFCI elsewhere on the circuit, a loose backstabbed connection in an upstream outlet, or a half-switched outlet controlled by a wall switch." },
      { q: "How long does a typical electrical repair take?", a: "Simple device replacements often take less than an hour. Tracing an intermittent fault can take longer because the electrician may need to test several points along the circuit." },
      { q: "Do electrical repairs need a permit?", a: "Like-for-like replacement of a switch or outlet often does not, but new circuits, panel work and wiring changes usually do. Rules are set by your city or county, and the electrician should know them." },
      { q: "Is it safe to keep using a circuit that works only some of the time?", a: "Intermittent power usually means a loose connection, which can heat up and arc. Stop using the circuit and have it checked." },
      { q: "What should I ask before hiring an electrician for a repair?", a: "Whether they are licensed for your state or city, whether a permit will be needed, how they charge for diagnosis, and whether the quote includes parts and any return visit." },
    ],
    terms: [
      { term: "Backstab connection", def: "A push-in wire connection on the back of an outlet or switch; it is more prone to loosening than a screw terminal." },
      { term: "Open neutral", def: "A broken neutral connection that can make lights flicker or brighten and can damage electronics." },
      { term: "Voltage drop", def: "A loss of voltage along a long or undersized circuit, often noticed as dimming lights." },
    ],
  },
  "outlet-switch-repair": {
    faqs: [
      { q: "Why is my outlet warm?", a: "A warm outlet usually means a loose connection or a device drawing more current than the outlet or circuit is rated for. Unplug what is connected, stop using it, and have it checked." },
      { q: "Can an outlet be added where there isn't one?", a: "Usually. An electrician can extend a nearby circuit or run a new one, install a new box, and add GFCI or AFCI protection where the location requires it. Adding outlets often needs a permit." },
      { q: "Why do plugs fall out of my outlets?", a: "The spring contacts inside the outlet wear out over time. A worn outlet can make poor contact and heat up, so it should be replaced." },
      { q: "What is a tamper-resistant outlet?", a: "An outlet with internal shutters that open only when both prongs are inserted at the same time. The NEC requires them in most locations in new and renovated homes to protect children." },
      { q: "Can I add USB outlets or smart switches?", a: "Yes, as long as the box has room and, for many smart switches, a neutral wire. An electrician can check whether your existing boxes support them." },
      { q: "How long does it take to replace an outlet or switch?", a: "A straightforward swap usually takes well under an hour per device. Old or damaged wiring in the box can add time." },
      { q: "Why does my light switch spark when I flip it?", a: "A tiny blue flash can be normal. A large spark, a popping sound, heat or a burning smell points to a failing switch or a loose connection and needs attention." },
    ],
    terms: [
      { term: "Tamper-resistant (TR) outlet", def: "An outlet with built-in shutters that block objects from being inserted into one slot." },
      { term: "Neutral wire", def: "The conductor that carries current back to the panel; many smart switches need one in the switch box." },
      { term: "Duplex receptacle", def: "The standard two-outlet wall receptacle found in most US homes." },
    ],
  },
  "panel-upgrade": {
    faqs: [
      { q: "How do I know if my panel is too small?", a: "Signs include no open breaker spaces, frequent tripping of the main breaker, double-tapped breakers, a 60 or 100 amp service in a home adding central air, an EV charger or a heat pump, and an electrician's load calculation showing the service is near capacity." },
      { q: "What is the difference between a panel replacement and a service upgrade?", a: "A panel replacement swaps the breaker box at the same amperage. A service upgrade increases the amperage, which usually means a new meter base and service entrance cable and coordination with the utility." },
      { q: "How long does a panel upgrade take?", a: "The on-site work is often completed in a day. Permits, inspections and scheduling the utility disconnect and reconnect can add days or weeks before and after." },
      { q: "Will my power be off during a panel upgrade?", a: "Yes, for much of the work day. The utility usually disconnects power so the electrician can work safely, then reconnects after the work is ready or has passed inspection." },
      { q: "Is 200 amps enough for my house?", a: "For most single-family homes, 200 amps is enough even with an EV charger and a heat pump. The right size depends on a load calculation, which also considers electric heat, cooking, a pool and future plans." },
      { q: "Are some panel brands considered unsafe?", a: "Electricians commonly recommend replacing Federal Pacific panels with Stab-Lok breakers and many Zinsco panels because of reports of breakers that fail to trip. Insurers may ask about them too." },
      { q: "Is there an alternative to a full service upgrade?", a: "Sometimes. A load-management device or smart panel can share capacity between large loads, such as an EV charger and a dryer, without increasing the service size." },
    ],
    terms: [
      { term: "Load calculation", def: "A calculation, following NEC Article 220, of the electrical demand of a home, used to size the service." },
      { term: "Service entrance", def: "The conductors and equipment that bring power from the utility into the main panel." },
      { term: "Double tap", def: "Two wires connected under a breaker terminal designed for one; a common sign of an overcrowded panel." },
    ],
  },
  "home-rewiring": {
    faqs: [
      { q: "How do I know if my house needs rewiring?", a: "Common reasons are knob-and-tube or cloth-insulated wiring still in use, ungrounded two-prong outlets throughout, aluminum branch wiring, frequent tripping, and wiring damaged by rodents, water or past amateur work." },
      { q: "Is knob-and-tube wiring dangerous?", a: "It was installed without a ground, its insulation becomes brittle with age, and it was designed to release heat into open air, so covering it with insulation is a concern. Many insurers ask about it." },
      { q: "Can a house be rewired without removing all the drywall or plaster?", a: "Usually. Electricians fish new cable through walls from the attic and basement and open small access holes where needed, which are then patched." },
      { q: "How long does a whole-house rewire take?", a: "It varies with the size of the home and access, from several days for a smaller home with good attic and basement access to a few weeks for larger or plaster-walled homes." },
      { q: "Can I live in the house during rewiring?", a: "Often yes, if the work is phased so some circuits stay on each night. Full gut renovations are easier to rewire when the home is empty." },
      { q: "What is the fix for aluminum branch wiring?", a: "A full rewire or, commonly, remediation by connecting copper pigtails at every outlet, switch and splice with connectors listed for aluminum-to-copper connections." },
      { q: "Does rewiring require a permit?", a: "Yes, almost always, with inspections before walls are closed and at the end. The permit record is useful when you sell the home." },
    ],
    terms: [
      { term: "Knob-and-tube", def: "Early wiring (roughly 1880s to 1940s) run on ceramic knobs and through ceramic tubes, with no ground conductor." },
      { term: "Fishing wire", def: "Pulling new cable through closed walls and ceilings without opening them fully." },
      { term: "Pigtail", def: "A short length of wire spliced to a circuit conductor to connect a device; used in aluminum wiring remediation." },
    ],
  },
  "dedicated-circuits": {
    faqs: [
      { q: "What is a dedicated circuit?", a: "A circuit that serves a single appliance or outlet, with its own breaker, so that appliance does not share capacity with anything else." },
      { q: "Which appliances need a dedicated circuit?", a: "Typically electric ranges, ovens, dryers, water heaters, central air and heat pumps, EV chargers, and often refrigerators, dishwashers, microwaves, disposals, sump pumps, hot tubs and window or mini-split air conditioners. The manufacturer's instructions set the requirement." },
      { q: "What is the difference between a 120-volt and a 240-volt circuit?", a: "Most outlets are 120 volts. Large heating and motor loads such as dryers, ranges, EV chargers and many air conditioners use 240-volt circuits with a double-pole breaker." },
      { q: "How is the wire size chosen?", a: "By the circuit's breaker rating and the length of the run: for example, 12-gauge copper for a 20 amp circuit and 10-gauge for 30 amps, with larger wire for long runs to limit voltage drop." },
      { q: "Can my panel handle another circuit?", a: "It needs an open space, or room for a tandem breaker where the panel allows it, and enough service capacity. An electrician checks both before adding a circuit." },
      { q: "How long does it take to add a dedicated circuit?", a: "Often a few hours when the panel is close and access is easy. Long runs, finished ceilings or exterior trenching take longer." },
      { q: "Do I need a dedicated circuit for a space heater or window AC?", a: "It is strongly recommended. A 1,500-watt space heater uses most of a 15 amp circuit on its own, which is why sharing causes tripping." },
    ],
    terms: [
      { term: "Double-pole breaker", def: "A breaker that occupies two spaces and supplies 240 volts." },
      { term: "Ampacity", def: "The current a conductor can carry continuously without exceeding its temperature rating." },
      { term: "Tandem breaker", def: "A breaker that fits two circuits into one panel space, allowed only in panels listed for it." },
    ],
  },
  "ev-charger-installation": {
    faqs: [
      { q: "What is the difference between Level 1 and Level 2 charging?", a: "Level 1 uses a standard 120-volt outlet and adds only a few miles of range per hour. Level 2 uses a 240-volt circuit and can typically recharge most EVs overnight." },
      { q: "What size circuit does an EV charger need?", a: "EV charging is a continuous load, so the NEC sizes the circuit at 125% of the charger's output: a 40 amp charger needs a 50 amp circuit, and a 48 amp charger needs a 60 amp circuit." },
      { q: "Hardwired charger or plug-in?", a: "A plug-in charger uses a NEMA 14-50 outlet and can be unplugged and moved. A hardwired charger can often deliver more power and avoids outlet wear. The NEC requires GFCI protection for many EV outlets, which affects plug-in setups." },
      { q: "Can an EV charger be installed outdoors?", a: "Yes, with a charger and outlet rated for outdoor use, weatherproof covers and wiring suited to wet locations. Placement should keep the cable off walkways and the unit away from sprinkler spray where possible." },
      { q: "How long does an EV charger installation take?", a: "Often a few hours to a day when the panel is near the garage. Long runs, detached garages and panel upgrades take longer." },
      { q: "Does an EV charger need a permit?", a: "In most places, yes, because it adds a new 240-volt circuit. The electrician normally pulls it." },
      { q: "Are there rebates for home EV chargers?", a: "Many utilities and some states offer rebates or EV rate plans, and the terms change often. Check your utility's current programs before you buy the charger." },
    ],
    terms: [
      { term: "EVSE", def: "Electric vehicle supply equipment: the wall-mounted charger and cable." },
      { term: "NEMA 14-50", def: "A 50 amp, 240-volt outlet commonly used for plug-in EV chargers." },
      { term: "125% rule", def: "The NEC requirement to size circuits for continuous loads, such as EV charging, at 125% of the load." },
    ],
  },
  "lighting-installation": {
    faqs: [
      { q: "Can recessed lights be installed in an existing ceiling?", a: "Yes. Remodel or canless LED fixtures are installed through holes cut in the finished ceiling, with wiring fished from an attic or between joists." },
      { q: "What is an IC-rated light?", a: "A fixture rated for direct contact with insulation. Recessed lights in insulated ceilings must be IC-rated to avoid overheating." },
      { q: "Why do my LED lights flicker on a dimmer?", a: "Many older dimmers were designed for incandescent bulbs. LED bulbs need a compatible dimmer and dimmable bulbs; mixing them causes flicker or buzzing." },
      { q: "Can a heavy chandelier hang from any ceiling box?", a: "No. Heavier fixtures need a box rated for the weight, and fixtures over 50 pounds must be independently supported." },
      { q: "How many recessed lights does a room need?", a: "It depends on ceiling height, beam angle and the room's use; a lighting plan usually spaces fixtures so their light overlaps evenly rather than following a fixed count." },
      { q: "Do outdoor lights need special fixtures?", a: "Yes. Outdoor fixtures must be rated for damp or wet locations, and outdoor outlets need GFCI protection and weatherproof covers." },
      { q: "Do I need a permit to add lighting?", a: "Replacing a fixture on an existing box often does not. Adding new circuits or new recessed lighting usually does." },
    ],
    terms: [
      { term: "IC-rated", def: "Insulation-contact rated: safe to install in contact with ceiling insulation." },
      { term: "Canless LED", def: "A thin recessed fixture with an integrated driver that needs no separate housing above the ceiling." },
      { term: "Color temperature", def: "The warmth or coolness of light, measured in kelvins; around 2700K to 3000K is typical for living spaces." },
    ],
  },
  "ceiling-fan-installation": {
    faqs: [
      { q: "Can a ceiling fan go where a light fixture is now?", a: "Often, but the existing box must be rated for fan support. Standard light boxes are not designed for the weight and movement of a fan and must be replaced with a fan-rated box or brace." },
      { q: "Can I control the fan and light separately?", a: "Yes, with a second wire run from the switch or with a remote or smart control. An electrician can tell you what your existing wiring allows." },
      { q: "How high should a ceiling fan be?", a: "Blades should be at least 7 feet above the floor. Downrods help on high ceilings, and low-profile fans suit ceilings under about 8 feet." },
      { q: "Why does my ceiling fan wobble?", a: "Usually unbalanced blades, loose blade screws or a loose mounting bracket. A wobble from a box that is not fan-rated is a safety issue." },
      { q: "Can a fan be installed on a sloped ceiling?", a: "Yes, with a fan and mount rated for the slope angle, and usually a longer downrod so the blades clear the ceiling." },
      { q: "Do outdoor patios need a special fan?", a: "Yes. Covered porches need a damp-rated fan, and areas exposed to rain need a wet-rated fan." },
      { q: "How long does a ceiling fan installation take?", a: "Replacing a fixture with a fan on a fan-rated box is often done in an hour or two. Adding a box, brace or new switch wiring takes longer." },
    ],
    terms: [
      { term: "Fan-rated box", def: "An electrical box listed to support the weight and motion of a ceiling fan." },
      { term: "Downrod", def: "The pipe between the ceiling mount and the fan motor; longer downrods lower the fan on tall ceilings." },
      { term: "Damp-rated", def: "Listed for covered outdoor areas exposed to moisture but not direct rain." },
    ],
  },
  "generator-installation": {
    faqs: [
      { q: "What is the difference between a portable and a standby generator?", a: "A portable generator is wheeled out and connected when needed. A standby generator is permanently installed, runs on natural gas or propane, and starts automatically through a transfer switch." },
      { q: "Can I plug a generator into a wall outlet?", a: "No. Backfeeding through an outlet can energize utility lines and injure line workers, and it can damage equipment. Use a transfer switch or an interlock with an inlet." },
      { q: "What is an interlock kit?", a: "A mechanical device on the main panel that makes it impossible to turn on the generator breaker while the main breaker is on, allowing a portable generator to safely power chosen circuits." },
      { q: "What size generator do I need?", a: "It depends on what you want to run: a few essentials such as a furnace, refrigerator and lights, or the whole house. An electrician sizes it from the loads and the starting current of motors such as air conditioners." },
      { q: "Where can a generator be placed?", a: "Outdoors, at clearances from windows, doors and vents set by the manufacturer and local code, because exhaust contains carbon monoxide. Never run a generator in a garage or basement." },
      { q: "Does a standby generator need a permit?", a: "Yes, usually electrical and often gas permits, plus any HOA approvals. The electrician and the gas installer coordinate inspections." },
      { q: "How long does a standby generator installation take?", a: "The installation itself is often a day or two once the pad, gas line and permits are ready; ordering and permits can take longer." },
    ],
    terms: [
      { term: "Automatic transfer switch (ATS)", def: "A switch that detects an outage, starts the generator and moves the home's load to it." },
      { term: "Backfeeding", def: "Sending generator power back through the home's wiring to the utility lines; dangerous and illegal." },
      { term: "Power inlet box", def: "An exterior connection where a portable generator's cord plugs in safely." },
    ],
  },
  "surge-protection": {
    faqs: [
      { q: "What is a whole-home surge protector?", a: "A surge protective device (SPD) installed at the main panel or meter that limits voltage spikes entering through the utility service before they reach the home's circuits." },
      { q: "Is a whole-home surge protector required?", a: "The 2020 and later editions of the NEC require surge protection for new and replaced dwelling services. Whether it applies to your home depends on the code edition your area has adopted and the work being done." },
      { q: "Do I still need plug-in surge protectors?", a: "Yes, for sensitive electronics. Whole-home protection handles large external surges; point-of-use protectors handle smaller surges generated inside the home." },
      { q: "Will a surge protector stop a lightning strike?", a: "No device guarantees protection from a direct strike. Surge protection limits damage from the far more common surges carried in on utility and communication lines." },
      { q: "Where do surges come from?", a: "Lightning, utility switching, downed lines, and large motors in the home such as air conditioners and pumps cycling on and off." },
      { q: "How long do surge protectors last?", a: "They wear with each surge they absorb. Many have an indicator light that shows when protection is no longer active, and they should be checked after major storms." },
      { q: "Does surge protection depend on grounding?", a: "Yes. A surge protector diverts energy to ground, so a sound grounding and bonding system is essential for it to work." },
    ],
    terms: [
      { term: "SPD", def: "Surge protective device; Type 1 installs at the meter, Type 2 at the panel, Type 3 at the point of use." },
      { term: "Clamping voltage", def: "The voltage at which a surge protector begins diverting excess energy; lower is more protective." },
      { term: "Bonding", def: "Connecting metal systems such as water and gas piping to the grounding system so they stay at the same potential." },
    ],
  },
  "gfci-afci-protection": {
    faqs: [
      { q: "What is the difference between GFCI and AFCI?", a: "A GFCI protects people from shock by detecting current leaking to ground. An AFCI protects against fire by detecting dangerous arcing in wiring. Dual-function devices provide both." },
      { q: "Where is GFCI protection required?", a: "Under the NEC, in bathrooms, kitchens (countertop and other locations), garages, outdoors, crawl spaces, unfinished basements, laundry areas, and near sinks, tubs and showers, among others. Requirements have expanded with each code edition." },
      { q: "Where is AFCI protection required?", a: "In new construction, most living areas of a home, including bedrooms, living rooms, kitchens and laundry areas. When existing circuits are extended or modified, AFCI protection is often required for those circuits." },
      { q: "Do GFCI outlets wear out?", a: "Yes. GFCIs can fail over time, and newer models are designed to stop supplying power when their protection fails. Test them monthly and replace any that will not trip or reset." },
      { q: "How often should I test GFCI outlets?", a: "Manufacturers recommend testing monthly with the test and reset buttons. A GFCI that will not trip or reset should be replaced." },
      { q: "Can GFCI protect an ungrounded outlet?", a: "Yes. The NEC allows a GFCI to protect two-prong or ungrounded three-prong outlets, labeled \"No equipment ground\", as a safety upgrade." },
      { q: "Breaker or outlet: which is better?", a: "Both provide the same protection. A GFCI or AFCI breaker protects the whole circuit from the panel; a GFCI outlet is easier to reset where you are and can protect outlets downstream." },
    ],
    terms: [
      { term: "GFCI", def: "Ground-fault circuit interrupter: cuts power when current leaks to ground, protecting people from shock." },
      { term: "AFCI", def: "Arc-fault circuit interrupter: cuts power when it detects arcing that can start a fire." },
      { term: "Ground fault", def: "Current flowing along an unintended path to ground, such as through water or a person." },
    ],
  },
  "smoke-detector-installation": {
    faqs: [
      { q: "Where should smoke alarms be installed?", a: "NFPA guidance calls for smoke alarms inside every bedroom, outside each sleeping area, and on every level of the home, including the basement. Local codes adopt these rules with some variation." },
      { q: "How often should smoke alarms be replaced?", a: "Every 10 years, according to NFPA. The manufacture date is printed on the back of the alarm." },
      { q: "What are interconnected smoke alarms?", a: "Alarms linked by wire or wireless signal so that when one sounds, they all sound. New homes are required to have them, and they help people hear an alarm anywhere in the house." },
      { q: "Why is my smoke alarm chirping?", a: "Usually a low battery, or an alarm reaching its end of life. Hardwired alarms have backup batteries that also need replacing." },
      { q: "Do I need carbon monoxide alarms?", a: "If the home has fuel-burning appliances, a fireplace or an attached garage, CO alarms are recommended outside sleeping areas and on each level, and many states require them." },
      { q: "Can hardwired smoke alarms be replaced with any brand?", a: "Not always. Interconnected alarms usually need to be the same brand and compatible model, and different brands use different wiring plugs." },
      { q: "Ionization or photoelectric: which is better?", a: "Ionization alarms respond faster to flaming fires and photoelectric alarms to smoldering fires. Many safety organizations recommend having both or using dual-sensor alarms." },
    ],
    terms: [
      { term: "Interconnected alarms", def: "Smoke alarms linked so that all sound when any one detects smoke." },
      { term: "Photoelectric sensor", def: "Detects smoke by light scattering; responds well to smoldering fires." },
      { term: "Hardwired alarm", def: "An alarm powered by the home's wiring, with a battery backup." },
    ],
  },
  "electrical-inspection": {
    faqs: [
      { q: "What does an electrical inspection include?", a: "Typically the panel and breakers, grounding and bonding, a sample of outlets and switches tested for polarity and ground, GFCI and AFCI protection, visible wiring in the attic and basement, and smoke and CO alarms." },
      { q: "How is an electrician's inspection different from a home inspection?", a: "A home inspector notes visible concerns across the whole house. A licensed electrician opens the panel, tests circuits and can explain what fixing each issue involves." },
      { q: "When should I get an electrical inspection?", a: "Before buying an older home, after a flood, fire or major storm, before adding major loads such as an EV charger or heat pump, when an insurer asks, and when a home is 40 or more years old and has never been checked." },
      { q: "How long does an electrical inspection take?", a: "Often one to a few hours for a single-family home, depending on its size and how many panels and circuits it has." },
      { q: "Is a permit inspection the same thing?", a: "No. A permit inspection is done by the building department to approve specific permitted work. A safety inspection is an evaluation you request from an electrician." },
      { q: "Will I get a written report?", a: "Ask for one before booking. A written report with photos is useful for negotiations, insurance and planning repairs." },
      { q: "What are the most common findings?", a: "Double-tapped breakers, missing GFCI protection, ungrounded outlets, open junction boxes, amateur splices, outdated panels and smoke alarms past their 10-year life." },
    ],
    terms: [
      { term: "Polarity", def: "Whether the hot and neutral wires are connected to the correct terminals; reversed polarity is a shock hazard." },
      { term: "Grounding electrode", def: "A rod or other conductor connecting the electrical system to the earth." },
      { term: "Open junction box", def: "A wiring box without a cover, leaving splices exposed." },
    ],
  },
};
