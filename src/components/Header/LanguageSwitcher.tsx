"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

const LOCALES = ["fr", "en"] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  return (
    <div className={styles.switcher} role="group" aria-label={t("languageSwitcherLabel")}>
      {LOCALES.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={loc === locale ? `${styles.localeLink} ${styles.active}` : styles.localeLink}
          aria-current={loc === locale ? "true" : undefined}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
