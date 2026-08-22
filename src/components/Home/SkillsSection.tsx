"use client";

import { useTranslations } from "next-intl";
import { FaTools } from "react-icons/fa";
import { skillsData } from "@/data/skillsData";
import SkillCard from "./SkillCard";
import styles from "./SkillsSection.module.css";

export default function SkillsSection() {
  const t = useTranslations("Home.skills");

  return (
    <section className={styles.skillsSection} aria-label={t("title")}>
      <h2 className={styles.sectionTitle}>
        <FaTools aria-hidden="true" />
        {t("title")}
      </h2>
      <div className={styles.skillsGrid}>
        {skillsData.map(({ key, icon: Icon, level, delay }) => {
          const title = t(`items.${key}.title`);
          return (
            <SkillCard
              key={key}
              icon={<Icon />}
              title={title}
              description={t(`items.${key}.description`)}
              level={level}
              delay={delay}
              ariaLabel={t("cardAriaLabel", { title, level })}
            />
          );
        })}
      </div>
    </section>
  );
}
