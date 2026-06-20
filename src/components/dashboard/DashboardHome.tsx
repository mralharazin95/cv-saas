"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Gauge,
  LayoutGrid,
  Briefcase,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Pencil,
  Trash2,
  Building2,
  PenLine,
  ScanLine,
} from "lucide-react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { getTemplate } from "@/components/resume/sampleData";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface ResumeCard {
  id: string;
  title: string;
  templateId: string;
  colorHex: string;
  updatedAt: string;
}

type AppStatus = "Applied" | "Interview" | "Offer" | "Rejected";

interface Application {
  id: string;
  company: string;
  role: string;
  status: AppStatus;
  date: string;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "resumex.applications.v1";

const STATUSES: AppStatus[] = ["Applied", "Interview", "Offer", "Rejected"];

const STATUS_STYLE: Record<AppStatus, { bg: string; color: string; dot: string }> = {
  Applied: { bg: "rgba(99,102,241,0.12)", color: "var(--primary-600)", dot: "var(--primary-500)" },
  Interview: { bg: "rgba(245,158,11,0.14)", color: "#b45309", dot: "var(--warning)" },
  Offer: { bg: "rgba(16,185,129,0.14)", color: "#047857", dot: "var(--success)" },
  Rejected: { bg: "rgba(239,68,68,0.12)", color: "#b91c1c", dot: "var(--danger)" },
};

const SAMPLE_APPLICATIONS: Application[] = [
  { id: "seed-1", company: "Stripe", role: "Senior Product Designer", status: "Interview", date: "2026-06-12" },
  { id: "seed-2", company: "Linear", role: "Product Designer", status: "Applied", date: "2026-06-16" },
  { id: "seed-3", company: "Figma", role: "Design Systems Lead", status: "Offer", date: "2026-06-05" },
];

const AI_TIPS = [
  {
    title: "Quantify your impact",
    body: "Resumes with metrics get 40% more interviews. Add numbers to your top 3 bullet points.",
    tone: "var(--primary-500)",
  },
  {
    title: "Match the job description",
    body: "Mirror keywords from the posting to clear ATS filters and boost your match score.",
    tone: "var(--violet-500)",
  },
  {
    title: "Tighten your summary",
    body: "Keep it to 2-3 sentences focused on your strongest, most relevant wins.",
    tone: "var(--accent-500)",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function DashboardHome() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const firstName = (session?.user?.name || "there").split(" ")[0];

  const [resumes, setResumes] = useState<ResumeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  /* ---- resumes ---- */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          if (active) setResumes(data.resumes || []);
        }
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const createResume = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/resumes", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/builder/${data.id}`);
        return;
      }
    } catch (err) {
      console.error("Failed to create resume:", err);
    }
    setCreating(false);
  };

  /* ---- application tracker (localStorage) ---- */
  const [apps, setApps] = useState<Application[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setApps(parsed);
        else setApps(SAMPLE_APPLICATIONS);
      } else {
        setApps(SAMPLE_APPLICATIONS);
      }
    } catch {
      setApps(SAMPLE_APPLICATIONS);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch {
      /* ignore quota errors */
    }
  }, [apps]);

  const addApp = () => {
    setApps((prev) => [
      {
        id: uid(),
        company: "",
        role: "",
        status: "Applied",
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const updateApp = (id: string, patch: Partial<Application>) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const removeApp = (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  /* ---- derived stats ---- */
  const templatesUsed = new Set(resumes.map((r) => r.templateId)).size;
  const activeApps = apps.filter((a) => a.status === "Applied" || a.status === "Interview").length;
  const atsScore = 86; // representative score

  const stats = [
    {
      icon: FileText,
      label: "Total resumes",
      value: loading ? "—" : String(resumes.length),
      tint: "var(--primary-500)",
      bg: "rgba(99,102,241,0.10)",
      delta: "Live",
    },
    {
      icon: Gauge,
      label: "Avg ATS score",
      value: `${atsScore}`,
      tint: "var(--success)",
      bg: "rgba(16,185,129,0.10)",
      delta: "+4 this week",
    },
    {
      icon: LayoutGrid,
      label: "Templates used",
      value: loading ? "—" : String(templatesUsed),
      tint: "var(--violet-500)",
      bg: "rgba(139,92,246,0.10)",
      delta: "of 20",
    },
    {
      icon: Briefcase,
      label: "Active applications",
      value: String(activeApps),
      tint: "var(--accent-500)",
      bg: "rgba(245,158,11,0.10)",
      delta: `${apps.length} total`,
    },
  ];

  /* ---- recent activity (derived from resumes + apps) ---- */
  const activity = buildActivity(resumes, apps);

  /* ---------------------------------------------------------------- */

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* Greeting / hero */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--text-tertiary)" }}>
            {greeting()},
          </p>
          <h1 className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {firstName}
            <span className="gradient-text"> — let&apos;s land the role.</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Track your resumes, polish them with AI, and stay on top of every application.
          </p>
        </div>
        <button
          onClick={createResume}
          disabled={creating}
          className="self-start flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold gradient-primary transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create new resume
        </button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.tint }} />
                </div>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
                >
                  {s.delta}
                </span>
              </div>
              <div className="text-3xl font-bold leading-none mb-1" style={{ color: "var(--text-primary)" }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid: resumes (left, wide) + side column */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ---- Your resumes ---- */}
        <section className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Your resumes
            </h2>
            <Link
              href={`/${locale}/dashboard/resumes`}
              className="text-sm font-medium flex items-center gap-1 transition-colors"
              style={{ color: "var(--primary-600)" }}
            >
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 card">
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: "var(--primary-500)" }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Create card */}
              <button
                onClick={createResume}
                disabled={creating}
                className="group rounded-2xl flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--bg-elevated)",
                  border: "2px dashed var(--border-primary)",
                  minHeight: 220,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 gradient-primary"
                >
                  {creating ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : (
                    <Plus className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  New resume
                </span>
                <span className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
                  Start from a template
                </span>
              </button>

              {resumes.length === 0 ? (
                <div
                  className="col-span-1 sm:col-span-2 rounded-2xl flex flex-col items-center justify-center text-center gap-2 p-6"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-primary)", minHeight: 220 }}
                >
                  <FileText className="w-8 h-8" style={{ color: "var(--text-tertiary)" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    No resumes yet
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Create your first one to see it here.
                  </p>
                </div>
              ) : (
                resumes.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/${locale}/builder/${r.id}`}
                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border-primary)",
                      boxShadow: "var(--shadow-md)",
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    {/* Mini preview — sample data via no `data` prop */}
                    <div
                      className="relative overflow-hidden"
                      style={{ borderBottom: "1px solid var(--border-primary)", background: "#fff" }}
                    >
                      <div className="pointer-events-none">
                        <ResumePreview
                          template={getTemplate(r.templateId)}
                          accent={r.colorHex}
                          mode="thumb"
                        />
                      </div>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent 55%)" }}
                      >
                        <span className="badge-brand text-[10px] flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {r.title || "Untitled resume"}
                      </h3>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        Updated {timeAgo(r.updatedAt)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Application tracker */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  Application tracker
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  Saved locally on this device.
                </p>
              </div>
              <button
                onClick={addApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                style={{ background: "var(--primary-50)", color: "var(--primary-600)" }}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* status summary chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {STATUSES.map((st) => {
                const count = apps.filter((a) => a.status === st).length;
                const sty = STATUS_STYLE[st];
                return (
                  <span
                    key={st}
                    className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    style={{ background: sty.bg, color: sty.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sty.dot }} />
                    {st} · {count}
                  </span>
                );
              })}
            </div>

            <div className="card overflow-hidden">
              {/* header row (md+) */}
              <div
                className="hidden md:grid px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  gridTemplateColumns: "1.4fr 1.6fr 1fr 0.9fr 36px",
                  color: "var(--text-tertiary)",
                  borderBottom: "1px solid var(--border-primary)",
                  background: "var(--bg-secondary)",
                }}
              >
                <span>Company</span>
                <span>Role</span>
                <span>Status</span>
                <span>Date</span>
                <span />
              </div>

              {apps.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    No applications tracked yet.
                  </p>
                  <button
                    onClick={addApp}
                    className="mt-3 text-sm font-medium"
                    style={{ color: "var(--primary-600)" }}
                  >
                    + Add your first one
                  </button>
                </div>
              ) : (
                apps.map((a) => {
                  const sty = STATUS_STYLE[a.status];
                  return (
                    <div
                      key={a.id}
                      className="grid grid-cols-1 md:grid-cols-[1.4fr_1.6fr_1fr_0.9fr_36px] gap-2 md:gap-3 px-4 py-3 items-center"
                      style={{ borderBottom: "1px solid var(--border-primary)" }}
                    >
                      {/* company */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
                        <input
                          value={a.company}
                          onChange={(e) => updateApp(a.id, { company: e.target.value })}
                          placeholder="Company"
                          className="w-full bg-transparent text-sm font-medium outline-none"
                          style={{ color: "var(--text-primary)" }}
                        />
                      </div>
                      {/* role */}
                      <input
                        value={a.role}
                        onChange={(e) => updateApp(a.id, { role: e.target.value })}
                        placeholder="Role / title"
                        className="w-full bg-transparent text-sm outline-none"
                        style={{ color: "var(--text-secondary)" }}
                      />
                      {/* status */}
                      <div className="relative">
                        <select
                          value={a.status}
                          onChange={(e) => updateApp(a.id, { status: e.target.value as AppStatus })}
                          className="w-full appearance-none text-xs font-semibold rounded-full pl-3 pr-7 py-1.5 outline-none cursor-pointer"
                          style={{ background: sty.bg, color: sty.color }}
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st} style={{ color: "var(--text-primary)", background: "var(--bg-elevated)" }}>
                              {st}
                            </option>
                          ))}
                        </select>
                        <span
                          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                          style={{ background: sty.dot }}
                        />
                      </div>
                      {/* date */}
                      <input
                        type="date"
                        value={a.date}
                        onChange={(e) => updateApp(a.id, { date: e.target.value })}
                        className="w-full bg-transparent text-xs outline-none"
                        style={{ color: "var(--text-tertiary)" }}
                      />
                      {/* remove */}
                      <button
                        onClick={() => removeApp(a.id)}
                        className="justify-self-start md:justify-self-center p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        style={{ color: "var(--text-tertiary)" }}
                        aria-label="Remove application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ---- Side column ---- */}
        <aside className="flex flex-col gap-6">
          {/* AI recommendations */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--violet-500))",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white">AI recommendations</h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.82)" }}>
                Smart tips to sharpen your profile.
              </p>
              <div className="flex flex-col gap-2.5">
                {AI_TIPS.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(4px)" }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Lightbulb className="w-3.5 h-3.5 text-white" />
                      <span className="text-sm font-semibold text-white">{tip.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {tip.body}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href={`/${locale}/analyzer`}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: "#fff", color: "var(--primary-700)" }}
              >
                <ScanLine className="w-4 h-4" /> Run ATS analysis
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Quick actions
            </h3>
            <div className="flex flex-col gap-2">
              <QuickAction
                href={`/${locale}/cover`}
                icon={PenLine}
                tint="var(--violet-500)"
                bg="rgba(139,92,246,0.10)"
                title="Write a cover letter"
                subtitle="AI-drafted in seconds"
              />
              <QuickAction
                href={`/${locale}/analyzer`}
                icon={ScanLine}
                tint="var(--success)"
                bg="rgba(16,185,129,0.10)"
                title="Analyze a resume"
                subtitle="Check your ATS score"
              />
              <QuickAction
                href={`/${locale}/dashboard/resumes`}
                icon={LayoutGrid}
                tint="var(--primary-500)"
                bg="rgba(99,102,241,0.10)"
                title="Browse templates"
                subtitle="20 designs to pick from"
              />
            </div>
          </div>

          {/* Recent activity */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Recent activity
              </h3>
              <Clock className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            </div>
            {activity.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Your activity will show up here.
              </p>
            ) : (
              <ol className="flex flex-col gap-4">
                {activity.map((ev, idx) => {
                  const Icon = ev.icon;
                  return (
                    <li key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: ev.bg }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: ev.tint }} />
                        </div>
                        {idx < activity.length - 1 && (
                          <div className="w-px flex-1 mt-1" style={{ background: "var(--border-primary)" }} />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                          {ev.text}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                          {ev.when}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function QuickAction({
  href,
  icon: Icon,
  tint,
  bg,
  title,
  subtitle,
}: {
  href: string;
  icon: typeof PenLine;
  tint: string;
  bg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-2.5 rounded-xl transition-all"
      style={{ border: "1px solid var(--border-primary)" }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <Icon className="w-4.5 h-4.5" style={{ color: tint }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {title}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
          {subtitle}
        </p>
      </div>
      <ArrowUpRight
        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--text-tertiary)" }}
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Activity feed builder                                              */
/* ------------------------------------------------------------------ */

interface ActivityEvent {
  icon: typeof FileText;
  tint: string;
  bg: string;
  text: React.ReactNode;
  when: string;
  sortKey: number;
}

function buildActivity(resumes: ResumeCard[], apps: Application[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  resumes.slice(0, 3).forEach((r) => {
    const ts = new Date(r.updatedAt).getTime();
    events.push({
      icon: FileText,
      tint: "var(--primary-500)",
      bg: "rgba(99,102,241,0.10)",
      text: (
        <>
          Updated <strong>{r.title || "a resume"}</strong>
        </>
      ),
      when: timeAgo(r.updatedAt),
      sortKey: Number.isNaN(ts) ? 0 : ts,
    });
  });

  apps
    .filter((a) => a.company || a.role)
    .slice(0, 3)
    .forEach((a) => {
      const offer = a.status === "Offer";
      const interview = a.status === "Interview";
      const ts = new Date(a.date).getTime();
      events.push({
        icon: offer ? CheckCircle2 : interview ? TrendingUp : Briefcase,
        tint: offer ? "var(--success)" : interview ? "var(--warning)" : "var(--text-secondary)",
        bg: offer
          ? "rgba(16,185,129,0.10)"
          : interview
          ? "rgba(245,158,11,0.10)"
          : "var(--bg-tertiary)",
        text: (
          <>
            {a.status} · <strong>{a.company || "a company"}</strong>
            {a.role ? ` — ${a.role}` : ""}
          </>
        ),
        when: Number.isNaN(ts) ? "" : timeAgo(a.date),
        sortKey: Number.isNaN(ts) ? 0 : ts,
      });
    });

  return events.sort((a, b) => b.sortKey - a.sortKey).slice(0, 5);
}
