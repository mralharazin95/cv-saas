"use client";


import { useResumeStore } from "@/store/useResumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function CertificatesForm() {
  const { resumeData, addCertificate, updateCertificate, removeCertificate } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAdd = () => {
    const newId = crypto.randomUUID();
    addCertificate({ id: newId, name: "", issuer: "", date: "", link: "" });
    setExpandedId(newId);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Certificates</h3>
        <button onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}>
          <Plus size={14} /> Add Certificate
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.certificates.map((cert) => (
          <div key={cert.id} className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-primary)" }}>
            <div className="p-3 flex justify-between items-center cursor-pointer"
              style={{ background: "var(--bg-secondary)" }}
              onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}>
              <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                {cert.name || "New Certificate"}
              </h4>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); removeCertificate(cert.id); }}
                  className="p-1" style={{ color: "var(--text-tertiary)" }}>
                  <Trash2 size={14} />
                </button>
                {expandedId === cert.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {expandedId === cert.id && (
              <div className="p-3 space-y-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
                <InputField label="Certificate Name" value={cert.name}
                  onChange={(v) => updateCertificate(cert.id, { name: v })} />
                <InputField label="Issuer" value={cert.issuer}
                  onChange={(v) => updateCertificate(cert.id, { issuer: v })} placeholder="e.g. Google, AWS" />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Date" value={cert.date}
                    onChange={(v) => updateCertificate(cert.id, { date: v })} placeholder="Jan 2023" />
                  <InputField label="Certificate Link" value={cert.link}
                    onChange={(v) => updateCertificate(cert.id, { link: v })} placeholder="https://..." />
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
