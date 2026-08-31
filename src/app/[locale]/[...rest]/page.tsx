import { notFound } from "next/navigation";

/* [...rest]/page.tsx — catch-all sous [locale].

   Sans ce fichier, seules les erreurs qui appellent notFound()
   explicitement (ex : locale invalide dans layout.tsx) affichaient la 404
   localisée. Une URL inconnue mais bien formée, du genre /fr/nimporte-quoi,
   ne correspondait à aucune route existante et Next.js tombait sur sa 404
   générique par défaut, en contournant not-found.tsx.

   Ce segment capture tout ce qui n'a matché aucune autre route sous
   /fr ou /en, et déclenche notFound() pour forcer le passage par notre
   ../not-found.tsx. */
export default function CatchAll() {
  notFound();
}
