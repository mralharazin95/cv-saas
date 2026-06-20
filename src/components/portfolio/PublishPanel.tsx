"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Globe,
  Lock,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";

interface PublishPanelProps {
  resumeId: string;
  slug?: string;
  isPublic?: boolean;
}

// Turn a free-text name (or title) into a clean, URL-safe slug.
function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function PublishPanel({ resumeId, slug, isPublic }: PublishPanelProps) {
  const resumeData = useResumeStore((s) => s.resumeData);

  const suggested = useMemo(() => {
    const p = resumeData.personalInfo;
    const fromName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    return slugify(fromName || resumeData.title || "my-portfolio") || "my-portfolio";
  }, [resumeData.personalInfo, resumeData.title]);

  const [pub, setPub] = useState<boolean>(!!isPublic);
  const [slugValue, setSlugValue] = useState<string>(slug || suggested);
  const [touched, setTouched] = useState<boolean>(!!slug);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the slug in sync with the name until the user edits it themselves.
  useEffect(() => {
    if (!touched) setSlugValue(suggested);
  }, [suggested, touched]);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://resumex.app";
  const publicUrl = `${origin}/p/${slugValue || suggested}`;

  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSave = async (overrides?: { isPublic?: boolean; slug?: string }) => {
    const nextPublic = overrides?.isPublic ?? pub;
    const nextSlug = (overrides?.slug ?? slugValue ?? suggested).trim();

    if (nextPublic && !nextSlug) {
      setError("Choose a link before publishing.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      // Send the full builder state alongside slug + isPublic so the existing
      // PUT (which restringifies dataJson from the body) keeps content intact.
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...resumeData,
          slug: nextSlug || null,
          isPublic: nextPublic,
        }),
      });
      if (!res.ok) {
        setError(
          res.status === 409
            ? "That link is already taken — try another."
            : "Couldn't save. Please try again."
        );
        return;
      }
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = () => {
    const next = !pub;
    setPub(next);
    void handleSave({ isPublic: next });
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-xl)",
        width: "100%",
        maxWidth: "420px",
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 gradient-primary"
        >
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Publish portfolio
            </h3>
            <span className="badge-ai inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Share
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Turn this resume into a live web page anyone can view.
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-4"
        style={{ background: "var(--bg-tertiary)" }}
      >
        <div className="flex items-center gap-2.5">
          {pub ? (
            <Globe className="w-4 h-4" style={{ color: "var(--success)" }} />
          ) : (
            <Lock className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
          )}
          <div>
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {pub ? "Public" : "Private"}
            </div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {pub ? "Live at the link below" : "Only you can see this"}
            </div>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={pub}
          aria-label="Make public"
          onClick={toggle}
          disabled={saving}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60"
          style={{ background: pub ? "var(--success)" : "var(--border-primary)" }}
        >
          <span
            className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
            style={{ transform: pub ? "translateX(22px)" : "translateX(2px)" }}
          />
        </button>
      </div>

      {/* Slug + URL */}
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        Your link
      </label>
      <div
        className="flex items-stretch rounded-xl overflow-hidden mb-1"
        style={{ border: "1px solid var(--border-primary)" }}
      >
        <span
          className="flex items-center px-3 text-xs whitespace-nowrap"
          style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
        >
          /p/
        </span>
        <input
          type="text"
          value={slugValue}
          onChange={(e) => {
            setTouched(true);
            setSlugValue(slugify(e.target.value));
          }}
          onBlur={() => void handleSave()}
          placeholder={suggested}
          className="flex-1 min-w-0 px-2.5 py-2 text-sm bg-transparent outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        <button
          type="button"
          onClick={() => {
            setTouched(false);
            setSlugValue(suggested);
          }}
          title="Suggest from name"
          className="flex items-center px-3 transition-colors"
          style={{ background: "var(--bg-tertiary)", color: "var(--primary-600)" }}
        >
          <Wand2 className="w-4 h-4" />
        </button>
      </div>

      {/* Public URL preview with copy */}
      <div
        className="flex items-center gap-2 p-2.5 rounded-xl mb-3"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}
      >
        <Globe className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} />
        <span
          className="flex-1 min-w-0 truncate text-xs font-mono"
          style={{ color: pub ? "var(--text-secondary)" : "var(--text-tertiary)" }}
          title={publicUrl}
        >
          {publicUrl}
        </span>
        <button
          type="button"
          onClick={copyUrl}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105 flex-shrink-0"
          style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" style={{ color: "var(--success)" }} />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs mb-3" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {saving ? "Saving..." : saved ? "Saved" : pub ? "Update" : "Publish"}
        </button>
        {pub && (
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <ExternalLink className="w-4 h-4" />
            View
          </a>
        )}
      </div>
    </div>
  );
}
