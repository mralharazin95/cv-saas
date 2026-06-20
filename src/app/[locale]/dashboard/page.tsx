"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  TrendingUp,
  Layout,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface ResumeCard {
  id: string;
  title: string;
  templateId: string;
  colorHex: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations("Dashboard");
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const [resumes, setResumes] = useState<ResumeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      }
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const createResume = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/resumes", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        router.push(`/${locale}/builder/${data.id}`);
      }
    } catch (err) {
      console.error("Failed to create resume:", err);
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (id: string) => {
    try {
      await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
    setMenuOpen(null);
  };

  const templateGradients: Record<string, string> = {
    modern: "from-indigo-500 to-purple-600",
    professional: "from-slate-600 to-slate-800",
    minimal: "from-gray-400 to-gray-600",
    academic: "from-emerald-500 to-teal-700",
    creative: "from-pink-500 to-orange-500",
  };

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {t("welcome")}, {session?.user?.name || "User"} 👋
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Manage your resumes and create new ones
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: FileText,
            label: t("total_resumes"),
            value: resumes.length.toString(),
            color: "var(--primary-500)",
            bg: "var(--primary-50)",
          },
          {
            icon: Layout,
            label: t("templates_used"),
            value: [...new Set(resumes.map((r) => r.templateId))].length.toString(),
            color: "#10b981",
            bg: "rgba(16, 185, 129, 0.1)",
          },
          {
            icon: TrendingUp,
            label: t("last_updated"),
            value: resumes.length > 0
              ? new Date(resumes[0]?.updatedAt).toLocaleDateString()
              : "-",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.1)",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumes Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {t("my_resumes")}
        </h2>
        <button
          onClick={createResume}
          disabled={creating}
          id="create-cv-btn"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold gradient-primary transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50"
        >
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {t("create_cv")}
        </button>
      </div>

      {/* Resumes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-500)" }} />
        </div>
      ) : resumes.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{
            background: "var(--bg-elevated)",
            border: "2px dashed var(--border-primary)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--primary-50)" }}
          >
            <FileText className="w-8 h-8" style={{ color: "var(--primary-500)" }} />
          </div>
          <p className="text-lg font-medium mb-1" style={{ color: "var(--text-primary)" }}>
            {t("no_resumes")}
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
            Get started by creating your first resume
          </p>
          <button
            onClick={createResume}
            disabled={creating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold gradient-primary transition-all hover:shadow-lg hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            {t("create_cv")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Create New Card */}
          <button
            onClick={createResume}
            disabled={creating}
            className="group rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 min-h-[260px]"
            style={{
              background: "var(--bg-elevated)",
              border: "2px dashed var(--border-primary)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: "var(--primary-50)" }}
            >
              {creating ? (
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: "var(--primary-500)" }} />
              ) : (
                <Plus className="w-7 h-7" style={{ color: "var(--primary-500)" }} />
              )}
            </div>
            <span className="font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
              {t("create_cv")}
            </span>
          </button>

          {/* Resume Cards */}
          {resumes.map((resume, i) => (
            <div
              key={resume.id}
              className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fadeInUp"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-primary)",
                animationDelay: `${i * 100}ms`,
              }}
            >
              {/* Preview header */}
              <div
                className={`h-36 bg-gradient-to-br ${
                  templateGradients[resume.templateId] || "from-indigo-500 to-purple-600"
                } relative`}
              >
                <div className="absolute inset-3 bg-white/90 rounded-lg p-3">
                  <div
                    className="w-10 h-1.5 rounded mb-1.5"
                    style={{ background: resume.colorHex }}
                  />
                  <div className="w-16 h-1 bg-gray-200 rounded mb-2" />
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-gray-200 rounded" />
                    <div className="w-4/5 h-1 bg-gray-200 rounded" />
                    <div className="w-3/5 h-1 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setMenuOpen(menuOpen === resume.id ? null : resume.id);
                      }}
                      className="p-1.5 rounded-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </button>
                    {menuOpen === resume.id && (
                      <div
                        className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-lg z-10 animate-scaleIn"
                        style={{
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-primary)",
                          minWidth: "140px",
                        }}
                      >
                        <Link
                          href={`/${locale}/builder/${resume.id}`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <Edit3 className="w-4 h-4" />
                          {t("edit")}
                        </Link>
                        <button
                          onClick={() => deleteResume(resume.id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t("delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card content */}
              <Link href={`/${locale}/builder/${resume.id}`} className="block p-4">
                <h3
                  className="font-semibold text-sm mb-1 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {resume.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{
                      background: "var(--primary-50)",
                      color: "var(--primary-600)",
                    }}
                  >
                    {resume.templateId}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
