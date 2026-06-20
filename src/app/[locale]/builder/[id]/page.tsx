"use client";

import { useRef } from "react";
import { FormArea } from "@/components/builder/FormArea";
import { PreviewArea } from "@/components/builder/PreviewArea";
import { useReactToPrint } from "react-to-print";
import { Download, ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";

export default function BuilderPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { resumeData } = useResumeStore();
  const componentRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: resumeData.title || "My_CV",
  });

  const handleSave = async () => {
    if (!params?.id) return;
    setSaving(true);
    try {
      await fetch(`/api/resumes/${params.id}`, {
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

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Builder Header */}
      <header className="h-14 px-4 flex items-center justify-between flex-shrink-0 builder-toolbar"
        style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-primary)" }}>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/dashboard`}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft size={18} /> Back
          </Link>
          <div className="h-5 w-px" style={{ background: "var(--border-primary)" }} />
          <input type="text" value={resumeData.title}
            onChange={(e) => useResumeStore.getState().updateSettings({ title: e.target.value })}
            className="font-semibold text-sm bg-transparent outline-none border-none px-2 py-1 rounded-lg focus:ring-2"
            style={{ color: "var(--text-primary)", "--tw-ring-color": "var(--primary-500)" } as React.CSSProperties} />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary transition-all hover:shadow-lg hover:scale-105">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <FormArea />
        <div ref={componentRef} className="flex-1 overflow-y-auto">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
}
