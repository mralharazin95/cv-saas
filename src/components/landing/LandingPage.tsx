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
  LayoutTemplate,
  Star,
  Menu,
  X,
  Wand2,
  Target,
  Lightbulb,
  PenLine,
  Quote,
  Crown,
  TrendingUp,
  ChevronDown,
  Gauge,
} from "lucide-react";
import { useState } from "react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplatesStudio } from "@/components/resume/TemplatesStudio";
import { TEMPLATES } from "@/components/resume/sampleData";

export function LandingPage() {
  const t = useTranslations("Landing");
  const nav = useTranslations("Nav");
  const p = useTranslations("Pricing");
  const { data: session } = useSession();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [mobileMenu, setMobileMenu] = useState(false);

  const features = [
    { icon: LayoutTemplate, key: "templates" },
    { icon: Sparkles, key: "ai" },
    { icon: Download, key: "export" },
    { icon: Globe, key: "multilang" },
    { icon: Moon, key: "dark" },
    { icon: Palette, key: "customize" },
  ];

  const aiTools = [
    { icon: Wand2, key: "ai_1" },
    { icon: PenLine, key: "ai_2" },
    { icon: Target, key: "ai_3" },
    { icon: Lightbulb, key: "ai_4" },
  ];

  const steps = [
    { n: "1", key: "step_1" },
    { n: "2", key: "step_2" },
    { n: "3", key: "step_3" },
  ];

  const stats = [
    { icon: TrendingUp, value: "50K+", key: "stat_users" },
    { icon: FileText, value: "120K+", key: "stat_cvs" },
    { icon: LayoutTemplate, value: "20+", key: "stat_templates" },
    { icon: Star, value: "92", key: "stat_score" },
  ];

  const heroFront = TEMPLATES.find((x) => x.id === "executive")!;
  const heroBack = TEMPLATES.find((x) => x.id === "creative")!;

  const testimonials = ["t1", "t2", "t3"];

  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Stripe", "Spotify", "Nvidia"];

  const featureMenu = [
    { icon: Wand2, name: "AI Writer", desc: "Generate & rewrite with AI", href: "#ai" },
    { icon: Gauge, name: "Resume Analyzer", desc: "ATS, readability & keyword score", href: "#ats" },
    { icon: PenLine, name: "Cover Letters", desc: "AI cover letter builder", href: `/${locale}/cover` },
    { icon: LayoutTemplate, name: "20 Templates", desc: "ATS-friendly, recruiter-approved", href: "#templates" },
    { icon: Download, name: "Export & Share", desc: "PDF, DOCX, JSON, link, QR", href: "#features" },
    { icon: Globe, name: "Portfolio Site", desc: "Turn your CV into a web page", href: `/${locale}/register` },
  ];

  const freeFeatures = ["free_1", "free_2", "free_3", "free_4"];
  const proFeatures = ["pro_1", "pro_2", "pro_3", "pro_4", "pro_5"];

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* ===== Announcement strip ===== */}
      <div className="gradient-primary text-white text-center text-sm py-2 px-4">
        <span className="inline-flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4" />
          {t("announce")}
        </span>
      </div>

      {/* ===== Navbar ===== */}
      <nav className="sticky top-0 z-50 glass" style={{ borderBottom: "1px solid var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ResumeX</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {/* Features mega-menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70 py-2" style={{ color: "var(--text-secondary)" }}>
                {nav("features")} <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                <div className="grid grid-cols-2 gap-1 p-2 rounded-2xl" style={{ width: 520, background: "var(--bg-elevated)", border: "1px solid var(--border-primary)", boxShadow: "var(--shadow-xl)" }}>
                  {featureMenu.map((f) => {
                    const Icon = f.icon;
                    return (
                      <a key={f.name} href={f.href} className="flex items-start gap-3 p-3 rounded-xl transition-colors" style={{ color: "var(--text-primary)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--primary-50)" }}>
                          <Icon className="w-4 h-4" style={{ color: "var(--primary-600)" }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{f.name}</div>
                          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{f.desc}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <a href="#templates" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>{nav("templates")}</a>
            <a href={`/${locale}/examples`} className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>Examples</a>
            <a href={`/${locale}/cover`} className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>Cover Letter</a>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>{nav("pricing")}</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {session ? (
              <Link href={`/${locale}/dashboard`} className="px-5 py-2 rounded-xl text-sm font-semibold text-white btn-primary">{nav("dashboard")}</Link>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>{nav("login")}</Link>
                <Link href={`/${locale}/register`} className="px-5 py-2 rounded-xl text-sm font-semibold text-white btn-primary">{nav("signup")}</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)} style={{ color: "var(--text-primary)" }} aria-label="Menu">
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden animate-fadeInDown" style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border-primary)", padding: "16px 24px" }}>
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{nav("features")}</a>
              <a href="#ai" onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>AI</a>
              <a href="#ats" onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Resume Analyzer</a>
              <a href={`/${locale}/cover`} onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Cover Letter</a>
              <a href={`/${locale}/examples`} onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Examples</a>
              <a href="#templates" onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{nav("templates")}</a>
              <a href="#pricing" onClick={() => setMobileMenu(false)} className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{nav("pricing")}</a>
              <div className="flex items-center gap-3 pt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {session ? (
                  <Link href={`/${locale}/dashboard`} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white text-center btn-primary">{nav("dashboard")}</Link>
                ) : (
                  <>
                    <Link href={`/${locale}/login`} className="px-4 py-2.5 rounded-xl text-sm font-medium text-center" style={{ color: "var(--text-secondary)", border: "1px solid var(--border-primary)" }}>{nav("login")}</Link>
                    <Link href={`/${locale}/register`} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white text-center btn-primary">{nav("signup")}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-x-0 top-0 h-full grid-pattern opacity-60" />
        <div className="absolute top-24 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float" style={{ background: "var(--primary-400)" }} />
        <div className="absolute bottom-0 -right-20 w-80 h-80 rounded-full blur-3xl opacity-15 animate-float-slow" style={{ background: "var(--accent-400)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-start">
            <div className="badge badge-ai mb-6 animate-fadeInDown">
              <Zap className="w-4 h-4" />
              {t("hero_badge")}
            </div>
            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.05] mb-6 animate-fadeInUp">
              <span style={{ color: "var(--text-primary)" }}>{t("hero_title").split(" ").slice(0, -1).join(" ")} </span>
              <span className="gradient-text">{t("hero_title").split(" ").slice(-1)[0]}</span>
            </h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-9 animate-fadeInUp stagger-1" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-fadeInUp stagger-2">
              <Link href={`/${locale}/register`} className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg btn-primary animate-pulse-glow">
                {t("hero_cta")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#templates" className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105" style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}>
                {t("hero_cta_secondary")}
              </a>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-8 animate-fadeInUp stagger-3">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4" style={{ color: "var(--gold-400)", fill: "var(--gold-400)" }} />
                ))}
              </div>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{t("hero_trust")}</span>
            </div>
          </div>

          {/* Right: real resume preview */}
          <div className="relative animate-fadeInUp stagger-2 hidden lg:block">
            <div className="relative mx-auto" style={{ maxWidth: 380 }}>
              {/* Peeking second template (depth) */}
              <div className="absolute -top-4 -left-10 w-[72%] -rotate-6 rounded-xl overflow-hidden hidden xl:block" style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-primary)", opacity: 0.85 }}>
                <ResumePreview template={heroBack} accent="#0891b2" />
              </div>

              {/* Featured resume */}
              <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-xl)", border: "1px solid var(--border-primary)" }}>
                <ResumePreview template={heroFront} />
              </div>

              {/* Floating ATS score */}
              <div className="absolute -top-5 -right-5 card p-3 flex items-center gap-3 animate-float" style={{ boxShadow: "var(--shadow-lg)" }}>
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border-primary)" strokeWidth="5" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke="var(--success)" strokeWidth="5" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="9" transform="rotate(-90 22 22)" />
                </svg>
                <div>
                  <div className="font-mono font-bold text-lg leading-none" style={{ color: "var(--text-primary)" }}>92</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>ATS</div>
                </div>
              </div>

              {/* Floating AI pill */}
              <div className="absolute -bottom-4 -left-6 badge badge-ai animate-float-slow" style={{ boxShadow: "var(--shadow-md)", background: "var(--bg-elevated)" }}>
                <Wand2 className="w-4 h-4" />
                AI rewrite
              </div>
            </div>
          </div>
        </div>

        {/* Logo cloud */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
          <p className="text-center text-sm font-medium mb-6" style={{ color: "var(--text-tertiary)" }}>{t("social_title")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {companies.map((c) => (
              <span key={c} className="font-display font-bold text-lg md:text-xl" style={{ color: "var(--text-secondary)" }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Stats band ===== */}
      <section className="py-12" style={{ background: "var(--bg-secondary)", borderBlock: "1px solid var(--border-primary)" }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3" style={{ background: "var(--primary-50)" }}>
                  <Icon className="w-5 h-5" style={{ color: "var(--primary-500)" }} />
                </div>
                <div className="font-display text-3xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>{t(s.key)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{t("features_title")}</h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>{t("features_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group card card-hover p-7">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: "var(--primary-50)" }}>
                    <Icon className="w-6 h-6" style={{ color: "var(--primary-600)" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t(`feature_${feature.key}`)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t(`feature_${feature.key}_desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== AI section ===== */}
      <section id="ai" className="py-24 scroll-mt-24 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{ background: "var(--accent-400)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="badge badge-ai mb-5"><Sparkles className="w-4 h-4" />{t("ai_eyebrow")}</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{t("ai_title")}</h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>{t("ai_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div key={i} className="card card-hover p-7" style={{ borderColor: "var(--accent-200)" }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 gradient-aqua">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{t(`${tool.key}_title`)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t(`${tool.key}_desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Steps ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-600)" }}>{t("steps_subtitle")}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">{t("steps_title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.n} className="relative text-center px-4">
                <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 font-display font-bold text-2xl text-white" style={{ boxShadow: "var(--shadow-glow)" }}>{step.n}</div>
                <h3 className="text-xl font-semibold mb-2">{t(`${step.key}_title`)}</h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>{t(`${step.key}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ATS scoring ===== */}
      <section id="ats" className="py-24 scroll-mt-24" style={{ background: "var(--bg-secondary)", borderBlock: "1px solid var(--border-primary)" }}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="badge badge-brand mb-5"><BarChartMini />{t("ats_eyebrow")}</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("ats_title")}</h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>{t("ats_subtitle")}</p>
            <ul className="space-y-3">
              {["ats_check_1", "ats_check_2", "ats_check_3"].map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--success-bg)" }}>
                    <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
                  </span>
                  <span className="text-sm font-medium">{t(c)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: t("ats_metric_ats"), value: 92, color: "var(--success)" },
                { label: t("ats_metric_read"), value: 88, color: "var(--primary-500)" },
                { label: t("ats_metric_key"), value: 85, color: "var(--accent-500)" },
              ].map((m) => {
                const circ = 2 * Math.PI * 30;
                const offset = circ * (1 - m.value / 100);
                return (
                  <div key={m.label} className="text-center">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="var(--border-primary)" strokeWidth="7" />
                      <circle cx="40" cy="40" r="30" fill="none" stroke={m.color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 40 40)" />
                      <text x="40" y="46" textAnchor="middle" className="font-mono" fontSize="20" fontWeight="700" fill="var(--text-primary)">{m.value}</text>
                    </svg>
                    <div className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Templates ===== */}
      <section id="templates" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{t("templates_title")}</h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>{t("templates_subtitle")}</p>
          </div>
          <TemplatesStudio
            locale={locale}
            colorLabel={t("studio_color")}
            useLabel={t("studio_use")}
            hint={t("studio_hint")}
          />
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-24" style={{ background: "var(--bg-secondary)", borderBlock: "1px solid var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{t("testimonials_title")}</h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>{t("testimonials_subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tk) => (
              <div key={tk} className="card p-7">
                <Quote className="w-8 h-8 mb-4" style={{ color: "var(--primary-300)" }} />
                <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-primary)" }}>{t(`${tk}_quote`)}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">{t(`${tk}_name`).charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-sm">{t(`${tk}_name`)}</div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{t(`${tk}_role`)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="py-24 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">{p("title")}</h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>{p("subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card p-8">
              <h3 className="font-display text-xl font-bold mb-1">{p("free_name")}</h3>
              <p className="text-sm mb-5" style={{ color: "var(--text-tertiary)" }}>{p("free_tagline")}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-4xl font-extrabold">{p("free_price")}</span>
                <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{p("free_period")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: "var(--success)" }} />
                    {p(f)}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/register`} className="block text-center px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]" style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-primary)" }}>{p("free_cta")}</Link>
            </div>

            {/* Pro */}
            <div className="card p-8 relative" style={{ borderColor: "var(--primary-400)", borderWidth: 2, boxShadow: "var(--shadow-glow)" }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-premium"><Crown className="w-3.5 h-3.5" />{p("pro_badge")}</span>
              <h3 className="font-display text-xl font-bold mb-1">{p("pro_name")}</h3>
              <p className="text-sm mb-5" style={{ color: "var(--text-tertiary)" }}>{p("pro_tagline")}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-4xl font-extrabold gradient-text">{p("pro_price")}</span>
                <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{p("pro_period")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary-500)" }} />
                    {p(f)}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/register`} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white btn-primary">{p("pro_cta")}<ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary-600), var(--violet-600))", boxShadow: "0 25px 60px rgba(99, 102, 241, 0.3)" }}>
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t("cta_title")}</h2>
              <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto">{t("cta_subtitle")}</p>
              <Link href={`/${locale}/register`} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white font-semibold text-lg transition-all hover:scale-105" style={{ color: "var(--primary-700)" }}>
                {t("hero_cta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-14" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-primary">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl">ResumeX</span>
              </div>
              <p className="text-sm max-w-xs" style={{ color: "var(--text-tertiary)" }}>{t("footer_tagline")}</p>
            </div>
            <FooterCol title={t("footer_product")} items={[nav("features"), nav("templates"), nav("pricing"), "AI"]} />
            <FooterCol title={t("footer_company")} items={["About", "Blog", "Careers", "Contact"]} />
            <FooterCol title={t("footer_resources")} items={["Help", "Examples", "Privacy", "Terms"]} />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--border-primary)" }}>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>© {new Date().getFullYear()} ResumeX. {t("footer_rights")}</p>
            <div className="flex items-center gap-2">
              {[Globe, Star, Crown].map((Icon, i) => (
                <span key={i} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>{title}</h4>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it}>
            <a href="#" className="text-sm transition-colors hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>{it}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarChartMini() {
  return <TrendingUp className="w-4 h-4" />;
}
