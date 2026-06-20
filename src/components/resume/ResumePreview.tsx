"use client";

import { SAMPLE, TemplateDef } from "./sampleData";

const INK = "#1f2430";
const MUTED = "#5b6472";
const FAINT = "#9aa3b2";
const LINE = "#e6e8ee";

function fontFor(f?: string) {
  if (f === "serif") return "Georgia, 'Times New Roman', serif";
  if (f === "mono") return "var(--font-mono), ui-monospace, monospace";
  return "var(--font-sans), system-ui, sans-serif";
}

function SecTitle({ children, color, style }: { children: React.ReactNode; color: string; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: "0.9em", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color, marginBottom: "0.45em", ...style }}>
      {children}
    </div>
  );
}

function Experience({ accent, light = false }: { accent: string; light?: boolean }) {
  const head = light ? "#fff" : INK;
  const sub = light ? "rgba(255,255,255,0.75)" : MUTED;
  const body = light ? "rgba(255,255,255,0.7)" : MUTED;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85em" }}>
      {SAMPLE.experience.map((x) => (
        <div key={x.role + x.company}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5em" }}>
            <span style={{ fontWeight: 700, color: head, fontSize: "1.02em" }}>{x.role}</span>
            <span style={{ color: light ? "rgba(255,255,255,0.7)" : accent, fontSize: "0.82em", whiteSpace: "nowrap", fontWeight: 600 }}>{x.period}</span>
          </div>
          <div style={{ color: light ? "rgba(255,255,255,0.85)" : accent, fontSize: "0.9em", fontWeight: 600, marginBottom: "0.2em" }}>{x.company}</div>
          <ul style={{ margin: 0, paddingInlineStart: "1.05em", color: body, fontSize: "0.86em", lineHeight: 1.45 }}>
            {x.bullets.map((b, i) => (
              <li key={i} style={{ marginBottom: "0.12em" }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Skills({ accent, variant }: { accent: string; variant: "chips" | "light" | "bars" }) {
  if (variant === "bars") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
        {SAMPLE.skills.map((s, i) => (
          <div key={s}>
            <div style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.85)", marginBottom: "0.2em" }}>{s}</div>
            <div style={{ height: "0.35em", background: "rgba(255,255,255,0.15)", borderRadius: 99 }}>
              <div style={{ width: `${92 - i * 7}%`, height: "100%", background: accent, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "light") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em" }}>
        {SAMPLE.skills.map((s) => (
          <span key={s} style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.92)", background: "rgba(255,255,255,0.16)", padding: "0.16em 0.6em", borderRadius: 99 }}>{s}</span>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em" }}>
      {SAMPLE.skills.map((s) => (
        <span key={s} style={{ fontSize: "0.82em", color: accent, background: `${accent}14`, border: `1px solid ${accent}33`, padding: "0.16em 0.6em", borderRadius: 99 }}>{s}</span>
      ))}
    </div>
  );
}

function Education({ light = false, accent }: { light?: boolean; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4em" }}>
      {SAMPLE.education.map((ed) => (
        <div key={ed.degree}>
          <div style={{ fontWeight: 700, fontSize: "0.92em", color: light ? "#fff" : INK }}>{ed.degree}</div>
          <div style={{ fontSize: "0.84em", color: light ? "rgba(255,255,255,0.8)" : accent, fontWeight: 600 }}>{ed.school}</div>
          <div style={{ fontSize: "0.8em", color: light ? "rgba(255,255,255,0.6)" : FAINT }}>{ed.period}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Layouts ---------------- */

function HeaderLayout({ accent, serif }: { accent: string; serif?: boolean }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: accent, color: "#fff", padding: "1.5em 1.6em 1.3em" }}>
        <div style={{ fontSize: "2.5em", fontWeight: 800, lineHeight: 1.05, fontFamily: serif ? "Georgia, serif" : undefined }}>{SAMPLE.name}</div>
        <div style={{ fontSize: "1.05em", fontWeight: 500, opacity: 0.92, marginTop: "0.15em" }}>{SAMPLE.title}</div>
      </div>
      <div style={{ display: "flex", gap: "1.4em", fontSize: "0.8em", color: MUTED, padding: "0.7em 1.6em", borderBottom: `1px solid ${LINE}`, flexWrap: "wrap" }}>
        <span>{SAMPLE.location}</span><span>{SAMPLE.email}</span><span>{SAMPLE.phone}</span>
      </div>
      <div style={{ display: "flex", gap: "1.5em", padding: "1.2em 1.6em", flex: 1 }}>
        <div style={{ flex: "1 1 62%", display: "flex", flexDirection: "column", gap: "1em" }}>
          <div>
            <SecTitle color={accent}>Profile</SecTitle>
            <div style={{ fontSize: "0.88em", color: MUTED, lineHeight: 1.5 }}>{SAMPLE.summary}</div>
          </div>
          <div>
            <SecTitle color={accent}>Experience</SecTitle>
            <Experience accent={accent} />
          </div>
        </div>
        <div style={{ flex: "1 1 38%", display: "flex", flexDirection: "column", gap: "1em" }}>
          <div>
            <SecTitle color={accent}>Skills</SecTitle>
            <Skills accent={accent} variant="chips" />
          </div>
          <div>
            <SecTitle color={accent}>Education</SecTitle>
            <Education accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLayout({ accent, serif }: { accent: string; serif?: boolean }) {
  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div style={{ width: "34%", background: accent, color: "#fff", padding: "1.4em 1.1em", display: "flex", flexDirection: "column", gap: "1.1em" }}>
        <div style={{ width: "3.4em", height: "3.4em", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.4em" }}>{SAMPLE.initials}</div>
        <div>
          <SecTitle color="rgba(255,255,255,0.95)">Contact</SecTitle>
          <div style={{ fontSize: "0.8em", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
            <div>{SAMPLE.location}</div><div>{SAMPLE.email}</div><div>{SAMPLE.phone}</div><div>{SAMPLE.site}</div>
          </div>
        </div>
        <div>
          <SecTitle color="rgba(255,255,255,0.95)">Skills</SecTitle>
          <Skills accent={accent} variant="light" />
        </div>
        <div>
          <SecTitle color="rgba(255,255,255,0.95)">Education</SecTitle>
          <Education light accent={accent} />
        </div>
      </div>
      <div style={{ flex: 1, padding: "1.5em 1.4em", display: "flex", flexDirection: "column", gap: "1em" }}>
        <div>
          <div style={{ fontSize: "2.2em", fontWeight: 800, lineHeight: 1.05, color: INK, fontFamily: serif ? "Georgia, serif" : undefined }}>{SAMPLE.name}</div>
          <div style={{ fontSize: "1.05em", fontWeight: 600, color: accent }}>{SAMPLE.title}</div>
        </div>
        <div>
          <SecTitle color={accent}>Profile</SecTitle>
          <div style={{ fontSize: "0.88em", color: MUTED, lineHeight: 1.5 }}>{SAMPLE.summary}</div>
        </div>
        <div>
          <SecTitle color={accent}>Experience</SecTitle>
          <Experience accent={accent} />
        </div>
      </div>
    </div>
  );
}

function SingleLayout({ accent, minimal }: { accent: string; minimal?: boolean }) {
  const head = minimal ? INK : accent;
  return (
    <div style={{ height: "100%", padding: "1.6em 1.7em", display: "flex", flexDirection: "column", gap: "1em" }}>
      <div style={{ textAlign: "center", paddingBottom: "0.9em", borderBottom: `${minimal ? 1 : 2}px solid ${minimal ? LINE : accent}` }}>
        <div style={{ fontSize: "2.4em", fontWeight: 800, color: INK, letterSpacing: minimal ? "0.02em" : 0 }}>{SAMPLE.name}</div>
        <div style={{ fontSize: "1.05em", fontWeight: 600, color: head, marginTop: "0.1em" }}>{SAMPLE.title}</div>
        <div style={{ fontSize: "0.8em", color: MUTED, marginTop: "0.4em" }}>{SAMPLE.location} · {SAMPLE.email} · {SAMPLE.phone}</div>
      </div>
      <div>
        <SecTitle color={head} style={{ borderBottom: minimal ? `1px solid ${LINE}` : undefined, paddingBottom: minimal ? "0.25em" : 0 }}>Summary</SecTitle>
        <div style={{ fontSize: "0.88em", color: MUTED, lineHeight: 1.5 }}>{SAMPLE.summary}</div>
      </div>
      <div>
        <SecTitle color={head} style={{ borderBottom: minimal ? `1px solid ${LINE}` : undefined, paddingBottom: minimal ? "0.25em" : 0 }}>Experience</SecTitle>
        <Experience accent={head} />
      </div>
      <div style={{ display: "flex", gap: "1.5em" }}>
        <div style={{ flex: 1 }}>
          <SecTitle color={head}>Skills</SecTitle>
          <div style={{ fontSize: "0.86em", color: MUTED, lineHeight: 1.6 }}>{SAMPLE.skills.join(" · ")}</div>
        </div>
        <div style={{ flex: 1 }}>
          <SecTitle color={head}>Education</SecTitle>
          <Education accent={head} />
        </div>
      </div>
    </div>
  );
}

function CreativeLayout({ accent }: { accent: string }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div style={{ width: "38%", background: accent, color: "#fff", padding: "1.4em 1.1em", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "3em", fontWeight: 900, lineHeight: 0.95 }}>{SAMPLE.name.split(" ")[0]}</div>
          <div style={{ fontSize: "3em", fontWeight: 900, lineHeight: 0.95, opacity: 0.55 }}>{SAMPLE.name.split(" ")[1]}</div>
          <div style={{ fontSize: "1em", fontWeight: 600, marginTop: "0.5em", opacity: 0.95 }}>{SAMPLE.title}</div>
        </div>
        <div style={{ flex: 1, padding: "1.2em 1.2em", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5em" }}>
          <div style={{ fontSize: "0.84em", color: MUTED, lineHeight: 1.5 }}>{SAMPLE.summary}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em", marginTop: "0.3em" }}>
            {SAMPLE.skills.slice(0, 4).map((s) => (
              <span key={s} style={{ fontSize: "0.78em", color: accent, background: `${accent}16`, padding: "0.15em 0.55em", borderRadius: 99, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "1.2em 1.4em", display: "flex", gap: "1.5em", flex: 1 }}>
        <div style={{ flex: "1 1 64%" }}>
          <div style={{ display: "inline-block", fontSize: "0.9em", fontWeight: 800, color: "#fff", background: accent, padding: "0.15em 0.7em", borderRadius: 4, marginBottom: "0.6em" }}>EXPERIENCE</div>
          <Experience accent={accent} />
        </div>
        <div style={{ flex: "1 1 36%" }}>
          <div style={{ display: "inline-block", fontSize: "0.9em", fontWeight: 800, color: "#fff", background: accent, padding: "0.15em 0.7em", borderRadius: 4, marginBottom: "0.6em" }}>EDUCATION</div>
          <Education accent={accent} />
        </div>
      </div>
    </div>
  );
}

function TechLayout({ accent }: { accent: string }) {
  const dark = "#0f172a";
  return (
    <div style={{ height: "100%", display: "flex", fontFamily: "var(--font-mono), monospace" }}>
      <div style={{ width: "36%", background: dark, color: "#e2e8f0", padding: "1.4em 1em", display: "flex", flexDirection: "column", gap: "1em" }}>
        <div>
          <div style={{ fontSize: "1.5em", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{SAMPLE.name}</div>
          <div style={{ fontSize: "0.85em", color: accent, marginTop: "0.2em" }}>&lt;{SAMPLE.title}/&gt;</div>
        </div>
        <div style={{ fontSize: "0.78em", color: "#94a3b8", lineHeight: 1.7 }}>
          <div>{SAMPLE.location}</div><div>{SAMPLE.email}</div><div>{SAMPLE.site}</div>
        </div>
        <div>
          <div style={{ fontSize: "0.82em", color: accent, marginBottom: "0.5em", fontWeight: 700 }}># skills</div>
          <Skills accent={accent} variant="bars" />
        </div>
      </div>
      <div style={{ flex: 1, padding: "1.5em 1.3em", display: "flex", flexDirection: "column", gap: "1em" }}>
        <div>
          <div style={{ fontSize: "0.85em", color: accent, fontWeight: 700, marginBottom: "0.4em" }}>## profile</div>
          <div style={{ fontSize: "0.85em", color: MUTED, lineHeight: 1.5 }}>{SAMPLE.summary}</div>
        </div>
        <div>
          <div style={{ fontSize: "0.85em", color: accent, fontWeight: 700, marginBottom: "0.5em" }}>## experience</div>
          <Experience accent={accent} />
        </div>
        <div>
          <div style={{ fontSize: "0.85em", color: accent, fontWeight: 700, marginBottom: "0.4em" }}>## education</div>
          <Education accent={accent} />
        </div>
      </div>
    </div>
  );
}

export function ResumePreview({ template, accent, className, style }: { template: TemplateDef; accent?: string; className?: string; style?: React.CSSProperties }) {
  const a = accent || template.accent;
  const paper: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: "#fff",
    color: INK,
    fontFamily: fontFor(template.font),
    fontSize: "2.5cqw",
    lineHeight: 1.4,
    overflow: "hidden",
    position: "relative",
  };
  return (
    <div className={className} style={{ containerType: "inline-size", width: "100%", aspectRatio: "1 / 1.414", ...style }}>
      <div dir="ltr" style={paper}>
        {template.layout === "header" && <HeaderLayout accent={a} serif={template.font === "serif"} />}
        {template.layout === "sidebar" && <SidebarLayout accent={a} serif={template.font === "serif"} />}
        {template.layout === "single" && <SingleLayout accent={a} minimal={template.minimal} />}
        {template.layout === "creative" && <CreativeLayout accent={a} />}
        {template.layout === "tech" && <TechLayout accent={a} />}
      </div>
    </div>
  );
}
