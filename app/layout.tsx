// Import the shared global styles so the app shell uses the same theme everywhere.
import "@/globals.css"
import type { Metadata } from "next"
import Footer from "@components/layout/Footer"


export const metadata: Metadata = {
  title: "Vector Austral | Soluciones web, apps y automatizaciones",
  description: "Diseñamos páginas, aplicaciones y flujos automatizados para empresas que buscan crecer y operar con mayor eficiencia.",
  keywords: ["Vector Austral", "n8n", "automatizaciones", "desarrollo web", "B2B"],
  openGraph: {
    title: "Vector Austral | Soluciones web, apps y automatizaciones",
    description: "Diseñamos páginas, aplicaciones y flujos automatizados para empresas que buscan crecer y operar con mayor eficiencia.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
