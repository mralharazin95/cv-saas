// Cover Letter templates + a non-AI templated generator.
// The AI generation path is wired separately; generateCoverLetter() is the
// deterministic fallback that always produces a clean, professional letter.

export interface CoverTemplate {
  id: string;
  name: string;
  /** default accent (overridable by the live colour picker) */
  accent: string;
}

// 5 distinct letter "voices". They share the same A4 layout but differ in
// tone — the body copy of generateCoverLetter() adapts to the chosen tone.
export const COVER_TEMPLATES: CoverTemplate[] = [
  { id: "professional", name: "Professional", accent: "#4f46e5" },
  { id: "modern", name: "Modern", accent: "#0891b2" },
  { id: "executive", name: "Executive", accent: "#1e293b" },
  { id: "creative", name: "Creative", accent: "#e11d48" },
  { id: "friendly", name: "Friendly", accent: "#059669" },
];

export function getCoverTemplate(id: string | undefined): CoverTemplate {
  return COVER_TEMPLATES.find((t) => t.id === id) || COVER_TEMPLATES[0];
}

export interface GenerateCoverLetterInput {
  name: string;
  role: string;
  company: string;
  /** Free-text bullet points / qualifications — newline or comma separated. */
  highlights: string;
  /** Person the letter is addressed to. Optional. */
  hiringManager?: string;
  /** Tone preset, usually the template id. Optional. */
  tone?: string;
}

const TODAY = (): string =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Split a free-text highlights blob into clean, sentence-ish fragments.
function parseHighlights(raw: string): string[] {
  return (raw || "")
    .split(/\r?\n|•|·|;/g)
    .map((s) => s.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean);
}

function joinNaturally(items: string[]): string {
  const parts = items.map((s) => s.replace(/[.\s]+$/, ""));
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

/**
 * Produce a complete, professional cover letter as a single string with
 * blank-line-separated paragraphs. Safe with empty inputs (falls back to
 * neutral placeholders so the preview never looks broken).
 */
export function generateCoverLetter({
  name,
  role,
  company,
  highlights,
  hiringManager,
  tone,
}: GenerateCoverLetterInput): string {
  const safeName = (name || "").trim() || "Your Name";
  const safeRole = (role || "").trim() || "the open position";
  const safeCompany = (company || "").trim() || "your company";
  const greetingName = (hiringManager || "").trim();
  const greeting = greetingName ? `Dear ${greetingName},` : "Dear Hiring Manager,";

  const bullets = parseHighlights(highlights);
  const strengths = joinNaturally(bullets.slice(0, 3));

  const opener =
    tone === "friendly"
      ? `I was genuinely excited to come across the ${safeRole} opening at ${safeCompany}, and I would love the chance to contribute.`
      : tone === "creative"
        ? `When I saw the ${safeRole} role at ${safeCompany}, I knew it was exactly the kind of work I want to be doing — and exactly where I can make an impact.`
        : tone === "executive"
          ? `I am writing to express my strong interest in the ${safeRole} role at ${safeCompany}, where I believe my leadership experience can deliver meaningful results.`
          : `I am writing to apply for the ${safeRole} position at ${safeCompany}. With a track record of delivering results, I am confident I would be a valuable addition to your team.`;

  const body =
    strengths.length > 0
      ? `Throughout my career I have focused on ${strengths}. These experiences have prepared me to step into this role and contribute from day one.`
      : `Throughout my career I have built the skills and judgment needed to take on this role and contribute meaningfully from the start.`;

  const fit = `What draws me to ${safeCompany} is the opportunity to bring real value to the ${safeRole} role. I am confident that my background aligns closely with what you are looking for, and I am eager to bring that same energy and commitment to your team.`;

  const closing =
    tone === "friendly"
      ? `Thank you so much for considering my application. I would be thrilled to talk further about how I can help ${safeCompany} succeed.`
      : `Thank you for your time and consideration. I would welcome the opportunity to discuss how my background can support the goals of ${safeCompany}, and I look forward to hearing from you.`;

  return [
    TODAY(),
    greeting,
    opener,
    body,
    fit,
    closing,
    "Sincerely,",
    safeName,
  ].join("\n\n");
}
