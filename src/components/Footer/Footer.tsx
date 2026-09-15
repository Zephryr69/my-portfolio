/* Footer.tsx — port de Footer.jsx vers Next.js App Router.

   Différence notable avec l'original : pas de "use client" ici.
   L'original appelait useTheme() uniquement pour choisir une classe
   "dark"/"light" — mais on a vu que cette classe ne correspondait à
   aucun sélecteur CSS réel (voir les notes dans Footer.module.css).
   Le thème est maintenant géré à 100% en CSS via [data-theme], donc
   Footer n'a plus besoin d'aucun state/hook côté client : c'est un
   Server Component, rendu une fois côté serveur, zéro JS envoyé au
   navigateur pour ce composant.
*/

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/projets", key: "projects" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export default function Footer() {
  const t = useTranslations("Header");
  const tFooter = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Marque + réseaux */}
        <div className={styles.footerSection}>
          <Link href="/" className={styles.footerBrand} aria-label={t("nav.home")}>
            <strong className={styles.brandMain}>{t("brand")}</strong>
            <span className={styles.brandSub}>{tFooter("brandSub")}</span>
          </Link>
          <p className={styles.slogan}>{tFooter("slogan")}</p>

          <div className={styles.socialIcons} aria-label={tFooter("socialLabel")}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a
              href="https://www.linkedin.com/in/amandino-a%C3%AFminasso-68034a224"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a href="https://github.com/Zephryr69" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://youtube.com/tonchaine" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className={`${styles.footerSection} ${styles.contactUs}`}>
          <h4>{tFooter("contactTitle")}</h4>
          <p>
            <FaMapMarkerAlt /> Porto-Novo, Bénin
          </p>
          <p>
            <FaPhoneAlt /> +229 01 69 11 87 45
          </p>
          <p>
            <FaEnvelope /> <a href="mailto:amandinoaiminasso@gmail.com">amandinoaiminasso@gmail.com</a>
          </p>
        </div>

        {/* Navigation */}
        <div className={styles.footerSection}>
          <h4>{tFooter("navTitle")}</h4>
          <ul className={styles.footerNavLinks}>
            {NAV_ITEMS.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className={styles.footerNavLink}>
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services — remplace l'ancien bloc "À propos", devenu redondant
            avec "Qui je suis" + l'aperçu À propos + la page À propos
            complète (le même pitch répété 4 fois). Renforce plutôt la
            section Services de l'accueil. */}
        <div className={styles.footerSection}>
          <h4>{tFooter("servicesTitle")}</h4>
          <ul className={styles.footerNavLinks}>
            <li>
              <Link href="/#services" className={styles.footerNavLink}>
                {tFooter("services.showcase")}
              </Link>
            </li>
            <li>
              <Link href="/#services" className={styles.footerNavLink}>
                {tFooter("services.redesign")}
              </Link>
            </li>
            <li>
              <Link href="/#services" className={styles.footerNavLink}>
                {tFooter("services.conversion")}
              </Link>
            </li>
            <li>
              <Link href="/#services" className={styles.footerNavLink}>
                {tFooter("services.customApp")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <small>
          © {currentYear} {t("brand")} — {tFooter("rights")}
        </small>
      </div>
    </footer>
  );
}
