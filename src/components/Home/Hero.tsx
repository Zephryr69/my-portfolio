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
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./Hero.module.css";

import profileImg from "../../assets/profile.png";

export default function Hero() {
  const t = useTranslations("Home.hero");
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Bascule 3D de la photo au survol, suit la position de la souris.
  // useSpring lisse le mouvement (pas de saccade), rotation plafonnée
  // à 12° pour rester subtil plutôt que gadget.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  // --- Effet « cinéma » : projecteur + parallaxe en couches + travelling ---
  // Position de la souris par rapport au CENTRE de la section, en pixels.
  // Les ressorts sont volontairement mous (stiffness bas) : la lumière
  // « traîne » derrière le curseur comme un projecteur de poursuite.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const slowX = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.8 });
  const slowY = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.8 });

  // Couches à des vitesses différentes selon la souris : plus une couche
  // est « loin » de la caméra, moins elle bouge (et en sens inverse du
  // portrait pour le halo). Des ratios en px (et non en %) : le décalage
  // reste petit sur mobile et sur grand écran.
  const photoShiftX = useTransform(slowX, (v) => v * 0.018);
  const photoShiftY = useTransform(slowY, (v) => v * 0.018);
  const haloX = useTransform(slowX, (v) => v * -0.04);
  const haloY = useTransform(slowY, (v) => v * -0.04);

  // « Travelling » : à mesure qu'on descend, la caméra recule. Le texte
  // monte plus vite que la photo, qui rétrécit légèrement, et l'ensemble
  // s'estompe vers la fin. À scrollYProgress = 0 (haut de page) tout est
  // à sa valeur neutre : le rendu serveur et le LCP ne changent pas.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textScrollY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const fade = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.3]);
  const photoY = useTransform(
    [photoShiftY, scrollYProgress],
    ([shift, progress]: number[]) => shift + progress * 40
  );

  // Mouvement coupé si le visiteur a demandé « réduire les animations » :
  // on ne passe simplement pas les motion values au style.
  const textStyle = reduceMotion ? undefined : { y: textScrollY, opacity: fade };
  const spotStyle = reduceMotion ? undefined : { x: slowX, y: slowY };
  const haloStyle = reduceMotion ? undefined : { x: haloX, y: haloY };
  const imageStyle = reduceMotion
    ? undefined
    : {
        rotateX: springX,
        rotateY: springY,
        x: photoShiftX,
        y: photoY,
        scale: photoScale,
        opacity: fade,
      };

  function handleHeroPointerMove(e: React.PointerEvent<HTMLElement>) {
    // Pas de curseur sur écran tactile : le halo y dérive tout seul (CSS).
    if (reduceMotion || e.pointerType === "touch") return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(e.clientX - rect.left - rect.width / 2);
    pointerY.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleHeroPointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
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
    <section
      ref={heroRef}
      className={styles.hero}
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
    >
      {/* Couches d'ambiance (décoratives) : vignette sur les bords, puis
          le « projecteur » qui suit la souris. Sous le texte et la photo
          (z-index), jamais devant. */}
      <div className={styles.vignette} aria-hidden="true" />
      <motion.div className={styles.spot} style={spotStyle} aria-hidden="true">
        <div className={styles.spotInner} />
      </motion.div>

      <motion.div className={styles.heroText} style={textStyle}>
        {/* h1/p en dur, sans motion : ce sont les deux éléments du LCP
            (contenu principal visible au premier écran). Avec
            initial="hidden" + animate="visible", Framer Motion les
            rendait à opacity:0 dans le HTML serveur lui-même — le titre
            de la page restait invisible jusqu'à l'hydratation JS,
            retardant le LCP (surtout sur connexion lente). Même
            raisonnement que le commentaire déjà présent plus bas pour
            la photo : au-dessus de la ligne de flottaison, pas de fondu
            au chargement. */}
        <h1 className={styles.heroTitle}>
          {t.rich("headline", {
            highlight: (chunks) => <span className={styles.highlight}>{chunks}</span>,
          })}
        </h1>

        <p className={styles.heroSubtitle}>{t("subtitle")}</p>

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
      </motion.div>

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
        style={imageStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Lumière de contour derrière le portrait. */}
        <motion.div className={styles.halo} style={haloStyle} aria-hidden="true" />
        <Image
          src={profileImg}
          alt={t("imageAlt")}
          width={320}
          height={400}
          preload
          sizes="(max-width: 768px) 240px, 320px"
          className={styles.heroImg}
        />
      </motion.div>
    </section>
  );
}
