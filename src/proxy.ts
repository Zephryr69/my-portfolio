import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

/* proxy.ts — remplace middleware.ts.

   Next.js 16 a renommé cette convention de fichier ("middleware.ts" est
   déprécié, "proxy.ts" est le nouveau nom). Le contenu ne change pas
   (createMiddleware fait toujours le même travail), seul le nom du
   fichier compte pour que Next.js le reconnaisse correctement.
*/

const intlMiddleware = createMiddleware(routing);

// Filet de sécurité : avec notre config (préfixe toujours affiché), le
// mécanisme de correction automatique de next-intl pour un préfixe
// superflu ne s'applique pas (il est réservé au mode "as-needed"). Si une
// URL en double préfixe comme /en/en ou /fr/en est demandée — quelle
// qu'en soit la cause — on la corrige nous-mêmes ici plutôt que de
// laisser l'utilisateur bloqué sur une 404.
const DOUBLE_LOCALE = new RegExp(`^/(${routing.locales.join("|")})/(${routing.locales.join("|")})(/.*)?$`);

export default function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(DOUBLE_LOCALE);
  if (match) {
    const [, , secondLocale, rest = ""] = match;
    const url = request.nextUrl.clone();
    url.pathname = `/${secondLocale}${rest}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
