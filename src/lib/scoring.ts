// Pure resume-scoring heuristics. No React, no DOM — safe to call anywhere
// (client component live-rescoring, server route, tests). Every function is
// defensive against empty / partial ResumeData.

import type { ResumeData } from "@/types/resume";

export type Severity = "good" | "warn" | "bad";

export interface Suggestion {
  label: string;
  severity: Severity;
}

export interface ScoreResult {
  overall: number;
  ats: number;
  readability: number;
  skills: number;
  experience: number;
  keywords: number;
  suggestions: Suggestion[];
}

// ---- small utilities -------------------------------------------------------

const clamp = (n: number, lo = 0, hi = 100): number =>
  Math.max(lo, Math.min(hi, Math.round(n)));

// Common, high-signal résumé action verbs. Lowercased for matching.
const ACTION_VERBS = [
  "led",
  "built",
  "shipped",
  "improved",
  "designed",
  "launched",
  "created",
  "developed",
  "managed",
  "drove",
  "delivered",
  "increased",
  "reduced",
  "grew",
  "owned",
  "architected",
  "spearheaded",
  "scaled",
  "optimized",
  "implemented",
  "automated",
  "founded",
  "established",
  "directed",
  "mentored",
  "negotiated",
  "streamlined",
  "engineered",
  "redesigned",
  "boosted",
];

// Words too generic to count as keyword overlap.
const STOPWORDS = new Set([
  "the","a","an","and","or","but","to","of","in","on","for","with","at","by",
  "from","as","is","are","was","were","be","been","being","this","that","these",
  "those","it","its","we","you","your","our","their","will","shall","can","may",
  "must","should","would","could","has","have","had","do","does","did","not","no",
  "than","then","so","such","into","over","under","about","across","per","via",
  "you'll","we're","ll","re","ve","etc","using","use","used","work","working",
  "role","team","teams","strong","ability","including","plus","years","year",
]);

const splitBullets = (description: string): string[] =>
  (description || "")
    .split("\n")
    .map((b) => b.replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);

const wordCount = (s: string): number =>
  (s || "").trim().split(/\s+/).filter(Boolean).length;

const hasQuantifiedImpact = (s: string): boolean =>
  /\d/.test(s) || /%/.test(s) || /\$/.test(s) || /\+/.test(s);

const tokenize = (text: string): string[] =>
  (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^\.+|\.+$/g, ""))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

// Gather all resume free-text into one blob (for keyword matching).
function resumeText(resume: ResumeData): string {
  const p = resume.personalInfo;
  const parts: string[] = [
    p?.summary || "",
    ...resume.experiences.flatMap((e) => [e.jobTitle, e.company, e.description]),
    ...resume.educations.flatMap((e) => [e.degree, e.school, e.description]),
    ...resume.skills.map((s) => s.name),
    ...resume.projects.flatMap((x) => [x.name, x.description]),
    ...resume.certificates.map((c) => c.name),
    ...resume.languages.map((l) => l.name),
  ];
  return parts.filter(Boolean).join(" ");
}

// How many of the major sections actually carry content.
function filledSections(resume: ResumeData): number {
  let n = 0;
  if ((resume.personalInfo?.summary || "").trim()) n++;
  if (resume.experiences.some((e) => e.jobTitle || e.company || e.description)) n++;
  if (resume.educations.some((e) => e.degree || e.school)) n++;
  if (resume.skills.some((s) => s.name)) n++;
  if (resume.projects.some((x) => x.name)) n++;
  if (resume.languages.some((l) => l.name)) n++;
  if (resume.certificates.some((c) => c.name)) n++;
  return n;
}

// ---- per-metric scorers ----------------------------------------------------

function scoreAts(resume: ResumeData): number {
  const p = resume.personalInfo || ({} as ResumeData["personalInfo"]);
  let score = 0;
  if ((p.email || "").trim()) score += 22;
  if ((p.phone || "").trim()) score += 18;
  if ((p.summary || "").trim()) score += 18;
  // At least two substantive sections.
  if (filledSections(resume) >= 2) score += 22;
  // ATS parsers struggle with photo-driven / graphic layouts — reward not relying on one.
  if (!(p.photoUrl || "").trim()) score += 10;
  else score += 2;
  // A real job title + company pair parses cleanly into work history.
  if (resume.experiences.some((e) => (e.jobTitle || "").trim() && (e.company || "").trim()))
    score += 10;
  return clamp(score);
}

