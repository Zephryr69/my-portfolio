"use client";

import { useTranslations } from "next-intl";
import { FaRocket } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import { projectsData } from "@/data/projectsData";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectsSection.module.css";

export default function ProjectsSection() {
  const t = useTranslations("Home.projects");

  return (
    <section className={styles.projectsSection} aria-label={t("title")}>
      <h2 className={styles.sectionTitle}>
        <FaRocket aria-hidden="true" />
        {t("title")}
      </h2>

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

      <div className={styles.projectsMore}>
        <Link href="/projets" className={styles.projectsBtn}>
          {t("seeMore")}
        </Link>
      </div>
    </section>
  );
}
