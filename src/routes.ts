export type Route =
  | "home"
  | "advisor"
  | "materials"
  | "about"
  | "radar"
  | "api-docs"
  | "pricing"
  | "research"
  | "dataset"
  | "model"
  | "cases"
  | "faq"
  | "contact"
  | "privacy"
  | "terms"
  | "license";

export const ROUTE_META: Record<Route, { label: string; icon: string; description: string }> = {
  home: { label: "Home", icon: "🏠", description: "Overview of BioDapt" },
  advisor: { label: "AI Advisor", icon: "", description: "Chat with the advisor" },
  materials: { label: "Materials DB", icon: "🧪", description: "Browse all biopolymers" },
  about: { label: "About Project", icon: "📋", description: "Project scope & timeline" },
  radar: { label: "Radar Comparator", icon: "📊", description: "Compare materials visually" },
  "api-docs": { label: "API Docs", icon: "️", description: "Developer documentation" },
  pricing: { label: "Pricing", icon: "💳", description: "Plans for MSMEs" },
  research: { label: "Research Paper", icon: "", description: "Technical whitepaper" },
  dataset: { label: "Dataset Details", icon: "🗂️", description: "MatWeb-derived dataset" },
  model: { label: "Model Architecture", icon: "🧠", description: "Classifier & regression models" },
  cases: { label: "Case Studies", icon: "📚", description: "Real manufacturer stories" },
  faq: { label: "FAQ", icon: "❓", description: "Common questions" },
  contact: { label: "Contact Team", icon: "✉️", description: "Reach the team" },
  privacy: { label: "Privacy Policy", icon: "🔒", description: "Data privacy practices" },
  terms: { label: "Terms of Use", icon: "📜", description: "Usage terms" },
  license: { label: "License (MIT)", icon: "📝", description: "Open-source license" },
};
