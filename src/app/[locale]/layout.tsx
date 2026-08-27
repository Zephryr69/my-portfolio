import type { Metadata } from "next";
import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppShell from "@/components/AppShell";
import { siteConfig } from "@/lib/siteConfig";
import "../globals.css";

/* generateMetadata (au lieu d'un simple export const metadata statique) :
   permet de générer un titre/description traduits selon la locale, et
   sert de base commune (OpenGraph, Twitter, hreflang) à toutes les pages
   — chaque page peut ensuite surcharger juste ce qui lui est spécifique
   via son propre generateMetadata (voir page.tsx de chaque route). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Header" });
  const tHero = await getTranslations({ locale, namespace: "Home.hero" });

  const title = t("brand");
  const description = tHero("subtitle");
  const url = `${siteConfig.url}/${locale}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s | ${title}` },
    description,
    alternates: {
      canonical: url,
      languages: {
        fr: `${siteConfig.url}/fr`,
        en: `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: title,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
