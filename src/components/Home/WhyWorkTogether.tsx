"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaUsers, FaBolt, FaMobileAlt, FaCode } from "react-icons/fa";
import styles from "./WhyWorkTogether.module.css";

const REASONS = [
  { key: "userFocused", icon: FaUsers },
  { key: "performance", icon: FaBolt },
  { key: "responsive", icon: FaMobileAlt },
  { key: "modernTech", icon: FaCode },
] as const;

export default function WhyWorkTogether() {
  const t = useTranslations("Home.whyWorkTogether");

  return (
    <section className={styles.section} aria-label={t("title")}>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.intro}>{t("intro")}</p>

      <div className={styles.grid}>
        {REASONS.map(({ key, icon: Icon }, i) => (
          <motion.div
            key={key}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <span className={styles.icon}>
              <Icon aria-hidden="true" />
            </span>
            <h3>{t(`items.${key}.title`)}</h3>
            <p>{t(`items.${key}.description`)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
