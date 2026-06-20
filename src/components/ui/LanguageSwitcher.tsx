"use client";

import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'en';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
    setOpen(false);
  };

  const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105"
        style={{
          background: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
        }}
        id="language-switcher"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang.flag}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-lg z-50 animate-scaleIn"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            minWidth: '160px',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-colors ${
                currentLocale === lang.code ? 'font-semibold' : ''
              }`}
              style={{
                background: currentLocale === lang.code ? 'var(--primary-50)' : 'transparent',
                color: currentLocale === lang.code ? 'var(--primary-600)' : 'var(--text-primary)',
              }}
              onMouseOver={(e) => {
                if (currentLocale !== lang.code) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }
              }}
              onMouseOut={(e) => {
                if (currentLocale !== lang.code) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
