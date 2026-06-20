"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { getTemplate, resumeDataToContent } from "./sampleData";
import { EXAMPLES, EXAMPLE_CATEGORIES, ResumeExample } from "./examples";

export async function cloneExampleToBuilder(
  example: ResumeExample,
  locale: string,
  router: ReturnType<typeof useRouter>,
  loggedIn: boolean
) {
  if (!loggedIn) {
    router.push(`/${locale}/register`);
    return;
  }
  const res = await fetch("/api/resumes", { method: "POST" });
  if (!res.ok) {
    router.push(`/${locale}/register`);
    return;
  }
  const { id } = await res.json();
  await fetch(`/api/resumes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...example.data, id }),
  });
  router.push(`/${locale}/builder/${id}`);
}

export function ExamplesGallery({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [usingId, setUsingId] = useState<string | null>(null);

  const filtered = category === "All" ? EXAMPLES : EXAMPLES.filter((e) => e.category === category);

  const handleUse = async (e: ResumeExample) => {
    setUsingId(e.id);
    try {
      await cloneExampleToBuilder(e, locale, router, !!session);
    } finally {
      setUsingId(null);
    }
  };

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {EXAMPLE_CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: active ? "var(--primary-600)" : "var(--bg-elevated)",
                color: active ? "#fff" : "var(--text-secondary)",
                border: active ? "1px solid var(--primary-600)" : "1px solid var(--border-primary)",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((e) => (
          <div key={e.id} className="group card card-hover overflow-hidden flex flex-col">
            <Link href={`/${locale}/examples/${e.id}`} className="block p-3" style={{ background: "var(--bg-tertiary)" }}>
              <ResumePreview
                template={getTemplate(e.data.templateId)}
                accent={e.data.colorHex}
                data={resumeDataToContent(e.data)}
                style={{ borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 8px rgba(15,23,42,0.14)" }}
              />
            </Link>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{e.role}</div>
                <div className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{e.name} · {e.category}</div>
              </div>
              <button
                onClick={() => handleUse(e)}
                disabled={usingId === e.id}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white btn-primary flex-shrink-0"
              >
                {usingId === e.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Use <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
