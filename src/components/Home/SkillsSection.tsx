"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaTools, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { skillsData } from "@/data/skillsData";
import styles from "./SkillsSection.module.css";

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

export default function SkillsSection() {
  const t = useTranslations("Home.technologies");
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);

  const total = skillsData.length;
  const current = skillsData[index];
  const Icon = current.icon;

  const paginate = (dir: number) => {
    setState(([i]) => {
      let next = (i + dir) % total;
      if (next < 0) next += total;
      return [next, dir];
    });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) paginate(1);
    else if (info.offset.x > 60) paginate(-1);
  };

  return (
    <section className={styles.skillsSection} aria-label={t("title")}>
      <h2 className={styles.sectionTitle}>
        <FaTools aria-hidden="true" />
        {t("title")}
      </h2>
      <p className={styles.sectionIntro}>{t("intro1")}</p>
      <p className={styles.sectionIntro}>{t("intro2")}</p>

      <div className={styles.carousel}>
        <button
          type="button"
          onClick={() => paginate(-1)}
          className={styles.navBtn}
          aria-label={t("prevLabel")}
        >
          <FaChevronLeft aria-hidden="true" />
        </button>

        <div className={styles.carouselTrack}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.key}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className={styles.techCard}
            >
              <span className={styles.techIconBig}>
                <Icon aria-hidden="true" />
              </span>
              <h3>{t(`items.${current.key}.title`)}</h3>
              <p className={styles.tagline}>{t(`items.${current.key}.tagline`)}</p>
              <p className={styles.description}>{t(`items.${current.key}.description`)}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => paginate(1)}
          className={styles.navBtn}
          aria-label={t("nextLabel")}
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>

      {/* Zone annoncée aux lecteurs d'écran à chaque changement de slide,
          puisque le carrousel ne peut pas compter uniquement sur le visuel. */}
      <p className={styles.srOnly} aria-live="polite">
        {t(`items.${current.key}.title`)}
      </p>

      <div className={styles.dots} role="tablist" aria-label={t("title")}>
        {skillsData.map((s, i) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={t(`items.${s.key}.title`)}
            className={i === index ? styles.dotActive : styles.dot}
            onClick={() => setState([i, i > index ? 1 : -1])}
          />
        ))}
      </div>

      <div className={styles.closing}>
        <h3>{t("closingTitle")}</h3>
        <p>{t("closingText")}</p>
      </div>
    </section>
  );
}
