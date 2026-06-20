"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Experience } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AIAssistantButton } from "@/components/ui/AIAssistantButton";

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    addExperience({
      id: newId, jobTitle: "", company: "", location: "",
      startDate: "", endDate: "", isCurrent: false, description: "",
    });
    setExpandedId(newId);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Work Experience</h3>
        <button onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
          <Plus size={14} /> Add Experience
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-primary)" }}>
            <div className="p-3 flex justify-between items-center cursor-pointer transition-colors"
              style={{ background: "var(--bg-secondary)" }}
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  {exp.jobTitle || "New Role"}
                </h4>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {exp.company || "Company Name"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                  className="p-1 rounded transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <Trash2 size={14} />
                </button>
                {expandedId === exp.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedId === exp.id && (
              <div className="p-3 space-y-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Job Title" value={exp.jobTitle}
                    onChange={(v) => updateExperience(exp.id, { jobTitle: v })} placeholder="Software Engineer" />
                  <InputField label="Company" value={exp.company}
                    onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="Google" />
                </div>
                <InputField label="Location" value={exp.location}
                  onChange={(v) => updateExperience(exp.id, { location: v })} placeholder="New York, NY" />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Start Date" value={exp.startDate}
                    onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="Jan 2022" />
                  <div>
                    <InputField label="End Date" value={exp.isCurrent ? "" : exp.endDate}
                      onChange={(v) => updateExperience(exp.id, { endDate: v })}
                      placeholder="Present" disabled={exp.isCurrent} />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                      <input type="checkbox" checked={exp.isCurrent}
                        onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                        className="w-3.5 h-3.5 rounded accent-[var(--primary-500)]" />
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Currently working here</span>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Description</label>
                    <AIAssistantButton 
                      currentText={exp.description}
                      onUpdate={(text) => updateExperience(exp.id, { description: text })}
                      type="experience"
                      locale="en"
                    />
                  </div>
                  <textarea rows={4}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" } as React.CSSProperties}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder="Describe your responsibilities and achievements..." />
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
