import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/* sitemap.ts — convention de fichier Next.js : génère automatiquement
   /sitemap.xml à partir de ce tableau. Une entrée par route × par langue,
   avec `alternates.languages` pour indiquer à Google que /fr/x et /en/x
   sont la même page dans deux langues (évite le contenu dupliqué). */

const routes = ["", "/projets", "/a-propos", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}/fr${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
    alternates: {
      languages: {
        fr: `${siteConfig.url}/fr${route}`,
        en: `${siteConfig.url}/en${route}`,
      },
    },
  }));
}
