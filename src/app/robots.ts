import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

/* robots.ts — convention de fichier Next.js : génère /robots.txt.
   Tout est autorisé à l'indexation (site public, pas d'admin ni de zone
   privée), et pointe vers le sitemap pour aider les moteurs à tout
   découvrir plus vite. */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
