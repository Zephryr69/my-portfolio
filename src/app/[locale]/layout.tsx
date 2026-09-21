import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit, Rubik, Updock } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
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
  // 700 ajouté : absent jusqu'ici, alors que font-weight:700 est demandé
  // à plusieurs endroits (dont le nom dans le Header) — sans cette
  // graisse chargée, le navigateur retombe sur la plus proche (600) et
  // le texte ne paraît pas vraiment gras.
  weight: ["300", "400", "600", "700"],
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

  // Indique à next-intl la locale de cette requête pour le rendu statique :
  // sans ça, les Server Components qui appellent useTranslations() sans
  // locale explicite retombent sur la langue par défaut (fr) — même sur /en.
  setRequestLocale(locale);

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
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${rubik.variable} ${updock.variable}`}
    >
      <head>
        {/* "only light" plutôt que "light dark" : instruction stricte
            plutôt qu'ambiguë (voir tokens.css pour le détail complet).
            Ce meta tag ne peut pas connaître le thème réel de
            l'utilisateur au moment du rendu serveur (préférence stockée
            en localStorage, donc invisible côté serveur) — il reflète
            le thème par défaut du site (clair). Le CSS de tokens.css
            prend ensuite le relais avec "only dark" dès que le vrai
            thème est déterminé côté client (via [data-theme="dark"]). */}
        <meta name="color-scheme" content="only light" />

        {/* Le script d'initialisation du thème (avant hydratation) a été
            retiré : bug connu de compatibilité entre Next.js 16 et React 19
            avec next/script en stratégie "beforeInteractive" (déclenche
            l'avertissement "Encountered a script tag while rendering" à
            chaque page, même avec la syntaxe officielle recommandée). Le
            thème réel est de toute façon posé juste après par
            ThemeContext.tsx — le compromis (un flash à peine perceptible
            au tout premier chargement) est préférable à une erreur
            console permanente. */}
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
