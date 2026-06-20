"use client";


import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function ReferencesForm() {
  const { resumeData, addReference, updateReference, removeReference } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    addReference({ id: newId, name: "", position: "", company: "", email: "", phone: "" });
    setExpandedId(newId);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>References</h3>
        <button onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
          <Plus size={14} /> Add Reference
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.references.map((ref) => (
          <div key={ref.id} className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-primary)" }}>
            <div className="p-3 flex justify-between items-center cursor-pointer"
              style={{ background: "var(--bg-secondary)" }}
              onClick={() => setExpandedId(expandedId === ref.id ? null : ref.id)}>
              <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                {ref.name || "New Reference"}
              </h4>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeReference(ref.id); }}
                  className="p-1" style={{ color: "var(--text-tertiary)" }}>
                  <Trash2 size={14} />
                </button>
                {expandedId === ref.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {expandedId === ref.id && (
              <div className="p-3 space-y-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Name" value={ref.name}
                    onChange={(v) => updateReference(ref.id, { name: v })} />
                  <InputField label="Position" value={ref.position}
                    onChange={(v) => updateReference(ref.id, { position: v })} />
                </div>
                <InputField label="Company" value={ref.company}
                  onChange={(v) => updateReference(ref.id, { company: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Email" value={ref.email}
                    onChange={(v) => updateReference(ref.id, { email: v })} />
                  <InputField label="Phone" value={ref.phone}
                    onChange={(v) => updateReference(ref.id, { phone: v })} />
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
