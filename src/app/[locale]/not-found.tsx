import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./not-found.module.css";

/* not-found.tsx (dans [locale]) — 404 traduite, appelée par Next.js dès
   qu'un segment sous [locale] appelle notFound() (ex : locale invalide
   dans layout.tsx), et par le catch-all [...rest]/page.tsx pour toute
   autre URL inconnue sous /fr ou /en. Sans ce fichier, ces deux cas
   tombaient sur la 404 générique de Next (non stylée, non traduite).

   Pas de "use client" : useTranslations() de next-intl fonctionne aussi
   en Server Component ici (le plugin next-intl expose la locale de la
   requête courante), donc pas besoin de passer par getTranslations. */
export default function NotFound() {
  const t = useTranslations("NotFound");
  const tHeader = useTranslations("Header");

  return (
    <div className={styles.wrapper}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.description}>{t("description")}</p>
      <Link href="/" className={styles.cta}>
        {tHeader("backHome")}
      </Link>
    </div>
  );
}
