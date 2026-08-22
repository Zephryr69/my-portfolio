# My Portfolio

Portfolio personnel d'**Amandino AIMINASSO**, développeur Full-Stack & UI/UX designer basé à Porto-Novo, Bénin.

Refonte complète de la version précédente (Vite + React) vers **Next.js 16** avec TypeScript, pensée pour être plus rapide, plus accessible, correctement internationalisée, et bâtie sur une architecture CSS qui ne se marche plus dessus.

🔗 **Démo en ligne :** _à ajouter une fois déployé_

---

## Sommaire

- [Pourquoi cette refonte](#pourquoi-cette-refonte)
- [Stack technique](#stack-technique)
- [Choix de design](#choix-de-design)
  - [Typographie](#typographie)
  - [Couleurs](#couleurs)
  - [Architecture CSS](#architecture-css)
- [Internationalisation](#internationalisation)
- [Structure du projet](#structure-du-projet)
- [Démarrer le projet](#démarrer-le-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Ce qui a été corrigé par rapport à l'ancienne version](#ce-qui-a-été-corrigé-par-rapport-à-lancienne-version)
- [Feuille de route](#feuille-de-route)
- [Contact](#contact)

---

## Pourquoi cette refonte

La version précédente (`mon-portfolio`, Vite + React + React Router) faisait le travail, mais cumulait plusieurs limites structurelles :

- **SPA pur** : aucune métadonnée par page, rendu vide au premier chargement — mauvais pour le référencement d'un portfolio, dont le but est justement d'être trouvé.
- **CSS global non scopé** : plusieurs fichiers redéfinissaient les mêmes variables (`--navbar-height`, `--color-accent`...) avec des valeurs différentes, le dernier fichier chargé l'emportant silencieusement.
- **Pas de TypeScript** : plusieurs bugs (props jamais transmises, variables CSS jamais définies, sélecteurs qui ne correspondaient à aucune classe réelle) ne se voyaient qu'à l'exécution, jamais à la compilation.
- **Pas d'internationalisation**, alors que la cible (clients francophones et anglophones) en a l'usage.

Cette refonte migre vers **Next.js (App Router)**, introduit **TypeScript** partout, centralise les styles dans un système de tokens unique, et ajoute le support **français / anglais**.

## Stack technique

| Domaine | Choix |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Langage | TypeScript |
| Style | CSS Modules + fichier de tokens centralisé (pas de Tailwind — voir [Architecture CSS](#architecture-css)) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Internationalisation | [next-intl](https://next-intl.dev/) (fr / en) |
| Icônes | [react-icons](https://react-icons.github.io/react-icons/) (Font Awesome, Tabler) |

## Choix de design

### Typographie

| Police | Usage | Pourquoi |
|---|---|---|
| **Outfit** | Corps de texte | Sans-serif géométrique, très lisible à petite taille, look moderne sans être froid |
| **Rubik** | Titres de section | Formes légèrement arrondies, apporte du caractère sur les titres sans nuire à la lisibilité |
| **Updock** | Accent ponctuel (prénom en hero) | Police manuscrite, réservée à un seul mot pour une touche personnelle — jamais utilisée pour du texte long |

Les trois sont chargées **une seule fois** dans `src/app/globals.css`. Dans l'ancienne version, la même police (Updock) était importée trois fois depuis trois fichiers CSS différents.

### Couleurs

| Rôle | Clair | Sombre |
|---|---|---|
| Accent principal | `#ff8c00` (orange) | `#ffb347` (orange doux) |
| Fond | `#fff6e9` | `#0a1a2f` |
| Texte | `#1f2d3d` | `#f5f5f5` |

L'orange est la couleur de marque du site — utilisée pour les CTA, les liens actifs, les accents. Le bleu marine sert de contrepoint sombre. Toutes les autres teintes (dégradés de cartes, glows) dérivent de ce même duo plutôt que d'introduire des couleurs arbitraires : c'est un choix délibéré, certaines couleurs "arc-en-ciel" de l'ancienne version (rose/cyan/violet sur les cartes projets, par exemple) ont été remplacées en ce sens pendant la migration.

Le **Header** et le **Footer** restent volontairement figés sur leurs couleurs claires, quel que soit le thème actif — un choix de conception assumé, pas un oubli.

### Architecture CSS

**CSS Modules + un seul fichier de tokens (`src/styles/tokens.css`)**, plutôt que Tailwind ou du CSS global classique :

- **Pourquoi pas Tailwind :** la priorité de cette refonte était de reproduire fidèlement le rendu visuel existant. Traduire des centaines de règles (dégradés, `backdrop-filter`, courbes d'animation `cubic-bezier`) en classes utilitaires aurait multiplié les occasions de dérive visuelle. Les CSS Modules gardent les valeurs exactes, juste réorganisées.
- **Pourquoi pas du CSS global :** l'ancienne version définissait les mêmes variables dans plusieurs fichiers avec des valeurs différentes selon celui chargé en dernier — une classe de bug qui disparaît structurellement avec les CSS Modules (chaque nom de classe est scopé à son fichier).
- Toutes les couleurs, transitions, tailles de navbar et niveaux de `z-index` viennent d'un seul fichier : `src/styles/tokens.css`.

## Internationalisation

Le site est disponible en **français** (langue par défaut) et **anglais**, via [next-intl](https://next-intl.dev/) :

- Routes préfixées par la langue : `/fr/...`, `/en/...`
- Détection automatique de la langue du navigateur à la première visite
- Traductions dans `messages/fr.json` et `messages/en.json`, organisées par composant/page

## Structure du projet

```
my-portfolio/
├── messages/                  # Traductions (fr.json, en.json)
├── src/
│   ├── app/
│   │   ├── [locale]/           # Toutes les routes, préfixées par la langue
│   │   │   ├── layout.tsx      # Layout racine (thème, i18n, structure de page)
│   │   │   ├── page.tsx        # Accueil
│   │   │   ├── projets/
│   │   │   ├── a-propos/
│   │   │   └── contact/
│   │   └── globals.css         # Reset, décor de fond, imports de police
│   ├── components/
│   │   ├── Header/
│   │   ├── Sidebar/             # Menu mobile
│   │   ├── Footer/
│   │   ├── ScrollToTopButton/
│   │   ├── Home/                # Sections de la page d'accueil
│   │   └── AppShell.tsx         # Assemble Header + Sidebar + Footer + état
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Thème clair/sombre (persisté en localStorage)
│   ├── data/                    # Données structurelles (compétences, projets)
│   ├── i18n/                    # Configuration next-intl (routing, middleware)
│   └── styles/
│       └── tokens.css           # Source unique des couleurs, tailles, transitions
└── src/middleware.ts             # Détection et routage de la langue
```

## Démarrer le projet

```powershell
git clone https://github.com/Zephryr69/my-portfolio.git
cd my-portfolio
npm install
npm run dev
```

Le site est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Commande | Effet |
|---|---|
| `npm run dev` | Lance le serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run lint` | Vérifie le code avec ESLint |

## Ce qui a été corrigé par rapport à l'ancienne version

Quelques bugs réels trouvés pendant la migration, corrigés au passage :

- Les barres de progression des compétences finissaient toutes à la même largeur (~70%), peu importe le niveau réel affiché.
- La Sidebar mobile restait figée en thème clair, une prop de thème n'étant plus transmise depuis un refactor précédent.
- Plusieurs styles de mode sombre (cartes projets, page À propos) ciblaient une classe CSS qui ne correspondait à aucun élément réel — ils ne s'étaient donc jamais affichés.
- Aucune page n'avait de titre `<h1>` — corrigé sur chaque page dédiée.

## Feuille de route

- [ ] Déploiement sur Vercel
- [ ] Formulaire de contact : passage à un envoi d'email réel côté serveur (actuellement `mailto:`)
- [ ] Ajout de nouveaux projets au fur et à mesure

## Contact

- **Email :** amandinoaiminasso@gmail.com
- **WhatsApp :** +229 01 69 11 87 45
- **GitHub :** [@Zephryr69](https://github.com/Zephryr69)
