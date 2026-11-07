"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import LibraryShowcase from "@/components/LibraryShowcase"
import {
  Users, BookOpen, Globe2, Plus, Pencil,
  Trash2, ArrowUpRight, RefreshCw
} from "lucide-react"
import {
  Loading, ErrorBox, Modal, inputClass,
  buttonClass, outlineClass, cardClass
} from "@/components/Ui"

type Author = {
  id: string
  name: string
  email: string
  bio: string | null
  nationality: string | null
  birthYear: number | null
  books: { id: string }[]
  _count: { books: number }
}

type AuthorForm = {
  name: string
  email: string
  bio: string
  nationality: string
  birthYear: string
}

type FeaturedBook = {
  id: string
  title: string
  isbn: string
  genre: string | null
  authorId: string
  author: { name: string }
}

const emptyForm: AuthorForm = {
  name: "", email: "", bio: "", nationality: "", birthYear: ""
}

export default function HomePage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<AuthorForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/authors", { cache: "no-store" })
      if (!res.ok) throw new Error("No se pudo consultar la base de datos.")
      setAuthors(await res.json())
    } catch {
      setError("No se pudo cargar la información. Verifica DATABASE_URL y la conexión con Supabase.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  useEffect(() => {
    fetch("/api/books/search?limit=8")
      .then(res => res.ok ? res.json() : null)
      .then(result => {
        if (result?.data) setFeaturedBooks(result.data)
      })
      .catch(() => {})
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setModal(true)
  }

  function openEdit(a: Author) {
    setEditing(a.id)
    setForm({
      name: a.name,
      email: a.email,
      bio: a.bio || "",
      nationality: a.nationality || "",
      birthYear: a.birthYear?.toString() || "",
    })
    setModal(true)
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/authors/${editing}` : "/api/authors", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Error al guardar")
      setModal(false)
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  async function remove(a: Author) {
    if (!confirm(`¿Eliminar a ${a.name} y todos sus libros?`)) return
    try {
      const res = await fetch(`/api/authors/${a.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("No se pudo eliminar el autor")
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  const filtered = authors.filter(a =>
    `${a.name} ${a.email} ${a.nationality || ""}`
      .toLowerCase().includes(search.toLowerCase())
  )

  const totalBooks = authors.reduce((sum, a) => sum + a._count.books, 0)
  const countries = new Set(authors.map(a => a.nationality).filter(Boolean)).size

  return (
    <div className="space-y-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-violet-600">PANEL PRINCIPAL</p>
          <h1 className="mt-1 text-3xl font-black">Gestión de autores</h1>
          <p className="mt-1 text-sm text-slate-500">Administra autores, libros y estadísticas.</p>
        </div>
        <button onClick={openCreate} className={buttonClass}>
          <Plus size={18} /> Nuevo autor
        </button>
      </div>

      <div className="hidden relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-indigo-700 to-[#142347] p-7 text-white">
        <div className="absolute right-8 top-5 text-6xl opacity-80">📚</div>
        <h2 className="relative max-w-lg text-2xl font-bold">Bienvenido a BookSpace</h2>
        <p className="relative mt-2 max-w-lg text-sm text-violet-100">
          Tu espacio para organizar autores, descubrir libros y gestionar tu colección.
        </p>
        <Link href="/books" className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700">
          Explorar libros <ArrowUpRight size={16} />
        </Link>
      </div>

      <LibraryShowcase books={featuredBooks} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Autores registrados", value: authors.length, icon: Users, color: "text-violet-600 bg-violet-100" },
          { label: "Libros registrados", value: totalBooks, icon: BookOpen, color: "text-blue-600 bg-blue-100" },
          { label: "Nacionalidades", value: countries, icon: Globe2, color: "text-emerald-600 bg-emerald-100" },
        ].map(item => (
          <div key={item.label} className={cardClass}>
            <div className={`mb-4 inline-flex rounded-xl p-3 ${item.color}`}>
              <item.icon size={22} />
            </div>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-3xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div id="autores" className={cardClass}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Gestión de autores</h2>
            <p className="text-xs text-slate-500">Consulta y administra los registros.</p>
          </div>
          <button onClick={()=>void load()} className={outlineClass}>
            <RefreshCw size={16} /> Actualizar
          </button>
        </div>

        <input
          className={`${inputClass} mb-5 max-w-md`}
          placeholder="Buscar autor, correo o nacionalidad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {error && <ErrorBox message={error} />}
        {loading ? <Loading /> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(a => (
              <div key={a.id} className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                    {a.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{a.name}</h3>
                    <p className="truncate text-xs text-slate-500">{a.email}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{a.nationality || "Sin nacionalidad"}</p>
                <p className="mt-1 text-xs text-slate-500">{a._count.books} libros registrados</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/authors/${a.id}`} className={outlineClass}>Ver detalles</Link>
                  <button onClick={()=>openEdit(a)} className={outlineClass} aria-label="Editar autor"><Pencil size={16}/></button>
                  <button onClick={()=>void remove(a)} className={`${outlineClass} text-red-600`} aria-label="Eliminar autor"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {!filtered.length && !error && (
              <p className="col-span-full py-8 text-center text-sm text-slate-500">
                No se encontraron autores.
              </p>
            )}
          </div>
        )}
      </div>

      {modal && (
        <Modal title={editing ? "Editar autor" : "Registrar autor"} close={()=>setModal(false)}>
          <form onSubmit={save} className="space-y-4">
            {([
              ["name", "Nombre completo *", "text"],
              ["email", "Correo electrónico *", "email"],
              ["nationality", "Nacionalidad", "text"],
              ["birthYear", "Año de nacimiento", "number"],
            ] as const).map(([key,label,type]) => (
              <label key={key} className="block space-y-1.5 text-sm">
                <span className="font-medium">{label}</span>
                <input
                  className={inputClass}
                  type={type}
                  required={key==="name"||key==="email"}
                  value={form[key]}
                  onChange={e=>setForm({...form,[key]:e.target.value})}
                />
              </label>
            ))}
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Biografía</span>
              <textarea
                className={inputClass}
                rows={3}
                value={form.bio}
                onChange={e=>setForm({...form,bio:e.target.value})}
              />
            </label>
            <div className="flex gap-3">
              <button disabled={saving} className={buttonClass}>
                {saving ? "Guardando..." : "Guardar autor"}
              </button>
              <button type="button" onClick={()=>setModal(false)} className={outlineClass}>Cancelar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
