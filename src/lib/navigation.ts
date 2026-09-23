/* navigation.ts — source unique des liens de navigation (Header, Sidebar,
   Footer avaient chacun leur copie identique de NAV_ITEMS). */

export const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/projets", key: "projects" },
  { href: "/a-propos", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

/* Lien actif si on est sur la page ou dans une sous-page (ex. la page
   /projets/hamuz garde "Projets" actif). L'accueil "/" reste strict :
   sinon il serait actif partout. `pathname` vient de next-intl, donc
   sans préfixe de langue. */
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
