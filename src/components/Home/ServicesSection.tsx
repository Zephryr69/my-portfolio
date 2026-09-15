"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaGlobe, FaArrowsRotate, FaBullseye, FaLaptopCode } from "react-icons/fa6";
import styles from "./ServicesSection.module.css";

/* Différenciés par SITUATION du client (pas encore de site / site à
   moderniser / objectif de conversion précis / outil métier interne),
   plutôt que par qualité vague ("moderne", "soigné") — les trois
   premières versions se ressemblaient trop, un client ne pouvait pas
   savoir laquelle correspondait à son besoin. */
const SERVICES = [
  { key: "showcase", icon: FaGlobe },
  { key: "redesign", icon: FaArrowsRotate },
  { key: "conversion", icon: FaBullseye },
  { key: "customApp", icon: FaLaptopCode },
] as const;

export default function ServicesSection() {
  const t = useTranslations("Home.services");

  return (
    <section id="services" className={styles.services} aria-label={t("title")}>
      <h2 className={styles.title}>{t("title")}</h2>

      <div className={styles.grid}>
        {SERVICES.map(({ key, icon: Icon }, i) => (
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
