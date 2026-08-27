/* siteConfig.ts — source unique pour tout ce qui touche au SEO global.
   Toute URL absolue (canonical, OpenGraph, sitemap, robots.txt) part
   d'ici, pour ne jamais avoir à la corriger à plusieurs endroits si le
   domaine change un jour. */

export const siteConfig = {
  name: "Amandino AIMINASSO — Portfolio",
  // process.env.NEXT_PUBLIC_SITE_URL permet de surcharger sans toucher au
  // code (utile si tu passes un jour sur un domaine personnalisé) — sinon
  // ça retombe sur l'URL Vercel actuelle.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://my-portfolio-nine-roan-27.vercel.app",
  locales: ["fr", "en"] as const,
  defaultLocale: "fr" as const,
};

export type Locale = (typeof siteConfig.locales)[number];
