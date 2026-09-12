import ecoleImg from "../assets/ecole.png";
import iphoneImg from "../assets/max-iphone.png";
import cantineImg from "../assets/cantine.png";
import madatoursImg from "../assets/madatours.png";
import hamuzImg from "../assets/hamuz.png";
import type { StaticImageData } from "next/image";

/* projectsData.ts — données structurelles des projets (image, lien, tech,
   couleur de carte). Le texte (titre, description) vient de
   messages/*.json sous Home.projects.items.<key> — voir ProjectsSection.tsx.

   thumbnail : importe "../assets/madatours.png" — le fichier doit
   exister sous ce nom exact dans src/assets/. */

export interface ProjectDefinition {
  key: string;
  thumbnail: StaticImageData;
  link: string;
  tech: string[];
  colorClass: "cardColor1" | "cardColor2" | "cardColor3" | "cardColor4" | "cardColor5";
  // Absent pour edudine : son repo GitHub est privé, pas de lien à afficher.
  githubUrl?: string;
}

// Ordre revu suite au retour du mentor : HAMUZ et Max iPhone en premier
// (les projets les plus forts / les plus aboutis techniquement).
export const projectsData: ProjectDefinition[] = [
  {
    key: "hamuz",
    thumbnail: hamuzImg,
    link: "https://hamuz.vercel.app/",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    colorClass: "cardColor5",
    githubUrl: "https://github.com/Zephryr69/hamuz",
  },
  {
    key: "iphone",
    thumbnail: iphoneImg,
    link: "https://max-iphone.vercel.app/",
    tech: ["Next.js", "TypeScript", "Framer Motion"],
    colorClass: "cardColor2",
    githubUrl: "https://github.com/Zephryr69/max-iphone",
  },
  {
    key: "madatours",
    thumbnail: madatoursImg,
    link: "https://madatours-eight.vercel.app/fr",
    tech: ["Next.js", "TypeScript", "next-intl", "Framer Motion"],
    colorClass: "cardColor4",
    githubUrl: "https://github.com/Zephryr69/madatours",
  },
  {
    key: "ecole",
    thumbnail: ecoleImg,
    link: "https://zephryr69.github.io/les-jumelles/",
    tech: ["HTML", "CSS", "JavaScript", "React"],
    colorClass: "cardColor1",
    githubUrl: "https://github.com/Zephryr69/les-jumelles",
  },
  {
    key: "edudine",
    thumbnail: cantineImg,
    link: "",
    tech: ["C#", "WinForms", "SQL Server"],
    colorClass: "cardColor3",
    // Pas de githubUrl : Zephryr69/EduDine est un repo privé.
  },
];
