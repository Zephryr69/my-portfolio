/* loading.tsx — convention de fichier Next.js App Router : affiché
   automatiquement pendant le chargement d'un segment sous [locale]
   (transition de route via <Link>, ou chargement initial pendant que
   React Server Components streament). Aucun import ni prop à câbler
   ailleurs — Next.js l'insère lui-même dans la frontière Suspense du
   layout.

   Pas de "use client" : ce composant n'a aucun state/effet, un Server
   Component simple suffit (plus léger, pas de JS envoyé au client pour
   ça). Pas de useTranslations ici non plus — ce fichier peut s'afficher
   avant même que la locale soit résolue, donc un simple spinner visuel
   sans texte évite toute dépendance aux traductions. */

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <span className={styles.spinner} />
    </div>
  );
}
