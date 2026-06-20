"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Phone, MapPin, Globe, Link2, FileText } from "lucide-react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { getTemplate, resumeDataToContent } from "@/components/resume/sampleData";
import type { ResumeData } from "@/types/resume";

// Defensive defaults so a partial / older save never leaves a section
// undefined when we hand the data to resumeDataToContent.
const EMPTY: ResumeData = {
  title: "",
  templateId: "executive",
  colorHex: "#4f46e5",
  fontFamily: "Inter, sans-serif",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    nationality: "",
    summary: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  languages: [],
  certificates: [],
  references: [],
  sectionOrder: [],
};

function normalize(parsed: Partial<ResumeData>, fallback: {
  title: string;
  templateId: string;
  colorHex: string;
}): ResumeData {
  return {
    ...EMPTY,
    ...parsed,
    title: parsed.title || fallback.title || EMPTY.title,
    templateId: parsed.templateId || fallback.templateId || EMPTY.templateId,
    colorHex: parsed.colorHex || fallback.colorHex || EMPTY.colorHex,
    personalInfo: { ...EMPTY.personalInfo, ...(parsed.personalInfo || {}) },
    experiences: parsed.experiences ?? [],
    educations: parsed.educations ?? [],
    skills: parsed.skills ?? [],
    projects: parsed.projects ?? [],
    languages: parsed.languages ?? [],
    certificates: parsed.certificates ?? [],
    references: parsed.references ?? [],
    sectionOrder: parsed.sectionOrder ?? EMPTY.sectionOrder,
  };
}

type Status = "loading" | "ready" | "notfound";

export default function PublicPortfolioPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const slug = params?.slug as string | undefined;

  const [status, setStatus] = useState<Status>("loading");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  useEffect(() => {
    if (!slug) {
      setStatus("notfound");
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/public/${slug}`);
        if (!active) return;
        if (!res.ok) {
          setStatus("notfound");
          return;
        }
        const { resume } = await res.json();
        const fallback = {
          title: resume?.title || "",
          templateId: resume?.templateId || "executive",
          colorHex: resume?.colorHex || "#4f46e5",
        };
        let parsed: Partial<ResumeData> = {};
        if (resume?.dataJson) {
          try {
            parsed = JSON.parse(resume.dataJson);
          } catch {
            parsed = {};
          }
        }
        setResumeData(normalize(parsed, fallback));
        setStatus("ready");
      } catch {
        if (active) setStatus("notfound");
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const fullName = useMemo(() => {
    if (!resumeData) return "";
    const p = resumeData.personalInfo;
    return `${p.firstName || ""} ${p.lastName || ""}`.trim();
  }, [resumeData]);

  const headline = useMemo(() => {
    if (!resumeData) return "";
    return resumeData.experiences[0]?.jobTitle || "";
  }, [resumeData]);

  // SEO: reflect the person's name in the document title.
  useEffect(() => {
    if (status === "ready" && fullName) {
      document.title = `${fullName}${headline ? ` — ${headline}` : ""} | ResumeX`;
    } else if (status === "notfound") {
      document.title = "Page not found | ResumeX";
    }
  }, [status, fullName, headline]);

  if (status === "loading") {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "100vh", background: "var(--bg-primary)" }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-500)" }} />
      </div>
    );
  }

  if (status === "notfound" || !resumeData) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "100vh", background: "var(--bg-primary)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: "var(--bg-tertiary)" }}
        >
          <FileText className="w-8 h-8" style={{ color: "var(--text-tertiary)" }} />
        </div>
        <h1
          className="font-display text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          This portfolio isn&apos;t available
        </h1>
        <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--text-secondary)" }}>
          The page you&apos;re looking for is private or doesn&apos;t exist.
        </p>
        <Link
          href={`/${locale}`}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary transition-all hover:shadow-lg hover:scale-105"
        >
          Go to ResumeX
        </Link>
      </div>
    );
  }

  const accent = resumeData.colorHex || "#4f46e5";
  const p = resumeData.personalInfo;
  const locationLabel = [p.city, p.country].filter(Boolean).join(", ") || p.address || "";

  const socials = [
    p.email ? { icon: Mail, label: p.email, href: `mailto:${p.email}` } : null,
    p.phone ? { icon: Phone, label: p.phone, href: `tel:${p.phone}` } : null,
    p.websiteUrl
      ? { icon: Globe, label: "Website", href: p.websiteUrl }
      : null,
    p.linkedinUrl
      ? { icon: Link2, label: "LinkedIn", href: p.linkedinUrl }
      : null,
    p.githubUrl ? { icon: Link2, label: "GitHub", href: p.githubUrl } : null,
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      {/* Hero band */}
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, var(--violet-500) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 45%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center">
          {p.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.photoUrl}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-5 border-4"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl font-bold text-white border-4"
              style={{
                background: "rgba(255,255,255,0.18)",
                borderColor: "rgba(255,255,255,0.4)",
              }}
            >
              {`${(p.firstName || "")[0] || ""}${(p.lastName || "")[0] || ""}`.toUpperCase() ||
                "CV"}
            </div>
          )}
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {fullName || "Your Name"}
          </h1>
          {headline && (
            <p className="mt-2 text-lg sm:text-xl font-medium text-white/90">{headline}</p>
          )}
          {locationLabel && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="w-4 h-4" />
              {locationLabel}
            </p>
          )}

          {socials.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {socials.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {s.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Resume canvas */}
      <main className="px-4 sm:px-6 py-10 sm:py-14">
        <div
          className="mx-auto"
          style={{
            maxWidth: "820px",
            background: "#fff",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
          }}
        >
          <ResumePreview
            template={getTemplate(resumeData.templateId)}
            accent={accent}
            data={resumeDataToContent(resumeData)}
            mode="page"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-12 text-center">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-medium transition-opacity hover:opacity-80"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold gradient-primary"
            aria-hidden
          >
            R
          </span>
          Made with ResumeX
        </Link>
      </footer>
    </div>
  );
}
