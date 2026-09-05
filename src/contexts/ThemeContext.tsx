"use client";

/* ThemeContext.tsx — port de ThemeContext.jsx (Vite) vers Next.js App Router.

   Ce qui a dû changer par rapport à l'original, et pourquoi :

   1. La lecture de localStorage se fait en DEUX temps :
      - un script bloquant posé dans <head> (voir layout.tsx) lit
        localStorage et pose data-theme sur <html> AVANT le premier
        rendu React → tout le CSS piloté par [data-theme] dans
        tokens.css est déjà correct au premier paint, donc pas de flash
        clair→sombre visible à l'écran.
      - isDarkMode vient de useSyncExternalStore (voir plus bas), qui
        sait nativement gérer "valeur différente entre le rendu serveur
        et le rendu client" sans déclencher d'avertissement d'hydratation
        — exactement notre cas ici (l'attribut data-theme réel n'existe
        que côté navigateur).

      ⚠️ Deux tentatives précédentes de ce fichier ont chacune buté sur un
      problème différent, gardé en note ici pour ne pas les refaire :
        a) un lazy initializer (`useState(() => document...)`) : sur le
           rendu serveur, `document` n'existe pas → renvoie toujours
           `false`. Mais à l'hydratation, React réexécute ce même
           initializer côté CLIENT, où `document` existe déjà → renvoie
           potentiellement `true`. Résultat : isDarkMode valait `false`
           côté serveur et `true` côté client dès le tout premier rendu
           → mismatch d'hydratation (vu sur l'icône soleil/lune).
        b) useState(false) + useEffect(() => setIsDarkMode(...), []) :
           plus de mismatch d'hydratation, mais ESLint (règle
           react-hooks/set-state-in-effect) refuse d'appeler setState de
           façon synchrone dans un effet — ce pattern déclenche un
           second rendu en cascade juste après le montage.
      useSyncExternalStore règle les deux à la fois : c'est l'API React
      conçue spécifiquement pour lire une source de vérité externe (ici,
      l'attribut data-theme du DOM) avec un instantané différent
      possible entre serveur et client, sans jamais passer par un
      setState dans un effet.

   2. On applique le thème via `data-theme="dark"` sur <html>, pas via
      une classe "containner dark" sur une div — ça correspond au
      sélecteur `[data-theme="dark"]` qu'on a mis dans tokens.css.

   3. `"use client"` en haut : ce fichier utilise des hooks React,
      donc c'est un Client Component (obligatoire en Next.js App Router
      dès qu'il y a de l'interactivité/du state côté navigateur).
*/

import { createContext, useContext, useSyncExternalStore, useCallback, type ReactNode } from "react";

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Store externe minimal : la "source de vérité" est l'attribut
// data-theme du DOM lui-même (déjà posé par le script bloquant), pas une
// copie dans une variable React. listeners permet à useSyncExternalStore
// de savoir quand redemander un instantané (voir emitThemeChange, appelé
// par toggleTheme plus bas).
let listeners: Array<() => void> = [];

function subscribeToTheme(onStoreChange: () => void) {
  listeners.push(onStoreChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onStoreChange);
  };
}

function getThemeSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

// Instantané utilisé pendant le rendu SERVEUR (et pendant l'hydratation
// client, jusqu'à ce que React puisse confirmer le vrai snapshot) :
// toujours `false`, pour matcher ce que le script bloquant applique par
// défaut avant toute lecture de localStorage.
function getServerThemeSnapshot() {
  return false;
}

function emitThemeChange() {
  listeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = useCallback(() => {
    const nextMode = !isDarkMode;
    document.documentElement.setAttribute("data-theme", nextMode ? "dark" : "light");
    localStorage.setItem("isDarkMode", String(nextMode));
    // Prévient useSyncExternalStore que la source externe a changé, pour
    // qu'il relise getThemeSnapshot() et re-render avec la bonne valeur.
    emitThemeChange();
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme doit être utilisé à l'intérieur d'un ThemeProvider");
  }
  return context;
}
