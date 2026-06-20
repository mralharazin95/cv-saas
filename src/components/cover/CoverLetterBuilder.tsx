"use client";

import { useMemo, useState } from "react";
import { Sparkles, Download, Wand2, Check } from "lucide-react";
import {
  COVER_TEMPLATES,
  generateCoverLetter,
  getCoverTemplate,
} from "@/lib/coverLetter";
import { ACCENTS } from "@/components/resume/sampleData";

interface CoverLetterBuilderProps {
  /**
   * Optional AI generation hook. Receives the current form values and should
   * return the generated letter body (string). When omitted, the button falls
   * back to the deterministic templated generator. AI wiring is separate.
   */
  onAIGenerate?: (input: {
    name: string;
    role: string;
    company: string;
    highlights: string;
    hiringManager: string;
    tone: string;
  }) => Promise<string> | string;
}

const fieldStyle: React.CSSProperties = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-primary)",
  color: "var(--text-primary)",
};

export function CoverLetterBuilder({ onAIGenerate }: CoverLetterBuilderProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [highlights, setHighlights] = useState("");
  const [templateId, setTemplateId] = useState(COVER_TEMPLATES[0].id);
  const [accent, setAccent] = useState(COVER_TEMPLATES[0].accent);
  // When the user edits the letter or runs AI, we hold an override; otherwise
  // the preview is derived live from the form via the templated generator.
  const [override, setOverride] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const tone = templateId;

  const letter = useMemo(() => {
    if (override !== null) return override;
    return generateCoverLetter({ name, role, company, highlights, hiringManager, tone });
  }, [override, name, role, company, highlights, hiringManager, tone]);

  // The first line of the generated letter is the date; render it separately
  // so the body paragraphs read cleanly.
  const paragraphs = letter.split("\n\n");
  const dateLine = paragraphs[0] || "";
  const bodyParagraphs = paragraphs.slice(1);

  const handlePickTemplate = (id: string) => {
    setTemplateId(id);
    setAccent(getCoverTemplate(id).accent);
    setOverride(null); // regenerate with the new tone
  };

  const handleAIGenerate = async () => {
    const input = { name, role, company, highlights, hiringManager, tone };
    setGenerating(true);
    try {
      if (onAIGenerate) {
        const result = await onAIGenerate(input);
        if (typeof result === "string" && result.trim()) {
          // Preserve the date header, swap in the AI body.
          setOverride(`${dateLine}\n\n${result.trim()}`);
        }
      } else {
        // Placeholder: no AI wired yet — use the templated generator so the
        // button still produces a polished result.
        setOverride(generateCoverLetter(input));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="cover-shell flex flex-col lg:flex-row gap-6">
      {/* Scoped print rules: hide everything except the printable letter. */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          .cover-shell { display: block !important; }
          .cover-shell > .cover-form { display: none !important; }
          .cover-preview-wrap { padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; background: #fff !important; }
          .cover-page { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; min-height: 100vh !important; border-radius: 0 !important; }
        }
      `}</style>

      {/* ---------------- LEFT: form ---------------- */}
      <div className="cover-form w-full lg:w-[420px] lg:flex-shrink-0 no-print">
        <div className="card p-5" style={{ background: "var(--bg-elevated)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center gradient-primary"
              aria-hidden
            >
              <Sparkles className="w-4 h-4 text-white" />
            </span>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Cover Letter
            </h2>
          </div>
          <p className="text-xs mb-5" style={{ color: "var(--text-tertiary)" }}>
            Fill in the details — the letter updates live on the right.
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Your name" value={name} onChange={(v) => { setName(v); setOverride(null); }} placeholder="Sarah Chen" />
              <Field label="Job title" value={role} onChange={(v) => { setRole(v); setOverride(null); }} placeholder="Product Designer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Company" value={company} onChange={(v) => { setCompany(v); setOverride(null); }} placeholder="Stripe" />
              <Field label="Hiring manager" value={hiringManager} onChange={(v) => { setHiringManager(v); setOverride(null); }} placeholder="Optional" />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Key highlights
              </label>
              <textarea
                rows={5}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
                style={fieldStyle}
                value={highlights}
                onChange={(e) => { setHighlights(e.target.value); setOverride(null); }}
                placeholder={"One per line, e.g.\nLed a checkout redesign that lifted conversion 18%\n8+ years in fintech and consumer apps"}
              />
              <p className="mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                One achievement per line. The top three shape the letter.
              </p>
            </div>

            {/* Template picker */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COVER_TEMPLATES.map((tpl) => {
                  const active = tpl.id === templateId;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handlePickTemplate(tpl.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-[1.02]"
                      style={{
                        background: active ? "var(--primary-50)" : "var(--bg-secondary)",
                        border: `1px solid ${active ? "var(--primary-500)" : "var(--border-primary)"}`,
                        color: active ? "var(--primary-600)" : "var(--text-secondary)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                        style={{ background: tpl.accent }}
                      />
                      {tpl.name}
                      {active && <Check className="w-3.5 h-3.5 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent picker */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Accent colour
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((c) => {
                  const active = c.value.toLowerCase() === accent.toLowerCase();
                  return (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      aria-label={c.name}
                      onClick={() => setAccent(c.value)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{
                        background: c.value,
                        boxShadow: active ? `0 0 0 2px var(--bg-elevated), 0 0 0 4px ${c.value}` : "none",
                      }}
                    >
                      {active && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={generating}
                className="badge-ai flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                <Wand2 className="w-4 h-4" />
                {generating ? "Generating…" : "AI generate"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="btn-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
            {override !== null && (
              <button
                type="button"
                onClick={() => setOverride(null)}
                className="w-full text-center text-[11px] underline"
                style={{ color: "var(--text-tertiary)" }}
              >
                Reset to live draft from the form
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT: A4 preview ---------------- */}
      <div
        className="cover-preview-wrap flex-1 rounded-2xl p-6 sm:p-10 flex justify-center overflow-auto"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}
      >
        <div
          className="cover-page bg-white"
          style={{
            width: "100%",
            maxWidth: "210mm",
            minHeight: "297mm",
            padding: "22mm 20mm",
            boxShadow: "var(--shadow-xl)",
            borderRadius: "var(--radius-md)",
            color: "#1f2937",
            fontFamily: "Georgia, 'Times New Roman', serif",
            lineHeight: 1.65,
            fontSize: "15px",
          }}
        >
          {/* Letterhead: sender name + accent rule */}
          <div className="mb-8">
            <div
              className="font-display"
              style={{ color: accent, fontSize: "30px", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {name.trim() || "Your Name"}
            </div>
            {role.trim() && (
              <div style={{ color: "#6b7280", fontSize: "14px", marginTop: "2px" }}>
                {role.trim()}
              </div>
            )}
            <div style={{ height: "3px", width: "64px", background: accent, marginTop: "14px", borderRadius: "2px" }} />
          </div>

          {/* Date */}
          <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "26px" }}>
            {dateLine}
          </div>

          {/* Recipient block */}
          {(company.trim() || role.trim()) && (
            <div style={{ marginBottom: "26px", color: "#374151" }}>
              {hiringManager.trim() && <div style={{ fontWeight: 600 }}>{hiringManager.trim()}</div>}
              {company.trim() && <div>{company.trim()}</div>}
              {role.trim() && <div style={{ color: "#6b7280" }}>Re: {role.trim()}</div>}
            </div>
          )}

          {/* Body */}
          <div>
            {bodyParagraphs.map((para, i) => {
              const isGreeting = i === 0;
              const isSignoff = para === "Sincerely,";
              const isName = i === bodyParagraphs.length - 1;
              return (
                <p
                  key={i}
                  style={{
                    marginBottom: isSignoff ? "2px" : "16px",
                    marginTop: isName ? "2px" : undefined,
                    fontWeight: isGreeting || isName ? 600 : 400,
                    color: isName ? accent : "#1f2937",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input
        type="text"
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
        style={fieldStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
