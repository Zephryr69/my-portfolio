"use client";

/* ThemeContext.tsx — port de ThemeContext.jsx (Vite) vers Next.js App Router.

   Ce qui a dû changer par rapport à l'original, et pourquoi :

   1. `useState(() => localStorage.getItem(...))` cassait en SSR :
      Next.js exécute ce composant une première fois côté SERVEUR, où
      `localStorage` n'existe pas → ça aurait fait planter le rendu.
      Solution : on part sur `false` par défaut, puis on lit
      `localStorage` dans un `useEffect` (qui, lui, ne tourne que côté
      navigateur, après l'hydratation).

   2. On applique le thème via `data-theme="dark"` sur <html>, pas via
      une classe "containner dark" sur une div — ça correspond au
      sélecteur `[data-theme="dark"]` qu'on a mis dans tokens.css.

   3. `"use client"` en haut : ce fichier utilise useState/useEffect,
      donc c'est un Client Component (obligatoire en Next.js App Router
      dès qu'il y a de l'interactivité/du state côté navigateur).
*/

import { createContext, useState, useContext, useEffect, type ReactNode } from "react";

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Lit la préférence sauvegardée une fois que le composant est monté
  // côté navigateur (localStorage n'existe pas pendant le rendu serveur).
  useEffect(() => {
    const saved = localStorage.getItem("isDarkMode");
    if (saved === "true") setIsDarkMode(true);
  }, []);

  // Répercute isDarkMode sur <html data-theme="..."> à chaque changement,
  // pour que tokens.css applique la bonne palette.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", String(newMode));
      return newMode;
    });
  };

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
