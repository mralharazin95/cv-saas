"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  PenLine,
  Target,
  Lightbulb,
  FileText,
  ListChecks,
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  Info,
} from "lucide-react";
import { runAI, type AITask } from "@/lib/ai/client";

interface ToolDef {
  task: AITask;
  title: string;
  blurb: string;
  icon: typeof Sparkles;
  /** Field label for the primary input. */
  inputLabel: string;
  placeholder: string;
  /** Use a single-line input instead of a textarea. */
  singleLine?: boolean;
  cta: string;
  /** Optional secondary field captured into `context`. */
  contextLabel?: string;
  contextPlaceholder?: string;
}

const TOOLS: ToolDef[] = [
  {
    task: "generate",
    title: "Resume Generator",
    blurb: "Draft a full resume body from a role or short background.",
    icon: Sparkles,
    inputLabel: "Your role & background",
    placeholder:
      "e.g. Senior product designer, 7 years, fintech, led a team of 4...",
    cta: "Generate Resume",
  },
  {
    task: "rewrite",
    title: "Rewrite",
    blurb: "Make any text more impactful, concise, and professional.",
    icon: Wand2,
    inputLabel: "Text to rewrite",
    placeholder: "Paste a bullet point or paragraph to polish...",
    cta: "Rewrite",
  },
  {
    task: "suggest",
    title: "Content Suggestions",
    blurb: "Get specific, actionable tips to sharpen a section.",
    icon: Lightbulb,
    inputLabel: "Section content",
    placeholder: "Paste the resume section you want feedback on...",
    cta: "Get Suggestions",
  },
  {
    task: "summary",
    title: "Summary Generator",
    blurb: "Craft a compelling professional summary for the top of your CV.",
    icon: PenLine,
    inputLabel: "Your background",
    placeholder: "e.g. Full-stack engineer focused on React & Node...",
    cta: "Generate Summary",
  },
  {
    task: "jd_optimize",
    title: "Job-Description Optimizer",
    blurb: "Tune your resume text to match a target job's keywords.",
    icon: Target,
    inputLabel: "Your resume text",
    placeholder: "Paste the resume content to optimize...",
    cta: "Optimize for Job",
    contextLabel: "Target job description",
    contextPlaceholder: "Paste the job description you're applying to...",
  },
  {
    task: "skills",
    title: "Skills Recommendation",
    blurb: "Surface the most relevant skills for your target role.",
    icon: ListChecks,
    inputLabel: "Role or field",
    placeholder: "e.g. Data Analyst, Project Manager, UX Researcher...",
    singleLine: true,
    cta: "Recommend Skills",
  },
  {
    task: "cover_letter",
    title: "Cover-Letter Generator",
    blurb: "Write a tailored, one-page cover letter in seconds.",
    icon: FileText,
    inputLabel: "Role & your background",
    placeholder: "e.g. Applying for Marketing Manager at Acme; 5 yrs in B2B SaaS...",
    cta: "Write Cover Letter",
  },
];

export function AIToolsPanel({ language = "en" }: { language?: string }) {
  const [active, setActive] = useState<ToolDef | null>(null);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "var(--accent-50)", color: "var(--accent-600)" }}
        >
          <Sparkles size={18} />
        </div>
        <div>
          <h3
            className="text-lg font-semibold font-display leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            AI Tools
          </h3>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Let AI help you write a standout resume.
          </p>
        </div>
      </div>

      {active ? (
        <ToolRunner tool={active} language={language} onBack={() => setActive(null)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.task}
                type="button"
                onClick={() => setActive(tool)}
                className="text-left rounded-xl p-3.5 transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                    style={{
                      background: "var(--accent-50)",
                      color: "var(--accent-600)",
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="badge-ai">AI</span>
                </div>
                <h4
                  className="font-semibold text-sm mb-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tool.title}
                </h4>
                <p
                  className="text-xs leading-snug"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {tool.blurb}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToolRunner({
  tool,
  language,
  onBack,
}: {
  tool: ToolDef;
  language: string;
  onBack: () => void;
}) {
  const Icon = tool.icon;
  const [input, setInput] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canRun =
    input.trim().length > 0 || tool.task === "generate" || tool.task === "skills";

  const handleRun = async () => {
    if (!canRun || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const { text, simulated: sim } = await runAI(tool.task, input, {
        language,
        context:
          tool.contextLabel && contextInput.trim()
            ? { jobDescription: contextInput.trim() }
            : undefined,
      });
      setResult(text);
      setSimulated(sim);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const fieldStyle: React.CSSProperties = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-primary)",
    color: "var(--text-primary)",
  };

  return (
    <div className="mt-4 animate-fadeIn">
      {/* Tool header + back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-medium mb-3 transition-colors hover:underline"
        style={{ color: "var(--text-tertiary)" }}
      >
        <ArrowLeft size={14} /> All tools
      </button>

      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "var(--accent-50)", color: "var(--accent-600)" }}
          >
            <Icon size={16} />
          </div>
          <div className="min-w-0">
            <h4
              className="font-semibold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {tool.title}
            </h4>
            <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
              {tool.blurb}
            </p>
          </div>
        </div>

        {/* Primary input */}
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {tool.inputLabel}
        </label>
        {tool.singleLine ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.placeholder}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
            style={fieldStyle}
          />
        ) : (
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.placeholder}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
            style={fieldStyle}
          />
        )}

        {/* Optional context field (job description) */}
        {tool.contextLabel && (
          <div className="mt-3">
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {tool.contextLabel}
            </label>
            <textarea
              rows={4}
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder={tool.contextPlaceholder}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 resize-none"
              style={fieldStyle}
            />
          </div>
        )}

        {/* Run button */}
        <button
          type="button"
          onClick={handleRun}
          disabled={!canRun || loading}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, var(--accent-500), var(--primary-500))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} /> {tool.cta}
            </>
          )}
        </button>

        {error && (
          <p
            className="mt-3 text-xs px-3 py-2 rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--danger) 12%, transparent)",
              color: "var(--danger)",
            }}
          >
            {error}
          </p>
        )}

        {/* Result */}
        {result !== null && !error && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Result
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                style={{
                  background: "var(--accent-50)",
                  color: "var(--accent-700)",
                  border: "1px solid var(--accent-200)",
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div
              className="rounded-xl p-3 text-sm whitespace-pre-wrap leading-relaxed max-h-72 overflow-auto"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-primary)",
              }}
            >
              {result}
            </div>

            {simulated && (
              <div
                className="mt-2 flex items-start gap-1.5 text-xs px-2.5 py-2 rounded-lg"
                style={{
                  background: "var(--accent-50)",
                  color: "var(--accent-700)",
                }}
              >
                <Info size={13} className="mt-0.5 flex-shrink-0" />
                <span>
                  Demo mode — add an{" "}
                  <code style={{ fontWeight: 600 }}>ANTHROPIC_API_KEY</code> to your
                  environment for live AI.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
