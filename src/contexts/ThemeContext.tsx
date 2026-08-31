"use client";

/* ThemeContext.tsx — port de ThemeContext.jsx (Vite) vers Next.js App Router.

   Ce qui a dû changer par rapport à l'original, et pourquoi :

   1. La lecture de localStorage se fait maintenant en DEUX temps :
      - un script bloquant posé dans <head> (voir layout.tsx) lit
        localStorage et pose data-theme sur <html> AVANT le premier
        rendu React → plus de flash clair→sombre au chargement.
      - useState(() => ...) ci-dessous relit cet attribut au montage
        pour initialiser isDarkMode. C'est un *lazy initializer*, il ne
        s'exécute qu'une fois, au premier rendu client — contrairement à
        un setState dans un useEffect, il ne déclenche pas de re-render
        supplémentaire après l'hydratation (c'est ce qu'ESLint
        react-hooks signalait).
      - Le rendu serveur, lui, n'a pas accès à `document` : l'initializer
        ne tourne jamais côté serveur (useState ne l'appelle qu'au
        montage client), donc pas de crash SSR.

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
  // Lazy initializer : ne s'exécute qu'au montage côté client, jamais
  // pendant le rendu serveur. Le script bloquant dans <head> (layout.tsx)
  // a déjà posé data-theme sur <html> avant que React n'hydrate, donc on
  // se contente de le relire ici pour que isDarkMode soit correct dès le
  // tout premier rendu — pas besoin d'un useEffect qui re-render juste après.
  const [isDarkMode, setIsDarkMode] = useState(
    () => typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark",
  );

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
