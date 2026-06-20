// Sample resume used across landing previews and (later) the template engine.
// Real, specific content — not placeholder bars — so previews read as a genuine product.

export interface SampleResume {
  name: string;
  title: string;
  initials: string;
  location: string;
  email: string;
  phone: string;
  site: string;
  summary: string;
  experience: { role: string; company: string; period: string; bullets: string[] }[];
  skills: string[];
  education: { degree: string; school: string; period: string }[];
}

export const SAMPLE: SampleResume = {
  name: "Sarah Chen",
  title: "Senior Product Designer",
  initials: "SC",
  location: "San Francisco, CA",
  email: "sarah.chen@email.com",
  phone: "+1 (415) 555-0188",
  site: "sarahchen.design",
  summary:
    "Product designer with 8+ years shaping intuitive, accessible experiences for millions of users across fintech and consumer apps.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "Stripe",
      period: "2021 — Present",
      bullets: [
        "Led the checkout redesign, lifting conversion by 18% across 40+ markets.",
        "Built the design system now used by 60 engineers and 12 designers.",
      ],
    },
    {
      role: "Product Designer",
      company: "Airbnb",
      period: "2018 — 2021",
      bullets: [
        "Shipped a new host onboarding flow that improved activation by 25%.",
      ],
    },
    {
      role: "UX Designer",
      company: "Spotify",
      period: "2016 — 2018",
      bullets: ["Designed playlist discovery features for 30M+ listeners."],
    },
  ],
  skills: [
    "Product Strategy",
    "Design Systems",
    "Prototyping",
    "User Research",
    "Figma",
    "Accessibility",
  ],
  education: [
    { degree: "B.F.A. Graphic Design", school: "Rhode Island School of Design", period: "2012 — 2016" },
  ],
};

export type TemplateLayout = "header" | "sidebar" | "single" | "creative" | "tech";

export interface TemplateDef {
  id: string;
  name: string;
  category: string;
  layout: TemplateLayout;
  accent: string;
  /** typographic personality */
  font?: "sans" | "serif" | "mono";
  /** restrained accent usage (minimal templates) */
  minimal?: boolean;
}

// 8 launch templates (the first slice of the eventual 20), each a genuinely
// distinct layout/personality — same content, different design.
export const TEMPLATES: TemplateDef[] = [
  { id: "executive", name: "Executive Elite", category: "Executive", layout: "header", accent: "#4f46e5", font: "sans" },
  { id: "modern", name: "Modern Professional", category: "Professional", layout: "sidebar", accent: "#0891b2", font: "sans" },
  { id: "ats", name: "ATS Pro", category: "ATS", layout: "single", accent: "#0f172a", font: "sans" },
  { id: "creative", name: "Creative Portfolio", category: "Creative", layout: "creative", accent: "#db2777", font: "sans" },
  { id: "tech", name: "Tech Innovator", category: "Tech", layout: "tech", accent: "#7c3aed", font: "mono" },
  { id: "corporate", name: "Corporate Premium", category: "Corporate", layout: "sidebar", accent: "#0e7490", font: "serif" },
  { id: "minimal", name: "Minimal Black", category: "Minimal", layout: "single", accent: "#1f2937", font: "sans", minimal: true },
  { id: "premium", name: "Premium Gold", category: "Premium", layout: "header", accent: "#b8860b", font: "serif" },
];

// Accent palette offered in the live colour switcher.
export const ACCENTS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Aqua", value: "#0891b2" },
  { name: "Emerald", value: "#059669" },
  { name: "Rose", value: "#e11d48" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Amber", value: "#d97706" },
  { name: "Slate", value: "#334155" },
  { name: "Gold", value: "#b8860b" },
];
