"use client";

/* AboutPreview.tsx — aperçu "À propos" sur la page d'accueil.

   Pas de nouveau namespace de traduction créé pour ce composant :
   il réutilise directement AboutPage (greeting/lead/portraitAlt), comme
   /projets réutilise Home.projects plutôt que d'avoir sa propre copie —
   même convention déjà en place dans ce projet. Seule clé ajoutée :
   AboutPage.previewCta (le texte "En savoir plus →" n'a pas d'équivalent
   parmi ctaPrimary/ctaSecondary, qui pointent vers d'autres actions).
*/

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import profileImg from "@/assets/profile.png";
import styles from "./AboutPreview.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPreview() {
  const t = useTranslations("AboutPage");

  return (
    <motion.section
      className={styles.aboutPreview}
      aria-label={t("metaTitle")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.portraitWrap}>
        <Image
          src={profileImg}
          alt={t("portraitAlt")}
          className={styles.portrait}
          placeholder="blur"
          sizes="(max-width: 768px) 160px, 220px"
        />
      </div>

      <div className={styles.content}>
        <p className={styles.greeting}>{t("greeting")}</p>
        <h2 className={styles.title}>{t("metaTitle")}</h2>
        <p className={styles.lead}>{t("lead")}</p>
        <Link href="/a-propos" className={styles.cta}>
          {t("previewCta")}
        </Link>
      </div>
    </motion.section>
  );
}
