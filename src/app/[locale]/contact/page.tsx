import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/siteConfig";
import ContactView from "./ContactView";

/* page.tsx (/contact) — Server Component, même split que About :
   generateMetadata ne peut pas vivre dans un fichier "use client". */

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const url = `${siteConfig.url}/${locale}/contact`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url },
  };
}

export default function ContactPage() {
  return <ContactView />;
}
