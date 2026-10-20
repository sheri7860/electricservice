import type { CityLocal } from "./types";
import { cityLocalMore } from "./cityLocalMore";
import { cityLocalWave3 } from "./cityLocalWave3";
import { cityLocalWave4 } from "./cityLocalWave4";
import { cityLocalWave5 } from "./cityLocalWave5";
import { cityLocalWave6 } from "./cityLocalWave6";
import { cityLocalWave7 } from "./cityLocalWave7";
import { cityLocalWave8 } from "./cityLocalWave8";
import { cityLocalWave9 } from "./cityLocalWave9";
import { cityLocalWave10 } from "./cityLocalWave10";
import { cityLocalWave12 } from "./cityLocalWave12";
import { cityLocalWave16 } from "./cityLocalWave16";
import { cityLocalWave16b } from "./cityLocalWave16b";
import { cityLocalWave21 } from "./cityLocalWave21";
import { cityLocalWave21b } from "./cityLocalWave21b";
import { cityLocalWave21c } from "./cityLocalWave21c";

/**
 * Hand-written local content. A city page is generated ONLY for cities listed here,
 * and only when the city also has live LeadSmart Electrical coverage.
 * Every other covered city is listed on its state page and served via the ZIP checker.
 * Add a city by writing real local content (housing era, weather, permits) — never by swapping names.
 */
