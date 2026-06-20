"use client";

import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Bell, Search } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header
      className="h-16 flex items-center justify-between px-6 flex-shrink-0"
      style={{
        background: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border-primary)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            placeholder="Search resumes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all focus:ring-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-secondary)",
              color: "var(--text-primary)",
              "--tw-ring-color": "var(--primary-500)",
            } as React.CSSProperties}
            id="header-search"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl transition-all hover:scale-105"
          style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          id="notifications-btn"
        >
          <Bell className="w-5 h-5" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
