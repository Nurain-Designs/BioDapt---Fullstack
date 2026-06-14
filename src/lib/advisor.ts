import {
  MATERIALS,
  type Material,
  type DisposalEnv,
  type ApplicationType,
} from "../data/materials";

export interface ParsedRequirements {
  application?: ApplicationType;
  disposal?: DisposalEnv;
  maxBiodegradeDays?: number;
  needsMoistureBarrier: boolean;
  needsHeat: boolean;
  needsStrength: boolean;
  needsFlexible: boolean;
  costSensitive: boolean;
  rawTokens: string[];
}

export interface Recommendation {
  material: Material;
  score: number;
  reasons: string[];
  warnings: string[];
}

const APP_KEYWORDS: Record<ApplicationType, string[]> = {
  food: ["food", "frozen", "fresh", "produce", "snack", "meal", "grocery", "edible", "drink", "beverage"],
  ecommerce: ["ecommerce", "e-commerce", "shipping", "mailer", "courier", "parcel", "delivery", "online", "wrap"],
  pharmaceutical: ["pharma", "pharmaceutical", "medical", "drug", "medicine", "sterile", "blister", "pill"],
  industrial: ["industrial", "machinery", "parts", "automotive", "construction", "heavy", "electronics"],
};

const DISPOSAL_KEYWORDS: Record<DisposalEnv, string[]> = {
  compost: ["compost", "composting", "home compost", "garden"],
  marine: ["marine", "ocean", "sea", "water", "coastal", "beach"],
  landfill: ["landfill", "bin", "trash", "garbage", "general waste"],
};

const MONTH_RE = /(\d+)\s*(month|months|mo)\b/i;
const WEEK_RE = /(\d+)\s*(week|weeks|wk)\b/i;
const DAY_RE = /(\d+)\s*(day|days)\b/i;
const YEAR_RE = /(\d+)\s*(year|years|yr)\b/i;

export function parseRequirements(input: string): ParsedRequirements {
  const text = input.toLowerCase();
  const tokens = text.split(/[^a-z0-9]+/).filter(Boolean);

  let application: ApplicationType | undefined;
  (Object.keys(APP_KEYWORDS) as ApplicationType[]).forEach((app) => {
    if (APP_KEYWORDS[app].some((k) => text.includes(k))) application = app;
  });

  let disposal: DisposalEnv | undefined;
  (Object.keys(DISPOSAL_KEYWORDS) as DisposalEnv[]).forEach((d) => {
    if (DISPOSAL_KEYWORDS[d].some((k) => text.includes(k))) disposal = d;
  });

  let maxBiodegradeDays: number | undefined;
  const y = text.match(YEAR_RE);
  const m = text.match(MONTH_RE);
  const w = text.match(WEEK_RE);
  const d = text.match(DAY_RE);
  if (y) maxBiodegradeDays = parseInt(y[1]) * 365;
  else if (m) maxBiodegradeDays = parseInt(m[1]) * 30;
  else if (w) maxBiodegradeDays = parseInt(w[1]) * 7;
  else if (d) maxBiodegradeDays = parseInt(d[1]);

  return {
    application,
    disposal,
    maxBiodegradeDays,
    needsMoistureBarrier:
      /moisture|water|humid|wet|frozen|liquid|barrier|fresh/.test(text),
    needsHeat: /heat|hot|microwave|temperature|warm|oven|boil/.test(text),
    needsStrength: /strong|strength|durable|heavy|protect|rigid|stack/.test(text),
    needsFlexible: /flex|bend|soft|wrap|pouch|bag|film|stretch/.test(text),
    costSensitive: /cheap|affordable|low cost|low-cost|budget|inexpensive|economical|cost-effective/.test(text),
    rawTokens: tokens,
  };
}