export const cityLocal: Record<string, CityLocal & { county?: string }> = {
  "NY/new-york": {
    county: "the five boroughs",
    intro: "New York City has one of the oldest building stocks in the country. Brownstones, walk-ups and prewar co-ops often still carry BX armored cable, cloth-insulated wire or 60 amp services split across several units, and many apartments were never wired for an air conditioner in every room.",
    housing: "Prewar buildings frequently have shared risers and small apartment panels. Adding a window or mini-split AC, an induction range or a dryer usually starts with checking whether the apartment feeder and the building's service can carry it, which may need the building's management to sign off.",
    issues: ["Overloaded 15 amp circuits from window AC units in summer", "Old BX cable whose armor no longer provides a reliable ground", "Co-op and condo boards that require licensed, insured contractors and approved paperwork before work starts"],
    permits: "Electrical work in New York City is filed with the Department of Buildings by a licensed master electrician. Co-op and condo buildings usually add their own alteration agreement on top.",
    areas: ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"],
  },
  "CA/los-angeles": {
    county: "Los Angeles County",
    intro: "Los Angeles mixes 1920s Spanish and craftsman homes, post-war tract houses from the 1940s and 1950s, and newer hillside construction. Many of the older homes still have small 60 or 100 amp services that were never meant for central air, an EV and an electric range at once.",
    housing: "Electrification is the biggest driver of panel work in LA: heat pumps, induction cooking, EV chargers and rooftop solar often all land on a panel that dates to the original build. Fuse panels and Zinsco equipment are still found in older neighborhoods.",
    issues: ["Panel upgrades for EV chargers, heat pumps and solar", "Older fuse and Zinsco panels in pre-1970 homes", "Earthquake-related checks for service masts and panels after seismic events"],
    permits: "In the City of Los Angeles, electrical permits are issued by LADBS. Other cities in the county, and unincorporated areas, have their own building departments.",
    areas: ["Downtown", "Silver Lake", "Westchester", "Van Nuys", "Highland Park", "San Pedro"],
  },
  "IL/chicago": {
    county: "Cook County",
    intro: "Chicago's bungalows, two-flats and greystones were mostly built before 1950, and the city has its own electrical code that differs from the rest of Illinois. Most new wiring in Chicago must run in metal conduit rather than plastic-sheathed cable.",
    housing: "Older two-flats commonly have two small services in the basement, sometimes still on fuses. Basement finishes, garage EV chargers and central air additions are frequent reasons to upgrade a service or add circuits.",
    issues: ["Conduit requirements that make DIY-style cable runs non-compliant", "Fuse boxes and 60 amp services in two-flats", "Basement flooding that reaches outlets, panels or sump-pump circuits"],
    permits: "Electrical permits in Chicago are issued by the Department of Buildings and the work must be done by a licensed electrical contractor registered with the city.",
    areas: ["Lincoln Park", "Logan Square", "Bridgeport", "Rogers Park", "Beverly", "Portage Park"],
  },
  "TX/houston": {
    county: "Harris County",
    intro: "Houston's heat, humidity and storms shape most electrical calls. Homes from the 1960s and 1970s in older suburbs sit alongside large newer subdivisions, and almost every house runs air conditioning for most of the year.",
    housing: "After hurricanes and the 2021 winter storm, standby generators and portable-generator inlets with interlocks became some of the most requested projects in the area. Flooding is the other big factor: any outlet, panel or wiring that has been under water must be inspected before it is used again.",
    issues: ["Generator and transfer switch installations for hurricane and freeze outages", "Post-flood electrical inspections and rewiring", "Surge damage from frequent Gulf Coast lightning"],
    permits: "Inside city limits, electrical permits come from the City of Houston's permitting center; unincorporated Harris County and suburban cities have their own rules. Texas electricians are licensed by TDLR.",
    areas: ["The Heights", "Montrose", "Meyerland", "Spring Branch", "Clear Lake", "Westchase"],
  },
  "TX/dallas": {
    county: "Dallas County",
    intro: "Dallas has a large stock of 1950s and 1960s ranch homes in neighborhoods like Lake Highlands and Preston Hollow, plus newer construction throughout the metro. Long, hot summers and spring hail storms drive most electrical work.",
    housing: "Older ranch homes often have 100 amp services and limited breaker space, which becomes a problem when owners add an EV charger, a pool or a larger AC system. Some homes from the late 1960s and early 1970s have aluminum branch wiring.",
    issues: ["Panel upgrades for pools, EVs and larger AC systems", "Aluminum branch wiring in some late-1960s homes", "Hail and lightning damage to meter bases, service masts and electronics"],
    permits: "Electrical permits in Dallas come from the city's Development Services department; suburbs such as Plano, Garland and Irving issue their own. Texas electricians are licensed by TDLR.",
    areas: ["Lake Highlands", "Oak Cliff", "Lakewood", "Preston Hollow", "Bishop Arts", "Uptown"],
  },
  "AZ/phoenix": {
    county: "Maricopa County",
    intro: "Phoenix summers push air conditioning to its limit for months at a time, and that constant load finds every weak connection. Many homes are slab-on-grade ranch houses from the 1960s through the 1980s, often with original panels.",
    housing: "Rooftop solar is common, and adding solar, a battery or an EV charger to an older panel frequently needs a panel upgrade or a main-panel derate. Monsoon storms bring lightning strikes and short, intense outages.",
    issues: ["AC circuits and disconnects stressed by extreme heat", "Solar, battery and EV additions on original panels", "Monsoon lightning surges and storm outages"],
    permits: "The City of Phoenix issues electrical permits through its Planning and Development Department; Scottsdale, Mesa, Tempe and other cities run their own.",
    areas: ["Arcadia", "Ahwatukee", "Maryvale", "North Central", "Laveen", "Deer Valley"],
  },
  "PA/philadelphia": {
    county: "Philadelphia County",
    intro: "Philadelphia's rowhomes and twins were mostly built before 1940, and many still have knob-and-tube in the walls, small services and only a couple of outlets per room. Renovations almost always uncover wiring that needs replacing.",
    housing: "Rowhome panels are often in the basement near the front wall, and service upgrades need coordination with PECO. Adding central air, a kitchen remodel or a basement finish usually triggers a service upgrade.",
    issues: ["Knob-and-tube and cloth wiring found during renovations", "Small services that cannot support central air or a modern kitchen", "Basement moisture around panels and outlets"],
    permits: "Electrical permits in Philadelphia are issued by the Department of Licenses and Inspections (L&I) to licensed electrical contractors.",
    areas: ["Fishtown", "South Philly", "Germantown", "Fairmount", "Mayfair", "Roxborough"],
  },
  "GA/atlanta": {
    county: "Fulton and DeKalb counties",
    intro: "Atlanta's housing ranges from 1920s bungalows in Kirkwood and Virginia-Highland to mid-century ranches and new construction across the metro. Heavy summer thunderstorms, mature trees over power lines and long cooling seasons shape most electrical work.",
    housing: "Older in-town bungalows often have mixed wiring from several renovations. Fast suburban growth brings a steady stream of EV chargers, basement finishes and panel upgrades.",
    issues: ["Tree-related outages and damaged service drops after storms", "Mixed-era wiring in renovated in-town homes", "Surge damage from frequent summer lightning"],
    permits: "Inside city limits, electrical permits come from the City of Atlanta's Office of Buildings; surrounding cities and counties issue their own.",
    areas: ["Kirkwood", "Virginia-Highland", "West End", "Buckhead", "East Atlanta", "Grant Park"],
  },
  "CO/denver": {
    county: "Denver County",
    intro: "Denver's older neighborhoods are full of brick bungalows and Denver squares from the early 1900s, while much of the metro is post-war and newer suburbs. Hail, lightning and fast-changing weather affect electrical service, and Colorado has one of the faster-growing EV markets in the country.",
    housing: "Heat pumps and EV chargers are pushing many older homes past their original 100 amp service. Basement finishes, which are common in Denver, also add circuits that need AFCI and GFCI protection.",
    issues: ["Panel upgrades for EV chargers and heat pumps", "Basement finish circuits and protection", "Hail damage to service masts, meters and outdoor equipment"],
    permits: "Electrical permits in Denver are issued by Community Planning and Development; surrounding cities have their own building departments.",
    areas: ["Washington Park", "Highlands", "Park Hill", "Baker", "Stapleton/Central Park", "Harvey Park"],
  },
  "WA/seattle": {
    county: "King County",
    intro: "Seattle's craftsman homes and early-1900s houses often have knob-and-tube wiring, and the city is pushing hard toward electrification. Winter windstorms knock trees into lines and cause outages several times a season.",
    housing: "Converting from oil or gas heat to a heat pump, adding an induction range and an EV charger is a common path, and it usually starts with a panel and service upgrade. Older homes also need knob-and-tube replacement before insulation is added.",
    issues: ["Knob-and-tube replacement before insulating", "Panel upgrades for heat pumps and electrification", "Windstorm outages and generator inlet installations"],
    permits: "Seattle issues its own electrical permits through the Seattle Department of Construction and Inspections (SDCI); most of the rest of Washington is permitted by the state Department of Labor and Industries.",
    areas: ["Ballard", "Capitol Hill", "West Seattle", "Queen Anne", "Wallingford", "Rainier Valley"],
  },
  "MA/boston": {
    county: "Suffolk County",
    intro: "Boston's triple-deckers, brownstones and Victorians are among the oldest homes in the country. Many have knob-and-tube or early cloth wiring, separate small services for each unit and panels tucked into tight basements.",
    housing: "Massachusetts heat-pump incentives are driving a wave of electrification, and most older homes need a service upgrade before a cold-climate heat pump can be installed. Nor'easters and ice also bring outages.",
    issues: ["Knob-and-tube in triple-deckers and Victorians", "Service upgrades for heat pumps", "Multi-unit services and meter banks in older buildings"],
    permits: "In Boston, electrical permits are issued by the Inspectional Services Department, and work must be done by a Massachusetts-licensed electrician.",
    areas: ["Dorchester", "Jamaica Plain", "South Boston", "Roslindale", "Charlestown", "West Roxbury"],
  },
  "NC/charlotte": {
    county: "Mecklenburg County",
    intro: "Charlotte is growing fast, with new subdivisions across the metro alongside 1950s and 1960s ranch homes in neighborhoods like Plaza Midwood and Myers Park. Summer storms and hurricane remnants bring outages and surge damage.",
    housing: "Older ranch homes often have 100 or 150 amp panels, sometimes Federal Pacific equipment. New homeowners frequently add EV chargers and generator inlets.",
    issues: ["Federal Pacific and older panels in mid-century homes", "Storm outages and generator inlets", "EV charger installations in new subdivisions"],
    permits: "Electrical permits in Charlotte and the rest of Mecklenburg County are issued by Mecklenburg County Code Enforcement.",
    areas: ["Plaza Midwood", "Myers Park", "South End", "Ballantyne", "NoDa", "Dilworth"],
  },
  "TN/nashville": {
    county: "Davidson County",
    intro: "Nashville's growth has brought a wave of infill construction next to older bungalows and mid-century ranches in East Nashville, Sylvan Park and Inglewood. Spring storms, tornadoes and summer heat drive much of the repair work.",
    housing: "Older homes often have limited outlets and older panels, and renovations frequently uncover outdated wiring. New construction drives EV and smart-home requests.",
    issues: ["Tornado and storm damage to service masts and meters", "Older wiring found in bungalow renovations", "Surge damage from frequent thunderstorms"],
    permits: "Electrical permits in Nashville and Davidson County come from Metro Codes, which also licenses electricians to work in the county; a state-issued limited electrician license is not accepted there.",
    areas: ["East Nashville", "Sylvan Park", "Inglewood", "Germantown", "The Nations", "Antioch"],
  },
  "FL/miami": {
    county: "Miami-Dade County",
    intro: "Miami's heat, salt air and hurricane season are hard on electrical equipment. Outdoor panels, meters and disconnects corrode, and 1950s–1970s homes and condos often carry original wiring and panels.",
    housing: "Generators, surge protection and post-storm inspections are routine, and many condo associations require licensed contractors with permits for any electrical work in units.",
    issues: ["Corroded outdoor panels, meters and AC disconnects", "Generator installations for hurricane season", "Lightning and surge damage"],
    permits: "Permits come from the City of Miami or, in unincorporated areas, Miami-Dade County; other cities in the county have their own building departments.",
    areas: ["Little Havana", "Coconut Grove", "Little River", "Allapattah", "Brickell", "Coral Way"],
  },
  "OR/portland": {
    county: "Multnomah County",
    intro: "Portland has a large stock of early-1900s homes, many with knob-and-tube wiring. Winter ice storms and summer heat waves have both caused major outages in recent years.",
    housing: "Heat-pump conversions and EV chargers often need service upgrades, and insulation projects require knob-and-tube to be assessed first.",
    issues: ["Knob-and-tube in early-1900s homes", "Ice storm outages and generator hookups", "Panel upgrades for heat pumps and EVs"],
    permits: "Electrical permits in Portland are issued by the city's permitting office; Oregon requires licensed electrical contractors.",
    areas: ["Sellwood", "St. Johns", "Hawthorne", "Alberta", "Montavilla", "Laurelhurst"],
  },
  "NV/las-vegas": {
    county: "Clark County",
    intro: "Las Vegas summers regularly go well past 110 degrees, and air conditioning carries the house for months. Homes are mostly post-1980 tract construction, with older neighborhoods closer to downtown.",
    housing: "AC circuits, disconnects and panels work hard in the heat. Solar and EV additions often need a panel upgrade.",
    issues: ["Heat stress on AC circuits and disconnects", "Solar and EV additions on builder-grade panels", "Monsoon lightning and outages"],
    permits: "Permits come from the City of Las Vegas or Clark County depending on the address; Henderson and North Las Vegas issue their own.",
    areas: ["Summerlin", "Spring Valley", "Paradise", "Downtown", "Centennial Hills", "Enterprise"],
  },
  "MN/minneapolis": {
    county: "Hennepin County",
    intro: "Minneapolis winters make reliable heating circuits essential, and many homes in neighborhoods like Longfellow and Powderhorn were built before 1930 with original wiring.",
    housing: "Older homes often have small services, few outlets and knob-and-tube. Basement finishes and heat pumps are frequent reasons to upgrade.",
    issues: ["Knob-and-tube in pre-1930 homes", "Heating circuits that cannot fail in winter", "Service upgrades for heat pumps and EVs"],
    permits: "Electrical permits and inspections in Minneapolis are handled by the Minnesota Department of Labor and Industry (DLI), which also licenses electricians; building permits for the same project still come from the city.",
    areas: ["Longfellow", "Powderhorn", "Northeast", "Linden Hills", "Nokomis", "North Loop"],
  },
};

Object.assign(cityLocal, cityLocalMore);
Object.assign(cityLocal, cityLocalWave3);
Object.assign(cityLocal, cityLocalWave4);
Object.assign(cityLocal, cityLocalWave5);
Object.assign(cityLocal, cityLocalWave6);
Object.assign(cityLocal, cityLocalWave7);
Object.assign(cityLocal, cityLocalWave8);
Object.assign(cityLocal, cityLocalWave9);
Object.assign(cityLocal, cityLocalWave10);
Object.assign(cityLocal, cityLocalWave12);
Object.assign(cityLocal, cityLocalWave16, cityLocalWave16b);
Object.assign(cityLocal, cityLocalWave21, cityLocalWave21b, cityLocalWave21c);
