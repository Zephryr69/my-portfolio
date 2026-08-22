import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppShell from "@/components/AppShell";
import "../globals.css";

export const metadata: Metadata = {
  title: "Mon Portfolio",
  description: "Portfolio de développeur front-end",
};

// Génère les pages /fr et /en à l'avance (SSG) plutôt qu'à la demande.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Si quelqu'un tape une URL avec une langue non supportée (/de par ex.),
  // on renvoie une 404 plutôt que de planter.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    // suppressHydrationWarning : ThemeContext pose l'attribut data-theme
    // côté client après le premier rendu (voir ThemeContext.tsx), donc un
    // écart HTML serveur/client est attendu ici, pas une vraie erreur.
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
