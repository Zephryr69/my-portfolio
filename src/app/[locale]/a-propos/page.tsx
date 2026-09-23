import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageSeo } from "@/lib/seo";
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

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    ...buildPageSeo({
      locale,
      path: "/a-propos",
      title: t("metaTitle"),
      description: t("metaDescription"),
    }),
  };
}

export default function AboutPage() {
  return <AboutView />;
}
