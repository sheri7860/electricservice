/**
 * Hand-written notes for subservice + city pages, keyed "ST/city-slug" -> subservice slug -> note.
 * A subservice + city page is published only when a note exists here, passes the quality gate
 * (lib/coverage.ts), and the city has no page for the parent service covering the same need.
 * Use only verified local facts (permit office, utility, housing stock). Never swap city names.
 */
import { subCityNotesMore } from "./subCityNotesMore";
import { subCityNotesWave3 } from "./subCityNotesWave3";
import { subCityNotesWave4 } from "./subCityNotesWave4";
import { subCityNotesWave5 } from "./subCityNotesWave5";
import { subCityNotesWave6 } from "./subCityNotesWave6";
import { subCityNotesWave7 } from "./subCityNotesWave7";
import { subCityNotesWave8 } from "./subCityNotesWave8";
import { subCityNotesWave9 } from "./subCityNotesWave9";
import { subCityNotesWave10 } from "./subCityNotesWave10";
import { subCityNotesWave11 } from "./subCityNotesWave11";
import { subCityNotesWave12 } from "./subCityNotesWave12";
export const subCityNotes: Record<string, Record<string, string>> = {
  "CA/sacramento": {
    "knob-and-tube-replacement": "Knob-and-tube is common in the bungalows and tudors of Land Park, East Sacramento, Curtis Park and Oak Park, most of which were built between the 1910s and the 1940s. It usually surfaces when owners add attic insulation to cope with Sacramento's long run of 100-degree summer days, since insulation should not be packed around active knob-and-tube. Replacement is often paired with a panel upgrade for a heat pump or EV charger, and SMUD, the publicly owned utility, coordinates any meter or service work. Permits inside city limits come from the City of Sacramento Community Development Department; unincorporated areas are permitted by Sacramento County.",
  },
  "ID/boise": {
    "hot-tub-electrical-installation": "Hot tubs are one of the loads driving circuit and panel work in Boise's growing neighborhoods, alongside EV chargers and detached shops. Treasure Valley winters bring hard freezes, so a tub's heater and circulation pump need reliable power through cold snaps, and the dedicated GFCI-protected circuit and disconnect should be sized exactly to the manufacturer's specification. Older homes in the North End and on the Bench often have 100 amp services, so a load calculation comes first. Idaho Power handles any service changes, and permits inside city limits come from the City of Boise's Planning and Development Services.",
  },
  "IA/des-moines": {
    "200-amp-service-upgrade": "Many Des Moines homes in Drake, Sherman Hill, Highland Park and the brick cottages of Beaverdale still run on 60 or 100 amp services from decades ago. Finishing a basement, adding central air or installing an EV charger is often what pushes them to 200 amps. Because nearly every home here has the panel in the basement, the electrician also checks for moisture and decides whether the new panel should move higher. MidAmerican Energy disconnects and reconnects the service, and permits come from the city's Permit and Development Center. Ask for a load calculation first, since a load-management device can sometimes avoid the upgrade.",
    "outlet-installation": "Older Des Moines homes often have only one or two outlets per room, a legacy of wiring designed before modern electronics. Extension cords and stacked power strips are the usual workaround, and adding properly protected outlets is the safer fix. Basement outlets need GFCI protection, and finished basement bedrooms and living areas need AFCI-protected circuits under current code, which matters in a city where basements are nearly universal. The electrician first checks whether nearby circuits have capacity or whether a new circuit is needed. Permits for new circuits come from the city's Permit and Development Center.",
  },
  "OH/dayton": {
    "fuse-box-replacement": "Victorian and early-1900s homes in the Oregon District, St. Anne's Hill and Dayton View still turn up with fuse boxes and decades of add-on circuits. Fuse panels in these homes usually come with small services, so replacement is commonly combined with an upgrade, and the electrician checks for knob-and-tube behind the old fuses. Dayton's storm history, including the 2019 Memorial Day tornadoes, also means some homes had hurried repairs worth checking. AES Ohio handles the utility disconnect and reconnect. Inside city limits, permits come from the City of Dayton's Division of Building Inspection; many suburbs use Montgomery County Building Regulations.",
  },
  "OH/akron": {
    "outlet-installation": "Akron's company-built neighborhoods, Goodyear Heights and Firestone Park, went up quickly in the 1910s and 1920s with a few circuits and few outlets per room, and Highland Square and Kenmore homes from the same era are similar. Adding outlets in these houses usually means fishing new cable from the basement or attic and checking that the old circuit can take more load. Basement and kitchen outlets need GFCI protection under current code. Projects in Akron are filed with both the City of Akron and the Summit County Department of Building Standards, which performs the inspections.",
  },
  "TX/dallas": {
    "outlet-installation": "Dallas ranch homes from the 1950s and 1960s, in neighborhoods like Lake Highlands and Preston Hollow, often have ungrounded two-prong outlets and fewer receptacles than modern kitchens and home offices need. Adding outlets is a chance to bring those rooms up to current code with grounded, tamper-resistant receptacles and GFCI protection where required. Some late-1960s homes have aluminum branch wiring, which needs connectors listed for aluminum at every new connection. Permits come from the City of Dallas Development Services department or your suburb, and Texas electricians are licensed by TDLR.",
  },
};

Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesMore).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave3).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave4).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave5).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave6).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave7).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave8).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave9).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave10).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave11).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
Object.assign(subCityNotes, Object.fromEntries(Object.entries(subCityNotesWave12).map(([k, v]) => [k, { ...subCityNotes[k], ...v }])));
