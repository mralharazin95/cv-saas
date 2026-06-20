// Ready-made resume examples (à la Kickresume) — real, complete content the
// user can preview and one-click clone into an editable resume.

import { ResumeData, DEFAULT_SECTION_ORDER } from "@/types/resume";

export interface ResumeExample {
  id: string;
  name: string;
  role: string;
  category: string;
  data: ResumeData;
}

interface ExpInput { jobTitle: string; company: string; period: [string, string]; current?: boolean; bullets: string[] }
interface EduInput { degree: string; school: string; period: [string, string] }

function make(p: {
  id: string;
  name: string;
  role: string;
  category: string;
  templateId: string;
  colorHex: string;
  city?: string;
  summary: string;
  experiences: ExpInput[];
  educations: EduInput[];
  skills: string[];
}): ResumeExample {
  const [first, ...rest] = p.name.split(" ");
  return {
    id: p.id,
    name: p.name,
    role: p.role,
    category: p.category,
    data: {
      title: `${p.name} — ${p.role}`,
      templateId: p.templateId,
      colorHex: p.colorHex,
      fontFamily: "Inter, sans-serif",
      personalInfo: {
        firstName: first,
        lastName: rest.join(" "),
        email: `${first.toLowerCase()}.${(rest[0] || "cv").toLowerCase()}@email.com`,
        phone: "+1 (415) 555-0142",
        address: "",
        city: p.city || "San Francisco",
        country: "USA",
        nationality: "",
        summary: p.summary,
        linkedinUrl: `linkedin.com/in/${first.toLowerCase()}${(rest[0] || "").toLowerCase()}`,
      },
      experiences: p.experiences.map((e, i) => ({
        id: `${p.id}-e${i}`,
        jobTitle: e.jobTitle,
        company: e.company,
        location: "",
        startDate: e.period[0],
        endDate: e.period[1],
        isCurrent: !!e.current,
        description: e.bullets.map((b) => `• ${b}`).join("\n"),
      })),
      educations: p.educations.map((e, i) => ({
        id: `${p.id}-ed${i}`,
        degree: e.degree,
        school: e.school,
        location: "",
        startDate: e.period[0],
        endDate: e.period[1],
        isCurrent: false,
        description: "",
      })),
      skills: p.skills.map((s, i) => ({ id: `${p.id}-s${i}`, name: s, level: "Advanced" })),
      projects: [],
      languages: [],
      certificates: [],
      references: [],
      sectionOrder: [...DEFAULT_SECTION_ORDER],
    },
  };
}

