"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen, LayoutDashboard, LibraryBig,
  Code2, GraduationCap
} from "lucide-react"
import type { ReactNode } from "react"

export default function LibraryLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/books", label: "Biblioteca", icon: LibraryBig },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fc] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="flex w-full flex-col bg-[#11182e] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
          <div className="flex items-center gap-3 border-b border-white/10 p-6">
            <div className="rounded-xl bg-violet-600 p-3">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black">BookSpace</h1>
              <p className="text-xs text-slate-400">Sistema de Biblioteca</p>
            </div>
          </div>

          <nav className="flex gap-2 p-4 lg:flex-col">
            {links.map(link => {
              const active = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-violet-600 text-white"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <link.icon size={19} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto hidden p-5 lg:block">
            <div className="rounded-xl bg-white/5 p-4">
              <GraduationCap className="mb-2 text-violet-300" />
              <p className="text-sm font-semibold">Laboratorio 12</p>
              <p className="mt-1 text-xs text-slate-400">
                Next.js + Prisma + PostgreSQL
              </p>
            </div>
            <a
              href="https://github.com/Chanok18"
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center gap-2 text-xs text-slate-400"
            >
              <Code2 size={15} /> Kevin Quispe · TECSUP
            </a>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
            <div>
              <p className="text-sm font-bold text-violet-600">BookSpace</p>
              <p className="text-xs text-slate-500">Gestión inteligente de biblioteca</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
              KQ
            </div>
          </header>
          <div className="mx-auto max-w-7xl p-5 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
