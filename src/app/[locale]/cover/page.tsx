"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { CoverLetterBuilder } from "@/components/cover/CoverLetterBuilder";
import { runAI } from "@/lib/ai/client";

export default function CoverLetterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Client pages still receive params as a Promise in Next 16 — unwrap with use().
  const { locale } = use(params);

  const handleAIGenerate = async (input: {
    name: string;
    role: string;
    company: string;
    highlights: string;
    hiringManager: string;
    tone: string;
  }) => {
    const prompt =
      `Write a professional cover letter body for ${input.name || "the applicant"} applying for the ` +
      `${input.role || "role"} position at ${input.company || "the company"}.` +
      (input.hiringManager ? ` Address it to ${input.hiringManager}.` : "") +
      ` Tone: ${input.tone || "professional"}.` +
      (input.highlights ? ` Key highlights to weave in: ${input.highlights}.` : "") +
      ` Return ONLY the letter body — greeting through the signature — with no date line.`;
    const { text } = await runAI("cover_letter", prompt, { language: locale });
    return text;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      {/* Top bar */}
      <header
        className="cover-topbar no-print sticky top-0 z-20 backdrop-blur"
        style={{
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 px-4 sm:px-6 h-14">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all hover:scale-[1.02]"
            style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2 ml-1">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center gradient-primary"
              aria-hidden
            >
              <FileText className="w-4 h-4 text-white" />
            </span>
            <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Cover Letter Builder
            </h1>
          </div>
          <span
            className="badge-brand ml-auto hidden sm:inline-flex"
            title="Pairs with your resume"
          >
            ResumeX
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
        <CoverLetterBuilder onAIGenerate={handleAIGenerate} />
      </main>
    </div>
  );
}
