import {
  FaReact,
  FaGitAlt,
  FaLanguage,
  FaFilm,
  FaHtml5,
} from "react-icons/fa";
import { FaScrewdriverWrench, FaMagnifyingGlass } from "react-icons/fa6";
import { SiLaravel, SiJavascript } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import type { IconType } from "react-icons";

/* skillsData.ts — données structurelles des compétences (icône, niveau,
   délai d'apparition). Le texte (titre, description) vient des fichiers
   de traduction sous la clé Home.skills.items.<key> — voir SkillsSection.tsx.
   `key` doit correspondre exactement à une entrée de messages/fr.json et en.json.

   Icônes choisies pour être précises : logos de marque exacts (Laravel,
   JavaScript) plutôt que des icônes génériques approximatives, et
   FaScrewdriverWrench pour "Maintenance" pour ne pas dupliquer FaTools
   déjà utilisé dans le titre de la section. Pour C#, Simple Icons n'a pas
   de logo officiel — TbBrandCSharp (Tabler Icons) affiche vraiment "C#"
   de façon lisible, contrairement à FaHashtag qui était trop abstrait. */

export interface SkillDefinition {
  key: string;
  icon: IconType;
  level: number;
  delay: number;
}

export const skillsData: SkillDefinition[] = [
  // react/javascript : niveau baissé de 60 à 35 — l'utilisateur a précisé
  // ne pas encore maîtriser ces deux technologies, être en formation
  // active (stages, cours en ligne à venir). Les autres compétences
  // (htmlCss, csharp, git...) n'ont pas été signalées comme concernées,
  // donc laissées inchangées.
  { key: "react", icon: FaReact, level: 35, delay: 0 },
  { key: "laravel", icon: SiLaravel, level: 30, delay: 0.12 },
  { key: "javascript", icon: SiJavascript, level: 35, delay: 0.24 },
  { key: "git", icon: FaGitAlt, level: 70, delay: 0.36 },
  { key: "english", icon: FaLanguage, level: 50, delay: 0.48 },
  { key: "video", icon: FaFilm, level: 40, delay: 0.6 },
  { key: "maintenance", icon: FaScrewdriverWrench, level: 70, delay: 0.72 },
  { key: "search", icon: FaMagnifyingGlass, level: 80, delay: 0.84 },
  { key: "htmlCss", icon: FaHtml5, level: 90, delay: 0.96 },
  { key: "csharp", icon: TbBrandCSharp, level: 85, delay: 1.08 },
];
