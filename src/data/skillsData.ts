import { FaReact, FaGitAlt, FaHtml5 } from "react-icons/fa";
import { SiJavascript, SiNextdotjs, SiTypescript, SiFramer } from "react-icons/si";
import type { IconType } from "react-icons";

/* skillsData.ts — données structurelles des compétences (icône, niveau,
   délai d'apparition). Le texte (titre, description) vient des fichiers
   de traduction sous la clé Home.skills.items.<key> — voir SkillsSection.tsx.
   `key` doit correspondre exactement à une entrée de messages/fr.json et en.json.

   Liste resserrée sur le front-end suite au retour du mentor : Laravel,
   C#, montage vidéo, maintenance OS et recherche web retirés (hors sujet
   pour un positionnement front-end, même si C# a sa place dans la
   description d'Edudine). Next.js, TypeScript et Framer Motion ajoutés :
   ils étaient absents alors qu'ils sont au cœur de 3 des 5 projets réels.
   L'anglais est passé dans le texte de la page À propos plutôt que dans
   cette grille technique. Icônes vérifiées une à une dans le package
   react-icons avant usage (SiFramer représente Framer/Framer Motion,
   pas de logo dédié séparé dans Simple Icons). */

export interface SkillDefinition {
  key: string;
  icon: IconType;
  level: number;
  delay: number;
}

export const skillsData: SkillDefinition[] = [
  // react/javascript : niveau à 35, pas 90 — en formation active sur ces
  // deux technos, pas encore maîtrisées (précision donnée par l'utilisateur).
  { key: "react", icon: FaReact, level: 35, delay: 0 },
  { key: "nextjs", icon: SiNextdotjs, level: 50, delay: 0.12 },
  { key: "typescript", icon: SiTypescript, level: 45, delay: 0.24 },
  { key: "javascript", icon: SiJavascript, level: 35, delay: 0.36 },
  { key: "git", icon: FaGitAlt, level: 70, delay: 0.48 },
  { key: "htmlCss", icon: FaHtml5, level: 90, delay: 0.6 },
  { key: "framerMotion", icon: SiFramer, level: 55, delay: 0.72 },
];
