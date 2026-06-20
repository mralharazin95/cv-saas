// Export & sharing utilities for ResumeX.
// - downloadJSON: serialise the full ResumeData and trigger a browser download.
// - buildShareUrl: public link for a published resume slug.
// - docxBlob: lazily build a clean Word document from the resume (the heavy
//   'docx' package is only loaded when the user actually exports to DOCX).
//
// These run in the browser (Blob / anchor / location), so call them from
// client components / event handlers only.

import type { ResumeData } from "@/types/resume";

/** Slugify the resume title into a safe download filename stem. */
function safeFileStem(resume: ResumeData, fallback: string): string {
  const base =
    (resume.title || "").trim() ||
    `${resume.personalInfo?.firstName || ""} ${resume.personalInfo?.lastName || ""}`.trim() ||
    fallback;
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

/** Trigger a client-side download of a Blob under the given filename. */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the download has a chance to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download the full resume as a pretty-printed .json file.
 * Useful as a portable backup / re-import format.
 */
export function downloadJSON(resume: ResumeData, filename?: string): void {
  const name = filename || `${safeFileStem(resume, "resume")}.json`;
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  triggerDownload(blob, name.endsWith(".json") ? name : `${name}.json`);
}

/**
 * Build the public share URL for a published resume.
 * Public resumes are served from the (locale-less) /p/<slug> route, so we just
 * append to the current origin. Falls back to a relative path during SSR.
 */
export function buildShareUrl(slug: string): string {
  const path = `/p/${slug}`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return path;
}

/** Strip leading bullet glyphs / whitespace from a description line. */
function cleanLine(line: string): string {
  return line.replace(/^[-•*•\s]+/, "").trim();
}

/** Split a free-text description into individual bullet lines. */
function toBullets(description: string): string[] {
  return (description || "")
    .split("\n")
    .map(cleanLine)
    .filter(Boolean);
}

/** Format a start/end range, honouring an "is current" flag. */
function formatRange(start?: string, end?: string, isCurrent?: boolean): string {
  const s = (start || "").trim();
  const e = isCurrent ? "Present" : (end || "").trim();
  if (s && e) return `${s} — ${e}`;
  return s || e || "";
}

/**
 * Build a clean Word (.docx) document from the resume and return it as a Blob.
 *
 * The 'docx' package is imported lazily so it never lands in the main bundle.
 * If the package is not installed, this rejects with a descriptive Error that
 * the UI can catch and surface as a toast.
 */
export async function docxBlob(resume: ResumeData): Promise<Blob> {
  let docx: typeof import("docx");
  try {
    docx = await import("docx");
  } catch {
    throw new Error(
      "DOCX export is unavailable — the 'docx' package is not installed."
    );
  }

  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
  } = docx;

  const p = resume.personalInfo || ({} as ResumeData["personalInfo"]);
  const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Your Name";
  const title = resume.experiences?.[0]?.jobTitle || "";

  const contactParts = [
    p.email,
    p.phone,
    [p.city, p.country].filter(Boolean).join(", "),
    p.websiteUrl,
    p.linkedinUrl,
  ].filter(Boolean) as string[];

  const children: InstanceType<typeof Paragraph>[] = [];

  // --- Header: name + (optional) headline ---
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: fullName, bold: true })],
    })
  );
  if (title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: title, italics: true, color: "555555" })],
      })
    );
  }
  if (contactParts.length) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: contactParts.join("  •  "), color: "666666", size: 18 }),
        ],
      })
    );
  }

  const sectionHeading = (text: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      children: [new TextRun({ text: text.toUpperCase(), bold: true })],
      border: {
        bottom: { color: "999999", size: 6, space: 1, style: BorderStyle.SINGLE },
      },
    });

  // --- Summary ---
  if (p.summary && p.summary.trim()) {
    children.push(sectionHeading("Summary"));
    children.push(new Paragraph({ children: [new TextRun({ text: p.summary.trim() })] }));
  }

  // --- Experience ---
  if (resume.experiences?.length) {
    children.push(sectionHeading("Experience"));
    for (const exp of resume.experiences) {
      const company = [exp.company, exp.location].filter(Boolean).join(" · ");
      const range = formatRange(exp.startDate, exp.endDate, exp.isCurrent);
      const headerRuns = [new TextRun({ text: exp.jobTitle || "", bold: true })];
      if (company) headerRuns.push(new TextRun({ text: `  —  ${company}` }));
      children.push(new Paragraph({ spacing: { before: 120 }, children: headerRuns }));
      if (range) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: range, italics: true, color: "777777", size: 18 })],
          })
        );
      }
      for (const bullet of toBullets(exp.description)) {
        children.push(
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: bullet })] })
        );
      }
    }
  }

  // --- Education ---
  if (resume.educations?.length) {
    children.push(sectionHeading("Education"));
    for (const edu of resume.educations) {
      const school = [edu.school, edu.location].filter(Boolean).join(", ");
      const range = formatRange(edu.startDate, edu.endDate, edu.isCurrent);
      const headerRuns = [new TextRun({ text: edu.degree || "", bold: true })];
      if (school) headerRuns.push(new TextRun({ text: `  —  ${school}` }));
      children.push(new Paragraph({ spacing: { before: 120 }, children: headerRuns }));
      if (range) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: range, italics: true, color: "777777", size: 18 })],
          })
        );
      }
      for (const bullet of toBullets(edu.description)) {
        children.push(
          new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: bullet })] })
        );
      }
    }
  }

  // --- Skills ---
  const skillNames = (resume.skills || []).map((s) => s.name).filter(Boolean);
  if (skillNames.length) {
    children.push(sectionHeading("Skills"));
    children.push(
      new Paragraph({ children: [new TextRun({ text: skillNames.join("  •  ") })] })
    );
  }

  const doc = new Document({
    creator: "ResumeX",
    title: resume.title || fullName,
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  // Packer.toBlob is the browser-friendly output.
  return Packer.toBlob(doc);
}

/** Convenience: build the DOCX and immediately download it. */
export async function downloadDOCX(resume: ResumeData, filename?: string): Promise<void> {
  const blob = await docxBlob(resume);
  const name = filename || `${safeFileStem(resume, "resume")}.docx`;
  triggerDownload(blob, name.endsWith(".docx") ? name : `${name}.docx`);
}