function scoreReadability(resume: ResumeData): number {
  const roles = resume.experiences.filter(
    (e) => e.jobTitle || e.company || e.description,
  );
  if (roles.length === 0) return 0;

  let bulletScoreSum = 0;
  let verbHits = 0;
  let bulletTotal = 0;

  for (const role of roles) {
    const bullets = splitBullets(role.description);
    bulletTotal += bullets.length;

    // Ideal 2-4 bullets per role.
    let roleScore: number;
    if (bullets.length === 0) roleScore = 10;
    else if (bullets.length >= 2 && bullets.length <= 4) roleScore = 100;
    else if (bullets.length === 1) roleScore = 55;
    else roleScore = 70; // 5+ — slightly verbose
    bulletScoreSum += roleScore;

    for (const b of bullets) {
      const first = b.toLowerCase().split(/\s+/)[0] || "";
      if (ACTION_VERBS.includes(first.replace(/[^a-z]/g, ""))) verbHits++;
      const wc = wordCount(b);
      // Reward bullets in the 6-25 word sweet spot.
      if (wc >= 6 && wc <= 25) bulletScoreSum += 0; // handled via length component below
    }
  }

  const bulletStructure = bulletScoreSum / roles.length; // 0-100

  // Action-verb coverage across all bullets.
  const verbRatio = bulletTotal > 0 ? verbHits / bulletTotal : 0;
  const verbScore = clamp(verbRatio * 100);

  // Length discipline across all bullets.
  const allBullets = roles.flatMap((r) => splitBullets(r.description));
  const goodLen = allBullets.filter((b) => {
    const wc = wordCount(b);
    return wc >= 6 && wc <= 25;
  }).length;
  const lenScore = allBullets.length > 0 ? clamp((goodLen / allBullets.length) * 100) : 40;

  // Weighted blend.
  return clamp(bulletStructure * 0.45 + verbScore * 0.3 + lenScore * 0.25);
}

function scoreSkills(resume: ResumeData): number {
  const names = resume.skills.map((s) => (s.name || "").trim()).filter(Boolean);
  const count = names.length;
  if (count === 0) return 0;

  // Count component: 8-12 skills ~ ideal. Cap so dumping 40 skills isn't "better".
  const countScore = clamp((Math.min(count, 12) / 12) * 100);

  // Spread / uniqueness — penalise duplicate or near-empty entries.
  const unique = new Set(names.map((n) => n.toLowerCase())).size;
  const spread = count > 0 ? unique / count : 0;
  const spreadScore = clamp(spread * 100);

  // Levels add depth (only if the user bothered to set them).
  const leveled = resume.skills.filter((s) => (s.level || "").trim()).length;
  const levelScore = count > 0 ? clamp((leveled / count) * 100) : 0;

  return clamp(countScore * 0.6 + spreadScore * 0.25 + levelScore * 0.15);
}

function scoreExperience(resume: ResumeData): number {
  const roles = resume.experiences.filter(
    (e) => (e.jobTitle || "").trim() || (e.company || "").trim(),
  );
  if (roles.length === 0) return 0;

  // 2-4 roles reads as a solid track record.
  const countScore =
    roles.length >= 3 ? 100 : roles.length === 2 ? 80 : 50;

  // Quantified impact — the single strongest signal of a senior résumé.
  const rolesWithImpact = roles.filter((r) =>
    splitBullets(r.description).some(hasQuantifiedImpact),
  ).length;
  const impactScore = clamp((rolesWithImpact / roles.length) * 100);

  // Roles that actually describe what was done.
  const described = roles.filter((r) => splitBullets(r.description).length > 0).length;
  const describedScore = clamp((described / roles.length) * 100);

  return clamp(countScore * 0.35 + impactScore * 0.45 + describedScore * 0.2);
}

function scoreKeywords(resume: ResumeData, jobDescription?: string): number {
  const jd = (jobDescription || "").trim();
  const skillNames = resume.skills.map((s) => (s.name || "").trim()).filter(Boolean);

  if (!jd) {
    // No JD: proxy on skills coverage + whether skills also appear in the body text.
    if (skillNames.length === 0) return 0;
    const body = tokenize(resumeText(resume));
    const bodySet = new Set(body);
    const reinforced = skillNames.filter((s) =>
      tokenize(s).some((t) => bodySet.has(t)),
    ).length;
    const coverage = clamp((Math.min(skillNames.length, 10) / 10) * 100);
    const reinforce = skillNames.length
      ? clamp((reinforced / skillNames.length) * 100)
      : 0;
    return clamp(coverage * 0.7 + reinforce * 0.3);
  }

  // JD provided: overlap of meaningful JD terms with the resume body.
  const jdTerms = Array.from(new Set(tokenize(jd)));
  if (jdTerms.length === 0) return 50;
  const resumeSet = new Set(tokenize(resumeText(resume)));
  const matched = jdTerms.filter((t) => resumeSet.has(t)).length;
  const ratio = matched / jdTerms.length;
  // Matching ~40%+ of distinct JD keywords is excellent in practice; scale up.
  return clamp((ratio / 0.4) * 100);
}

// ---- suggestions -----------------------------------------------------------

