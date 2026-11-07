import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params

    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    })

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      )
    }

    const books = author.books

    const byYear = books
      .filter(book => book.publishedYear !== null)
      .sort((a, b) => a.publishedYear! - b.publishedYear!)

    const byPages = books
      .filter(book => book.pages !== null)
      .sort((a, b) => a.pages! - b.pages!)

    const totalPages = byPages.reduce((sum, book) => sum + book.pages!, 0)

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks: books.length,
      firstBook: byYear.length
        ? { title: byYear[0].title, year: byYear[0].publishedYear }
        : null,
      latestBook: byYear.length
        ? {
            title: byYear[byYear.length - 1].title,
            year: byYear[byYear.length - 1].publishedYear,
          }
        : null,
      averagePages: byPages.length
        ? Math.round(totalPages / byPages.length)
        : 0,
      genres: [...new Set(books.map(book => book.genre).filter(Boolean))],
      longestBook: byPages.length
        ? {
            title: byPages[byPages.length - 1].title,
            pages: byPages[byPages.length - 1].pages,
          }
        : null,
      shortestBook: byPages.length
        ? { title: byPages[0].title, pages: byPages[0].pages }
        : null,
    })
  } catch {
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
