"use client";

/* AboutPreview.tsx — aperçu "À propos" sur la page d'accueil.

   Pas de nouveau namespace de traduction créé pour ce composant :
   il réutilise directement AboutPage, comme /projets réutilise
   Home.projects plutôt que d'avoir sa propre copie — même convention
   déjà en place dans ce projet. Seule clé ajoutée : AboutPage.previewCta.

   v2 : greeting/lead retirés. Ces deux clés reprenaient quasiment mot
   pour mot Home.hero.subtitle ("Développeur Front-end...") déjà affiché
   juste au-dessus dans le Hero — cette section ne disait donc rien de
   nouveau. À la place : la disponibilité (info absente du Hero) et les
   3 stats chiffrées déjà utilisées sur /a-propos (preuve concrète,
   plutôt qu'une redite du pitch). */

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
        <h2 className={styles.title}>{t("metaTitle")}</h2>
        <p className={styles.availability}>{t("availability")}</p>

        {/* Même donnée (3 projets) que le "3" en dur dans AboutView.tsx
            (aside .stats) — pas de clé de traduction dédiée pour ce
            nombre côté AboutPage, donc même choix ici pour rester
            cohérent entre les deux endroits où il s'affiche. */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <strong>3</strong>
            <span>{t("stat1Label")}</span>
          </div>
          <div className={styles.stat}>
            <strong>{t("stat2Value")}</strong>
            <span>{t("stat2Label")}</span>
          </div>
          <div className={styles.stat}>
            <strong>{t("stat3Value")}</strong>
            <span>{t("stat3Label")}</span>
          </div>
        </div>

        <Link href="/a-propos" className={styles.cta}>
          {t("previewCta")}
        </Link>
      </div>
    </motion.section>
  );
}
