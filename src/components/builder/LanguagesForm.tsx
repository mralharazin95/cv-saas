"use client";


import { useResumeStore } from "@/store/useResumeStore";
import { Language } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const proficiencyLevels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];

export function LanguagesForm() {
  const { resumeData, addLanguage, removeLanguage } = useResumeStore();
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState("Intermediate");

  const handleAdd = () => {
    if (!name.trim()) return;
    addLanguage({ id: crypto.randomUUID(), name: name.trim(), proficiency });
    setName("");
  };

  return (
    <div className="animate-fadeIn">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Languages</h3>

      <div className="flex gap-2 mb-4">
        <input type="text"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" } as React.CSSProperties}
          value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g. English, Arabic, Turkish..." />
        <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}
          className="w-32 px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}>
          {proficiencyLevels.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button onClick={handleAdd}
          className="p-2.5 rounded-xl text-white transition-all hover:scale-105 gradient-primary">
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-2">
        {resumeData.languages.map((lang) => (
          <div key={lang.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{lang.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
                {lang.proficiency}
              </span>
            </div>
            <button onClick={() => removeLanguage(lang.id)}
              className="p-1 transition-colors hover:text-red-500" style={{ color: "var(--text-tertiary)" }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
