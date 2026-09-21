"use client";

/* Hero.tsx — section hero de Home.jsx.

   Retiré par rapport à l'original :
   - `altFont` (useState + setInterval de 2.2s) : ne pilotait aucun style
     CSS réel (voir chat, `[data-alt="true"]` n'existe dans aucune règle).
     Un minuteur qui tournait dans le vide pendant toute la durée de vie
     du composant, sans le moindre effet visuel.

   Ajouté : un mot du titre mis en valeur (dégradé animé, via t.rich)
   pour donner du "punch" à une phrase autrement plate, et un effet de
   bascule 3D sur la photo qui suit la souris — une vraie touche UX
   plutôt qu'un simple effet décoratif.
*/

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
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
  const imageWrapRef = useRef<HTMLDivElement>(null);

  // Bascule 3D de la photo au survol, suit la position de la souris.
  // useSpring lisse le mouvement (pas de saccade), rotation plafonnée
  // à 12° pour rester subtil plutôt que gadget.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imageWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 12);
    rotateX.set(-y * 12);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

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
          {t.rich("headline", {
            highlight: (chunks) => <span className={styles.highlight}>{chunks}</span>,
          })}
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

        <p className={styles.tagline}>{t("tagline")}</p>
      </div>

      {/* Plus de délai ni de fondu d'opacité ici : c'est l'élément LCP
          (le plus gros contenu visible de la page), donc il doit
          s'afficher tout de suite. L'ancien fondu (opacity 0 → 1 sur
          0,9s avec 0,25s de délai) retardait le moment où le navigateur
          considère la photo comme "affichée", même une fois chargée.
          L'effet de bascule au survol ci-dessous ne touche pas à ça :
          transform reste à 0 tant qu'il n'y a pas d'interaction. */}
      <motion.div
        ref={imageWrapRef}
        className={styles.heroImage}
        style={{ rotateX: springX, rotateY: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={profileImg}
          alt={t("imageAlt")}
          width={320}
          height={400}
          priority
          sizes="(max-width: 768px) 240px, 320px"
          className={styles.heroImg}
        />
      </motion.div>
    </section>
  );
}
