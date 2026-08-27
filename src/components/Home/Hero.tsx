"use client";

/* Hero.tsx — section hero de Home.jsx.

   Retiré par rapport à l'original :
   - `altFont` (useState + setInterval de 2.2s) : ne pilotait aucun style
     CSS réel (voir chat, `[data-alt="true"]` n'existe dans aucune règle).
     Un minuteur qui tournait dans le vide pendant toute la durée de vie
     du composant, sans le moindre effet visuel.
*/

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./Hero.module.css";

import profileImg from "../../assets/profile.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const t = useTranslations("Home.hero");

  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <motion.h1
          className={styles.heroTitle}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          {t("greeting")}{" "}
          <span className={styles.fancy}>
            <span className={styles.firstName}>Amandino</span>{" "}
            <span className={styles.lastName}>AIMINASSO</span>
          </span>
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8, delay: 0.12 }}
        >
          {t("subtitle")}
        </motion.p>

        <div className={styles.ctaGroup}>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link href="/contact" className={`${styles.heroBtn} ${styles.primary}`}>
              {t("ctaPrimary")}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link href="/projets" className={`${styles.heroBtn} ${styles.secondary}`}>
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Plus de délai ni de fondu d'opacité ici : c'est l'élément LCP
          (le plus gros contenu visible de la page), donc il doit
          s'afficher tout de suite. L'ancien fondu (opacity 0 → 1 sur
          0,9s avec 0,25s de délai) retardait le moment où le navigateur
          considère la photo comme "affichée", même une fois chargée. */}
      <div className={styles.heroImage}>
        <Image
          src={profileImg}
          alt={t("imageAlt")}
          width={320}
          height={400}
          priority
          sizes="(max-width: 768px) 240px, 320px"
          className={styles.heroImg}
        />
      </div>
    </section>
  );
}
