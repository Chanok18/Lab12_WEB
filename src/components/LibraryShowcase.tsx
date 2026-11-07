"use client"

import Link from "next/link"
import {
  BookOpen, BookMarked, CalendarCheck,
  LibraryBig, ArrowRight, Search
} from "lucide-react"
import BookCover from "@/components/BookCover"

type ShelfBook = {
  id: string
  title: string
  isbn: string
  genre: string | null
  authorId: string
  author: { name: string }
}

const categories = [
  { name: "Destacado", isbn: "9780743273565" },
  { name: "Novela", isbn: "9780307474728" },
  { name: "Fantasía", isbn: "9780547928227" },
  { name: "Romance", isbn: "9780141439518" },
  { name: "Cuento", isbn: "9780141182636" },
  { name: "Historia", isbn: "9780553296983" },
  { name: "Poesía", isbn: "9780143039969" },
  { name: "Ciencia", isbn: "9780553380163" },
]

export default function LibraryShowcase({
  books = [],
  title = "Explora las estanterías"
}: {
  books?: ShelfBook[]
  title?: string
}) {
  return (
    <div className="space-y-9">
      <section>
        <h2 className="library-heading mb-5 text-2xl">
          Bienvenido a la Biblioteca BookSpace
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Explora nuestra biblioteca",
              description: "Descubre y organiza los libros registrados en nuestro catálogo.",
              href: "/books"
            },
            {
              icon: CalendarCheck,
              title: "Gestiona tu colección",
              description: "Registra nuevas obras y mantén actualizada su información.",
              href: "/books"
            },
            {
              icon: BookMarked,
              title: "Conoce a los autores",
              description: "Consulta biografías, publicaciones y estadísticas literarias.",
              href: "/#autores"
            }
          ].map(item => (
            <Link
              key={item.title}
              href={item.href}
              className="flex min-h-32 items-center gap-4 rounded-lg border border-[#e0dac8] bg-[#faf9f4] p-4 transition hover:border-[#9eafc2]"
            >
              <item.icon size={43} strokeWidth={1.4} className="shrink-0 text-[#4b4a43]" />
              <div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#615e55]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="library-heading mb-4 text-2xl">{title}</h2>
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map(category => (
            <Link
              key={category.name}
              href={category.name === "Destacado"
                ? "/books"
                : `/books?genre=${encodeURIComponent(category.name)}`}
              className="flex min-w-32 flex-col items-center gap-3 rounded-lg border border-[#e0dac8] bg-white p-3 hover:border-[#3269b2] hover:bg-[#f5f8fc]"
            >
              <BookCover
                isbn={category.isbn}
                title={category.name}
                className="h-28 w-20"
              />
              <span className="text-xs font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="library-shelf p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="library-heading text-2xl">Libros destacados</h2>
            <p className="mt-1 text-xs text-[#706b5f]">
              Descubre las obras de nuestra colección
            </p>
          </div>
          <Link href="/books" className="flex items-center gap-1 text-sm font-semibold text-[#3269b2]">
            Ver todo <ArrowRight size={16} />
          </Link>
        </div>

        {books.length ? (
          <div className="flex gap-5 overflow-x-auto pb-3">
            {books.slice(0, 8).map(book => (
              <div key={book.id} className="w-36 shrink-0">
                <Link href={`/authors/${book.authorId}`}>
                  <BookCover
                    isbn={book.isbn}
                    title={book.title}
                    className="mx-auto h-48 w-32"
                  />
                </Link>
                <p className="mt-3 line-clamp-2 min-h-10 text-center text-sm font-semibold">
                  {book.title}
                </p>
                <p className="truncate text-center text-xs text-[#777267]">
                  {book.author.name}
                </p>
                <Link
                  href={`/authors/${book.authorId}`}
                  className="library-blue-button mt-3 block text-center"
                >
                  Ver libro
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#d0c8b3] bg-white px-5 py-12 text-center">
            <LibraryBig size={38} className="text-[#8e8879]" />
            <p className="font-medium">Tu estantería estará lista pronto</p>
            <p className="max-w-sm text-sm text-[#777267]">
              Cuando conectes Supabase y registres libros, sus portadas aparecerán aquí automáticamente.
            </p>
            <Link href="/books" className="library-blue-button">
              <Search size={15} className="mr-2 inline" />
              Explorar catálogo
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
