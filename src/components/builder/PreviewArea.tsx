"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { ResumeData } from "@/types/resume";

export function PreviewArea() {
  const { resumeData } = useResumeStore();
  const tpl = resumeData.templateId;

  return (
    <div className="flex-1 overflow-y-auto p-8 flex justify-center PreviewArea" style={{ background: "var(--bg-tertiary)" }}>
      <div className="cv-page bg-white shadow-2xl w-full max-w-[794px] min-h-[1123px] transition-all duration-300"
        style={{ fontFamily: resumeData.fontFamily || "Inter, sans-serif" }}>
        {tpl === "modern" && <ModernTemplate data={resumeData} />}
        {tpl === "professional" && <ProfessionalTemplate data={resumeData} />}
        {tpl === "minimal" && <MinimalTemplate data={resumeData} />}
        {tpl === "academic" && <AcademicTemplate data={resumeData} />}
        {tpl === "creative" && <CreativeTemplate data={resumeData} />}
      </div>
    </div>
  );
}

function SectionTitle({ title, color, style }: { title: string; color: string; style?: string }) {
  if (style === "minimal") return <h2 className="text-sm font-bold uppercase tracking-[3px] text-center border-b pb-1 mb-3" style={{ color, borderColor: color + "40" }}>{title}</h2>;
  if (style === "academic") return <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ color, borderColor: color }}>{title}</h2>;
  return <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color }}>{title}</h2>;
}

