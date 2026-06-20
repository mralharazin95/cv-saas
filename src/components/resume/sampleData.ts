// Sample resume used across landing previews and the builder template engine.
// Real, specific content — not placeholder bars — so previews read as a genuine product.

import type { ResumeData } from "@/types/resume";

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
  // Optional sections (rendered when present — used by the builder).
  projects?: { name: string; description: string; link?: string }[];
  languages?: { name: string; level: string }[];
  certificates?: { name: string; issuer: string; date?: string }[];
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

// ---- Builder integration: map the store's ResumeData onto the preview shape ----

function fmtPeriod(start?: string, end?: string, isCurrent?: boolean): string {
  const s = (start || "").trim();
  const e = isCurrent ? "Present" : (end || "").trim();
  if (s && e) return `${s} — ${e}`;
  return s || e || "";
}

export function resumeDataToContent(d: ResumeData): SampleResume {
  const p = d.personalInfo;
  const name = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Your Name";
  const initials =
    `${(p.firstName || "")[0] || ""}${(p.lastName || "")[0] || ""}`.toUpperCase() || "CV";
  return {
    name,
    title: d.experiences[0]?.jobTitle || "",
    initials,
    location: [p.city, p.country].filter(Boolean).join(", ") || p.address || "",
    email: p.email || "",
    phone: p.phone || "",
    site: p.websiteUrl || p.linkedinUrl || "",
    summary: p.summary || "",
    experience: d.experiences.map((e) => ({
      role: e.jobTitle || "",
      company: [e.company, e.location].filter(Boolean).join(" · "),
      period: fmtPeriod(e.startDate, e.endDate, e.isCurrent),
      bullets: (e.description || "")
        .split("\n")
        .map((b) => b.replace(/^[-•*\s]+/, "").trim())
        .filter(Boolean),
    })),
    skills: d.skills.map((s) => s.name).filter(Boolean),
    education: d.educations.map((e) => ({
      degree: e.degree || "",
      school: [e.school, e.location].filter(Boolean).join(", "),
      period: fmtPeriod(e.startDate, e.endDate, e.isCurrent),
    })),
    projects: d.projects.length
      ? d.projects.map((x) => ({ name: x.name, description: x.description, link: x.link }))
      : undefined,
    languages: d.languages.length
      ? d.languages.map((l) => ({ name: l.name, level: l.proficiency }))
      : undefined,
    certificates: d.certificates.length
      ? d.certificates.map((c) => ({ name: c.name, issuer: c.issuer, date: c.date }))
      : undefined,
  };
}

// Older saved resumes used template ids modern/professional/minimal/academic/creative.
const TEMPLATE_ALIASES: Record<string, string> = {
  professional: "corporate",
  academic: "premium",
};

export function resolveTemplateId(id: string | undefined): string {
  if (id && TEMPLATES.some((t) => t.id === id)) return id;
  const aliased = id ? TEMPLATE_ALIASES[id] : undefined;
  if (aliased && TEMPLATES.some((t) => t.id === aliased)) return aliased;
  return "executive";
}

export function getTemplate(id: string | undefined): TemplateDef {
  const resolved = resolveTemplateId(id);
  return TEMPLATES.find((t) => t.id === resolved) || TEMPLATES[0];
}
