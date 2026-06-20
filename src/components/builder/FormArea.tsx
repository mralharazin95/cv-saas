"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { ProjectsForm } from "./ProjectsForm";
import { LanguagesForm } from "./LanguagesForm";
import { CertificatesForm } from "./CertificatesForm";
import { ReferencesForm } from "./ReferencesForm";
import { AIAssistantButton } from "@/components/ui/AIAssistantButton";
import { COLOR_PRESETS } from "@/types/resume";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TEMPLATES as ENGINE_TEMPLATES, resumeDataToContent, resolveTemplateId } from "@/components/resume/sampleData";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Globe2,
  Award,
  Users,
  Link2,
  Palette,
  Type,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const sectionIcons: Record<string, any> = {
  summary: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderOpen,
  languages: Globe2,
  certificates: Award,
  references: Users,
};

export function FormArea() {
  const { resumeData, updatePersonalInfo, updateSettings } = useResumeStore();
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [showCustomize, setShowCustomize] = useState(true);
  const previewContent = resumeDataToContent(resumeData);
  const activeTemplateId = resolveTemplateId(resumeData.templateId);

  const sections = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "summary", label: "Professional Summary", icon: User },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "languages", label: "Languages", icon: Globe2 },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "references", label: "References", icon: Users },
    { id: "social", label: "Social Links", icon: Link2 },
  ];

  return (
    <div
      className="w-[420px] flex-shrink-0 flex flex-col h-full FormArea"
      style={{
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border-primary)",
      }}
    >
      {/* Customization Panel Toggle */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        style={{ borderBottom: "1px solid var(--border-primary)" }}
        onClick={() => setShowCustomize(!showCustomize)}
      >
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: "var(--primary-500)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Customize
          </span>
        </div>
        {showCustomize ? (
          <ChevronUp className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
        ) : (
          <ChevronDown className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
        )}
      </div>

      {showCustomize && (
        <div
          className="px-4 py-4 space-y-4 animate-fadeIn"
          style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
          {/* Template selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block"
              style={{ color: "var(--text-tertiary)" }}>
              Template
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ENGINE_TEMPLATES.map((tpl) => {
                const active = activeTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => updateSettings({ templateId: tpl.id })}
                    className="rounded-lg overflow-hidden text-left transition-all"
                    style={{
                      border: active ? "2px solid var(--primary-500)" : "1px solid var(--border-primary)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <div className="p-1.5" style={{ background: "var(--bg-tertiary)" }}>
                      <ResumePreview
                        template={tpl}
                        accent={resumeData.colorHex}
                        data={previewContent}
                        style={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }}
                      />
                    </div>
                    <div className="px-2 py-1.5 text-[11px] font-semibold truncate" style={{ color: active ? "var(--primary-600)" : "var(--text-secondary)" }}>
                      {tpl.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-2 block"
              style={{ color: "var(--text-tertiary)" }}>
              Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateSettings({ colorHex: color })}
                  className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                  style={{
                    background: color,
                    border: resumeData.colorHex === color ? "3px solid var(--text-primary)" : "2px solid transparent",
                    outline: resumeData.colorHex === color ? "2px solid var(--bg-primary)" : "none",
                  }}
                />
              ))}
              <input
                type="color"
                value={resumeData.colorHex}
                onChange={(e) => updateSettings({ colorHex: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-none"
              />
            </div>
          </div>

        </div>
      )}

      {/* Section Nav */}
      <div
        className="flex overflow-x-auto px-3 py-2 gap-1 no-scrollbar flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-primary)" }}
      >
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-xs font-medium"
              style={{
                background: isActive ? "var(--primary-50)" : "transparent",
                color: isActive ? "var(--primary-600)" : "var(--text-tertiary)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {sec.label.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Personal Info */}
        {activeSection === "personal" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" value={resumeData.personalInfo.firstName}
                onChange={(v) => updatePersonalInfo({ firstName: v })} />
              <FormField label="Last Name" value={resumeData.personalInfo.lastName}
                onChange={(v) => updatePersonalInfo({ lastName: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Email" type="email" value={resumeData.personalInfo.email}
                onChange={(v) => updatePersonalInfo({ email: v })} />
              <FormField label="Phone" value={resumeData.personalInfo.phone}
                onChange={(v) => updatePersonalInfo({ phone: v })} />
            </div>
            <FormField label="Address" value={resumeData.personalInfo.address}
              onChange={(v) => updatePersonalInfo({ address: v })} />
            <div className="grid grid-cols-3 gap-3">
              <FormField label="City" value={resumeData.personalInfo.city}
                onChange={(v) => updatePersonalInfo({ city: v })} />
              <FormField label="Country" value={resumeData.personalInfo.country}
                onChange={(v) => updatePersonalInfo({ country: v })} />
              <FormField label="Nationality" value={resumeData.personalInfo.nationality}
                onChange={(v) => updatePersonalInfo({ nationality: v })} />
            </div>
            <FormField label="Photo URL" value={resumeData.personalInfo.photoUrl || ""}
              onChange={(v) => updatePersonalInfo({ photoUrl: v })} placeholder="https://..." />
          </div>
        )}

        {/* Summary */}
        {activeSection === "summary" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Professional Summary
              </h3>
              <AIAssistantButton 
                currentText={resumeData.personalInfo.summary}
                onUpdate={(text) => updatePersonalInfo({ summary: text })}
                type="summary"
                locale="en"
              />
            </div>
            <textarea
              rows={8}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
                "--tw-ring-color": "var(--primary-500)",
              } as React.CSSProperties}
              value={resumeData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
              placeholder="Write a brief professional summary..."
            />
            <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
              Tip: Keep it under 3-4 sentences. Highlight your key strengths and career goals.
            </p>
          </div>
        )}

        {/* Experience */}
        {activeSection === "experience" && <ExperienceForm />}

        {/* Education */}
        {activeSection === "education" && <EducationForm />}

        {/* Skills */}
        {activeSection === "skills" && <SkillsForm />}

        {/* Projects */}
        {activeSection === "projects" && <ProjectsForm />}

        {/* Languages */}
        {activeSection === "languages" && <LanguagesForm />}

        {/* Certificates */}
        {activeSection === "certificates" && <CertificatesForm />}

        {/* References */}
        {activeSection === "references" && <ReferencesForm />}

        {/* Social Links */}
        {activeSection === "social" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Social Links
            </h3>
            <FormField label="LinkedIn URL" value={resumeData.personalInfo.linkedinUrl || ""}
              onChange={(v) => updatePersonalInfo({ linkedinUrl: v })} placeholder="https://linkedin.com/in/..." />
            <FormField label="GitHub URL" value={resumeData.personalInfo.githubUrl || ""}
              onChange={(v) => updatePersonalInfo({ githubUrl: v })} placeholder="https://github.com/..." />
            <FormField label="Website / Portfolio" value={resumeData.personalInfo.websiteUrl || ""}
              onChange={(v) => updatePersonalInfo({ websiteUrl: v })} placeholder="https://..." />
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          color: "var(--text-primary)",
          "--tw-ring-color": "var(--primary-500)",
        } as React.CSSProperties}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
