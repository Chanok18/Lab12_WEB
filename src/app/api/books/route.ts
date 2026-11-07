import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get("genre")
    const authorId = searchParams.get("authorId")

    const books = await prisma.book.findMany({
      where: {
        ...(genre ? { genre } : {}),
        ...(authorId ? { authorId } : {}),
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(books)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener libros" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, isbn, publishedYear, genre, pages, authorId } = body

    if (typeof title !== "string" || title.trim().length < 3 || !authorId || !isbn) {
      return NextResponse.json(
        { error: "Título, ISBN y autor son obligatorios" },
        { status: 400 }
      )
    }

    if (pages != null && pages !== "" && (!Number.isInteger(Number(pages)) || Number(pages) < 1)) {
      return NextResponse.json(
        { error: "El número de páginas debe ser positivo" },
        { status: 400 }
      )
    }

    const author = await prisma.author.findUnique({
      where: { id: authorId },
    })

    if (!author) {
      return NextResponse.json(
        { error: "El autor especificado no existe" },
        { status: 404 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title: title.trim(),
        description: description || null,
        isbn: String(isbn).trim(),
        publishedYear: publishedYear ? Number(publishedYear) : null,
        genre: genre || null,
        pages: pages ? Number(pages) : null,
        authorId,
      },
      include: { author: true },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "El ISBN ya existe" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear libro" },
      { status: 500 }
    )
  }
}
