"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Plus, Pencil, BarChart3 } from "lucide-react"
import {
  Loading, ErrorBox, Modal, inputClass,
  buttonClass, outlineClass, cardClass
} from "@/components/Ui"

type Book = {
  id:string
  title:string
  genre:string|null
  publishedYear:number|null
  pages:number|null
}
type Author = {
  id:string
  name:string
  email:string
  nationality:string|null
  birthYear:number|null
  bio:string|null
  books:Book[]
}
type Stats = {
  totalBooks:number
  averagePages:number
  genres:string[]
  firstBook:{title:string;year:number}|null
  latestBook:{title:string;year:number}|null
  longestBook:{title:string;pages:number}|null
  shortestBook:{title:string;pages:number}|null
}

export default function AuthorDetailsPage() {
  const { id } = useParams<{id:string}>()
  const router = useRouter()
  const [author,setAuthor] = useState<Author|null>(null)
  const [stats,setStats] = useState<Stats|null>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState("")
  const [editing,setEditing] = useState(false)
  const [adding,setAdding] = useState(false)
  const [saving,setSaving] = useState(false)
  const [form,setForm] = useState({
    name:"",email:"",nationality:"",birthYear:"",bio:""
  })
  const [bookForm,setBookForm] = useState({
    title:"",isbn:"",description:"",genre:"Novela",
    publishedYear:"",pages:""
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [authorRes,statsRes] = await Promise.all([
        fetch(`/api/authors/${id}`,{cache:"no-store"}),
        fetch(`/api/authors/${id}/stats`,{cache:"no-store"})
      ])
      if (!authorRes.ok || !statsRes.ok) throw new Error("No se pudo cargar el autor")
      const a:Author = await authorRes.json()
      const s:Stats = await statsRes.json()
      setAuthor(a)
      setStats(s)
      setForm({
        name:a.name,email:a.email,nationality:a.nationality||"",
        birthYear:a.birthYear?.toString()||"",bio:a.bio||""
      })
    } catch {
      setError("No se pudo cargar el autor. Verifica Supabase y el ID.")
    } finally {
      setLoading(false)
    }
  },[id])

  useEffect(()=>{void load()},[load])

  async function saveAuthor(e:FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/authors/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error||"Error al editar")
      setEditing(false)
      await load()
    } catch(err) {
      alert(err instanceof Error?err.message:"Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  async function saveBook(e:FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/books",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...bookForm,authorId:id})
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error||"Error al registrar libro")
      setAdding(false)
      setBookForm({
        title:"",isbn:"",description:"",genre:"Novela",
        publishedYear:"",pages:""
      })
      await load()
    } catch(err) {
      alert(err instanceof Error?err.message:"Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading/>
  if (error || !author) return <ErrorBox message={error||"Autor no encontrado"}/>

  return <div className="space-y-6">
    <button onClick={()=>router.push("/")} className={outlineClass}>
      <ArrowLeft size={16}/> Volver al dashboard
    </button>

    <div className="rounded-2xl bg-[#f4f1e7] border border-[#ded6c3] p-7 text-[#302e28]">
      <div className="flex flex-wrap items-start gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ded7c5] text-3xl font-black">
          {author.name.slice(0,2).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#3269b2]">PERFIL DEL AUTOR</p>
          <h1 className="mt-1 text-3xl font-black">{author.name}</h1>
          <p className="mt-2 text-sm text-[#625e53]">{author.email}</p>
          <p className="mt-1 text-sm text-[#625e53]">
            {author.nationality||"Nacionalidad no indicada"}
            {author.birthYear?` · Nació en ${author.birthYear}`:""}
          </p>
        </div>
        <button onClick={()=>setEditing(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-700">
          <Pencil size={16}/> Editar autor
        </button>
      </div>
      <p className="mt-5 max-w-3xl text-sm text-[#625e53]">
        {author.bio||"Este autor todavía no tiene una biografía registrada."}
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Libros publicados",stats?.totalBooks??0],
        ["Promedio de páginas",stats?.averagePages??0],
        ["Géneros literarios",stats?.genres.length??0],
        ["Última publicación",stats?.latestBook?.year??"—"]
      ].map(([label,value])=><div key={label} className={cardClass}>
        <BarChart3 className="mb-4 text-violet-600"/>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-black">{value}</p>
      </div>)}
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-4 font-bold">Estadísticas literarias</h2>
        {[
          ["Primer libro",stats?.firstBook?.title||"Sin datos"],
          ["Último libro",stats?.latestBook?.title||"Sin datos"],
          ["Libro más largo",stats?.longestBook?.title||"Sin datos"],
          ["Libro más corto",stats?.shortestBook?.title||"Sin datos"],
        ].map(([label,value])=><div key={label} className="flex justify-between gap-3 border-b border-slate-100 py-3 text-sm">
          <span className="text-slate-500">{label}</span>
          <span className="text-right font-medium">{value}</span>
        </div>)}
      </div>
      <div className={cardClass}>
        <h2 className="mb-4 font-bold">Géneros publicados</h2>
        <div className="flex flex-wrap gap-2">
          {stats?.genres.map(g=><span key={g}
            className="rounded-full bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700">{g}</span>)}
          {!stats?.genres.length && <p className="text-sm text-slate-500">Sin géneros registrados.</p>}
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Más páginas: {stats?.longestBook?.pages??"—"} ·
          Menos páginas: {stats?.shortestBook?.pages??"—"}
        </div>
      </div>
    </div>

    <div className={cardClass}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Libros del autor</h2>
          <p className="text-sm text-slate-500">{author.books.length} libros encontrados</p>
        </div>
        <button onClick={()=>setAdding(true)} className={buttonClass}>
          <Plus size={17}/> Agregar libro
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {author.books.map(b=><div key={b.id}
          className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
            <BookOpen size={22}/>
          </div>
          <div>
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-xs text-slate-500">
              {b.genre||"Sin género"} · {b.publishedYear||"Sin año"} · {b.pages||"—"} páginas
            </p>
          </div>
        </div>)}
        {!author.books.length && <p className="text-sm text-slate-500">Este autor aún no tiene libros.</p>}
      </div>
      <Link href="/books" className="mt-5 inline-block text-sm font-semibold text-violet-600 hover:underline">
        Ir al catálogo completo
      </Link>
    </div>

    {editing && <Modal title="Editar información del autor" close={()=>setEditing(false)}>
      <form onSubmit={saveAuthor} className="space-y-4">
        {([
          ["name","Nombre *","text"],
          ["email","Email *","email"],
          ["nationality","Nacionalidad","text"],
          ["birthYear","Año de nacimiento","number"]
        ] as const).map(([key,label,type])=><label key={key} className="block space-y-1 text-sm">
          <span>{label}</span>
          <input className={inputClass} type={type} required={key==="name"||key==="email"}
            value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
        </label>)}
        <label className="block space-y-1 text-sm">
          <span>Biografía</span>
          <textarea className={inputClass} rows={3} value={form.bio}
            onChange={e=>setForm({...form,bio:e.target.value})}/>
        </label>
        <button disabled={saving} className={buttonClass}>Guardar cambios</button>
      </form>
    </Modal>}

    {adding && <Modal title="Agregar libro al autor" close={()=>setAdding(false)}>
      <form onSubmit={saveBook} className="space-y-4">
        {([
          ["title","Título *","text"],
          ["isbn","ISBN *","text"],
          ["publishedYear","Año","number"],
          ["pages","Páginas","number"],
          ["genre","Género","text"]
        ] as const).map(([key,label,type])=><label key={key} className="block space-y-1 text-sm">
          <span>{label}</span>
          <input className={inputClass} type={type} required={key==="title"||key==="isbn"}
            min={type==="number"?1:undefined}
            value={bookForm[key]} onChange={e=>setBookForm({...bookForm,[key]:e.target.value})}/>
        </label>)}
        <label className="block space-y-1 text-sm">
          <span>Descripción</span>
          <textarea className={inputClass} rows={3} value={bookForm.description}
            onChange={e=>setBookForm({...bookForm,description:e.target.value})}/>
        </label>
        <button disabled={saving} className={buttonClass}>Registrar libro</button>
      </form>
    </Modal>}
  </div>
}
