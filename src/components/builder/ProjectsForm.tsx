"use client";


import { useResumeStore } from "@/store/useResumeStore";
import { Project } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";

export function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    addProject({
      id: newId, name: "", description: "", link: "", startDate: "", endDate: "",
    });
    setExpandedId(newId);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Projects</h3>
        <button onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.projects.map((proj) => (
          <div key={proj.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-primary)" }}>
            <div className="p-3 flex justify-between items-center cursor-pointer transition-colors"
              style={{ background: "var(--bg-secondary)" }}
              onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}>
              <div>
                <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                  {proj.name || "New Project"}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                  className="p-1 rounded transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <Trash2 size={14} />
                </button>
                {expandedId === proj.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {expandedId === proj.id && (
              <div className="p-3 space-y-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
                <InputField label="Project Name" value={proj.name}
                  onChange={(v) => updateProject(proj.id, { name: v })} />
                <InputField label="Project Link" value={proj.link}
                  onChange={(v) => updateProject(proj.id, { link: v })} placeholder="https://..." />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Start Date" value={proj.startDate}
                    onChange={(v) => updateProject(proj.id, { startDate: v })} placeholder="Jan 2023" />
                  <InputField label="End Date" value={proj.endDate}
                    onChange={(v) => updateProject(proj.id, { endDate: v })} placeholder="Mar 2023" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description</label>
                  <textarea rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" } as React.CSSProperties}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Describe the project..." />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input type="text"
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" } as React.CSSProperties}
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
