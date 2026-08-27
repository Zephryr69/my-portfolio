import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

/* opengraph-image.tsx — convention de fichier Next.js : ce fichier seul
   suffit à générer l'image de partage (Facebook, Twitter/X, LinkedIn,
   WhatsApp...) pour toutes les pages sous [locale], sans avoir besoin
   d'un fichier image dessiné à la main. Next.js l'associe automatiquement
   aux metadata OpenGraph de chaque page de ce segment. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.hero" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #ff8c00 0%, #1f2d3d 55%, #0a1a2f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          Amandino AIMINASSO
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            marginTop: 20,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {t("subtitle")}
        </div>
      </div>
    ),
    { ...size }
  );
}
