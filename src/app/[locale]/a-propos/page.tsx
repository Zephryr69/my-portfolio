import { getTranslations } from "next-intl/server";
import AboutView from "./AboutView";

/* page.tsx (/a-propos) — Server Component.
   generateMetadata ne peut vivre que dans un Server Component ; comme le
   contenu de la page utilise Framer Motion (Client Component obligatoire),
   on sépare : ce fichier gère juste le <title> de l'onglet, AboutView.tsx
   porte tout le contenu animé. */

export async function generateMetadata() {
  const t = await getTranslations("AboutPage");
  return { title: t("metaTitle") };
}

export default function AboutPage() {
  return <AboutView />;
}
