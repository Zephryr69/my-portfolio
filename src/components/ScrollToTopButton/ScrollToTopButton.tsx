"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import styles from "./ScrollToTopButton.module.css";

/* ScrollToTopButton.tsx — port de ScrollToTopButton.jsx.

   Changement : l'original posait onClick sur un <motion.div>, pas un
   vrai <button> — inaccessible au clavier et pas annoncé comme un
   contrôle par un lecteur d'écran (même famille de problème que
   l'ancien toggle de thème dans Header). Corrigé ici avec un vrai
   <button> + aria-label. */

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("ScrollToTop");

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className={styles.scrollToTop}
          onClick={scrollToTop}
          aria-label={t("label")}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          <FaArrowUp aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
