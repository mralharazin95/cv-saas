"use client";

import { useMemo, useState } from "react";
import {
  Target,
  Gauge,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileText,
  Wand2,
} from "lucide-react";
import type { ResumeData } from "@/types/resume";
import {
  computeScores,
  scoreBand,
  type ScoreResult,
  type Severity,
} from "@/lib/scoring";

interface ResumeScoreProps {
  resume: ResumeData;
  jobDescription?: string;
}

// Map a 0-100 band to one of the semantic palette colours.
const bandColor = (score: number): string => {
  const band = scoreBand(score);
  if (band === "good") return "var(--success)";
  if (band === "warn") return "var(--warning)";
  return "var(--danger)";
};

const bandBg = (score: number): string => {
  const band = scoreBand(score);
  if (band === "good") return "var(--success-bg)";
  if (band === "warn") return "var(--warning-bg)";
  return "var(--danger-bg)";
};

const bandLabel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs work";
  return "Weak";
};

// ---- big overall ring ------------------------------------------------------

function ScoreRing({ score }: { score: number }) {
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (clampPct(score) / 100) * circ;
  const color = bandColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: 48, color: "var(--text-primary)" }}
        >
          {Math.round(score)}
        </span>
        <span className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          out of 100
        </span>
        <span
          className="badge mt-2 text-xs font-semibold"
          style={{ background: bandBg(score), color: bandColor(score), border: "none" }}
        >
          {bandLabel(score)}
        </span>
      </div>
    </div>
  );
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

// ---- small metric ring -----------------------------------------------------

function MetricRing({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  const size = 72;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (clampPct(score) / 100) * circ;
  const color = bandColor(score);

  return (
    <div
      className="flex flex-col items-center text-center rounded-xl p-4"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <span
        className="mt-2.5 text-sm font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {Math.round(score)}
      </span>
      <span className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
    </div>
  );
}

// ---- suggestion row --------------------------------------------------------

function severityIcon(severity: Severity) {
  if (severity === "good")
    return <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--success)" }} />;
  if (severity === "warn")
    return <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--warning)" }} />;
  return <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--danger)" }} />;
}

function severityColor(severity: Severity): string {
  if (severity === "good") return "var(--success)";
  if (severity === "warn") return "var(--warning)";
  return "var(--danger)";
}

// ---- main component --------------------------------------------------------

export function ResumeScore({ resume, jobDescription }: ResumeScoreProps) {
  const [jd, setJd] = useState(jobDescription || "");

  const result: ScoreResult = useMemo(
    () => computeScores(resume, jd.trim() ? jd : undefined),
    [resume, jd],
  );

  const metrics: {
    key: keyof ScoreResult;
    label: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }[] = [
    { key: "ats", label: "ATS", icon: Target },
    { key: "readability", label: "Readability", icon: Gauge },
    { key: "skills", label: "Skills", icon: Sparkles },
    { key: "experience", label: "Experience", icon: TrendingUp },
    { key: "keywords", label: "Keywords", icon: FileText },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header + overall ring */}
      <div className="card p-6" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-shrink-0 self-center">
            <ScoreRing score={result.overall} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="badge badge-ai text-xs font-semibold inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Analysis
              </span>
            </div>
            <h2
              className="font-display font-bold text-xl mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              Resume Score
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              We analysed your resume across five dimensions that recruiters and
              applicant-tracking systems care about most. Improve the metrics
              below to boost your overall score.
            </p>

            {/* Metric grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
              {metrics.map((m) => (
                <MetricRing
                  key={m.key}
                  label={m.label}
                  score={result[m.key] as number}
                  icon={m.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions + JD matcher */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        {/* Suggestions */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-4 h-4" style={{ color: "var(--primary-500)" }} />
            <h3 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>
              Suggestions
            </h3>
            <span
              className="badge text-xs ml-auto"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)", border: "none" }}
            >
              {result.suggestions.length}
            </span>
          </div>

          {result.suggestions.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              No suggestions — your resume looks great.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {result.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg p-3"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <span className="mt-0.5">{severityIcon(s.severity)}</span>
                  <span
                    className="text-sm leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="ml-auto mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: severityColor(s.severity) }}
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Job-description matcher */}
        <div className="card p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" style={{ color: "var(--violet-500)" }} />
            <h3 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>
              Match a job
            </h3>
          </div>
          <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
            Paste a job description to score how well your resume matches its
            keywords.
          </p>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here…"
            rows={9}
            className="w-full rounded-xl p-3 text-sm resize-y outline-none transition-colors"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-primary)",
            }}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-display font-bold"
                style={{ color: bandColor(result.keywords) }}
              >
                {Math.round(result.keywords)}
              </span>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                keyword
                <br />
                match
              </span>
            </div>
            {jd.trim() && (
              <button
                type="button"
                onClick={() => setJd("")}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeScore;