function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, colorHex: c } = data;
  return (
    <div className="flex min-h-[1123px]">
      <div className="w-[260px] text-white p-6 flex flex-col" style={{ background: c }}>
        {p.photoUrl && <img src={p.photoUrl} alt="" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-3 border-white/30" />}
        <h1 className="text-xl font-bold mb-0.5">{p.firstName} {p.lastName}</h1>
        <div className="text-xs text-white/70 space-y-1 mt-3">
          {p.email && <div>📧 {p.email}</div>}
          {p.phone && <div>📱 {p.phone}</div>}
          {p.address && <div>📍 {p.address}{p.city ? `, ${p.city}` : ""}</div>}
          {p.nationality && <div>🌍 {p.nationality}</div>}
        </div>
        {data.skills.length > 0 && (
          <div className="mt-6"><h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">Skills</h3>
            <div className="space-y-2">{data.skills.map(s => (
              <div key={s.id}><div className="text-xs mb-0.5">{s.name}</div>
                <div className="w-full h-1.5 rounded-full bg-white/20"><div className="h-full rounded-full bg-white/80" style={{ width: s.level === "Expert" ? "100%" : s.level === "Advanced" ? "80%" : s.level === "Intermediate" ? "60%" : "40%" }} /></div>
              </div>
            ))}</div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div className="mt-6"><h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">Languages</h3>
            <div className="space-y-1.5">{data.languages.map(l => (
              <div key={l.id} className="flex justify-between text-xs"><span>{l.name}</span><span className="text-white/60">{l.proficiency}</span></div>
            ))}</div>
          </div>
        )}
        {(p.linkedinUrl || p.githubUrl || p.websiteUrl) && (
          <div className="mt-6"><h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-white/80">Links</h3>
            <div className="text-xs space-y-1 text-white/70 break-all">
              {p.linkedinUrl && <div>{p.linkedinUrl}</div>}
              {p.githubUrl && <div>{p.githubUrl}</div>}
              {p.websiteUrl && <div>{p.websiteUrl}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 p-6">
        {p.summary && <><SectionTitle title="Profile" color={c} /><p className="text-xs text-gray-600 leading-relaxed mb-5">{p.summary}</p></>}
        {data.experiences.length > 0 && <><SectionTitle title="Experience" color={c} /><div className="space-y-4 mb-5">{data.experiences.map(e => (
          <div key={e.id}><div className="flex justify-between"><h3 className="text-sm font-semibold text-gray-800">{e.jobTitle}</h3><span className="text-[10px] text-gray-400">{e.startDate} - {e.isCurrent ? "Present" : e.endDate}</span></div>
            <div className="text-xs text-gray-500 mb-1">{e.company}{e.location ? ` | ${e.location}` : ""}</div>
            {e.description && <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{e.description}</p>}</div>
        ))}</div></>}
        {data.educations.length > 0 && <><SectionTitle title="Education" color={c} /><div className="space-y-3 mb-5">{data.educations.map(e => (
          <div key={e.id}><div className="flex justify-between"><h3 className="text-sm font-semibold text-gray-800">{e.degree}</h3><span className="text-[10px] text-gray-400">{e.startDate} - {e.isCurrent ? "Present" : e.endDate}</span></div>
            <div className="text-xs text-gray-500">{e.school}{e.location ? ` | ${e.location}` : ""}</div>
            {e.description && <p className="text-xs text-gray-600 mt-0.5">{e.description}</p>}</div>
        ))}</div></>}
        {data.projects.length > 0 && <><SectionTitle title="Projects" color={c} /><div className="space-y-3 mb-5">{data.projects.map(p => (
          <div key={p.id}><h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>{p.link && <div className="text-[10px] text-blue-500">{p.link}</div>}
            {p.description && <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>}</div>
        ))}</div></>}
        {data.certificates.length > 0 && <><SectionTitle title="Certificates" color={c} /><div className="space-y-2 mb-5">{data.certificates.map(cert => (
          <div key={cert.id} className="flex justify-between"><div><span className="text-xs font-medium text-gray-800">{cert.name}</span><span className="text-xs text-gray-500"> — {cert.issuer}</span></div><span className="text-[10px] text-gray-400">{cert.date}</span></div>
        ))}</div></>}
        {data.references.length > 0 && <><SectionTitle title="References" color={c} /><div className="grid grid-cols-2 gap-3">{data.references.map(r => (
          <div key={r.id} className="text-xs"><div className="font-semibold text-gray-800">{r.name}</div><div className="text-gray-500">{r.position}, {r.company}</div>
            {r.email && <div className="text-gray-400">{r.email}</div>}{r.phone && <div className="text-gray-400">{r.phone}</div>}</div>
        ))}</div></>}
      </div>
    </div>
  );
}

function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, colorHex: c } = data;
  return (
    <div className="p-8">
      <header className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${c}` }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{p.firstName} {p.lastName}</h1>
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500 flex-wrap">
          {p.email && <span>{p.email}</span>}{p.phone && <span>• {p.phone}</span>}{p.address && <span>• {p.address}{p.city ? `, ${p.city}` : ""}</span>}
        </div>
        {(p.linkedinUrl || p.githubUrl) && <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-1">{p.linkedinUrl && <span>{p.linkedinUrl}</span>}{p.githubUrl && <span>{p.githubUrl}</span>}</div>}
      </header>
      {p.summary && <section className="mb-5"><SectionTitle title="Professional Summary" color={c} /><p className="text-xs text-gray-600 leading-relaxed">{p.summary}</p></section>}
      {data.experiences.length > 0 && <section className="mb-5"><SectionTitle title="Professional Experience" color={c} /><div className="space-y-4">{data.experiences.map(e => (
        <div key={e.id} className="border-l-2 pl-3" style={{ borderColor: c + "40" }}><div className="flex justify-between"><h3 className="text-sm font-semibold text-gray-800">{e.jobTitle}</h3><span className="text-[10px] text-gray-400 font-medium">{e.startDate} — {e.isCurrent ? "Present" : e.endDate}</span></div>
          <div className="text-xs text-gray-500 italic mb-1">{e.company}{e.location ? `, ${e.location}` : ""}</div>
          {e.description && <p className="text-xs text-gray-600 whitespace-pre-wrap">{e.description}</p>}</div>
      ))}</div></section>}
      {data.educations.length > 0 && <section className="mb-5"><SectionTitle title="Education" color={c} /><div className="space-y-3">{data.educations.map(e => (
        <div key={e.id}><div className="flex justify-between"><h3 className="text-sm font-semibold text-gray-800">{e.degree}</h3><span className="text-[10px] text-gray-400">{e.startDate} — {e.isCurrent ? "Present" : e.endDate}</span></div>
          <div className="text-xs text-gray-500">{e.school}</div></div>
      ))}</div></section>}
      <div className="grid grid-cols-2 gap-6">
        {data.skills.length > 0 && <section><SectionTitle title="Skills" color={c} /><div className="flex flex-wrap gap-1.5">{data.skills.map(s => <span key={s.id} className="text-xs px-2 py-0.5 rounded border text-gray-700" style={{ borderColor: c + "40" }}>{s.name}</span>)}</div></section>}
        {data.languages.length > 0 && <section><SectionTitle title="Languages" color={c} /><div className="space-y-1">{data.languages.map(l => <div key={l.id} className="text-xs text-gray-700"><span className="font-medium">{l.name}</span> — {l.proficiency}</div>)}</div></section>}
      </div>
      {data.certificates.length > 0 && <section className="mt-5"><SectionTitle title="Certifications" color={c} /><div className="space-y-1">{data.certificates.map(cert => <div key={cert.id} className="text-xs text-gray-700"><span className="font-medium">{cert.name}</span> — {cert.issuer} ({cert.date})</div>)}</div></section>}
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, colorHex: c } = data;
  return (
    <div className="p-10">
      <header className="text-center mb-8"><h1 className="text-4xl font-light tracking-[6px] uppercase text-gray-900 mb-2">{p.firstName} {p.lastName}</h1>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">{p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.address && <span>{p.address}</span>}</div>
      </header>
      {p.summary && <section className="mb-6"><SectionTitle title="About" color={c} style="minimal" /><p className="text-xs text-gray-600 leading-relaxed text-center max-w-lg mx-auto">{p.summary}</p></section>}
      {data.experiences.length > 0 && <section className="mb-6"><SectionTitle title="Experience" color={c} style="minimal" /><div className="space-y-4">{data.experiences.map(e => (
        <div key={e.id} className="text-center"><h3 className="text-sm font-medium text-gray-800">{e.jobTitle}</h3><div className="text-xs text-gray-500">{e.company} • {e.startDate} - {e.isCurrent ? "Present" : e.endDate}</div>
          {e.description && <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">{e.description}</p>}</div>
      ))}</div></section>}
      {data.educations.length > 0 && <section className="mb-6"><SectionTitle title="Education" color={c} style="minimal" /><div className="space-y-3">{data.educations.map(e => (
        <div key={e.id} className="text-center"><h3 className="text-sm font-medium text-gray-800">{e.degree}</h3><div className="text-xs text-gray-500">{e.school} • {e.startDate} - {e.isCurrent ? "Present" : e.endDate}</div></div>
      ))}</div></section>}
      {data.skills.length > 0 && <section className="mb-6"><SectionTitle title="Skills" color={c} style="minimal" /><div className="flex flex-wrap gap-2 justify-center">{data.skills.map(s => <span key={s.id} className="text-xs text-gray-600">{s.name}</span>)}</div></section>}
      {data.languages.length > 0 && <section className="mb-6"><SectionTitle title="Languages" color={c} style="minimal" /><div className="flex gap-4 justify-center">{data.languages.map(l => <span key={l.id} className="text-xs text-gray-600">{l.name} ({l.proficiency})</span>)}</div></section>}
    </div>
  );
}

function AcademicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, colorHex: c } = data;
  return (
    <div className="p-8">
      <header className="mb-6"><h1 className="text-2xl font-bold text-gray-900">{p.firstName} {p.lastName}</h1>
        <div className="text-xs text-gray-500 mt-1 space-x-2">{p.email && <span>{p.email}</span>}{p.phone && <span>| {p.phone}</span>}{p.address && <span>| {p.address}</span>}</div>
        {p.websiteUrl && <div className="text-xs text-blue-600 mt-0.5">{p.websiteUrl}</div>}
      </header>
      {p.summary && <section className="mb-5"><SectionTitle title="Research Interests" color={c} style="academic" /><p className="text-xs text-gray-600 leading-relaxed">{p.summary}</p></section>}
      {data.educations.length > 0 && <section className="mb-5"><SectionTitle title="Education" color={c} style="academic" /><div className="space-y-3">{data.educations.map(e => (
        <div key={e.id}><div className="flex justify-between"><h3 className="text-sm font-semibold text-gray-800">{e.degree}</h3><span className="text-[10px] text-gray-400">{e.startDate} — {e.isCurrent ? "Present" : e.endDate}</span></div>
          <div className="text-xs text-gray-500">{e.school}{e.location ? `, ${e.location}` : ""}</div>{e.description && <p className="text-xs text-gray-600 mt-0.5 italic">{e.description}</p>}</div>
      ))}</div></section>}
      {data.experiences.length > 0 && <section className="mb-5"><SectionTitle title="Experience" color={c} style="academic" /><div className="space-y-3">{data.experiences.map(e => (
        <div key={e.id}><div className="flex justify-between"><h3 className="text-sm font-semibold text-gray-800">{e.jobTitle}</h3><span className="text-[10px] text-gray-400">{e.startDate} — {e.isCurrent ? "Present" : e.endDate}</span></div>
          <div className="text-xs text-gray-500 italic">{e.company}</div>{e.description && <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap">{e.description}</p>}</div>
      ))}</div></section>}
      {data.projects.length > 0 && <section className="mb-5"><SectionTitle title="Publications & Projects" color={c} style="academic" /><div className="space-y-2">{data.projects.map(p => (
        <div key={p.id}><span className="text-xs font-medium text-gray-800">{p.name}</span>{p.description && <span className="text-xs text-gray-600"> — {p.description}</span>}</div>
      ))}</div></section>}
      {data.skills.length > 0 && <section className="mb-5"><SectionTitle title="Technical Skills" color={c} style="academic" /><p className="text-xs text-gray-600">{data.skills.map(s => s.name).join(", ")}</p></section>}
      {data.certificates.length > 0 && <section className="mb-5"><SectionTitle title="Awards & Certifications" color={c} style="academic" /><div className="space-y-1">{data.certificates.map(cert => <div key={cert.id} className="text-xs text-gray-700">{cert.name} — {cert.issuer}{cert.date ? `, ${cert.date}` : ""}</div>)}</div></section>}
    </div>
  );
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo: p, colorHex: c } = data;
  return (
    <div>
      <header className="p-8 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c}, ${c}dd)` }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-6">
          {p.photoUrl && <img src={p.photoUrl} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30" />}
          <div><h1 className="text-3xl font-bold">{p.firstName} {p.lastName}</h1>
            <div className="flex gap-3 text-xs text-white/70 mt-1">{p.email && <span>{p.email}</span>}{p.phone && <span>• {p.phone}</span>}</div>
          </div>
        </div>
      </header>
      <div className="p-8">
        {p.summary && <section className="mb-6 p-4 rounded-xl" style={{ background: c + "08", borderLeft: `3px solid ${c}` }}><p className="text-xs text-gray-600 leading-relaxed">{p.summary}</p></section>}
        {data.experiences.length > 0 && <section className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Experience</h2><div className="space-y-4">{data.experiences.map(e => (
          <div key={e.id} className="relative pl-4" style={{ borderLeft: `2px solid ${c}30` }}><div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            <h3 className="text-sm font-semibold text-gray-800">{e.jobTitle}</h3><div className="text-xs text-gray-500">{e.company} • {e.startDate} - {e.isCurrent ? "Present" : e.endDate}</div>
            {e.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{e.description}</p>}</div>
        ))}</div></section>}
        {data.educations.length > 0 && <section className="mb-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Education</h2><div className="space-y-3">{data.educations.map(e => (
          <div key={e.id}><h3 className="text-sm font-semibold text-gray-800">{e.degree}</h3><div className="text-xs text-gray-500">{e.school} • {e.startDate} - {e.isCurrent ? "Present" : e.endDate}</div></div>
        ))}</div></section>}
        <div className="grid grid-cols-2 gap-6">
          {data.skills.length > 0 && <section><h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Skills</h2><div className="flex flex-wrap gap-1.5">{data.skills.map(s => <span key={s.id} className="text-xs px-2.5 py-1 rounded-full text-white" style={{ background: c }}>{s.name}</span>)}</div></section>}
          {data.languages.length > 0 && <section><h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Languages</h2><div className="space-y-1.5">{data.languages.map(l => <div key={l.id} className="text-xs text-gray-700">{l.name} — <span style={{ color: c }}>{l.proficiency}</span></div>)}</div></section>}
        </div>
        {data.projects.length > 0 && <section className="mt-6"><h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Projects</h2><div className="grid grid-cols-2 gap-3">{data.projects.map(proj => (
          <div key={proj.id} className="p-3 rounded-lg" style={{ background: c + "08" }}><h3 className="text-xs font-semibold text-gray-800">{proj.name}</h3>{proj.description && <p className="text-[10px] text-gray-500 mt-0.5">{proj.description}</p>}</div>
        ))}</div></section>}
      </div>
    </div>
  );
}
