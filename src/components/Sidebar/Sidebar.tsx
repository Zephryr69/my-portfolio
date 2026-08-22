"use client";

/* Sidebar.tsx — port de Sidebar.jsx vers Next.js App Router.

   Changements :
   1. Plus de prop `isDarkMode` : le thème est géré entièrement en CSS
      via [data-theme] (voir Sidebar.module.css). Ça élimine le bug
      qu'on avait trouvé dans l'audit (la prop n'était plus transmise
      depuis App.jsx après la migration vers Context, donc la Sidebar
      restait toujours en mode clair).
   2. `useLocation()` (react-router) → `usePathname()` (next-intl),
      même principe que dans Header.tsx.
   3. Textes → useTranslations, en réutilisant le namespace "Header"
      pour les libellés de nav (mêmes destinations que dans le Header,
      pas la peine de dupliquer les traductions).
   4. Ajouté (l'original ne l'avait pas) : un overlay derrière le panneau
      qui ferme au clic, la touche Échap qui ferme aussi, et le scroll de
      la page bloqué tant que le panneau est ouvert. Avant, seuls le
      bouton "fermer" et le clic sur un lien permettaient de sortir.
*/

import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  closeSidebar: () => void;
}

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/projets", key: "projects" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Header");
  const tSidebar = useTranslations("Sidebar");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Empêche la page derrière de scroller tant que le panneau est ouvert.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeSidebar]);

  return (
    <>
      <motion.div
        className={styles.overlay}
        onClick={closeSidebar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />

      <motion.aside
        className={styles.sidebar}
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>{tSidebar("title")}</h2>
          <button
            className={styles.closeButton}
            onClick={closeSidebar}
            aria-label={tSidebar("closeButton")}
          >
            <FaXmark className={styles.customCloseIcon} aria-hidden="true" />
          </button>
        </div>

        <ul className={styles.sidebarLinks}>
          {NAV_ITEMS.map(({ href, key }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={isActive ? styles.linkActive : undefined}
                  onClick={closeSidebar}
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.aside>
    </>
  );
}
