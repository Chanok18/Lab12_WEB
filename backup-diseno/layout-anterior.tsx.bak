import { Suspense } from "react"
import type { Metadata } from "next"
import "./globals.css"
import LibraryLayout from "@/components/LibraryLayout"

export const metadata: Metadata = {
  title: "BookSpace | Sistema de Biblioteca",
  description: "Laboratorio 12 - Next.js, Prisma y Supabase",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Suspense fallback={
          <div className="min-h-screen bg-[#f5f7fc] p-8 text-slate-600">
            Cargando BookSpace...
          </div>
        }>
          <LibraryLayout>{children}</LibraryLayout>
        </Suspense>
      </body>
    </html>
  )
}
