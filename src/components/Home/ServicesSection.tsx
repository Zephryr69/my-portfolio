"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaGlobe, FaBolt, FaBullseye, FaLaptopCode } from "react-icons/fa";
import styles from "./ServicesSection.module.css";

const SERVICES = [
  { key: "showcase", icon: FaGlobe },
  { key: "modernExperience", icon: FaBolt },
  { key: "conversion", icon: FaBullseye },
  { key: "webApp", icon: FaLaptopCode },
] as const;

export default function ServicesSection() {
  const t = useTranslations("Home.services");

  return (
    <section className={styles.services} aria-label={t("title")}>
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
