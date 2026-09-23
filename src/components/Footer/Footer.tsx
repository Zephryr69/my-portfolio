/* Footer.tsx — port de Footer.jsx vers Next.js App Router.

   Différence notable avec l'original : pas de "use client" ici.
   L'original appelait useTheme() uniquement pour choisir une classe
   "dark"/"light" — mais on a vu que cette classe ne correspondait à
   aucun sélecteur CSS réel (voir les notes dans Footer.module.css).
   Le thème est maintenant géré à 100% en CSS via [data-theme], donc
   Footer n'a plus besoin d'aucun state/hook qui lui soit propre.
   Attention : il n'est pas pour autant un Server Component — il est
   importé par AppShell (Client Component), donc il est bien inclus dans
   le JavaScript envoyé au navigateur.
*/

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NAV_ITEMS } from "@/lib/navigation";
import { contact, socialLinks } from "@/lib/siteConfig";
import {
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import styles from "./Footer.module.css";

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

          {/* Facebook et YouTube retirés : les liens étaient des
              placeholders (facebook.com tout court, youtube.com/tonchaine).
              À rajouter ici avec les vraies URLs des pages/chaînes. */}
          <div className={styles.socialIcons} role="group" aria-label={tFooter("socialLabel")}>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className={`${styles.footerSection} ${styles.contactUs}`}>
          <h4>{tFooter("contactTitle")}</h4>
          <p>
            <FaMapMarkerAlt /> {contact.city}
          </p>
          <p>
            <FaPhoneAlt /> {contact.phoneDisplay}
          </p>
          <p>
            <FaEnvelope /> <a href={`mailto:${contact.email}`}>{contact.email}</a>
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
