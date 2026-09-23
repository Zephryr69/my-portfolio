"use client";

/* AppShell.tsx — pourquoi ce fichier existe :

   layout.tsx est un Server Component (async), il ne peut pas avoir de
   useState ni transmettre de fonctions à Header/Sidebar (voir l'erreur
   "Event handlers cannot be passed to Client Component props" qu'on a
   corrigée plus tôt). AppShell est le Client Component qui porte cet
   état — layout.tsx n'a plus qu'à le rendre, sans se soucier de
   l'interactivité.
*/

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton/ScrollToTopButton";
import StickyMobileCta from "@/components/StickyMobileCta/StickyMobileCta";

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Le panneau est masqué en CSS dès 769px, mais restait "ouvert" dans le
  // state : le scroll de la page restait bloqué (overflow:hidden posé par
  // Sidebar) sans aucun bouton pour le fermer. On le ferme donc dès que
  // la fenêtre passe en mode bureau (rotation d'une tablette, redimensionnement).
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 769px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsSidebarOpen(false);
    };
    desktop.addEventListener("change", handleChange);
    return () => desktop.removeEventListener("change", handleChange);
  }, []);

  return (
    // reducedMotion="user" : respecte le réglage « réduire les animations »
    // de l'appareil pour toutes les animations Framer Motion du site.
    <MotionConfig reducedMotion="user">
      <Header
        onMenuClick={() => setIsSidebarOpen((open) => !open)}
        isMenuOpen={isSidebarOpen}
      />
      <AnimatePresence>
        {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />}
      </AnimatePresence>
      <main className="content">{children}</main>
      <Footer />
      <ScrollToTopButton />
      <StickyMobileCta />
    </MotionConfig>
  );
}
