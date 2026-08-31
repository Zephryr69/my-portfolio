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
          background: "linear-gradient(135deg, #ff8c00 0%, #1f2d3d 55%, #0a1a2f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Décor : grille de points discrète en fond, coin haut-droit */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 420,
            display: "flex",
            flexWrap: "wrap",
            opacity: 0.12,
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#ffffff",
                margin: 15,
              }}
            />
          ))}
        </div>

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

        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#ffffff" }}>
          Amandino AIMINASSO
        </div>

        {/* Badge de rôle */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            padding: "12px 28px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            fontSize: 30,
            fontWeight: 600,
            color: "#ffffff",
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
