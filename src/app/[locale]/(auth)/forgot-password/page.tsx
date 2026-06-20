"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowLeft, Loader2, Mail, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-12">
          <Link href={`/${locale}`} className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-primary">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">ResumeX</span>
          </Link>
          <ThemeToggle />
        </div>

        {sent ? (
          <div className="text-center animate-fadeInUp">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(16, 185, 129, 0.1)" }}
            >
              <Check className="w-8 h-8" style={{ color: "#10b981" }} />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Check your email
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--primary-500)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back_to_login")}
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "var(--primary-50)" }}
              >
                <Mail className="w-7 h-7" style={{ color: "var(--primary-500)" }} />
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {t("reset_password")}
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>{t("reset_subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                  {t("email")}
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--primary-500)",
                  } as React.CSSProperties}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                id="forgot-submit"
                className="w-full py-3.5 rounded-xl text-white font-semibold gradient-primary transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t("send_reset")
                )}
              </button>
            </form>

            <div className="text-center mt-8">
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--primary-500)" }}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back_to_login")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
