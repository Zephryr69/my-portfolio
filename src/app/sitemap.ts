import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { projectsData } from "@/data/projectsData";

/* sitemap.ts — convention de fichier Next.js : génère automatiquement
   /sitemap.xml à partir de ce tableau.

   Avant : une seule entrée par route, toujours en /fr, avec /en glissé
   uniquement dans `alternates.languages` — les pages anglaises n'étaient
   donc jamais listées comme URL à part entière dans le sitemap, seulement
   référencées en creux sous leur équivalent français. Certains moteurs
   les indexaient quand même via hreflang, mais rien ne le garantissait.

   Maintenant : une entrée par route × par langue (fr ET en), chacune
   pointant sur sa propre URL, et portant les MÊMES alternates (donc
   chaque entrée dit aux moteurs "voici l'équivalent fr et l'équivalent
   en de cette page" — symétrique dans les deux sens). */

// Les pages « cas d'étude » (/projets/[slug]) étaient absentes du sitemap :
// on les dérive de projectsData pour qu'un nouveau projet y apparaisse seul.
const routes = [
  "",
  "/projets",
  "/a-propos",
  "/contact",
  ...projectsData.map(({ key }) => `/projets/${key}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    siteConfig.locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          fr: `${siteConfig.url}/fr${route}`,
          en: `${siteConfig.url}/en${route}`,
        },
      },
    })),
  );
}
