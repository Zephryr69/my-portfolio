import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { FaRocket } from "react-icons/fa";
import { projectsData } from "@/data/projectsData";
import ProjectCard from "@/components/Home/ProjectCard";
import { siteConfig } from "@/lib/siteConfig";
import styles from "@/components/Home/ProjectsSection.module.css";

/* page.tsx (/projets) — liste complète des projets.

   Réutilise ProjectCard et projectsData de la page d'accueil plutôt que
   de porter Projects.jsx/.css d'origine : ce dernier avait son propre
   CSS séparé (sans variantes clair/sombre, sans les couleurs de marque)
   et un bug qui empêchait la description de chaque projet de s'afficher
   (`project.description` au lieu de `project.brief` — voir chat).
   Cette page réutilise donc la version déjà corrigée et cohérente avec
   le reste du site plutôt que de reproduire ces deux problèmes. */

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.projects" });
  const url = `${siteConfig.url}/${locale}/projets`;

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: { title: t("title"), description: t("metaDescription"), url },
  };
}

export default function ProjectsPage() {
  const t = useTranslations("Home.projects");

  return (
    <section className={styles.projectsSection} aria-label={t("title")}>
      <h1 className={styles.sectionTitle}>
        <FaRocket aria-hidden="true" />
        {t("title")}
      </h1>

      <div className={styles.projectsGrid}>
        {projectsData.map(({ key, thumbnail, link, tech, colorClass }, idx) => (
          <ProjectCard
            key={key}
            title={t(`items.${key}.title`)}
            brief={t(`items.${key}.brief`)}
            thumbnail={thumbnail}
            thumbnailAlt={t("thumbnailAlt", { title: t(`items.${key}.title`) })}
            link={link}
            tech={tech}
            colorClass={colorClass}
            ctaLabel={t("ctaLabel")}
            noDemoLabel={t("noDemoLabel")}
            delay={idx * 0.15}
          />
        ))}
      </div>
    </section>
  );
}
