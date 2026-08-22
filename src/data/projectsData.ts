import ecoleImg from "../assets/ecole.png";
import iphoneImg from "../assets/iphone.png";
import cantineImg from "../assets/cantine.png";
import type { StaticImageData } from "next/image";

/* projectsData.ts — données structurelles des projets (image, lien, tech,
   couleur de carte). Le texte (titre, description) vient de
   messages/*.json sous Home.projects.items.<key> — voir ProjectsSection.tsx. */

export interface ProjectDefinition {
  key: string;
  thumbnail: StaticImageData;
  link: string;
  tech: string[];
  colorClass: "cardColor1" | "cardColor2" | "cardColor3" | "cardColor4";
}

export const projectsData: ProjectDefinition[] = [
  {
    key: "ecole",
    thumbnail: ecoleImg,
    link: "https://zephryr69.github.io/les-jumelles/",
    tech: ["HTML", "CSS", "JavaScript", "React"],
    colorClass: "cardColor1",
  },
  {
    key: "iphone",
    thumbnail: iphoneImg,
    link: "https://zephryr69.github.io/max-iphone/",
    tech: ["React", "CSS", "Framer Motion"],
    colorClass: "cardColor2",
  },
  {
    key: "cantine",
    thumbnail: cantineImg,
    link: "",
    tech: ["C#", "WinForms", "SQL Server"],
    colorClass: "cardColor3",
  },
];
