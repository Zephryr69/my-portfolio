"use client";

/* AppShell.tsx — pourquoi ce fichier existe :

   layout.tsx est un Server Component (async), il ne peut pas avoir de
   useState ni transmettre de fonctions à Header/Sidebar (voir l'erreur
   "Event handlers cannot be passed to Client Component props" qu'on a
   corrigée plus tôt). AppShell est le Client Component qui porte cet
   état — layout.tsx n'a plus qu'à le rendre, sans se soucier de
   l'interactivité.
*/

import { useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton/ScrollToTopButton";
import StickyMobileCta from "@/components/StickyMobileCta/StickyMobileCta";

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
