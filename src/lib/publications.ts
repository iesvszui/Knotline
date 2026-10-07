import t1 from "@/assets/trail-1.jpg";
import t2 from "@/assets/trail-2.jpg";
import t3 from "@/assets/trail-3.jpg";
import t4 from "@/assets/trail-4.jpg";

export const trailImages = [t1, t2, t3, t4];

export type Publication = {
  slug: string;
  title: string;
  description: string;
  date: string;
  edition: string;
  cover: string;
  pageCount: number;
  sections: string[];
};

export const publications: Publication[] = [
  { slug: "hull-performance-2-0", title: "Hull Performance 2.0", description: "Fouling, friction and the new economics of clean hulls.", date: "Sep 2026", edition: "No. 24", cover: t4, pageCount: 24, sections: ["Friction as a Fuel Line", "Inside the Dry Dock", "Data From 400 Hulls", "The Coating Question"] },
  { slug: "tanker-markets-q3", title: "Tanker Markets Q3", description: "Freight, fleet and the long voyage of crude.", date: "Aug 2026", edition: "No. 23", cover: t1, pageCount: 20, sections: ["Rates at Dusk", "Shadow Fleets", "Ton-Mile Arithmetic", "Outlook"] },
  { slug: "ports-after-dark", title: "Ports After Dark", description: "Automation, labour and the 24-hour terminal.", date: "Jul 2026", edition: "No. 22", cover: t2, pageCount: 22, sections: ["The Night Shift", "Cranes That Think", "Berth Windows", "Congestion Maps"] },
  { slug: "north-sea-offshore", title: "North Sea Offshore", description: "Decommissioning, wind and what remains.", date: "Jun 2026", edition: "No. 21", cover: t3, pageCount: 20, sections: ["Fog Lines", "Steel Afterlives", "Wind Over Water", "Field Notes"] },
  { slug: "decarbonisation-ledger", title: "The Decarbonisation Ledger", description: "CII, EEXI and the accounting of emissions.", date: "May 2026", edition: "No. 20", cover: t1, pageCount: 24, sections: ["Counting Carbon", "Retrofit or Replace", "Methanol Notes", "Regulators"] },
  { slug: "survey-season", title: "Survey Season", description: "Classification, inspection and the human eye.", date: "Apr 2026", edition: "No. 19", cover: t4, pageCount: 20, sections: ["Walking the Hull", "Drones in Tanks", "Findings", "Checklists"] },
  { slug: "container-cycles", title: "Container Cycles", description: "Boom, bust and the box that changed the world.", date: "Mar 2026", edition: "No. 18", cover: t2, pageCount: 22, sections: ["The Box", "Overcapacity", "Alliances", "Blank Sailings"] },
  { slug: "weather-routing", title: "Weather Routing", description: "Reading the sea before it reads you.", date: "Feb 2026", edition: "No. 17", cover: t3, pageCount: 20, sections: ["Isobars", "Voyage Optimisation", "Heavy Weather", "Arrival"] },
];

export const getPublication = (slug: string) => publications.find((p) => p.slug === slug);
