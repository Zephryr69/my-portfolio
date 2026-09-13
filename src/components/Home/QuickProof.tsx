"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { projectsData } from "@/data/projectsData";
import styles from "./QuickProof.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function QuickProof() {
  const t = useTranslations("Home.quickProof");

  return (
    <motion.section
      className={styles.quickProof}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
      aria-label={t("title")}
    >
      <h2 className={styles.title}>{t("title")}</h2>

      <div className={styles.grid}>
        <div className={styles.stat}>
          {/* Nombre réel de projets (source unique : projectsData.ts),
              jamais un chiffre en dur qui pourrait devenir faux. */}
          <strong>{projectsData.length}</strong>
          <span>{t("projectsLabel")}</span>
          <p>{t("projectsDetail")}</p>
        </div>
        <div className={styles.stat}>
          <strong>{t("experienceValue")}</strong>
          <span>{t("experienceLabel")}</span>
          <p>{t("experienceDetail")}</p>
        </div>
        <div className={styles.stat}>
          <strong>{t("responsiveValue")}</strong>
          <span>{t("responsiveLabel")}</span>
          <p>{t("responsiveDetail")}</p>
        </div>
      </div>
    </motion.section>
  );
}
