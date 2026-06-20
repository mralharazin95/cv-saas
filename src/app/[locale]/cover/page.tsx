"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { CoverLetterBuilder } from "@/components/cover/CoverLetterBuilder";

export default function CoverLetterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // Client pages still receive params as a Promise in Next 16 — unwrap with use().
  const { locale } = use(params);

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
        <CoverLetterBuilder />
      </main>
    </div>
  );
}
