import coverage from "@/data/coverage.json";
import type { CoverageCity, Region, StateInfo } from "./types";

export const regions: Region[] = [
  { slug: "northeast", name: "Northeast", climate: "cold winters, nor'easters and ice storms", housing: "a large share of pre-1950 homes, many with knob-and-tube or cloth-insulated wiring and small services", issues: ["Knob-and-tube and ungrounded wiring in older homes", "Ice-storm outages and generator hookups", "Undersized 60–100 amp services in multi-family conversions"] },
  { slug: "mid-atlantic", name: "Mid-Atlantic", climate: "humid summers, coastal storms and occasional ice", housing: "rowhomes and older suburbs with mixed wiring eras", issues: ["Aging panels in rowhomes and twins", "Storm outages and surge damage", "Panel space for heat pumps and EV chargers"] },
  { slug: "southeast", name: "Southeast", climate: "heat, humidity, frequent thunderstorms and hurricane season near the coast", housing: "fast-growing suburbs alongside 1960s–70s ranch homes", issues: ["Lightning and surge damage", "Hurricane and storm outages", "Aluminum branch wiring in some 1960s–70s homes"] },
  { slug: "midwest", name: "Midwest", climate: "cold winters, severe thunderstorms and tornado season", housing: "older city housing stock and post-war suburbs with basements", issues: ["Basement and sump-pump circuits", "Storm outages and generator demand", "Older panels and fuse boxes in pre-1960 homes"] },
  { slug: "south-central", name: "South Central", climate: "long, hot summers, severe storms and occasional hard freezes", housing: "post-1970 suburbs with heavy air-conditioning loads", issues: ["High AC loads on undersized circuits", "Storm and freeze outages", "Surge damage from frequent lightning"] },
  { slug: "mountain", name: "Mountain West", climate: "dry air, large temperature swings, wildfire seasons and heavy snow at elevation", housing: "newer suburbs and older mountain-town homes", issues: ["Wildfire-season outages and generator use", "Snow-load and cold-weather outages", "Panel upgrades for heat pumps and EVs"] },
  { slug: "southwest", name: "Southwest", climate: "extreme summer heat and monsoon storms", housing: "post-1960 slab-on-grade homes with heavy cooling loads", issues: ["AC circuits under heavy summer load", "Monsoon lightning and surge damage", "Solar and EV additions on older panels"] },
  { slug: "pacific", name: "Pacific", climate: "mild coast, wildfire seasons inland, and wet winters in the Northwest", housing: "older craftsman homes, mid-century tracts and newer construction", issues: ["Public safety power shutoffs and generator hookups", "Panel upgrades for electrification", "Older wiring in early-1900s homes"] },
];

const st = (code: string, name: string, region: string, note: string): StateInfo => ({ code, slug: slugify(name), name, region, note });

