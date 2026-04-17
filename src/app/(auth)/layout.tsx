import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Project",
  description: "Built with Gemini AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased h-full overflow-hidden`}>
          
          <main className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
            {/* Header - balandligi aniq (h-14) */}
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur">
              <div className="h-4 w-[1px] bg-border mx-2" />
              <h1 className="text-sm font-medium">Dashboard</h1>
            </header>

            {/* Content Area - Bu qatlam juda muhim */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                {/* Children (Xabarlar tarixi) - Faqat shu yer scroll bo'ladi */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {children}
                </div>
            </div>
          </main>
      </body>
    </html>
  );
}