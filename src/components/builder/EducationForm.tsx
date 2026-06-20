"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Education } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    addEducation({
      id: newId, degree: "", school: "", location: "",
      startDate: "", endDate: "", isCurrent: false, description: "",
    });
    setExpandedId(newId);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Education</h3>
        <button onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
          <Plus size={14} /> Add Education
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.educations.map((edu) => (
          <div key={edu.id} className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-primary)" }}>
            <div className="p-3 flex justify-between items-center cursor-pointer transition-colors"
              style={{ background: "var(--bg-secondary)" }}
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}>
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  {edu.degree || "New Degree"}
                </h4>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {edu.school || "School/University"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                  className="p-1" style={{ color: "var(--text-tertiary)" }}>
                  <Trash2 size={14} />
                </button>
                {expandedId === edu.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedId === edu.id && (
              <div className="p-3 space-y-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Degree / Field" value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, { degree: v })} placeholder="BSc Computer Science" />
                  <InputField label="School / University" value={edu.school}
                    onChange={(v) => updateEducation(edu.id, { school: v })} placeholder="MIT" />
                </div>
                <InputField label="Location" value={edu.location}
                  onChange={(v) => updateEducation(edu.id, { location: v })} placeholder="Cambridge, MA" />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Start Date" value={edu.startDate}
                    onChange={(v) => updateEducation(edu.id, { startDate: v })} placeholder="Sep 2018" />
                  <div>
                    <InputField label="End Date" value={edu.isCurrent ? "" : edu.endDate}
                      onChange={(v) => updateEducation(edu.id, { endDate: v })}
                      placeholder="May 2022" disabled={edu.isCurrent} />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                      <input type="checkbox" checked={edu.isCurrent}
                        onChange={(e) => updateEducation(edu.id, { isCurrent: e.target.checked })}
                        className="w-3.5 h-3.5 rounded accent-[var(--primary-500)]" />
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Currently studying here</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Achievements</label>
                  <textarea rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" } as React.CSSProperties}
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                    placeholder="GPA, coursework, awards..." />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input type="text" disabled={disabled}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 disabled:opacity-50"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" } as React.CSSProperties}
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
