"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { TEMPLATES, ACCENTS } from "./sampleData";

export function TemplatesStudio({
  locale,
  colorLabel,
  useLabel,
  hint,
}: {
  locale: string;
  colorLabel: string;
  useLabel: string;
  hint: string;
}) {
  const [selectedId, setSelectedId] = useState("executive");
  const [accent, setAccent] = useState<string | null>(null);

  const selected = TEMPLATES.find((t) => t.id === selectedId) || TEMPLATES[0];
  const activeAccent = accent || selected.accent;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
      {/* Gallery */}
      <div>
        <p className="text-sm mb-5" style={{ color: "var(--text-tertiary)" }}>{hint}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => {
            const isSel = tpl.id === selectedId;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className="group text-start rounded-xl overflow-hidden transition-all"
                style={{
                  background: "var(--bg-elevated)",
                  border: isSel ? "2px solid var(--primary-500)" : "1px solid var(--border-primary)",
                  boxShadow: isSel ? "var(--shadow-lg)" : "var(--shadow-sm)",
                  transform: isSel ? "translateY(-2px)" : undefined,
                }}
              >
                <div className="p-2.5" style={{ background: "var(--bg-tertiary)" }}>
                  <ResumePreview template={tpl} accent={isSel ? activeAccent : tpl.accent} style={{ borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} />
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{tpl.name}</span>
                  {isSel ? (
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--primary-500)" }} />
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>{tpl.category}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live preview panel (sticky on desktop) */}
      <div className="lg:sticky lg:top-24">
        <div className="card p-5" style={{ boxShadow: "var(--shadow-lg)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>{selected.name}</div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{selected.category}</div>
            </div>
            <span className="badge badge-premium text-xs">ATS</span>
          </div>

          {/* Live preview */}
          <div className="rounded-xl p-3 mb-4" style={{ background: "var(--bg-tertiary)" }}>
            <ResumePreview template={selected} accent={activeAccent} style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.18)" }} />
          </div>

          {/* Color switcher */}
          <div className="mb-4">
            <div className="text-xs font-semibold mb-2.5" style={{ color: "var(--text-secondary)" }}>{colorLabel}</div>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((c) => {
                const isActive = activeAccent.toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.value}
                    onClick={() => setAccent(c.value)}
                    aria-label={c.name}
                    title={c.name}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                    style={{ background: c.value, boxShadow: isActive ? `0 0 0 2px var(--bg-elevated), 0 0 0 4px ${c.value}` : "none" }}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Link href={`/${locale}/register`} className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl font-semibold text-white btn-primary">
            {useLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
