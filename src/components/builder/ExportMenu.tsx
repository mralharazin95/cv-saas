"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileJson,
  FileText,
  Share2,
  QrCode,
  Printer,
  Link2,
  Loader2,
  Check,
  X,
} from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { downloadJSON, docxBlob, buildShareUrl } from "@/lib/exporters";

interface ExportMenuProps {
  resume: ResumeData;
  onPrintPDF: () => void;
  slug?: string;
}

type ToastKind = "error" | "success";

export function ExportMenu({ resume, onPrintPDF, slug }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ kind: ToastKind; message: string } | null>(null);

  const [qrOpen, setQrOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const shareUrl = slug ? buildShareUrl(slug) : "";

  // Close everything when clicking outside the menu root.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQrOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQrOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Auto-dismiss toasts.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const flash = (kind: ToastKind, message: string) => setToast({ kind, message });

  const handlePDF = () => {
    setOpen(false);
    onPrintPDF();
  };

  const handleJSON = () => {
    try {
      downloadJSON(resume);
      flash("success", "JSON exported.");
    } catch {
      flash("error", "Could not export JSON.");
    }
    setOpen(false);
  };

  const handleDOCX = async () => {
    if (docxLoading) return;
    setDocxLoading(true);
    try {
      const blob = await docxBlob(resume);
      const name =
        (resume.title || "resume")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "resume";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      flash("success", "DOCX exported.");
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "DOCX export failed. Please try again.";
      flash("error", message);
    } finally {
      setDocxLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      flash("success", "Share link copied.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      flash("error", "Could not copy the link.");
    }
  };

  const handleShowQR = async () => {
    if (!shareUrl) return;
    setQrOpen((v) => !v);
    if (qrDataUrl || qrLoading) return;
    setQrLoading(true);
    try {
      const mod = await import("qrcode");
      // Handle both ESM named export and CJS default-interop shapes.
      const QR = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof import("qrcode");
      const dataUrl = await QR.toDataURL(shareUrl, {
        width: 220,
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
    } catch {
      flash("error", "Could not generate QR code.");
      setQrOpen(false);
    } finally {
      setQrLoading(false);
    }
  };

  const itemStyle: React.CSSProperties = { color: "var(--text-primary)" };

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary transition-all hover:shadow-lg hover:scale-105"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Share2 size={16} />
        Export / Share
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="card absolute right-0 mt-2 w-64 p-1.5 z-50 animate-fadeIn"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <MenuItem icon={<Printer size={16} />} label="Download PDF" onClick={handlePDF} style={itemStyle} />

          <MenuItem
            icon={
              docxLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )
            }
            label={docxLoading ? "Building DOCX…" : "Download DOCX"}
            onClick={handleDOCX}
            disabled={docxLoading}
            style={itemStyle}
          />

          <MenuItem icon={<FileJson size={16} />} label="Export JSON" onClick={handleJSON} style={itemStyle} />

          {slug && (
            <>
              <div className="my-1 h-px" style={{ background: "var(--border-primary)" }} />

              <MenuItem
                icon={copied ? <Check size={16} style={{ color: "var(--success)" }} /> : <Link2 size={16} />}
                label={copied ? "Copied!" : "Copy share link"}
                onClick={handleCopyLink}
                style={itemStyle}
              />

              <MenuItem
                icon={qrLoading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                label="Show QR code"
                onClick={handleShowQR}
                active={qrOpen}
                style={itemStyle}
              />

              {qrOpen && (
                <div
                  className="mt-1 p-3 flex flex-col items-center gap-2 animate-fadeIn"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  {qrLoading && (
                    <div className="flex items-center justify-center" style={{ width: 180, height: 180 }}>
                      <Loader2 size={24} className="animate-spin" style={{ color: "var(--primary-500)" }} />
                    </div>
                  )}
                  {!qrLoading && qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="QR code linking to the public resume"
                      width={180}
                      height={180}
                      style={{ borderRadius: "var(--radius-md)", background: "#fff" }}
                    />
                  )}
                  <p
                    className="text-[11px] text-center break-all"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {shareUrl}
                  </p>
                </div>
              )}
            </>
          )}

          {!slug && (
            <p className="px-3 py-2 text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
              Publish this resume to get a shareable link and QR code.
            </p>
          )}
        </div>
      )}

      {/* Inline toast */}
      {toast && (
        <div
          className="absolute right-0 mt-2 w-64 px-3 py-2.5 flex items-start gap-2 z-50 animate-fadeIn"
          style={{
            top: "100%",
            background: "var(--bg-elevated)",
            border: `1px solid ${toast.kind === "error" ? "var(--danger)" : "var(--success)"}`,
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
          }}
          role="status"
        >
          {toast.kind === "error" ? (
            <X size={15} style={{ color: "var(--danger)", marginTop: 1, flexShrink: 0 }} />
          ) : (
            <Check size={15} style={{ color: "var(--success)", marginTop: 1, flexShrink: 0 }} />
          )}
          <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
  active,
  style,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: active ? "var(--primary-50)" : "transparent",
        color: active ? "var(--primary-600)" : style?.color,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = "var(--bg-secondary)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span className="flex-shrink-0 inline-flex" style={{ color: active ? "var(--primary-600)" : "var(--text-tertiary)" }}>
        {icon}
      </span>
      {label}
    </button>
  );
}
