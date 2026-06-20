"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ArrowRight, Loader2, Check } from "lucide-react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { getExample } from "@/components/resume/examples";
import { getTemplate, resumeDataToContent, ACCENTS } from "@/components/resume/sampleData";
import { cloneExampleToBuilder } from "@/components/resume/ExamplesGallery";

export default function ExampleDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = use(params);
  const example = getExample(id);
  const { data: session } = useSession();
  const router = useRouter();
  const [accent, setAccent] = useState<string | null>(null);
  const [using, setUsing] = useState(false);

  if (!example) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-primary)" }}>
        <p style={{ color: "var(--text-secondary)" }}>Example not found.</p>
        <Link href={`/${locale}/examples`} className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-semibold">Browse examples</Link>
      </div>
    );
  }

  const activeAccent = accent || example.data.colorHex;

  const handleUse = async () => {
    setUsing(true);
    try {
      await cloneExampleToBuilder({ ...example, data: { ...example.data, colorHex: activeAccent } }, locale, router, !!session);
    } finally {
      setUsing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <header className="sticky top-0 z-20 glass" style={{ borderBottom: "1px solid var(--border-primary)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/${locale}/examples`} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft className="w-4 h-4" /> All examples
          </Link>
          <button onClick={handleUse} disabled={using} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white btn-primary">
            {using ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Use this example <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        {/* Preview */}
        <div className="rounded-2xl p-4 mx-auto w-full max-w-2xl" style={{ background: "var(--bg-tertiary)" }}>
          <ResumePreview
            template={getTemplate(example.data.templateId)}
            accent={activeAccent}
            data={resumeDataToContent(example.data)}
            style={{ borderRadius: 8, overflow: "hidden", boxShadow: "var(--shadow-xl)" }}
          />
        </div>

        {/* Info panel */}
        <div className="lg:sticky lg:top-24 space-y-5">
          <div>
            <span className="badge badge-brand mb-3 inline-flex">{example.category}</span>
            <h1 className="font-display text-2xl font-bold mb-1">{example.role}</h1>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Example resume · {example.name}</p>
          </div>

          <div className="card p-4">
            <div className="text-xs font-semibold mb-2.5" style={{ color: "var(--text-secondary)" }}>Try a colour</div>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((c) => {
                const isActive = activeAccent.toLowerCase() === c.value.toLowerCase();
                return (
                  <button key={c.value} onClick={() => setAccent(c.value)} aria-label={c.name} title={c.name}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: c.value, boxShadow: isActive ? `0 0 0 2px var(--bg-elevated), 0 0 0 4px ${c.value}` : "none" }}>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-4 space-y-2.5">
            {["Recruiter-ready, ATS-friendly content", "Real bullet points with impact", "Editable in the builder", "Switch any of the 20 templates"].map((t) => (
              <div key={t} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--success)" }} /> {t}
              </div>
            ))}
          </div>

          <button onClick={handleUse} disabled={using} className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-white btn-primary">
            {using ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Use this example <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </main>
    </div>
  );
}
