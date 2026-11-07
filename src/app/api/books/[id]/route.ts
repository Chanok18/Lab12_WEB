import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch {
    return NextResponse.json({ error: "Error al obtener libro" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params
    const body = await request.json()

    if (body.title !== undefined &&
        (typeof body.title !== "string" || body.title.trim().length < 3)) {
      return NextResponse.json(
        { error: "El título debe tener al menos 3 caracteres" },
        { status: 400 }
      )
    }

    if (body.pages != null && body.pages !== "" &&
        (!Number.isInteger(Number(body.pages)) || Number(body.pages) < 1)) {
      return NextResponse.json(
        { error: "Número de páginas inválido" },
        { status: 400 }
      )
    }

    if (body.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: body.authorId },
      })
      if (!author) {
        return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 })
      }
    }

    const data: Prisma.BookUncheckedUpdateInput = {}

    if (body.title !== undefined) data.title = body.title.trim()
    if (body.description !== undefined) data.description = body.description || null
    if (body.isbn !== undefined) data.isbn = body.isbn
    if (body.genre !== undefined) data.genre = body.genre || null
    if (body.publishedYear !== undefined) {
      data.publishedYear = body.publishedYear ? Number(body.publishedYear) : null
    }
    if (body.pages !== undefined) data.pages = body.pages ? Number(body.pages) : null
    if (body.authorId !== undefined) data.authorId = body.authorId

    const book = await prisma.book.update({
      where: { id },
      data,
      include: { author: true },
    })

    return NextResponse.json(book)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
      }
      if (error.code === "P2002") {
        return NextResponse.json({ error: "ISBN duplicado" }, { status: 409 })
      }
    }

    return NextResponse.json({ error: "Error al actualizar libro" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params
    await prisma.book.delete({ where: { id } })

    return NextResponse.json({ message: "Libro eliminado correctamente" })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ error: "Error al eliminar libro" }, { status: 500 })
  }
}
