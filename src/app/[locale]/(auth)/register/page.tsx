"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FileText, Eye, EyeOff, ArrowRight, Loader2, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase", valid: /[A-Z]/.test(password) },
    { label: "Contains number", valid: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push(`/${locale}/login`);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-16 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 backdrop-blur-sm">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Join ResumeX</h1>
          <p className="text-lg text-white/80 text-center max-w-md mb-12">
            Create your account and start building professional resumes today
          </p>
          <div className="space-y-4 text-left max-w-sm w-full">
            {[
              "5 Premium CV Templates",
              "AI Writing Assistant",
              "Export to PDF & Print",
              "Multi-language Support",
              "Dark Mode",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm text-white/90">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-10">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-primary">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg lg:hidden">ResumeX</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {t("register")}
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>{t("register_subtitle")}</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 p-4 rounded-xl text-sm animate-scaleIn"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {t("name")}
              </label>
              <input
                type="text"
                id="register-name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--primary-500)",
                } as React.CSSProperties}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {t("email")}
              </label>
              <input
                type="email"
                id="register-email"
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

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 pr-12"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-primary)",
                    color: "var(--text-primary)",
                    "--tw-ring-color": "var(--primary-500)",
                  } as React.CSSProperties}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="mt-2 space-y-1 animate-fadeIn">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center transition-all"
                        style={{
                          background: check.valid ? "#10b981" : "var(--bg-tertiary)",
                        }}
                      >
                        {check.valid && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: check.valid ? "#10b981" : "var(--text-tertiary)" }}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {t("confirm_password")}
              </label>
              <input
                type="password"
                id="register-confirm"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--primary-500)",
                } as React.CSSProperties}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="w-full py-3.5 rounded-xl text-white font-semibold gradient-primary transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t("register")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "var(--text-tertiary)" }}>
            {t("terms")}
          </p>

          {/* Link to login */}
          <p className="text-center mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("have_account")}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold transition-colors"
              style={{ color: "var(--primary-500)" }}
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
