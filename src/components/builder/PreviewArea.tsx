"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { getTemplate, resumeDataToContent } from "@/components/resume/sampleData";

export function PreviewArea() {
  const { resumeData } = useResumeStore();
  const template = getTemplate(resumeData.templateId);
  const content = resumeDataToContent(resumeData);

  return (
    <div className="flex-1 overflow-y-auto p-8 flex justify-center PreviewArea" style={{ background: "var(--bg-tertiary)" }}>
      <div className="cv-page w-full max-w-[794px]" style={{ boxShadow: "var(--shadow-xl)", borderRadius: 4, overflow: "hidden", alignSelf: "flex-start" }}>
        <ResumePreview template={template} accent={resumeData.colorHex} data={content} mode="page" />
      </div>
    </div>
  );
}
