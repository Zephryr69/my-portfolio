"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./MethodSection.module.css";

const STEPS = ["understand", "structure", "design", "develop", "deliver"] as const;

export default function MethodSection() {
  const t = useTranslations("Home.method");

  return (
    <section className={styles.method} aria-label={t("title")}>
      <h2 className={styles.title}>{t("title")}</h2>

      <ol className={styles.steps}>
        {STEPS.map((key, i) => (
          <motion.li
            key={key}
            className={styles.step}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{t(`steps.${key}.title`)}</h3>
              <p>{t(`steps.${key}.description`)}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
