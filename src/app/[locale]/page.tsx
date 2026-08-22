import Hero from "@/components/Home/Hero";
import SkillsSection from "@/components/Home/SkillsSection";
import ProjectsSection from "@/components/Home/ProjectsSection";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homeWrapper}>
      <Hero />
      <SkillsSection />
      <ProjectsSection />
      {/* AboutPreview arrive à l'étape suivante */}
    </div>
  );
}
