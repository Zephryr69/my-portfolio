import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageSeo } from "@/lib/seo";
import Hero from "@/components/Home/Hero";
import QuickProof from "@/components/Home/QuickProof";
import WhoIAm from "@/components/Home/WhoIAm";
import ProjectsSection from "@/components/Home/ProjectsSection";
import ServicesSection from "@/components/Home/ServicesSection";
import WhyWorkTogether from "@/components/Home/WhyWorkTogether";
import MethodSection from "@/components/Home/MethodSection";
import SkillsSection from "@/components/Home/SkillsSection";
import AboutPreview from "@/components/Home/AboutPreview";
import FinalCTA from "@/components/Home/FinalCTA";
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

  return {
    description,
    ...buildPageSeo({ locale, title, description }),
  };
}

export default function HomePage() {
  return (
    <div className={styles.homeWrapper}>
      <Hero />
      <QuickProof />
      <WhoIAm />
      <ProjectsSection />
      <ServicesSection />
      <WhyWorkTogether />
      <MethodSection />
      <SkillsSection />
      <AboutPreview />
      <FinalCTA />
    </div>
  );
}
