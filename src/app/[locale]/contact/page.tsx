import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig, baseOpenGraph } from "@/lib/siteConfig";
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
    openGraph: {
      ...baseOpenGraph,
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

const FAQ_ITEM_KEYS = ["item1", "item2", "item3", "item4", "item5"] as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage.faq" });

  const faqItems = FAQ_ITEM_KEYS.map((key) => ({
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  }));

  // FAQPage (schema.org) : généré ici plutôt que redéclaré dans
  // ContactView, pour ne jamais avoir deux copies des mêmes questions à
  // maintenir en cohérence — les mêmes `faqItems` alimentent le JSON-LD
  // ET l'accordéon visible passé à ContactView. Peut donner des extraits
  // enrichis (rich snippets) dans les résultats Google.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ContactView faqItems={faqItems} />
    </>
  );
}
