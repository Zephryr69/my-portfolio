import type { Metadata } from "next";
import { siteConfig, baseOpenGraph } from "@/lib/siteConfig";

/* seo.ts — métadonnées de partage communes à toutes les pages.

   Pourquoi ce fichier : Next.js ne fusionne pas `alternates`, `openGraph`
   et `twitter` entre layout et page — un objet défini dans une page
   REMPLACE celui du layout. Conséquences constatées avant ce fichier :
   plus de hreflang dans le <head> et plus d'image de partage (og:image)
   sur toutes les pages sauf l'accueil, et des balises Twitter reprenant
   le titre de l'accueil. Chaque generateMetadata appelle donc
   buildPageSeo() pour tout redéclarer d'un coup, de façon cohérente.

   `path` : chemin SANS langue, "" pour l'accueil (ex. "/projets"). */

export function buildPageSeo({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  const url = `${siteConfig.url}/${locale}${path}`;
  // Généré par src/app/[locale]/opengraph-image.tsx (une image par langue).
  // Les pages imbriquées (/projets...) n'héritent pas de ce fichier
  // automatiquement, d'où l'URL explicite.
  const image = { url: `/${locale}/opengraph-image`, width: 1200, height: 630, alt: title };

  return {
    alternates: {
      canonical: url,
      languages: {
        fr: `${siteConfig.url}/fr${path}`,
        en: `${siteConfig.url}/en${path}`,
      },
    },
    openGraph: {
      ...baseOpenGraph,
      title,
      description,
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