export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const stateInfo: StateInfo[] = [
  st("AL", "Alabama", "southeast", "Severe thunderstorms and tornadoes in spring, plus hurricane remnants in the south, make surge protection and generator hookups common requests."),
  st("AR", "Arkansas", "south-central", "Spring storms and summer heat drive surge, storm-repair and AC-circuit calls; many rural homes rely on long service drops."),
  st("AZ", "Arizona", "southwest", "Summer heat puts air conditioners under heavy, constant load, and monsoon storms bring lightning and outages."),
  st("CA", "California", "pacific", "Electrification, rooftop solar and EV adoption make panel upgrades common, and wildfire-season power shutoffs drive generator and battery hookups."),
  st("CO", "Colorado", "mountain", "Hail and lightning on the Front Range, heavy snow in the mountains and a fast-growing EV fleet shape most electrical calls."),
  st("CT", "Connecticut", "northeast", "Older housing stock and nor'easter outages make rewiring, panel replacement and generator transfer switches frequent projects."),
  st("DC", "District of Columbia", "mid-atlantic", "Rowhomes from the late 1800s and early 1900s often carry original or patched wiring and small services."),
  st("DE", "Delaware", "mid-atlantic", "Coastal storms and older homes in Wilmington and Dover are the main drivers of repair and upgrade work."),
  st("FL", "Florida", "southeast", "Florida has some of the highest lightning activity in the country, and hurricane season makes surge protection and generators routine."),
  st("GA", "Georgia", "southeast", "Rapid suburban growth around Atlanta brings EV chargers and additions, while summer storms bring surge and outage calls."),
  st("HI", "Hawaii", "pacific", "Salt air corrodes outdoor equipment, and many homes have rooftop solar tied into older panels."),
  st("IA", "Iowa", "midwest", "Derechos, tornadoes and cold winters make storm repair, generator hookups and sump-pump circuits common."),
  st("ID", "Idaho", "mountain", "Population growth around Boise and cold winters drive new circuits, panel upgrades and heat-related loads."),
  st("IL", "Illinois", "midwest", "Chicago-area housing includes many pre-1950 two-flats and bungalows, and Chicago requires conduit in most new wiring."),
  st("IN", "Indiana", "midwest", "Severe storms and an older housing stock in its cities keep panel and rewiring work steady."),
  st("KS", "Kansas", "south-central", "Tornado season and summer heat drive storm repair, surge protection and AC circuit work."),
  st("KY", "Kentucky", "southeast", "Older homes in Louisville and Lexington, plus spring storms and flooding, account for most repair calls."),
  st("LA", "Louisiana", "south-central", "Hurricanes, flooding and heat make generator installation and post-flood electrical inspections common."),
  st("MA", "Massachusetts", "northeast", "Triple-deckers and colonials from before 1950 often need rewiring, and heat-pump rebates push panel upgrades."),
  st("MD", "Maryland", "mid-atlantic", "Baltimore rowhomes and older suburbs carry aging wiring, and summer storms bring surge and outage calls."),
  st("ME", "Maine", "northeast", "Ice storms, long outages and older farmhouses make generators, transfer switches and rewiring frequent."),
  st("MI", "Michigan", "midwest", "Cold winters, older city housing and summer storms bring panel, rewiring and generator work."),
  st("MN", "Minnesota", "midwest", "Deep cold makes reliable heating circuits critical, and older Twin Cities homes often need wiring updates."),
  st("MO", "Missouri", "midwest", "Kansas City and St. Louis have large pre-1950 housing stocks; spring storms add surge and outage calls."),
  st("MS", "Mississippi", "southeast", "Hurricanes on the Gulf Coast and summer heat drive generator, surge and AC-circuit work."),
  st("MT", "Montana", "mountain", "Long distances, cold winters and wildfire season make generators and reliable heating circuits important."),
  st("NC", "North Carolina", "southeast", "Fast growth around Charlotte and Raleigh plus hurricane remnants drive EV, panel and generator work."),
  st("ND", "North Dakota", "midwest", "Extreme cold makes heating and block-heater circuits essential."),
  st("NE", "Nebraska", "midwest", "Severe storms and cold winters drive surge, generator and heating-circuit work."),
  st("NH", "New Hampshire", "northeast", "Ice storms and older New England homes make generators and rewiring common projects."),
  st("NJ", "New Jersey", "mid-atlantic", "Dense older suburbs and coastal storms drive panel upgrades, rewiring and generator installations."),
  st("NM", "New Mexico", "southwest", "Monsoon lightning and adobe and older homes with limited wiring shape most calls."),
  st("NV", "Nevada", "southwest", "Extreme summer heat in Las Vegas and growth around Reno drive AC circuits, EV chargers and panel upgrades."),
  st("NY", "New York", "northeast", "New York City has one of the oldest building stocks in the country, and upstate winters bring ice-storm outages."),
  st("OH", "Ohio", "midwest", "Older city neighborhoods in Cleveland, Columbus and Dayton carry aging wiring, and storms bring outages."),
  st("OK", "Oklahoma", "south-central", "Tornadoes, ice storms and summer heat make storm repair, surge protection and generators common."),
  st("OR", "Oregon", "pacific", "Older Portland homes, wildfire-season outages and winter ice storms drive rewiring and generator work."),
  st("PA", "Pennsylvania", "mid-atlantic", "Philadelphia and Pittsburgh rowhomes and older suburbs carry original wiring and small services."),
  st("RI", "Rhode Island", "northeast", "Older multi-family homes and coastal storms drive rewiring, panel and generator work."),
  st("SC", "South Carolina", "southeast", "Hurricane season on the coast and fast inland growth drive generator, surge and EV work."),
  st("TN", "Tennessee", "southeast", "Spring storms and fast growth around Nashville drive surge, panel and new-circuit work."),
  st("TX", "Texas", "south-central", "Heat, hail and the 2021 winter storm have made generators, surge protection and panel capacity priorities; electricians are licensed by the state through TDLR."),
  st("UT", "Utah", "mountain", "Fast growth along the Wasatch Front and cold winters drive EV chargers, panel upgrades and finished-basement circuits."),
  st("VA", "Virginia", "mid-atlantic", "Coastal storms in Hampton Roads and older Richmond homes shape repair and upgrade work."),
  st("WA", "Washington", "pacific", "Wet winters, windstorms and electrification incentives drive generator hookups and panel upgrades."),
  st("WI", "Wisconsin", "midwest", "Cold winters and older Milwaukee housing drive heating-circuit and rewiring work."),
  st("WV", "West Virginia", "mid-atlantic", "Hilly terrain, flooding and older homes make storm repair and rewiring common."),
  st("WY", "Wyoming", "mountain", "Wind, cold and long service distances make reliable heating circuits and generators important."),
];

/** States with no live LeadSmart Electrical coverage yet. Listed honestly on the hub; no state page until coverage exists. */
export const uncoveredStates = [
  { code: "AK", name: "Alaska" },
  { code: "SD", name: "South Dakota" },
  { code: "VT", name: "Vermont" },
];

const cov = coverage as { dataDate: string; states: Record<string, CoverageCity[]> };
export const coverageDate = cov.dataDate;

/** Only states with live LeadSmart Electrical coverage get pages. */
export const coveredStates = stateInfo.filter((s) => cov.states[s.code]?.length).sort((a, b) => a.name.localeCompare(b.name));

export const getState = (slug: string) => coveredStates.find((s) => s.slug === slug);
export const getRegion = (slug: string) => regions.find((r) => r.slug === slug)!;
export const citiesIn = (code: string): CoverageCity[] => cov.states[code] ?? [];
export const zipCount = (code: string) => citiesIn(code).reduce((n, c) => n + c.zips.length, 0);
export const totalCities = coveredStates.reduce((n, s) => n + citiesIn(s.code).length, 0);
export const totalZips = coveredStates.reduce((n, s) => n + zipCount(s.code), 0);
export const statesInRegion = (r: string) => coveredStates.filter((s) => s.region === r);

export const cityLabel = (city: string, code: string) => `${city}, ${code}`;
