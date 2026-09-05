"use client";

/* AboutView.tsx — port de About.jsx.

   Changements :
   - Emojis (👋, 🛠) retirés — le 🛠 est remplacé par FaTools comme sur
     l'accueil, le 👋 simplement retiré (une salutation n'a pas besoin
     d'icône de remplacement).
   - Couleurs des icônes de compétences : l'original faisait tourner
     4 couleurs arc-en-ciel (#61dafb, #ff2d55, #facc15, #34d399) sans
     rapport avec l'identité du site — remplacées par la palette
     orange/marine, même logique que la correction déjà faite sur les
     cartes projets.
   - Icônes de compétences réutilisées depuis skillsData.ts (déjà
     corrigées : SiLaravel, SiJavascript, FaGitAlt, TbBrandCSharp...)
     plutôt que ré-approximées une seconde fois comme dans l'original
     (qui avait FaPhp, FaMobileAlt, FaGithub, FaCode ici aussi).
   - `data-theme={themeClass}` posé localement sur la page retiré : le
     thème est déjà porté globalement par <html data-theme="..."> via
     ThemeContext, plus besoin de le reposer à chaque page.
*/

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FaTools, FaCode, FaBolt, FaPalette } from "react-icons/fa";
import { skillsData } from "@/data/skillsData";
import { projectsData } from "@/data/projectsData";
import styles from "./page.module.css";
import profileImg from "../../../assets/profile.png";

const WHY_ME_ITEMS = [
  { key: "clean", icon: FaCode },
  { key: "fast", icon: FaBolt },
  { key: "design", icon: FaPalette },
] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutView() {
  const t = useTranslations("AboutPage");

  return (
    <main className={styles.aboutPage}>
      {/* INTRO */}
      <section className={`${styles.intro} ${styles.glassmorphic}`} aria-labelledby="about-hello">
        <div>
          <motion.h1
            id="about-hello"
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            {t("greeting")} <span className={styles.name}>Amandino AIMINASSO</span>
          </motion.h1>

          <motion.p
            className={styles.lead}
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            {t("lead")}
          </motion.p>

          <div className={styles.introCta} role="group" aria-label={t("ctaGroupLabel")}>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/contact" className={`${styles.heroBtn} ${styles.primary}`}>
                {t("ctaPrimary")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link href="/projets" className={`${styles.heroBtn} ${styles.ghost}`}>
                {t("ctaSecondary")}
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.figure
          className={styles.introPortrait}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Image src={profileImg} alt={t("portraitAlt")} width={260} height={260} className={styles.portraitImg} />
          <figcaption>{t("availability")}</figcaption>
        </motion.figure>
      </section>

      {/* PARCOURS / METHODE */}
      <section className={styles.storyHero} aria-label={t("storyAriaLabel")}>
        <motion.article
          className={`${styles.story} ${styles.glassmorphic}`}
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2>{t("storyTitle")}</h2>
          <p>{t("storyText")}</p>

          <h4>{t("methodTitle")}</h4>
          <ol className={styles.process}>
            <li>
              <strong>{t("step1Title")}</strong> — {t("step1Text")}
            </li>
            <li>
              <strong>{t("step2Title")}</strong> — {t("step2Text")}
            </li>
            <li>
              <strong>{t("step3Title")}</strong> — {t("step3Text")}
            </li>
          </ol>
        </motion.article>

        <aside className={`${styles.stats} ${styles.glassmorphic}`}>
          <div className={styles.stat}>
            {/* Avant : "3" en dur — périmé depuis l'ajout de MadaTours
                (4e projet). Dérivé de projectsData.length maintenant,
                donc ce nombre ne pourra plus se re-périmer tout seul
                au prochain projet ajouté. */}
            <strong>{projectsData.length}</strong>
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
        </aside>
      </section>

      {/* COMPETENCES */}
      <section className={styles.skillsSection} aria-label={t("skillsAriaLabel")}>
        <h2 className={styles.sectionTitle}>
          <FaTools aria-hidden="true" />
          {t("skillsTitle")}
        </h2>
        <p className={styles.sub}>{t("skillsSubtitle")}</p>

        <div className={styles.skillsGrid}>
          {skillsData.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              className={styles.skillCard}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <div className={styles.skillLeft}>
                <span className={styles.skillIcon} aria-hidden="true">
                  <Icon />
                </span>
              </div>
              <div className={styles.skillRight}>
                <div className={styles.skillTitle}>{t(`skillItems.${key}.title`)}</div>
                <div className={styles.skillSub}>{t(`skillItems.${key}.subtitle`)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POURQUOI MOI — fusion de l'ancien "Ce que j'apporte" avec un
          vrai argumentaire, plutôt qu'une simple liste à puces dans un
          panneau glassmorphique comme les autres sections. */}
      <section className={styles.whyMeSection}>
        <h2 className={styles.whyMeTitle}>{t("whyMeTitle")}</h2>
        <p className={styles.whyMeIntro}>{t("whyMeIntro")}</p>

        <div className={styles.whyMeGrid}>
          {WHY_ME_ITEMS.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              className={styles.whyMeCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <span className={styles.whyMeIcon}>
                <Icon aria-hidden="true" />
              </span>
              <h3>{t(`whyMeItems.${key}.title`)}</h3>
              <p>{t(`whyMeItems.${key}.description`)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={styles.whyMeCtaWrap}
        >
          <Link href="/contact" className={`${styles.heroBtn} ${styles.primary}`}>
            {t("whyMeCta")}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
