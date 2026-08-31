import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig, baseOpenGraph } from "@/lib/siteConfig";
import AboutView from "./AboutView";

/* page.tsx (/a-propos) — Server Component.
   generateMetadata ne peut vivre que dans un Server Component ; comme le
   contenu de la page utilise Framer Motion (Client Component obligatoire),
   on sépare : ce fichier gère juste le <title> de l'onglet, AboutView.tsx
   porte tout le contenu animé. */

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  const url = `${siteConfig.url}/${locale}/a-propos`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function AboutPage() {
  return <AboutView />;
}
