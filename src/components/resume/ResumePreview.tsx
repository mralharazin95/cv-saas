"use client";

import { SAMPLE, SampleResume, TemplateDef } from "./sampleData";

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

function Experience({ data, accent, light = false }: { data: SampleResume; accent: string; light?: boolean }) {
  const head = light ? "#fff" : INK;
  const body = light ? "rgba(255,255,255,0.72)" : MUTED;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85em" }}>
      {data.experience.map((x, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5em" }}>
            <span style={{ fontWeight: 700, color: head, fontSize: "1.02em" }}>{x.role || "Role"}</span>
            {x.period && <span style={{ color: light ? "rgba(255,255,255,0.7)" : accent, fontSize: "0.82em", whiteSpace: "nowrap", fontWeight: 600 }}>{x.period}</span>}
          </div>
          {x.company && <div style={{ color: light ? "rgba(255,255,255,0.85)" : accent, fontSize: "0.9em", fontWeight: 600, marginBottom: "0.2em" }}>{x.company}</div>}
          {x.bullets.length > 0 && (
            <ul style={{ margin: 0, paddingInlineStart: "1.05em", color: body, fontSize: "0.86em", lineHeight: 1.45 }}>
              {x.bullets.map((b, j) => (
                <li key={j} style={{ marginBottom: "0.12em" }}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function Skills({ data, accent, variant }: { data: SampleResume; accent: string; variant: "chips" | "light" | "bars" }) {
  if (variant === "bars") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
        {data.skills.map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.85)", marginBottom: "0.2em" }}>{s}</div>
            <div style={{ height: "0.35em", background: "rgba(255,255,255,0.15)", borderRadius: 99 }}>
              <div style={{ width: `${Math.max(55, 92 - i * 6)}%`, height: "100%", background: accent, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "light") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em" }}>
        {data.skills.map((s, i) => (
          <span key={i} style={{ fontSize: "0.82em", color: "rgba(255,255,255,0.92)", background: "rgba(255,255,255,0.16)", padding: "0.16em 0.6em", borderRadius: 99 }}>{s}</span>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em" }}>
      {data.skills.map((s, i) => (
        <span key={i} style={{ fontSize: "0.82em", color: accent, background: `${accent}14`, border: `1px solid ${accent}33`, padding: "0.16em 0.6em", borderRadius: 99 }}>{s}</span>
      ))}
    </div>
  );
}

function Education({ data, accent, light = false }: { data: SampleResume; accent: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4em" }}>
      {data.education.map((ed, i) => (
        <div key={i}>
          <div style={{ fontWeight: 700, fontSize: "0.92em", color: light ? "#fff" : INK }}>{ed.degree || "Degree"}</div>
          {ed.school && <div style={{ fontSize: "0.84em", color: light ? "rgba(255,255,255,0.8)" : accent, fontWeight: 600 }}>{ed.school}</div>}
          {ed.period && <div style={{ fontSize: "0.8em", color: light ? "rgba(255,255,255,0.6)" : FAINT }}>{ed.period}</div>}
        </div>
      ))}
    </div>
  );
}

function Languages({ data, accent, light = false }: { data: SampleResume; accent: string; light?: boolean }) {
  if (!data.languages?.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25em" }}>
      {data.languages.map((l, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84em", color: light ? "rgba(255,255,255,0.85)" : MUTED }}>
          <span>{l.name}</span>
          <span style={{ color: light ? "rgba(255,255,255,0.6)" : accent }}>{l.level}</span>
        </div>
      ))}
    </div>
  );
}

function Extras({ data, accent }: { data: SampleResume; accent: string }) {
  return (
    <>
      {data.projects?.length ? (
        <div>
          <SecTitle color={accent}>Projects</SecTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
            {data.projects.map((p, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, fontSize: "0.92em", color: INK }}>{p.name}</div>
                {p.description && <div style={{ fontSize: "0.84em", color: MUTED, lineHeight: 1.45 }}>{p.description}</div>}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {data.certificates?.length ? (
        <div>
          <SecTitle color={accent}>Certificates</SecTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3em" }}>
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: "0.86em", color: MUTED }}>
                <span style={{ fontWeight: 600, color: INK }}>{c.name}</span>
                {c.issuer ? ` — ${c.issuer}` : ""}{c.date ? ` (${c.date})` : ""}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Contact({ data, color }: { data: SampleResume; color: string }) {
  const items = [data.location, data.email, data.phone, data.site].filter(Boolean);
  if (!items.length) return null;
  return <div style={{ display: "flex", gap: "1.2em", fontSize: "0.8em", color, flexWrap: "wrap" }}>{items.map((it, i) => <span key={i}>{it}</span>)}</div>;
}

type LayoutProps = { data: SampleResume; accent: string; serif?: boolean; minimal?: boolean; rootStyle: React.CSSProperties };

function HeaderLayout({ data, accent, serif, rootStyle }: LayoutProps) {
  return (
    <div style={{ ...rootStyle, display: "flex", flexDirection: "column" }}>
      <div style={{ background: accent, color: "#fff", padding: "1.5em 1.6em 1.3em" }}>
        <div style={{ fontSize: "2.5em", fontWeight: 800, lineHeight: 1.05, fontFamily: serif ? "Georgia, serif" : undefined }}>{data.name}</div>
        {data.title && <div style={{ fontSize: "1.05em", fontWeight: 500, opacity: 0.92, marginTop: "0.15em" }}>{data.title}</div>}
      </div>
      <div style={{ padding: "0.7em 1.6em", borderBottom: `1px solid ${LINE}` }}><Contact data={data} color={MUTED} /></div>
      <div style={{ display: "flex", gap: "1.5em", padding: "1.2em 1.6em", flex: 1 }}>
        <div style={{ flex: "1 1 62%", display: "flex", flexDirection: "column", gap: "1em", minWidth: 0 }}>
          {data.summary && <div><SecTitle color={accent}>Profile</SecTitle><div style={{ fontSize: "0.88em", color: MUTED, lineHeight: 1.5 }}>{data.summary}</div></div>}
          {data.experience.length > 0 && <div><SecTitle color={accent}>Experience</SecTitle><Experience data={data} accent={accent} /></div>}
          <Extras data={data} accent={accent} />
        </div>
        <div style={{ flex: "1 1 38%", display: "flex", flexDirection: "column", gap: "1em", minWidth: 0 }}>
          {data.skills.length > 0 && <div><SecTitle color={accent}>Skills</SecTitle><Skills data={data} accent={accent} variant="chips" /></div>}
          {data.languages?.length ? <div><SecTitle color={accent}>Languages</SecTitle><Languages data={data} accent={accent} /></div> : null}
          {data.education.length > 0 && <div><SecTitle color={accent}>Education</SecTitle><Education data={data} accent={accent} /></div>}
        </div>
      </div>
    </div>
  );
}

function SidebarLayout({ data, accent, serif, rootStyle }: LayoutProps) {
  return (
    <div style={{ ...rootStyle, display: "flex" }}>
      <div style={{ width: "34%", background: accent, color: "#fff", padding: "1.4em 1.1em", display: "flex", flexDirection: "column", gap: "1.1em" }}>
        <div style={{ width: "3.4em", height: "3.4em", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.4em" }}>{data.initials}</div>
        <div>
          <SecTitle color="rgba(255,255,255,0.95)">Contact</SecTitle>
          <div style={{ fontSize: "0.8em", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, wordBreak: "break-word" }}>
            {[data.location, data.email, data.phone, data.site].filter(Boolean).map((it, i) => <div key={i}>{it}</div>)}
          </div>
        </div>
        {data.skills.length > 0 && <div><SecTitle color="rgba(255,255,255,0.95)">Skills</SecTitle><Skills data={data} accent={accent} variant="light" /></div>}
        {data.languages?.length ? <div><SecTitle color="rgba(255,255,255,0.95)">Languages</SecTitle><Languages data={data} accent={accent} light /></div> : null}
        {data.education.length > 0 && <div><SecTitle color="rgba(255,255,255,0.95)">Education</SecTitle><Education data={data} accent={accent} light /></div>}
      </div>
      <div style={{ flex: 1, padding: "1.5em 1.4em", display: "flex", flexDirection: "column", gap: "1em", minWidth: 0 }}>
        <div>
          <div style={{ fontSize: "2.2em", fontWeight: 800, lineHeight: 1.05, color: INK, fontFamily: serif ? "Georgia, serif" : undefined }}>{data.name}</div>
          {data.title && <div style={{ fontSize: "1.05em", fontWeight: 600, color: accent }}>{data.title}</div>}
        </div>
        {data.summary && <div><SecTitle color={accent}>Profile</SecTitle><div style={{ fontSize: "0.88em", color: MUTED, lineHeight: 1.5 }}>{data.summary}</div></div>}
        {data.experience.length > 0 && <div><SecTitle color={accent}>Experience</SecTitle><Experience data={data} accent={accent} /></div>}
        <Extras data={data} accent={accent} />
      </div>
    </div>
  );
}

function SingleLayout({ data, accent, minimal, rootStyle }: LayoutProps) {
  const head = minimal ? INK : accent;
  return (
    <div style={{ ...rootStyle, padding: "1.6em 1.7em", display: "flex", flexDirection: "column", gap: "1em" }}>
      <div style={{ textAlign: "center", paddingBottom: "0.9em", borderBottom: `${minimal ? 1 : 2}px solid ${minimal ? LINE : accent}` }}>
        <div style={{ fontSize: "2.4em", fontWeight: 800, color: INK, letterSpacing: minimal ? "0.02em" : 0 }}>{data.name}</div>
        {data.title && <div style={{ fontSize: "1.05em", fontWeight: 600, color: head, marginTop: "0.1em" }}>{data.title}</div>}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.4em" }}><Contact data={data} color={MUTED} /></div>
      </div>
      {data.summary && <div><SecTitle color={head}>Summary</SecTitle><div style={{ fontSize: "0.88em", color: MUTED, lineHeight: 1.5 }}>{data.summary}</div></div>}
      {data.experience.length > 0 && <div><SecTitle color={head}>Experience</SecTitle><Experience data={data} accent={head} /></div>}
      <Extras data={data} accent={head} />
      <div style={{ display: "flex", gap: "1.5em" }}>
        {data.skills.length > 0 && <div style={{ flex: 1 }}><SecTitle color={head}>Skills</SecTitle><div style={{ fontSize: "0.86em", color: MUTED, lineHeight: 1.6 }}>{data.skills.join(" · ")}</div></div>}
        {data.education.length > 0 && <div style={{ flex: 1 }}><SecTitle color={head}>Education</SecTitle><Education data={data} accent={head} /></div>}
      </div>
      {data.languages?.length ? <div><SecTitle color={head}>Languages</SecTitle><div style={{ fontSize: "0.86em", color: MUTED }}>{data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</div></div> : null}
    </div>
  );
}

function CreativeLayout({ data, accent, rootStyle }: LayoutProps) {
  const [first, ...rest] = data.name.split(" ");
  return (
    <div style={{ ...rootStyle, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div style={{ width: "38%", background: accent, color: "#fff", padding: "1.4em 1.1em", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "3em", fontWeight: 900, lineHeight: 0.95 }}>{first}</div>
          {rest.length > 0 && <div style={{ fontSize: "3em", fontWeight: 900, lineHeight: 0.95, opacity: 0.55 }}>{rest.join(" ")}</div>}
          {data.title && <div style={{ fontSize: "1em", fontWeight: 600, marginTop: "0.5em", opacity: 0.95 }}>{data.title}</div>}
        </div>
        <div style={{ flex: 1, padding: "1.2em", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5em", minWidth: 0 }}>
          {data.summary && <div style={{ fontSize: "0.84em", color: MUTED, lineHeight: 1.5 }}>{data.summary}</div>}
          {data.skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4em", marginTop: "0.3em" }}>
              {data.skills.slice(0, 6).map((s, i) => <span key={i} style={{ fontSize: "0.78em", color: accent, background: `${accent}16`, padding: "0.15em 0.55em", borderRadius: 99, fontWeight: 600 }}>{s}</span>)}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "1.2em 1.4em", display: "flex", gap: "1.5em", flex: 1, minWidth: 0 }}>
        <div style={{ flex: "1 1 64%", display: "flex", flexDirection: "column", gap: "1em", minWidth: 0 }}>
          {data.experience.length > 0 && <div><div style={{ display: "inline-block", fontSize: "0.9em", fontWeight: 800, color: "#fff", background: accent, padding: "0.15em 0.7em", borderRadius: 4, marginBottom: "0.6em" }}>EXPERIENCE</div><Experience data={data} accent={accent} /></div>}
          <Extras data={data} accent={accent} />
        </div>
        <div style={{ flex: "1 1 36%", display: "flex", flexDirection: "column", gap: "1em", minWidth: 0 }}>
          {data.education.length > 0 && <div><div style={{ display: "inline-block", fontSize: "0.9em", fontWeight: 800, color: "#fff", background: accent, padding: "0.15em 0.7em", borderRadius: 4, marginBottom: "0.6em" }}>EDUCATION</div><Education data={data} accent={accent} /></div>}
          {data.languages?.length ? <div><div style={{ display: "inline-block", fontSize: "0.9em", fontWeight: 800, color: "#fff", background: accent, padding: "0.15em 0.7em", borderRadius: 4, marginBottom: "0.6em" }}>LANGUAGES</div><Languages data={data} accent={accent} /></div> : null}
        </div>
      </div>
    </div>
  );
}

function TechLayout({ data, accent, rootStyle }: LayoutProps) {
  const dark = "#0f172a";
  return (
    <div style={{ ...rootStyle, display: "flex", fontFamily: "var(--font-mono), monospace" }}>
      <div style={{ width: "36%", background: dark, color: "#e2e8f0", padding: "1.4em 1em", display: "flex", flexDirection: "column", gap: "1em" }}>
        <div>
          <div style={{ fontSize: "1.5em", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{data.name}</div>
          {data.title && <div style={{ fontSize: "0.85em", color: accent, marginTop: "0.2em" }}>&lt;{data.title}/&gt;</div>}
        </div>
        <div style={{ fontSize: "0.78em", color: "#94a3b8", lineHeight: 1.7, wordBreak: "break-word" }}>
          {[data.location, data.email, data.site].filter(Boolean).map((it, i) => <div key={i}>{it}</div>)}
        </div>
        {data.skills.length > 0 && <div><div style={{ fontSize: "0.82em", color: accent, marginBottom: "0.5em", fontWeight: 700 }}># skills</div><Skills data={data} accent={accent} variant="bars" /></div>}
        {data.languages?.length ? <div><div style={{ fontSize: "0.82em", color: accent, marginBottom: "0.4em", fontWeight: 700 }}># languages</div><Languages data={data} accent={accent} light /></div> : null}
      </div>
      <div style={{ flex: 1, padding: "1.5em 1.3em", display: "flex", flexDirection: "column", gap: "1em", minWidth: 0 }}>
        {data.summary && <div><div style={{ fontSize: "0.85em", color: accent, fontWeight: 700, marginBottom: "0.4em" }}>## profile</div><div style={{ fontSize: "0.85em", color: MUTED, lineHeight: 1.5 }}>{data.summary}</div></div>}
        {data.experience.length > 0 && <div><div style={{ fontSize: "0.85em", color: accent, fontWeight: 700, marginBottom: "0.5em" }}>## experience</div><Experience data={data} accent={accent} /></div>}
        <Extras data={data} accent={accent} />
        {data.education.length > 0 && <div><div style={{ fontSize: "0.85em", color: accent, fontWeight: 700, marginBottom: "0.4em" }}>## education</div><Education data={data} accent={accent} /></div>}
      </div>
    </div>
  );
}

export function ResumePreview({
  template,
  accent,
  data,
  mode = "thumb",
  className,
  style,
}: {
  template: TemplateDef;
  accent?: string;
  data?: SampleResume;
  mode?: "thumb" | "page";
  className?: string;
  style?: React.CSSProperties;
}) {
  const d = data || SAMPLE;
  const a = accent || template.accent;
  const isPage = mode === "page";

  const wrap: React.CSSProperties = isPage
    ? { width: "100%", display: "flex", ...style }
    : { containerType: "inline-size", width: "100%", aspectRatio: "1 / 1.414", display: "flex", ...style };

  const paper: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    background: "#fff",
    color: INK,
    fontFamily: fontFor(template.font),
    fontSize: isPage ? "13px" : "2.5cqw",
    lineHeight: 1.4,
    overflow: isPage ? "visible" : "hidden",
    minHeight: isPage ? "1123px" : undefined,
  };

  const rootStyle: React.CSSProperties = isPage ? { minHeight: "1123px" } : { height: "100%" };
  const common = { data: d, accent: a, rootStyle };

  return (
    <div className={className} style={wrap}>
      <div dir="ltr" style={paper}>
        {template.layout === "header" && <HeaderLayout {...common} serif={template.font === "serif"} />}
        {template.layout === "sidebar" && <SidebarLayout {...common} serif={template.font === "serif"} />}
        {template.layout === "single" && <SingleLayout {...common} minimal={template.minimal} />}
        {template.layout === "creative" && <CreativeLayout {...common} />}
        {template.layout === "tech" && <TechLayout {...common} />}
      </div>
    </div>
  );
}