export const EXAMPLES: ResumeExample[] = [
  make({
    id: "software-engineer",
    name: "Alex Morgan",
    role: "Senior Software Engineer",
    category: "Technology",
    templateId: "engineer",
    colorHex: "#059669",
    summary: "Backend-leaning full-stack engineer with 9 years building reliable, high-scale services. I care about clean APIs, observability, and shipping.",
    experiences: [
      { jobTitle: "Senior Software Engineer", company: "Datadog", period: ["2021", "Present"], current: true, bullets: ["Led migration to event-driven ingestion, cutting p99 latency 42%.", "Owned a service handling 3M req/min with 99.99% uptime."] },
      { jobTitle: "Software Engineer", company: "Shopify", period: ["2017", "2021"], bullets: ["Built the checkout rate-limiter protecting Black Friday traffic.", "Mentored 4 engineers; ran the on-call rotation."] },
    ],
    educations: [{ degree: "B.Sc. Computer Science", school: "University of Waterloo", period: ["2013", "2017"] }],
    skills: ["Go", "TypeScript", "PostgreSQL", "Kubernetes", "AWS", "Distributed Systems"],
  }),
  make({
    id: "product-designer",
    name: "Sarah Chen",
    role: "Senior Product Designer",
    category: "Design",
    templateId: "executive",
    colorHex: "#4f46e5",
    summary: "Product designer with 8+ years shaping intuitive, accessible experiences for millions of users across fintech and consumer apps.",
    experiences: [
      { jobTitle: "Senior Product Designer", company: "Stripe", period: ["2021", "Present"], current: true, bullets: ["Led the checkout redesign, lifting conversion 18% across 40+ markets.", "Built the design system now used by 60 engineers."] },
      { jobTitle: "Product Designer", company: "Airbnb", period: ["2018", "2021"], bullets: ["Shipped a host onboarding flow that improved activation 25%."] },
    ],
    educations: [{ degree: "B.F.A. Graphic Design", school: "Rhode Island School of Design", period: ["2012", "2016"] }],
    skills: ["Product Strategy", "Design Systems", "Prototyping", "User Research", "Figma", "Accessibility"],
  }),
  make({
    id: "marketing-manager",
    name: "Maya Patel",
    role: "Marketing Manager",
    category: "Marketing",
    templateId: "marketing",
    colorHex: "#e11d48",
    summary: "Growth-focused marketer who turns data into demand. 7 years across B2B SaaS lifecycle, brand, and performance marketing.",
    experiences: [
      { jobTitle: "Marketing Manager", company: "Notion", period: ["2020", "Present"], current: true, bullets: ["Scaled the lifecycle program to 2M users, +31% activation.", "Ran ABM campaigns sourcing $4.2M in pipeline."] },
      { jobTitle: "Growth Marketer", company: "Webflow", period: ["2017", "2020"], bullets: ["Grew organic traffic 3x with an SEO + content engine."] },
    ],
    educations: [{ degree: "B.A. Communications", school: "NYU", period: ["2013", "2017"] }],
    skills: ["Demand Gen", "SEO", "Lifecycle Marketing", "HubSpot", "Analytics", "Copywriting"],
  }),
  make({
    id: "data-analyst",
    name: "David Kim",
    role: "Data Analyst",
    category: "Data",
    templateId: "data",
    colorHex: "#0284c7",
    summary: "Analytical problem-solver translating messy data into decisions. SQL-first analyst with a strong product and experimentation background.",
    experiences: [
      { jobTitle: "Data Analyst", company: "DoorDash", period: ["2020", "Present"], current: true, bullets: ["Built the experimentation dashboard used by 120+ PMs.", "Designed the courier-supply model that cut wait times 12%."] },
      { jobTitle: "Business Analyst", company: "Deloitte", period: ["2018", "2020"], bullets: ["Delivered analytics for 6 enterprise clients."] },
    ],
    educations: [{ degree: "B.Sc. Statistics", school: "UCLA", period: ["2014", "2018"] }],
    skills: ["SQL", "Python", "dbt", "Tableau", "A/B Testing", "Forecasting"],
  }),
  make({
    id: "sales-executive",
    name: "James Carter",
    role: "Sales Executive",
    category: "Sales",
    templateId: "sales",
    colorHex: "#dc2626",
    summary: "Quota-crushing enterprise AE with 10 years closing complex SaaS deals. President's Club three years running.",
    experiences: [
      { jobTitle: "Enterprise Account Executive", company: "Salesforce", period: ["2019", "Present"], current: true, bullets: ["Closed $8.4M ARR in FY24 — 142% of quota.", "Landed 3 of the region's top-10 logos."] },
      { jobTitle: "Account Executive", company: "Oracle", period: ["2014", "2019"], bullets: ["Grew territory revenue 60% over three years."] },
    ],
    educations: [{ degree: "B.B.A. Marketing", school: "University of Texas", period: ["2010", "2014"] }],
    skills: ["Enterprise Sales", "Negotiation", "Pipeline Management", "Salesforce", "Forecasting", "MEDDIC"],
  }),
  make({
    id: "financial-consultant",
    name: "Olivia Brooks",
    role: "Financial Consultant",
    category: "Finance",
    templateId: "finance",
    colorHex: "#1e40af",
    summary: "CFA charterholder advising clients on portfolio strategy and risk. 11 years across wealth management and corporate finance.",
    experiences: [
      { jobTitle: "Senior Financial Consultant", company: "Morgan Stanley", period: ["2018", "Present"], current: true, bullets: ["Manage a $240M book across 80 client households.", "Delivered 9.2% avg. annual returns, beating benchmark."] },
      { jobTitle: "Financial Analyst", company: "Goldman Sachs", period: ["2013", "2018"], bullets: ["Modeled valuations for $1B+ M&A transactions."] },
    ],
    educations: [{ degree: "B.Sc. Finance", school: "Wharton, UPenn", period: ["2009", "2013"] }],
    skills: ["Portfolio Strategy", "Financial Modeling", "Risk Management", "Valuation", "CFA", "Excel"],
  }),
  make({
    id: "product-manager",
    name: "Daniel Reed",
    role: "Product Manager",
    category: "Product",
    templateId: "product",
    colorHex: "#2563eb",
    summary: "Outcome-driven PM who ships. 8 years taking 0→1 and 1→N products in marketplaces and developer tools.",
    experiences: [
      { jobTitle: "Senior Product Manager", company: "GitHub", period: ["2020", "Present"], current: true, bullets: ["Launched Codespaces to GA — 1M+ monthly developers.", "Drove a roadmap that grew activation 28%."] },
      { jobTitle: "Product Manager", company: "Atlassian", period: ["2016", "2020"], bullets: ["Owned Jira automation, adopted by 40% of teams."] },
    ],
    educations: [{ degree: "B.Sc. Engineering", school: "Georgia Tech", period: ["2012", "2016"] }],
    skills: ["Product Strategy", "Roadmapping", "Discovery", "Analytics", "Stakeholder Mgmt", "A/B Testing"],
  }),
  make({
    id: "healthcare",
    name: "Emily Nguyen",
    role: "Registered Nurse",
    category: "Healthcare",
    templateId: "healthcare",
    colorHex: "#0d9488",
    summary: "Compassionate RN with 7 years in acute and critical care. BLS/ACLS certified, known for calm under pressure and patient advocacy.",
    experiences: [
      { jobTitle: "ICU Registered Nurse", company: "UCSF Medical Center", period: ["2019", "Present"], current: true, bullets: ["Lead nurse for a 12-bed ICU; precept new graduates.", "Cut central-line infections 30% via a new protocol."] },
      { jobTitle: "Medical-Surgical Nurse", company: "Kaiser Permanente", period: ["2016", "2019"], bullets: ["Managed care for up to 6 patients per shift."] },
    ],
    educations: [{ degree: "B.S. Nursing (BSN)", school: "University of San Francisco", period: ["2012", "2016"] }],
    skills: ["Critical Care", "Patient Assessment", "ACLS / BLS", "EHR (Epic)", "Triage", "Patient Education"],
  }),
];

export const EXAMPLE_CATEGORIES = ["All", ...Array.from(new Set(EXAMPLES.map((e) => e.category)))];

export function getExample(id: string): ResumeExample | undefined {
  return EXAMPLES.find((e) => e.id === id);
}