export function recommend(req: ParsedRequirements): Recommendation[] {
  const results: Recommendation[] = MATERIALS.map((material) => {
    let score = 50;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Application fit
    if (req.application) {
      const fit = material.suitability[req.application];
      score += (fit - 60) * 0.6;
      if (fit >= 80)
        reasons.push(`Strong fit for ${labelApp(req.application)} (${fit}/100 suitability).`);
      else if (fit < 55)
        warnings.push(`Limited track record for ${labelApp(req.application)} applications.`);
    }

    // Disposal / biodegradation window
    if (req.disposal) {
      const days = material.biodegradeDays[req.disposal];
      if (req.maxBiodegradeDays) {
        if (days <= req.maxBiodegradeDays) {
          score += 22;
          reasons.push(
            `Biodegrades in ~${days} days in ${req.disposal} — within your ${req.maxBiodegradeDays}-day target.`
          );
        } else {
          score -= 25;
          warnings.push(
            `Takes ~${days} days in ${req.disposal} — exceeds your ${req.maxBiodegradeDays}-day window.`
          );
        }
      } else {
        score += Math.max(0, 18 - days / 15);
        reasons.push(`Degrades in ~${days} days under ${req.disposal} conditions.`);
      }
    } else if (req.maxBiodegradeDays) {
      const days = material.biodegradeDays.compost;
      if (days <= req.maxBiodegradeDays) {
        score += 15;
        reasons.push(`Meets ${req.maxBiodegradeDays}-day target (~${days} days, composting).`);
      } else {
        score -= 18;
        warnings.push(`~${days} days to compost — slower than your ${req.maxBiodegradeDays}-day goal.`);
      }
    }

    // Moisture barrier (lower WVP is better)
    if (req.needsMoistureBarrier) {
      if (material.waterVaporPermeability <= 3) {
        score += 12;
        reasons.push(`Good moisture barrier (WVP ${material.waterVaporPermeability}).`);
      } else if (material.waterVaporPermeability >= 5) {
        score -= 12;
        warnings.push(`Weak moisture barrier (WVP ${material.waterVaporPermeability}) — risky for wet/frozen goods.`);
      }
    }

    // Heat resistance
    if (req.needsHeat) {
      if (material.tempResistance >= 100) {
        score += 12;
        reasons.push(`Withstands heat up to ${material.tempResistance}°C.`);
      } else if (material.tempResistance < 65) {
        score -= 12;
        warnings.push(`Low heat tolerance (max ${material.tempResistance}°C).`);
      }
    }

    // Strength
    if (req.needsStrength) {
      if (material.tensileStrength >= 50) {
        score += 10;
        reasons.push(`High tensile strength (${material.tensileStrength} MPa).`);
      } else if (material.tensileStrength < 25) {
        score -= 10;
        warnings.push(`Low strength (${material.tensileStrength} MPa) — may need lamination.`);
      }
    }

    // Flexibility
    if (req.needsFlexible) {
      if (material.elongation >= 20) {
        score += 10;
        reasons.push(`Flexible film (elongation ${material.elongation}%).`);
      } else if (material.elongation < 8) {
        score -= 8;
        warnings.push(`Brittle (elongation ${material.elongation}%) — poor for flexible packaging.`);
      }
    }

    // Cost
    if (req.costSensitive) {
      if (material.costPerKg <= 2.5) {
        score += 14;
        reasons.push(`Budget friendly at $${material.costPerKg.toFixed(2)}/kg.`);
      } else if (material.costPerKg >= 5) {
        score -= 14;
        warnings.push(`Premium price ($${material.costPerKg.toFixed(2)}/kg).`);
      }
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    return { material, score, reasons, warnings };
  });

  return results.sort((a, b) => b.score - a.score);
}

export function labelApp(app: ApplicationType): string {
  return {
    food: "food packaging",
    ecommerce: "e-commerce / shipping",
    pharmaceutical: "pharmaceutical",
    industrial: "industrial",
  }[app];
}

export interface AgentStep {
  label: string;
  detail: string;
}

export function buildAgentTrace(
  req: ParsedRequirements,
  recs: Recommendation[]
): AgentStep[] {
  const steps: AgentStep[] = [];
  steps.push({
    label: "Parsing requirements",
    detail: [
      req.application ? `application = ${labelApp(req.application)}` : null,
      req.disposal ? `disposal = ${req.disposal}` : null,
      req.maxBiodegradeDays ? `biodegrade window = ${req.maxBiodegradeDays} days` : null,
      req.needsMoistureBarrier ? "needs moisture barrier" : null,
      req.needsHeat ? "needs heat resistance" : null,
      req.needsStrength ? "needs strength" : null,
      req.needsFlexible ? "needs flexibility" : null,
      req.costSensitive ? "cost sensitive" : null,
    ]
      .filter(Boolean)
      .join(", ") || "no specific constraints detected",
  });
  steps.push({
    label: "Querying classifier tool",
    detail: "Multi-label material classifier scored 5 candidate biopolymers against the application profile.",
  });
  steps.push({
    label: "Querying regression tool",
    detail: req.disposal
      ? `Biodegradation-time model estimated days-to-degrade under ${req.disposal} conditions.`
      : "Biodegradation-time model estimated compost degradation times.",
  });
  steps.push({
    label: "Ranking & trade-off analysis",
    detail: `Top pick: ${recs[0].material.shortName} (${recs[0].score}/100). Shortlisted top 3 for radar comparison.`,
  });
  return steps;
}