function buildSuggestions(
  resume: ResumeData,
  scores: Omit<ScoreResult, "suggestions">,
  jobDescription?: string,
): Suggestion[] {
  const out: Suggestion[] = [];
  const p = resume.personalInfo || ({} as ResumeData["personalInfo"]);

  // Contact essentials.
  if (!(p.email || "").trim())
    out.push({ label: "Add an email address so recruiters can reach you", severity: "bad" });
  if (!(p.phone || "").trim())
    out.push({ label: "Add a phone number to your contact details", severity: "warn" });

  // Summary.
  if (!(p.summary || "").trim())
    out.push({ label: "Add a professional summary at the top of your resume", severity: "bad" });
  else if (wordCount(p.summary) < 12)
    out.push({ label: "Expand your summary to 2-3 sentences highlighting your impact", severity: "warn" });

  // Experience depth + quantified impact (name the specific role).
  const roles = resume.experiences.filter(
    (e) => (e.jobTitle || "").trim() || (e.company || "").trim(),
  );
  if (roles.length === 0) {
    out.push({ label: "Add your work experience — at least one role", severity: "bad" });
  } else {
    const weakest = roles.find(
      (r) => !splitBullets(r.description).some(hasQuantifiedImpact),
    );
    if (weakest) {
      const where =
        (weakest.company || "").trim() ||
        (weakest.jobTitle || "").trim() ||
        "your latest";
      out.push({
        label: `Add measurable impact (numbers, %, $) to your ${where} role`,
        severity: "warn",
      });
    }
    const noBullets = roles.find((r) => splitBullets(r.description).length === 0);
    if (noBullets) {
      const where =
        (noBullets.company || "").trim() ||
        (noBullets.jobTitle || "").trim() ||
        "a";
      out.push({
        label: `Describe what you did at ${where} with 2-3 bullet points`,
        severity: "warn",
      });
    }
    if (roles.length === 1)
      out.push({ label: "List more roles if you have them — depth builds credibility", severity: "warn" });
  }

  // Action verbs.
  const allBullets = roles.flatMap((r) => splitBullets(r.description));
  if (allBullets.length > 0) {
    const verbStarts = allBullets.filter((b) => {
      const first = (b.toLowerCase().split(/\s+/)[0] || "").replace(/[^a-z]/g, "");
      return ACTION_VERBS.includes(first);
    }).length;
    if (verbStarts / allBullets.length < 0.5)
      out.push({ label: "Start bullets with strong action verbs (Led, Built, Shipped, Improved)", severity: "warn" });
  }

  // Skills.
  const skillCount = resume.skills.filter((s) => (s.name || "").trim()).length;
  if (skillCount === 0)
    out.push({ label: "Add a skills section with your key tools and strengths", severity: "bad" });
  else if (skillCount < 5)
    out.push({ label: "Add a few more relevant skills (aim for 8-12)", severity: "warn" });

  // Education.
  if (!resume.educations.some((e) => (e.degree || "").trim() || (e.school || "").trim()))
    out.push({ label: "Add your education or relevant qualifications", severity: "warn" });

  // Photo / ATS.
  if ((p.photoUrl || "").trim())
    out.push({ label: "Many ATS can't parse photos — consider a text-only version for applications", severity: "warn" });

  // Keyword tailoring.
  if ((jobDescription || "").trim()) {
    if (scores.keywords < 60)
      out.push({ label: "Tailor your resume — weave more keywords from the job description into your experience", severity: "warn" });
    else
      out.push({ label: "Good keyword match against the job description", severity: "good" });
  } else {
    out.push({ label: "Paste a job description below to check keyword match", severity: "good" });
  }

  // Positive reinforcement when things look strong.
  if (scores.overall >= 80)
    out.push({ label: "Strong resume — well structured and impact-driven", severity: "good" });
  if (roles.some((r) => splitBullets(r.description).some(hasQuantifiedImpact)))
    out.push({ label: "Nice — you've quantified your impact with real numbers", severity: "good" });

  return out;
}

// ---- public API ------------------------------------------------------------

export function computeScores(
  resume: ResumeData,
  jobDescription?: string,
): ScoreResult {
  // Guard against a malformed object: normalise array fields.
  const safe: ResumeData = {
    ...resume,
    personalInfo: resume.personalInfo || ({} as ResumeData["personalInfo"]),
    experiences: resume.experiences || [],
    educations: resume.educations || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    languages: resume.languages || [],
    certificates: resume.certificates || [],
    references: resume.references || [],
  };

  const ats = scoreAts(safe);
  const readability = scoreReadability(safe);
  const skills = scoreSkills(safe);
  const experience = scoreExperience(safe);
  const keywords = scoreKeywords(safe, jobDescription);

  // Weighted overall. Experience + ATS carry the most weight for real-world hiring.
  const overall = clamp(
    ats * 0.24 +
      experience * 0.26 +
      readability * 0.2 +
      skills * 0.15 +
      keywords * 0.15,
  );

  const partial = { overall, ats, readability, skills, experience, keywords };
  const suggestions = buildSuggestions(safe, partial, jobDescription);

  return { ...partial, suggestions };
}

// Band helper shared with the UI so colours stay consistent.
export function scoreBand(score: number): Severity {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}
