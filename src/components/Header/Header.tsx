"use client";

/* Header.tsx — port de Header.jsx (Vite/react-router) vers Next.js App Router.

   Changements par rapport à l'original :
   1. `Link`/`NavLink` de react-router → `Link`/`usePathname` de
      "@/i18n/routing" (générés par next-intl dans routing.ts).
      Avantage : ce Link gère automatiquement le préfixe /fr ou /en,
      pas besoin d'y penser dans le composant.
   2. Plus de prop `isActive` fournie par NavLink : Next.js n'a pas
      d'équivalent direct, donc on compare nous-mêmes `pathname` à la
      route du lien (voir isActivePath dans lib/navigation.ts).
   3. Textes en dur → `useTranslations("Header")`, lus depuis
      messages/fr.json et messages/en.json.
   4. Les icônes viennent de src/assets/ et passent par next/image, qui
      lit leurs dimensions à l'import statique.
   5. Les routes restent en français pour les deux langues pour l'instant
      (/projets, /a-propos, /contact) — seul le contenu change de langue.
      Si tu veux aussi des URLs traduites (/en/projects), on ajoutera un
      objet `pathnames` dans i18n/routing.ts plus tard, ça se fait
      indépendamment du reste.
*/

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useTheme } from "@/contexts/ThemeContext";
import { NAV_ITEMS, isActivePath } from "@/lib/navigation";
import { FaXmark } from "react-icons/fa6";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Header.module.css";

// Import statique depuis src/assets : next/image lit les dimensions
// réelles du fichier automatiquement (pas besoin de les deviner).
import sunIcon from "../../assets/Sun.png";
import moonIcon from "../../assets/Crescent Moon.png";
import menuIcon from "../../assets/menu-icon.png";

interface HeaderProps {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuClick = () => {}, isMenuOpen = false }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const t = useTranslations("Header");
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.headerLink} aria-label={t("backHome")}>
        <div className={styles.header}>
          <span className={styles.brandName}>{t("brand")}</span>
          <span className={styles.brandRole}>{t("brandRole")}</span>
        </div>
      </Link>

      <ul className={styles.navList}>
        {NAV_ITEMS.map(({ href, key }) => {
          const isActive = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              >
                {t(`nav.${key}`)}
              </Link>
            </li>
          );
        })}
      </ul>

      <LanguageSwitcher />

      <button
        type="button"
        className={styles.toggleIcon}
        onClick={toggleTheme}
        aria-label={t("themeToggle")}
      >
        <Image
          src={isDarkMode ? moonIcon : sunIcon}
          alt=""
          width={28}
          height={28}
        />
      </button>

      <button
        className={styles.burger}
        onClick={onMenuClick}
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <FaXmark className={styles.customMenuIcon} aria-hidden="true" />
        ) : (
          <Image
            src={menuIcon}
            alt=""
            width={28}
            height={28}
            className={styles.customMenuIcon}
          />
        )}
      </button>
    </header>
  );
}
