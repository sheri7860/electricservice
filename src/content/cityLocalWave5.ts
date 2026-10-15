import type { CityLocal } from "./types";

/** Wave 5 metros: first metro page in states that had none. Same rules as cityLocal.ts. */
export const cityLocalWave5: Record<string, CityLocal & { county?: string }> = {
  "ID/boise": {
    county: "Ada County",
    intro: "Boise's North End and East End are full of bungalows and foursquares from the 1900s to the 1930s, the Bench has post-war ranch homes, and fast growth has filled West Boise and neighboring Meridian with new construction. Hot, dry summers and cold winters shape most electrical work.",
    housing: "Older North End homes can still have knob-and-tube, small services and few outlets, while newer homes drive EV charger, shop and hot-tub circuits. Heat pumps and central air additions often push older panels past their limit.",
    issues: ["Knob-and-tube and small services in North End homes", "Panel capacity for EV chargers, heat pumps and shops", "Winter outages and generator inlets"],
    permits: "Electrical permits inside city limits come from the City of Boise's Planning and Development Services; elsewhere in Idaho the state often handles electrical permits. Electricians are licensed through Idaho's Division of Occupational and Professional Licenses.",
    areas: ["North End", "East End", "Boise Bench", "Collister", "Southeast Boise", "West Boise"],
  },
  "MI/grand-rapids": {
    county: "Kent County",
    intro: "Grand Rapids has one of the largest historic districts in the Midwest in Heritage Hill, early-1900s homes in Eastown, East Hills and Creston, and post-war and newer suburbs around the city. Lake-effect snow, ice storms and summer thunderstorms drive much of the work.",
    housing: "Victorian and early-1900s homes often have knob-and-tube, cloth wiring and small services, and nearly every home has a basement holding the panel and sump pump. Basement finishes and EV chargers are common reasons to add circuits.",
    issues: ["Knob-and-tube in Heritage Hill and older homes", "Ice-storm and windstorm outages", "Basement circuits and sump pumps"],
    permits: "Electrical permits in Grand Rapids come from the city's Development Center; surrounding cities and townships issue their own. Michigan licenses electricians through the Department of Licensing and Regulatory Affairs (LARA).",
    areas: ["Heritage Hill", "Eastown", "East Hills", "Creston", "Garfield Park", "Alger Heights"],
  },
  "NH/manchester": {
    county: "Hillsborough County",
    intro: "Manchester grew around the Amoskeag mills, and its housing reflects that: mill-era brick tenements, triple-deckers and multi-family homes on the West Side and in the inner neighborhoods, and larger Victorians in the North End. Long winters and ice storms are the main weather factors.",
    housing: "Multi-family buildings often have several small services and a meter bank, and knob-and-tube or cloth wiring is common in pre-1930 homes. Heat-pump conversions and EV chargers usually need a service upgrade.",
    issues: ["Knob-and-tube in pre-1930 multi-family homes", "Ice-storm outages and generators", "Service upgrades for heat pumps"],
    permits: "Electrical permits in Manchester come from the city's building regulations office; other towns issue their own. New Hampshire licenses electricians through the Electricians' Board.",
    areas: ["North End", "West Side", "East Side", "Rimmon Heights", "Hallsville", "South End"],
  },
  "RI/providence": {
    county: "Providence County",
    intro: "Providence has colonial and Federal-era homes on College Hill and in Fox Point, Victorians on the West End and Elmwood, and many triple-deckers and multi-family homes across the city. Old housing, coastal storms and nor'easters shape most electrical work.",
    housing: "Multi-family homes often have a separate small service for each unit, and knob-and-tube and early wiring are common. Historic district rules can affect exterior equipment such as meters and service masts.",
    issues: ["Knob-and-tube and early wiring in pre-1930 homes", "Multiple small services in triple-deckers", "Hurricane and nor'easter outages"],
    permits: "Electrical permits in Providence come from the city's Department of Inspection and Standards, and historic districts may require review of exterior changes. Rhode Island licenses electricians through the Department of Labor and Training.",
    areas: ["College Hill", "Fox Point", "West End", "Elmwood", "Mount Pleasant", "Federal Hill"],
  },
  "SC/charleston": {
    county: "Charleston County",
    intro: "Charleston's peninsula has some of the oldest homes in the country, from 1700s single houses South of Broad to Victorian homes in Wagener Terrace, while West Ashley, James Island and Daniel Island have post-war and newer construction. Hurricanes, flooding and salt air shape almost every electrical decision.",
    housing: "Historic homes may have wiring from many eras, and the city's Board of Architectural Review regulates visible exterior changes. Low-lying neighborhoods flood from storms and king tides, so elevating panels, meters and AC equipment is common.",
    issues: ["Flood and storm damage to electrical equipment", "Older wiring in historic peninsula homes", "Salt-air corrosion on outdoor equipment"],
    permits: "Electrical permits inside city limits come from the City of Charleston's building inspections division; other municipalities and unincorporated Charleston County have their own. South Carolina licenses electricians through the Department of Labor, Licensing and Regulation (LLR).",
    areas: ["South of Broad", "Wagener Terrace", "Hampton Park", "West Ashley", "James Island", "Daniel Island"],
  },
  "SC/greenville": {
    county: "Greenville County",
    intro: "Greenville has early-1900s homes along Augusta Road and North Main, former textile mill villages with small frame houses, and fast-growing suburbs across the county. Summer storms, ice storms and the 2024 outages from Hurricane Helene drive much of the work.",
    housing: "Mill-village houses are often small with limited circuits and small services, and many have been renovated in stages. New construction brings EV chargers and generator requests.",
    issues: ["Small services in mill-village homes", "Storm outages and generators", "Older wiring in pre-1950 homes"],
    permits: "Electrical permits inside city limits come from the City of Greenville's Planning and Development office; unincorporated areas are permitted by Greenville County. South Carolina licenses electricians through LLR.",
    areas: ["North Main", "Augusta Road", "Overbrook", "Alta Vista", "Parkins Mill", "Monaghan Mill"],
  },
  "WI/madison": {
    county: "Dane County",
    intro: "Madison's isthmus neighborhoods, including Willy Street, Tenney-Lapham and Marquette, have homes from the 1890s to the 1920s, and Dudgeon-Monroe and the near west side add 1920s and 1930s homes. Cold winters and summer storms shape most electrical work.",
    housing: "Older homes often have knob-and-tube, small services and limited outlets, and basements hold the panel and sump pump. Heat pumps, EV chargers and rooftop solar are increasingly common reasons to upgrade a panel.",
    issues: ["Knob-and-tube in pre-1930 isthmus homes", "Panel upgrades for heat pumps, EVs and solar", "Basement circuits and sump pumps"],
    permits: "Electrical permits in Madison come from the city's Building Inspection division; surrounding cities and villages issue their own. Wisconsin licenses electricians through the Department of Safety and Professional Services (DSPS).",
    areas: ["Willy Street", "Tenney-Lapham", "Dudgeon-Monroe", "Near West", "Hill Farms", "Atwood"],
  },
  "WI/milwaukee": {
    county: "Milwaukee County",
    intro: "Milwaukee is known for its Polish flats, duplexes and brick bungalows, most built before 1950, in neighborhoods like Bay View, Riverwest, Washington Heights and Sherman Park. Cold winters and summer storms drive most electrical calls.",
    housing: "Duplexes typically have two services and two meters in the basement, and knob-and-tube, fuse boxes and patched wiring are common. Basement water can reach panels and outlets during heavy rain.",
    issues: ["Knob-and-tube and fuse boxes in pre-1950 homes", "Two-family services in Milwaukee duplexes", "Basement flooding near panels and sump pumps"],
    permits: "Electrical permits in Milwaukee come from the city's Department of Neighborhood Services; suburbs issue their own. Wisconsin licenses electricians through DSPS.",
    areas: ["Bay View", "Riverwest", "Washington Heights", "Sherman Park", "Walker's Point", "East Side"],
  },
};
