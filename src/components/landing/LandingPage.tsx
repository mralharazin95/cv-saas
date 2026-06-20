"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  FileText,
  Sparkles,
  Download,
  Globe,
  Moon,
  Palette,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Layout,
  Star,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function LandingPage() {
  const t = useTranslations("Landing");
  const nav = useTranslations("Nav");
  const { data: session } = useSession();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [mobileMenu, setMobileMenu] = useState(false);

  const features = [
    { icon: Layout, title: t("feature_templates"), desc: t("feature_templates_desc") },
    { icon: Sparkles, title: t("feature_ai"), desc: t("feature_ai_desc") },
    { icon: Download, title: t("feature_export"), desc: t("feature_export_desc") },
    { icon: Globe, title: t("feature_multilang"), desc: t("feature_multilang_desc") },
    { icon: Moon, title: t("feature_dark"), desc: t("feature_dark_desc") },
    { icon: Palette, title: t("feature_customize"), desc: t("feature_customize_desc") },
  ];

  const templates = [
    { id: "modern", gradient: "from-indigo-500 to-purple-600" },
    { id: "professional", gradient: "from-slate-600 to-slate-800" },
    { id: "minimal", gradient: "from-gray-400 to-gray-600" },
    { id: "academic", gradient: "from-emerald-500 to-teal-700" },
    { id: "creative", gradient: "from-pink-500 to-orange-500" },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* ===== Navbar ===== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass"
        style={{ borderBottom: "1px solid var(--border-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary"
              style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
              ResumeX
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              {nav("features")}
            </a>
            <a
              href="#templates"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              {nav("templates")}
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {session ? (
              <Link
                href={`/${locale}/dashboard`}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white gradient-primary transition-all hover:shadow-lg hover:scale-105"
              >
                {nav("dashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {nav("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white gradient-primary transition-all hover:shadow-lg hover:scale-105"
                >
                  {nav("signup")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{ color: "var(--text-primary)" }}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div
            className="md:hidden animate-fadeInDown"
            style={{
              background: "var(--bg-elevated)",
              borderTop: "1px solid var(--border-primary)",
              padding: "16px 24px",
            }}
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {nav("features")}
              </a>
              <a href="#templates" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {nav("templates")}
              </a>
              <div className="flex items-center gap-3 pt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {session ? (
                  <Link
                    href={`/${locale}/dashboard`}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white text-center gradient-primary"
                  >
                    {nav("dashboard")}
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-center"
                      style={{ color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}
                    >
                      {nav("login")}
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white text-center gradient-primary"
                    >
                      {nav("signup")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
          style={{ background: "var(--primary-400)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
          style={{ background: "#a855f7", animationDelay: "1s", animation: "float 4s ease-in-out infinite" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fadeInDown"
            style={{
              background: "var(--primary-50)",
              color: "var(--primary-600)",
              border: "1px solid var(--primary-200)",
            }}
          >
            <Zap className="w-4 h-4" />
            AI-Powered CV Builder
          </div>

          {/* Main Title */}
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fadeInUp"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span style={{ color: "var(--text-primary)" }}>{t("hero_title").split(" ").slice(0, -1).join(" ")} </span>
            <span className="gradient-text">{t("hero_title").split(" ").slice(-1)[0]}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fadeInUp stagger-1"
            style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
          >
            {t("hero_subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp stagger-2">
            <Link
              href={`/${locale}/register`}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg gradient-primary transition-all hover:shadow-xl hover:scale-105 animate-pulse-glow"
            >
              {t("hero_cta")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#templates"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-primary)",
              }}
            >
              {t("hero_cta_secondary")}
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-16 animate-fadeInUp stagger-3">
            {[
              { value: "10K+", label: "Users" },
              { value: "50K+", label: "CVs Created" },
              { value: "5", label: "Templates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 rotate-90" style={{ color: "var(--text-tertiary)" }} />
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t("features_title")}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              {t("features_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-primary)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                    style={{ background: "var(--primary-50)" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "var(--primary-500)" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Templates Section ===== */}
      <section id="templates" className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t("templates_title")}
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              {t("templates_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                style={{ border: "1px solid var(--border-primary)" }}
              >
                <div className={`h-48 bg-gradient-to-br ${tpl.gradient} relative`}>
                  <div className="absolute inset-4 bg-white/90 rounded-lg p-3">
                    <div className="w-12 h-1.5 bg-gray-300 rounded mb-2" />
                    <div className="w-20 h-1 bg-gray-200 rounded mb-3" />
                    <div className="space-y-1.5">
                      <div className="w-full h-1 bg-gray-200 rounded" />
                      <div className="w-4/5 h-1 bg-gray-200 rounded" />
                      <div className="w-3/5 h-1 bg-gray-200 rounded" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="w-full h-1 bg-gray-100 rounded" />
                      <div className="w-full h-1 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
                <div className="p-4" style={{ background: "var(--bg-elevated)" }}>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                    {tpl.id.charAt(0).toUpperCase() + tpl.id.slice(1)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div
            className="p-12 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
              boxShadow: "0 25px 50px rgba(99, 102, 241, 0.25)",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("cta_title")}</h2>
            <p className="text-lg text-white/80 mb-8">{t("cta_subtitle")}</p>
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg"
              style={{ color: "var(--primary-700)" }}
            >
              {t("hero_cta")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer
        className="py-12"
        style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-primary)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-primary">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                ResumeX
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              {t("footer_tagline")} © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
