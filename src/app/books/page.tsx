"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import BookCover from "@/components/BookCover"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Pencil, Trash2, BookOpen } from "lucide-react"
import {
  Loading, ErrorBox, Modal, inputClass,
  buttonClass, outlineClass, cardClass
} from "@/components/Ui"

type Author = { id: string; name: string }
type Book = {
  id: string
  title: string
  description: string | null
  isbn: string
  publishedYear: number | null
  genre: string | null
  pages: number | null
  authorId: string
  author: Author
}
type BookForm = {
  title: string
  description: string
  isbn: string
  publishedYear: string
  genre: string
  pages: string
  authorId: string
}
type PaginationData = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const emptyForm: BookForm = {
  title:"", description:"", isbn:"", publishedYear:"",
  genre:"Novela", pages:"", authorId:""
}
const genres = ["Novela","Cuento","Poesía","Ensayo","Historia","Ciencia","Fantasía","Romance","Biografía","Infantil","Otro"]

export default function BooksPage() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page:1,limit:6,total:0,totalPages:0,hasNext:false,hasPrev:false
  })
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [genre, setGenre] = useState(searchParams.get("genre") || "")
  const [authorId, setAuthorId] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [order, setOrder] = useState("desc")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<string|null>(null)
  const [form, setForm] = useState<BookForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setGenre(searchParams.get("genre") || "")
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    async function getAuthors() {
      try {
        const res = await fetch("/api/authors")
        if (res.ok) setAuthors(await res.json())
      } catch {
        // El error de conexión se muestra al consultar los libros.
      }
    }
    void getAuthors()
  }, [refresh])

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({
        search, genre, page:String(page), limit:"6", sortBy, order
      })
      const author = authors.find(a=>a.id===authorId)
      if (author) params.set("authorName",author.name)

      const res = await fetch(`/api/books/search?${params}`, {
        cache:"no-store", signal
      })
      if (!res.ok) throw new Error("No se pudieron consultar los libros")
      const result = await res.json()
      if (signal?.aborted) return
      setBooks(result.data)
      setPagination(result.pagination)
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [search,genre,authorId,authors,page,sortBy,order])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      void load(controller.signal)
    }, 300)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [load,refresh])

  function openCreate() {
    setEditing(null)
    setForm({...emptyForm,authorId:authors[0]?.id||""})
    setModal(true)
  }

  function openEdit(b:Book) {
    setEditing(b.id)
    setForm({
      title:b.title,
      description:b.description||"",
      isbn:b.isbn,
      publishedYear:b.publishedYear?.toString()||"",
      genre:b.genre||"Otro",
      pages:b.pages?.toString()||"",
      authorId:b.authorId,
    })
    setModal(true)
  }

  async function save(e:FormEvent) {
    e.preventDefault()
    if (!form.authorId) return alert("Selecciona un autor")
    setSaving(true)
    try {
      const res = await fetch(editing?`/api/books/${editing}`:"/api/books",{
        method:editing?"PUT":"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error||"Error al guardar libro")
      setModal(false)
      setRefresh(n=>n+1)
    } catch(err) {
      alert(err instanceof Error?err.message:"Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  async function remove(b:Book) {
    if (!confirm(`¿Eliminar el libro "${b.title}"?`)) return
    try {
      const res = await fetch(`/api/books/${b.id}`,{method:"DELETE"})
      if (!res.ok) throw new Error("Error al eliminar libro")
      setRefresh(n=>n+1)
    } catch(err) {
      alert(err instanceof Error?err.message:"Error al eliminar")
    }
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-violet-600">CATÁLOGO DIGITAL</p>
        <h1 className="mt-1 text-3xl font-black">Explora nuestra biblioteca</h1>
        <p className="mt-1 text-sm text-slate-500">
          Busca, filtra y administra tu colección.
        </p>
      </div>
      <button onClick={openCreate} className={buttonClass}>
        <Plus size={18}/> Nuevo libro
      </button>
    </div>

    <div className="rounded-2xl bg-[#f4f1e7] border border-[#ded6c3] p-6 text-white">
      <div className="flex items-center gap-3">
        <BookOpen size={30} className="text-[#3269b2]"/>
        <div>
          <h2 className="library-heading text-xl font-bold text-[#302e28]">Explora tu colección</h2>
          <p className="text-sm text-[#625e53]">
            Búsqueda avanzada conectada con Prisma y PostgreSQL.
          </p>
        </div>
      </div>
    </div>

    <div className={cardClass}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="relative xl:col-span-2">
          <Search size={17} className="absolute left-3 top-3 text-slate-400"/>
          <input
            className={`${inputClass} pl-10`}
            placeholder="Buscar por título..."
            value={search}
            onChange={e=>{setSearch(e.target.value);setPage(1)}}
          />
        </label>
        <select className={inputClass} value={genre}
          onChange={e=>{setGenre(e.target.value);setPage(1)}}>
          <option value="">Todos los géneros</option>
          {genres.map(g=><option key={g}>{g}</option>)}
        </select>
        <select className={inputClass} value={authorId}
          onChange={e=>{setAuthorId(e.target.value);setPage(1)}}>
          <option value="">Todos los autores</option>
          {authors.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select className={inputClass} value={sortBy}
          onChange={e=>{setSortBy(e.target.value);setPage(1)}}>
          <option value="createdAt">Fecha de registro</option>
          <option value="title">Título</option>
          <option value="publishedYear">Año de publicación</option>
        </select>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {pagination.total} resultados encontrados
        </p>
        <select className={`${inputClass} max-w-40`} value={order}
          onChange={e=>{setOrder(e.target.value);setPage(1)}}>
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </div>
    </div>

    {error && <ErrorBox message={`${error}. Revisa la conexión con Supabase.`}/>}
    {loading ? <Loading/> : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {books.map(b=><div key={b.id} className={`${cardClass} flex flex-col`}>
          <div className="mb-4 flex h-56 items-center justify-center rounded-lg bg-[#f4f1e8] p-3">
            <BookCover
              isbn={b.isbn}
              title={b.title}
              className="h-full w-36"
            />
          </div>
          <span className="mb-2 self-start rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            {b.genre||"Sin género"}
          </span>
          <h3 className="text-lg font-bold">{b.title}</h3>
          <Link href={`/authors/${b.authorId}`} className="mt-1 text-sm text-violet-600 hover:underline">
            {b.author.name}
          </Link>
          <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-500">
            {b.description||"Sin descripción"}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            {b.publishedYear||"Año no indicado"} · {b.pages||"—"} páginas
          </p>
          <p className="mt-1 text-xs text-slate-400">ISBN: {b.isbn}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={()=>openEdit(b)} className={outlineClass}>
              <Pencil size={15}/> Editar
            </button>
            <button onClick={()=>void remove(b)} className={`${outlineClass} text-red-600`}>
              <Trash2 size={15}/> Eliminar
            </button>
          </div>
        </div>)}
        {!books.length && !error && (
          <div className={`${cardClass} col-span-full py-12 text-center text-slate-500`}>
            No se encontraron libros con los filtros seleccionados.
          </div>
        )}
      </div>
    )}

    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        Página {pagination.page} de {Math.max(1,pagination.totalPages)}
      </p>
      <div className="flex gap-2">
        <button disabled={!pagination.hasPrev||loading} className={outlineClass}
          onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
        <button disabled={!pagination.hasNext||loading} className={outlineClass}
          onClick={()=>setPage(p=>p+1)}>Siguiente</button>
      </div>
    </div>

    {modal && <Modal title={editing?"Editar libro":"Registrar libro"} close={()=>setModal(false)}>
      <form onSubmit={save} className="space-y-4">
        {([
          ["title","Título *","text"],
          ["isbn","ISBN *","text"],
          ["publishedYear","Año de publicación","number"],
          ["pages","Número de páginas","number"],
        ] as const).map(([key,label,type])=>(
          <label key={key} className="block space-y-1.5 text-sm">
            <span className="font-medium">{label}</span>
            <input className={inputClass} type={type}
              required={key==="title"||key==="isbn"}
              min={type==="number"?(key==="pages"?1:1):undefined}
              value={form[key]}
              onChange={e=>setForm({...form,[key]:e.target.value})}/>
          </label>
        ))}
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Género</span>
          <select className={inputClass} value={form.genre}
            onChange={e=>setForm({...form,genre:e.target.value})}>
            {genres.map(g=><option key={g}>{g}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Autor *</span>
          <select required className={inputClass} value={form.authorId}
            onChange={e=>setForm({...form,authorId:e.target.value})}>
            <option value="">Seleccionar autor</option>
            {authors.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Descripción</span>
          <textarea className={inputClass} rows={3} value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}/>
        </label>
        <div className="flex gap-3">
          <button disabled={saving} className={buttonClass}>
            {saving?"Guardando...":"Guardar libro"}
          </button>
          <button type="button" onClick={()=>setModal(false)} className={outlineClass}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>}
  </div>
}
