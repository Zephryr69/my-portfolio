import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit, Rubik, Updock } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppShell from "@/components/AppShell";
import { siteConfig, baseOpenGraph } from "@/lib/siteConfig";
import "../globals.css";

/* next/font/google : télécharge les polices UNE FOIS au moment du build,
   les héberge directement sur ton site (plus de requête vers Google à
   chaque visite), et les précharge sans bloquer l'affichage — contrairement
   à l'ancien @import CSS qui obligeait le navigateur à attendre la
   réponse de fonts.googleapis.com avant de continuer à dessiner la page.
   C'était la cause principale du mauvais score LCP sur la photo du Hero. */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-outfit",
  display: "swap",
});
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});
const updock = Updock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-updock",
  display: "swap",
});

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
      ...baseOpenGraph,
      title,
      description,
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
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

  // `getMessages()` sans argument s'appuie sur un contexte de requête
  // implicite (AsyncLocalStorage côté next-intl) pour deviner la locale —
  // et dans cette combinaison Next.js 16 (Turbopack) + next-intl 4.13, ce
  // contexte retombe systématiquement sur `defaultLocale` ("fr") côté
  // client, MÊME sur /en : le <html lang="en"> et le <title> restent
  // corrects (générés via generateMetadata, qui reçoit `locale` en
  // paramètre explicite), mais tout ce qui passe par useTranslations /
  // useLocale côté client (Header, LanguageSwitcher, Hero...) recevait le
  // français quelle que soit l'URL — d'où le sélecteur de langue qui
  // semblait "ne rien faire" en anglais.
  // Fix : on passe `locale` explicitement, à la fois à getMessages() et
  // au provider, pour ne plus dépendre de cette déduction implicite.
  const messages = await getMessages({ locale });

  return (
    // suppressHydrationWarning : ThemeContext pose l'attribut data-theme
    // côté client après le premier rendu (voir ThemeContext.tsx), donc un
    // écart HTML serveur/client est attendu ici, pas une vraie erreur.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${outfit.variable} ${rubik.variable} ${updock.variable}`}
    >
      <head>
        {/* next/script avec strategy="beforeInteractive" (au lieu d'une
            balise <script> brute) : s'exécute avant l'hydratation React,
            comme voulu pour lire isDarkMode et poser data-theme sans flash
            — mais via le mécanisme officiel de Next.js, qui sait où
            l'insérer correctement. Une <script> brute directement dans le
            JSX déclenche l'avertissement React "Encountered a script tag
            while rendering" (React ne l'exécute jamais lui-même côté
            client), alors que next/script est prévu précisément pour ça. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            var saved = localStorage.getItem("isDarkMode");
            if (saved === "true") document.documentElement.setAttribute("data-theme", "dark");
          } catch (e) {}`}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
