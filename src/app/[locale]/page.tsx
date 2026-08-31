import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig, baseOpenGraph } from "@/lib/siteConfig";
import Hero from "@/components/Home/Hero";
import SkillsSection from "@/components/Home/SkillsSection";
import ProjectsSection from "@/components/Home/ProjectsSection";
import styles from "./page.module.css";

export const dynamic = "force-static";

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
    description,
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default function HomePage() {
  return (
    <div className={styles.homeWrapper}>
      <Hero />
      <SkillsSection />
      <ProjectsSection />
      {/* AboutPreview arrive à l'étape suivante */}
    </div>
  );
}
