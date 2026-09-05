"use client";

/* StickyMobileCta.tsx — barre CTA fixe en bas d'écran, mobile uniquement
   (cachée en desktop via CSS, voir le .module.css : display:none par
   défaut, display:flex sous 768px — même breakpoint que le reste du
   site). Objectif : garder l'appel à l'action visible en permanence
   pendant le scroll sur mobile, plutôt que seulement dans le Hero.

   Cachée sur /contact elle-même : inutile de proposer "démarrer un
   projet → /contact" à quelqu'un déjà sur la page de contact.
   Réutilise Home.hero.ctaPrimary plutôt qu'un nouveau texte, pour rester
   cohérent avec le bouton déjà utilisé dans le Hero (même convention
   que /projets qui réutilise Home.projects). */

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import styles from "./StickyMobileCta.module.css";

export default function StickyMobileCta() {
  const t = useTranslations("Home.hero");
  const pathname = usePathname();

  if (pathname === "/contact") return null;

  return (
    <div className={styles.stickyBar}>
      <Link href="/contact" className={styles.ctaButton}>
        {t("ctaPrimary")}
      </Link>
    </div>
  );
}
