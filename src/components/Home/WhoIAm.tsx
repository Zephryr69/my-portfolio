"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./WhoIAm.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function WhoIAm() {
  const t = useTranslations("Home.whoIAm");

  return (
    <motion.section
      className={styles.whoIAm}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <h2>{t("title")}</h2>
      <p>{t("text")}</p>
    </motion.section>
  );
}
