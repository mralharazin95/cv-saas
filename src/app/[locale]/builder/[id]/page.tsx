"use client";

import { useRef, useState, useEffect } from "react";
import { FormArea } from "@/components/builder/FormArea";
import { PreviewArea } from "@/components/builder/PreviewArea";
import { ResumeScore } from "@/components/analyzer/ResumeScore";
import { AIToolsPanel } from "@/components/ai/AIToolsPanel";
import { ExportMenu } from "@/components/builder/ExportMenu";
import { PublishPanel } from "@/components/portfolio/PublishPanel";
import { useReactToPrint } from "react-to-print";
import { ChevronLeft, Save, Loader2, LayoutGrid, Gauge, Sparkles, Globe, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useResumeStore, initialResumeData } from "@/store/useResumeStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type View = "editor" | "score" | "ai";

export default function BuilderPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const id = (params?.id as string) || "";
  const { resumeData, setResumeData } = useResumeStore();
  const componentRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("editor");
  const [pub, setPub] = useState<{ slug?: string; isPublic?: boolean }>({});
  const [showPublish, setShowPublish] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/resumes/${id}`);
        if (res.ok && active) {
          const { resume } = await res.json();
          setPub({ slug: resume?.slug || undefined, isPublic: !!resume?.isPublic });
          if (resume?.dataJson) {
            const parsed = JSON.parse(resume.dataJson);
            setResumeData({
              ...initialResumeData,
              ...parsed,
              personalInfo: { ...initialResumeData.personalInfo, ...(parsed.personalInfo || {}) },
              experiences: parsed.experiences ?? [],
              educations: parsed.educations ?? [],
              skills: parsed.skills ?? [],
              projects: parsed.projects ?? [],
              languages: parsed.languages ?? [],
              certificates: parsed.certificates ?? [],
              references: parsed.references ?? [],
              sectionOrder: parsed.sectionOrder ?? initialResumeData.sectionOrder,
              id: resume.id,
            });
          } else if (resume) {
            setResumeData({
              ...initialResumeData,
              id: resume.id,
              title: resume.title || "Untitled CV",
              templateId: resume.templateId || "executive",
              colorHex: resume.colorHex || "#4f46e5",
            });
          }
        }
      } catch {
        /* keep current state on failure */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, setResumeData]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: resumeData.title || "My_CV",
  });

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setTimeout(() => setSaving(false), 800);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full" style={{ background: "var(--bg-primary)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-500)" }} />
      </div>
    );
  }

  const tabs: { k: View; label: string; icon: typeof LayoutGrid }[] = [
    { k: "editor", label: "Editor", icon: LayoutGrid },
    { k: "score", label: "Analyzer", icon: Gauge },
    { k: "ai", label: "AI", icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="h-14 px-4 flex items-center justify-between flex-shrink-0 builder-toolbar gap-3"
        style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-primary)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-1.5 text-sm font-medium flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-5 w-px flex-shrink-0" style={{ background: "var(--border-primary)" }} />
          <input type="text" value={resumeData.title}
            onChange={(e) => useResumeStore.getState().updateSettings({ title: e.target.value })}
            className="font-semibold text-sm bg-transparent outline-none border-none px-2 py-1 rounded-lg focus:ring-2 min-w-0 w-32 md:w-48"
            style={{ color: "var(--text-primary)", "--tw-ring-color": "var(--primary-500)" } as React.CSSProperties} />
        </div>

        {/* View tabs */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl flex-shrink-0" style={{ background: "var(--bg-tertiary)" }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = view === t.k;
            return (
              <button key={t.k} onClick={() => setView(t.k)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: active ? "var(--bg-elevated)" : "transparent", color: active ? "var(--primary-600)" : "var(--text-secondary)", boxShadow: active ? "var(--shadow-sm)" : "none" }}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeToggle />
          <button onClick={() => setShowPublish(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}>
            <Globe className="w-4 h-4" /> Publish
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
          </button>
          <ExportMenu resume={resumeData} onPrintPDF={handlePrint} slug={pub.slug} />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex flex-1 overflow-hidden" style={{ display: view === "editor" ? "flex" : "none" }}>
          <FormArea />
          <div ref={componentRef} className="flex-1 overflow-y-auto">
            <PreviewArea />
          </div>
        </div>

        {view === "score" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8" style={{ background: "var(--bg-secondary)" }}>
            <div className="max-w-5xl mx-auto">
              <ResumeScore resume={resumeData} />
            </div>
          </div>
        )}

        {view === "ai" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-8" style={{ background: "var(--bg-secondary)" }}>
            <div className="max-w-5xl mx-auto">
              <AIToolsPanel language={locale} />
            </div>
          </div>
        )}
      </div>

      {/* Publish modal */}
      {showPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "var(--bg-overlay)" }} onClick={() => setShowPublish(false)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowPublish(false)} className="p-2 rounded-lg" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <PublishPanel resumeId={id} slug={pub.slug} isPublic={pub.isPublic} />
          </div>
        </div>
      )}
    </div>
  );
}
