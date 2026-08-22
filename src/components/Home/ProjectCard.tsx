"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { StaticImageData } from "next/image";
import styles from "./ProjectsSection.module.css";

interface ProjectCardProps {
  title: string;
  brief: string;
  thumbnail: StaticImageData;
  thumbnailAlt: string;
  link: string;
  tech: string[];
  colorClass: "cardColor1" | "cardColor2" | "cardColor3" | "cardColor4";
  ctaLabel: string;
  delay: number;
}

export default function ProjectCard({
  title,
  brief,
  thumbnail,
  thumbnailAlt,
  link,
  tech,
  colorClass,
  ctaLabel,
  delay,
}: ProjectCardProps) {
  return (
    <motion.div
      className={`${styles.projectCard} ${styles[colorClass]}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      aria-label={title}
      role="region"
    >
      <Image src={thumbnail} alt={thumbnailAlt} className={styles.projectImg} />

      <div className={styles.projectInfo}>
        <h3>{title}</h3>
        <p>{brief}</p>

        <div className={styles.projectTech}>
          {tech.map((item) => (
            <span key={item} className={styles.techBadges}>
              {item}
            </span>
          ))}
        </div>

        <div className={styles.projectLinks}>
          <a href={link} className={styles.projectCta} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
