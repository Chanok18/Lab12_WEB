"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, type FormEvent, type ReactNode } from "react"
import {
  BookOpen, Search, Menu, LibraryBig,
  Users, X
} from "lucide-react"

export default function LibraryLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    router.push(`/books?search=${encodeURIComponent(search)}`)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#e7e5d5] text-[#302e28]">
      <div className="bg-[#37352c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs">
          <span className="flex items-center gap-2 font-semibold tracking-wide">
            <BookOpen size={15} /> BOOKSPACE DIGITAL LIBRARY
          </span>
          <span>TECSUP · Laboratorio 12</span>
        </div>
      </div>

      <header className="border-b border-[#d5d0bd] bg-[#e7e5d5]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-5">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="rotate-[-7deg] rounded bg-[#3268ad] px-2 py-1 text-sm font-black text-white">
              BOOK
            </span>
            <span className="font-serif text-2xl tracking-tight text-[#26251f]">
              SPACE
            </span>
          </Link>

          <nav className="ml-5 hidden items-center gap-6 text-sm lg:flex">
            <Link href="/" className={pathname === "/" ? "font-bold text-[#285e9c]" : "hover:text-[#285e9c]"}>
              Inicio
            </Link>
            <Link href="/books" className={pathname.startsWith("/books") ? "font-bold text-[#285e9c]" : "hover:text-[#285e9c]"}>
              Explorar libros
            </Link>
            <Link href="/#autores" className="hover:text-[#285e9c]">
              Autores
            </Link>
          </nav>

          <form onSubmit={submitSearch} className="ml-auto hidden max-w-sm flex-1 items-center overflow-hidden rounded-lg border border-[#d1cbb7] bg-white md:flex">
            <input
              aria-label="Buscar libros"
              placeholder="Buscar libros..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="min-w-0 flex-1 px-4 py-2.5 text-sm outline-none"
            />
            <button aria-label="Buscar" className="px-3 text-[#8c8777]">
              <Search size={20} />
            </button>
          </form>

          <Link href="/books" className="hidden rounded-lg bg-[#3269b2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#24518e] sm:block">
            Mi biblioteca
          </Link>

          <button
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto rounded-md p-2 hover:bg-[#d8d5c6] md:ml-0"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mx-auto max-w-7xl border-t border-[#d5d0bd] px-5 py-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <Users size={16} /> Autores
              </Link>
              <Link href="/books" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <LibraryBig size={16} /> Catálogo
              </Link>
              <a href="https://github.com/Chanok18" target="_blank" rel="noreferrer">
                GitHub del proyecto
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto min-h-[75vh] max-w-7xl px-3 py-5 sm:px-5">
        <div className="rounded-xl border border-[#d6d0bc] bg-white p-5 shadow-sm md:p-8">
          {children}
        </div>
      </main>

      <footer className="mt-8 border-t border-[#d5d0bd] py-6 text-center text-xs text-[#716d60]">
        BookSpace · Biblioteca digital · Kevin Quispe · TECSUP
        <div className="mt-2">
          Portadas proporcionadas por Open Library
        </div>
      </footer>
    </div>
  )
}
