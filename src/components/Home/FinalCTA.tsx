"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  const t = useTranslations("Home.finalCta");

  return (
    <motion.section
      className={styles.finalCta}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2>{t("title")}</h2>
      <p>{t("text")}</p>

      <div className={styles.buttons}>
        <Link href="/contact" className={`${styles.btn} ${styles.primary}`}>
          {t("ctaPrimary")}
        </Link>
        <span className={styles.or}>{t("or")}</span>
        <a
          href="https://wa.me/2290169118745"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.btn} ${styles.secondary}`}
        >
          {t("ctaWhatsapp")}
        </a>
      </div>
    </motion.section>
  );
}
