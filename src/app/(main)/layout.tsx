"use client" // Pathname'ni aniqlash uchun kerak

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation"; // Route'ni aniqlash uchun
import "./../globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChevronRight, Sparkles } from "lucide-react"; // Chiroyli ikonka uchun

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Route nomini chiroyli ko'rinishga keltirish funksiyasi
  const getRouteName = (path: string) => {
    if (path === "/" || path === "") return "Yangi Chat";
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/profile")) return "Profil Sozlamalari";
    if (path.includes("/chat")) return "Intellektual Suhbat";
    return "Sora AI";
  };

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full overflow-hidden bg-background`}>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            
            <main className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
              
              {/* YANGILANGAN HEADER DIZAYNI */}
              <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-emerald-600 transition-colors" />
                  
                  <div className="h-4 w-[1px] bg-border mx-2" />
                  
                  {/* Dinamik Route ko'rsatkichi */}
                  <nav className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hidden sm:inline">
                      Sora AI
                    </span>
                    <ChevronRight size={12} className="text-muted-foreground/40 hidden sm:inline" />
                    <h1 className="text-sm font-semibold tracking-tight text-foreground">
                      {getRouteName(pathname)}
                    </h1>
                  </nav>
                </div>

                {/* Header o'ng tomoni - Model statusi */}
                <div className="flex items-center gap-3">
                   <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                      <Sparkles size={12} className="text-emerald-600 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                        Gemini 1.5 Pro
                      </span>
                   </div>
                </div>
              </header>

              {/* Content Area - O'zgarmadi */}
              <div className="flex flex-1 flex-col overflow-hidden relative">
                  <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                  </div>
              </div>
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}