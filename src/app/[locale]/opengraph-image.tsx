import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/siteConfig";

/* opengraph-image.tsx — convention de fichier Next.js : ce fichier seul
   suffit à générer l'image de partage (Facebook, Twitter/X, LinkedIn,
   WhatsApp...) pour toutes les pages sous [locale], sans avoir besoin
   d'un fichier image dessiné à la main. Next.js l'associe automatiquement
   aux metadata OpenGraph de chaque page de ce segment. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori (le moteur de rendu derrière ImageResponse) ne comprend pas les
// imports d'images façon next/image (StaticImageData) — il lui faut une
// vraie URL ou une data URI. Le fichier est lu une fois au build (cette
// fonction est appelée par page pré-générée grâce à generateStaticParams
// ci-dessous) et converti en base64.
async function getPortraitDataUri() {
  const filePath = path.join(process.cwd(), "src/assets/profile.png");
  const buffer = await readFile(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Sans ça, l'image se dessinait à la demande à la toute première visite
// d'un robot (WhatsApp, Facebook...) — un délai évitable, puisqu'on
// connaît déjà les deux langues possibles à l'avance. Avec ça, l'image
// est prête au build, comme le reste du site (SSG), et servie
// instantanément depuis le CDN de Vercel.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OpenGraph" });
  const portraitDataUri = await getPortraitDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          position: "relative",
          /* Avant : linear-gradient(135deg, #ff8c00 0%, #1f2d3d 55%, #0a1a2f 100%)
             — même dégradé orange→marine que le Hero, avec la même zone
             terne au milieu. Remplacé par un dégradé mono-chaud
             orange→brun ambré foncé : reste dans la famille orange
             (cohérent avec le reste du site), et le brun foncé à droite
             garde assez de contraste pour le texte blanc — un ambre
             clair comme sur le Hero ne suffirait pas ici, il n'y a pas
             de fond de page derrière pour rattraper le contraste. */
          background: "linear-gradient(135deg, #ff8c00 0%, #7a4a12 55%, #3d2506 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Barre d'accent verticale */}
        <div
          style={{
            width: 8,
            height: 140,
            borderRadius: 4,
            background: "#ffffff",
            marginBottom: 32,
          }}
        />

        {/* Portrait + nom côte à côte : avant, la carte n'était que du
            texte sur un dégradé — indiscernable d'un template générique.
            Le portrait (déjà utilisé sur /a-propos et la home) rend la
            carte immédiatement identifiable comme personnelle au premier
            coup d'oeil dans un feed. */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <img
            src={portraitDataUri}
            alt=""
            width={180}
            height={180}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid rgba(255,255,255,0.85)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
            }}
          />
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#ffffff" }}>
            Amandino AIMINASSO
          </div>
        </div>

        {/* Badge de rôle — fond orange plein, texte en brun foncé (même
            famille que le fond, cohérent avec le nouveau dégradé
            mono-chaud) plutôt que le marine qui n'a plus lieu d'être
            une fois le marine retiré du fond. */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            padding: "12px 28px",
            borderRadius: 999,
            background: "#ff8c00",
            fontSize: 30,
            fontWeight: 700,
            color: "#3d2506",
            width: "fit-content",
          }}
        >
          {t("roleTag")}
        </div>

        {/* URL du site, discrète, en bas */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 50,
            left: 90,
            fontSize: 24,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
