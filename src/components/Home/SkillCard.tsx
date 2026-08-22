"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./SkillsSection.module.css";

interface SkillCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  level: number;
  delay: number;
  ariaLabel: string;
}

export default function SkillCard({ icon, title, description, level, delay, ariaLabel }: SkillCardProps) {
  return (
    <motion.div
      className={styles.skillCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      aria-label={ariaLabel}
      role="region"
    >
      <span className={styles.skillIcon}>{icon}</span>
      <div className={styles.skillTextLevel}>
        <span className={styles.skillTitle}>{title}</span>
        <span className={styles.skillDescription}>{description}</span>
        {/* Barre corrigée : va vraiment jusqu'à `level`%, contrairement à
            l'originale qui finissait toujours à 70% (voir chat). */}
        <motion.div
          className={styles.skillLevel}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
