import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "CV Builder SaaS",
  description: "Modern CV & Resume Management System",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log("LocaleLayout resolved locale:", locale);
  console.log("Routing locales:", routing.locales);

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir}>
      <Providers>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </Providers>
    </div>
  );
}
