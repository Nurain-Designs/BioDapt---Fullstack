export type DisposalEnv = "compost" | "landfill" | "marine";

export type ApplicationType =
  | "food"
  | "ecommerce"
  | "pharmaceutical"
  | "industrial";

export interface Material {
  id: string;
  name: string;
  shortName: string;
  family: string;
  color: string;
  // Raw properties (real-world approximate ranges)
  tensileStrength: number; // MPa
  elongation: number; // % at break
  waterVaporPermeability: number; // g·mm/m²·day (lower = better barrier)
  biodegradationRate: number; // % mass loss / month in compost
  costPerKg: number; // USD
  tempResistance: number; // °C max service temp
  // Biodegradation time (days) under each disposal condition
  biodegradeDays: Record<DisposalEnv, number>;
  // Suitability per application (0-100)
  suitability: Record<ApplicationType, number>;
  description: string;
  pros: string[];
  cons: string[];
  bioBased: boolean;
}

export const MATERIALS: Material[] = [
  {
    id: "pla",
    name: "Polylactic Acid (PLA)",
    shortName: "PLA",
    family: "Polyester (corn/sugarcane)",
    color: "#16a34a",
    tensileStrength: 55,
    elongation: 6,
    waterVaporPermeability: 1.7,
    biodegradationRate: 18,
    costPerKg: 2.4,
    tempResistance: 60,
    biodegradeDays: { compost: 180, landfill: 2900, marine: 1400 },
    suitability: { food: 82, ecommerce: 74, pharmaceutical: 70, industrial: 60 },
    description:
      "The most widely produced bioplastic. Rigid, transparent and easy to thermoform, but only composts industrially.",
    pros: ["Low cost & scalable", "Clear & rigid", "Good printability"],
    cons: ["Brittle (low elongation)", "Needs industrial compost", "Low heat resistance"],
    bioBased: true,
  },
  {
    id: "pha",
    name: "Polyhydroxyalkanoates (PHA)",
    shortName: "PHA",
    family: "Microbial polyester",
    color: "#0891b2",
    tensileStrength: 40,
    elongation: 12,
    waterVaporPermeability: 2.1,
    biodegradationRate: 42,
    costPerKg: 5.8,
    tempResistance: 110,
    biodegradeDays: { compost: 90, landfill: 600, marine: 180 },
    suitability: { food: 88, ecommerce: 68, pharmaceutical: 76, industrial: 72 },
    description:
      "Microbially-grown polyester that biodegrades in soil, marine and home-compost conditions — the gold standard for end-of-life.",
    pros: ["Marine biodegradable", "High heat resistance", "Home compostable"],
    cons: ["Expensive", "Limited supply", "Slower production"],
    bioBased: true,
  },
  {
    id: "starch",
    name: "Starch-Based Blend (TPS)",
    shortName: "Starch",
    family: "Thermoplastic starch",
    color: "#d97706",
    tensileStrength: 18,
    elongation: 35,
    waterVaporPermeability: 6.8,
    biodegradationRate: 70,
    costPerKg: 1.6,
    tempResistance: 50,
    biodegradeDays: { compost: 45, landfill: 400, marine: 120 },
    suitability: { food: 60, ecommerce: 78, pharmaceutical: 40, industrial: 55 },
    description:
      "Cheap, fast-degrading films made from corn or potato starch. Flexible but highly moisture-sensitive.",
    pros: ["Very low cost", "Fast biodegradation", "Flexible"],
    cons: ["Poor moisture barrier", "Low strength", "Heat sensitive"],
    bioBased: true,
  },
  {
    id: "chitosan",
    name: "Chitosan Film",
    shortName: "Chitosan",
    family: "Polysaccharide (shellfish)",
    color: "#7c3aed",
    tensileStrength: 38,
    elongation: 22,
    waterVaporPermeability: 4.2,
    biodegradationRate: 55,
    costPerKg: 7.5,
    tempResistance: 70,
    biodegradeDays: { compost: 60, landfill: 350, marine: 90 },
    suitability: { food: 90, ecommerce: 50, pharmaceutical: 85, industrial: 45 },
    description:
      "Antimicrobial biopolymer from crustacean shells. Excellent for active food packaging and pharma, but costly.",
    pros: ["Antimicrobial", "Edible/biocompatible", "Good for food shelf-life"],
    cons: ["High cost", "Not vegan", "Moisture sensitive"],
    bioBased: true,
  },
  {
    id: "cellulose",
    name: "Cellulose Composite",
    shortName: "Cellulose",
    family: "Regenerated cellulose / nanocellulose",
    color: "#ca8a04",
    tensileStrength: 90,
    elongation: 8,
    waterVaporPermeability: 3.0,
    biodegradationRate: 48,
    costPerKg: 3.9,
    tempResistance: 130,
    biodegradeDays: { compost: 70, landfill: 500, marine: 200 },
    suitability: { food: 72, ecommerce: 80, pharmaceutical: 65, industrial: 88 },
    description:
      "High-strength, heat-stable composites from wood pulp or nanocellulose. Strong and renewable, moderate cost.",
    pros: ["Very high strength", "Heat resistant", "Renewable feedstock"],
    cons: ["Stiff / low flex", "Variable barrier", "Process intensive"],
    bioBased: true,
  },
];

// Normalization bounds for radar chart (min/max across dataset + headroom)
export const PROPERTY_META: {
  key: keyof Pick<
    Material,
    | "tensileStrength"
    | "elongation"
    | "waterVaporPermeability"
    | "biodegradationRate"
    | "costPerKg"
    | "tempResistance"
  >;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  min: number;
  max: number;
}[] = [
  { key: "tensileStrength", label: "Strength", unit: "MPa", higherIsBetter: true, min: 0, max: 100 },
  { key: "elongation", label: "Flexibility", unit: "%", higherIsBetter: true, min: 0, max: 40 },
  { key: "waterVaporPermeability", label: "Moisture Barrier", unit: "g·mm/m²·d", higherIsBetter: false, min: 0, max: 8 },
  { key: "biodegradationRate", label: "Biodegrade Speed", unit: "%/mo", higherIsBetter: true, min: 0, max: 80 },
  { key: "costPerKg", label: "Affordability", unit: "$/kg", higherIsBetter: false, min: 0, max: 10 },
  { key: "tempResistance", label: "Heat Resistance", unit: "°C", higherIsBetter: true, min: 0, max: 140 },
];

export function normalizeScore(
  value: number,
  meta: (typeof PROPERTY_META)[number]
): number {
  const clamped = Math.max(meta.min, Math.min(meta.max, value));
  const raw = (clamped - meta.min) / (meta.max - meta.min);
  return Math.round((meta.higherIsBetter ? raw : 1 - raw) * 100);
}
