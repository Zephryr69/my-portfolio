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

/* contact/social — étaient dupliqués en dur à 7 endroits (Footer,
   FinalCTA, ContactView) avec un vrai risque de désync si le numéro ou
   l'email change un jour. Un seul de ces endroits (ContactView) formatait
   déjà le wa.me sans "+" — ce fichier dérive whatsappUrl du même numéro
   que telHref, donc les deux ne peuvent plus diverger. */
export const contact = {
  phoneDisplay: "+229 01 69 11 87 45",
  telHref: "tel:+2290169118745",
  whatsappUrl: "https://wa.me/2290169118745",
  email: "amandinoaiminasso@gmail.com",
  city: "Porto-Novo, Bénin",
};

export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/amandino-a%C3%AFminasso-68034a224",
  github: "https://github.com/Zephryr69",
};

/* baseOpenGraph — champs OpenGraph qui ne varient PAS d'une page à
   l'autre (siteName, type). Next.js ne fusionne pas les objets `openGraph`
   entre layout et page (un `openGraph` défini dans page.tsx REMPLACE
   entièrement celui du layout, il ne le complète pas champ par champ).
   Donc chaque generateMetadata qui définit `openGraph` doit spreader
   cette base pour ne jamais perdre siteName/type — voir layout.tsx et
   les page.tsx de chaque route. */
export const baseOpenGraph = {
  siteName: siteConfig.name,
  type: "website" as const,
};
