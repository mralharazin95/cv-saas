"use client";

import { use } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { ExamplesGallery } from "@/components/resume/ExamplesGallery";

export default function ExamplesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <header className="sticky top-0 z-20 glass" style={{ borderBottom: "1px solid var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ResumeX</span>
          </Link>
          <Link href={`/${locale}/register`} className="px-5 py-2 rounded-xl text-sm font-semibold text-white btn-primary">
            Get started free
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fadeInUp">
          <div className="badge badge-brand mb-5 inline-flex">Resume examples</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Examples for every career</h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Real, recruiter-ready resumes written for actual roles. Preview one, then make it yours in a single click.
          </p>
        </div>
        <ExamplesGallery locale={locale} />
      </main>
    </div>
  );
}
