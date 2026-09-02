/**
 * Canonical list of the 17 UN Sustainable Development Goals.
 * Used as supporting context for AI classification and for validating
 * anything that comes back from the model before it is stored.
 */
export interface SDG {
  id: number;
  name: string;
  description: string;
  keywords: string[];
}

export const SDGS: SDG[] = [
  { id: 1, name: "No Poverty", description: "End poverty in all its forms everywhere.", keywords: ["poverty", "income", "social protection", "microfinance", "livelihood"] },
  { id: 2, name: "Zero Hunger", description: "End hunger, achieve food security and improved nutrition, promote sustainable agriculture.", keywords: ["hunger", "food security", "nutrition", "agriculture", "farming", "crops"] },
  { id: 3, name: "Good Health and Well-Being", description: "Ensure healthy lives and promote well-being for all at all ages.", keywords: ["health", "medical", "wellbeing", "hospital", "mental health", "nursing", "biomedical", "assistive care"] },
  { id: 4, name: "Quality Education", description: "Ensure inclusive and equitable quality education and promote lifelong learning.", keywords: ["education", "training", "course", "workshop", "internship", "bootcamp", "learning", "curriculum", "seminar"] },
  { id: 5, name: "Gender Equality", description: "Achieve gender equality and empower all women and girls.", keywords: ["gender", "women", "girls", "equality", "empowerment", "diversity"] },
  { id: 6, name: "Clean Water and Sanitation", description: "Ensure availability and sustainable management of water and sanitation for all.", keywords: ["water", "sanitation", "hygiene", "wastewater", "irrigation", "water quality"] },
  { id: 7, name: "Affordable and Clean Energy", description: "Ensure access to affordable, reliable, sustainable and modern energy for all.", keywords: ["energy", "solar", "wind", "renewable", "electricity", "power grid", "battery"] },
  { id: 8, name: "Decent Work and Economic Growth", description: "Promote sustained, inclusive economic growth, full employment and decent work for all.", keywords: ["employment", "job", "internship", "career", "entrepreneurship", "productivity", "industry placement", "economy"] },
  { id: 9, name: "Industry, Innovation and Infrastructure", description: "Build resilient infrastructure, promote inclusive industrialization and foster innovation.", keywords: ["innovation", "technology", "engineering", "software", "robotics", "iot", "ai", "infrastructure", "research", "manufacturing"] },
  { id: 10, name: "Reduced Inequalities", description: "Reduce inequality within and among countries.", keywords: ["inequality", "inclusion", "accessibility", "marginalized", "equity"] },
  { id: 11, name: "Sustainable Cities and Communities", description: "Make cities and human settlements inclusive, safe, resilient and sustainable.", keywords: ["smart city", "urban", "transport", "housing", "community", "mobility", "disaster resilience"] },
  { id: 12, name: "Responsible Consumption and Production", description: "Ensure sustainable consumption and production patterns.", keywords: ["recycling", "waste", "circular economy", "sustainable production", "resource efficiency"] },
  { id: 13, name: "Climate Action", description: "Take urgent action to combat climate change and its impacts.", keywords: ["climate", "carbon", "emissions", "global warming", "sustainability", "green"] },
  { id: 14, name: "Life Below Water", description: "Conserve and sustainably use the oceans, seas and marine resources.", keywords: ["ocean", "marine", "fisheries", "coral", "coastal", "aquatic"] },
  { id: 15, name: "Life on Land", description: "Protect, restore and promote sustainable use of terrestrial ecosystems.", keywords: ["forest", "biodiversity", "wildlife", "soil", "conservation", "ecosystem"] },
  { id: 16, name: "Peace, Justice and Strong Institutions", description: "Promote peaceful and inclusive societies, provide access to justice and build accountable institutions.", keywords: ["justice", "governance", "law", "ethics", "policy", "cybersecurity", "human rights"] },
  { id: 17, name: "Partnerships for the Goals", description: "Strengthen the means of implementation and revitalize the global partnership for sustainable development.", keywords: ["partnership", "collaboration", "ngo", "volunteering", "global", "cooperation"] },
];

export const sdgById = (id: number) => SDGS.find((s) => s.id === id);

/** Canonical stored label, e.g. "SDG 4: Quality Education". */
export const sdgLabel = (id: number) => {
  const s = sdgById(id);
  return s ? `SDG ${s.id}: ${s.name}` : "";
};

export const SDG_LABELS = SDGS.map((s) => sdgLabel(s.id));

/** Parse a stored label back to its SDG number (tolerant of legacy formats). */
export const parseSdgId = (value: string): number | null => {
  const m = value.match(/(\d{1,2})/);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 1 && n <= 17 ? n : null;
};

/** Normalize any stored/typed value to the canonical label; drops unknowns. */
export const normalizeSdg = (value: string): string | null => {
  const id = parseSdgId(value);
  return id ? sdgLabel(id) : null;
};

export const normalizeSdgList = (values: string[]): string[] =>
  Array.from(new Set(values.map(normalizeSdg).filter((v): v is string => !!v)));
