"use client";

import { SessionProvider } from "next-auth/react";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect } from "react";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeInitializer>
        {children}
      </ThemeInitializer>
    </SessionProvider>
  );
}
