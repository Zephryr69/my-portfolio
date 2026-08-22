import { getTranslations } from "next-intl/server";
import ContactView from "./ContactView";

/* page.tsx (/contact) — Server Component, même split que About :
   generateMetadata ne peut pas vivre dans un fichier "use client". */

export async function generateMetadata() {
  const t = await getTranslations("ContactPage");
  return { title: t("metaTitle") };
}

export default function ContactPage() {
  return <ContactView />;
}
