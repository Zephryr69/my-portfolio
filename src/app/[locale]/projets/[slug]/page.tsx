import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FaGithub, FaArrowLeft } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import { projectsData } from "@/data/projectsData";
import { siteConfig, baseOpenGraph } from "@/lib/siteConfig";
import styles from "./page.module.css";

/* page.tsx (/projets/[slug]) — page de détail (« cas d'étude ») par
   projet. Ajoutée suite au retour du mentor sur le manque de « preuves » :
   une carte de deux phrases ne peut pas porter le contexte, les choix
   techniques et le lien vers le code — une page dédiée, si. */

export const dynamic = "force-static";

export function generateStaticParams() {
  return projectsData.map(({ key }) => ({ slug: key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projectsData.find((p) => p.key === slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: "Home.projects" });
  const title = t(`items.${slug}.title`);
  const description = t(`items.${slug}.brief`);
  const url = `${siteConfig.url}/${locale}/projets/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...baseOpenGraph, title, description, url, locale: locale === "fr" ? "fr_FR" : "en_US" },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = projectsData.find((p) => p.key === slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "Home.projects" });
  const tCase = await getTranslations({ locale, namespace: "CaseStudy" });

  return (
    <article className={styles.caseStudy}>
      <Link href="/projets" className={styles.backLink}>
        <FaArrowLeft aria-hidden="true" /> {tCase("backToProjects")}
      </Link>

      <h1 className={styles.title}>{t(`items.${slug}.title`)}</h1>

      <Image
        src={project.thumbnail}
        alt={t("thumbnailAlt", { title: t(`items.${slug}.title`) })}
        className={styles.heroImage}
        sizes="(max-width: 768px) 95vw, 800px"
        priority
      />

      <div className={styles.techRow}>
        {project.tech.map((item) => (
          <span key={item} className={styles.techBadge}>
            {item}
          </span>
        ))}
      </div>

      <div className={styles.linksRow}>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.primaryLink}>
            {t("ctaLabel")}
          </a>
        )}
        {project.githubUrl ? (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            <FaGithub aria-hidden="true" /> {tCase("viewCode")}
          </a>
        ) : (
          <span className={styles.privateNote}>{tCase("privateRepoNote")}</span>
        )}
      </div>

      <section className={styles.section}>
        <h2>{tCase("contextTitle")}</h2>
        <p>{tCase(`items.${slug}.context`)}</p>
      </section>

      <section className={styles.section}>
        <h2>{tCase("choicesTitle")}</h2>
        <p>{tCase(`items.${slug}.technicalChoices`)}</p>
      </section>
    </article>
  );
}
