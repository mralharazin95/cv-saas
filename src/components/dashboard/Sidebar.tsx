"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  PenLine,
  LayoutTemplate,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: "Examples", href: `/${locale}/examples`, icon: LayoutTemplate },
    { name: "Cover Letter", href: `/${locale}/cover`, icon: PenLine },
    { name: "Profile", href: `/${locale}/dashboard/profile`, icon: User },
    { name: "Settings", href: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
      style={{
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border-primary)",
      }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center justify-between px-4"
        style={{ borderBottom: "1px solid var(--border-primary)" }}
      >
        {!collapsed && (
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-primary flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              ResumeX
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-all hover:scale-105"
          style={{ color: "var(--text-tertiary)", background: "var(--bg-tertiary)" }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              }`}
              style={{
                background: isActive ? "var(--primary-50)" : "transparent",
                color: isActive ? "var(--primary-600)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
              }}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border-primary)" }}>
        {session?.user && (
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0"
              style={{ background: "var(--primary-100)", color: "var(--primary-600)" }}
            >
              {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {session.user.name || "User"}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                  {session.user.email}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
