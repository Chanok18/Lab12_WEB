import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Context = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: { orderBy: { publishedYear: "desc" } },
        _count: { select: { books: true } },
      },
    })

    if (!author) {
      return NextResponse.json(
        { error: "Autor no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(author)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener autor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params
    const body = await request.json()

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const data: {
      name?: string
      email?: string
      bio?: string | null
      nationality?: string | null
      birthYear?: number | null
    } = {}

    if (body.name !== undefined) data.name = body.name
    if (body.email !== undefined) data.email = body.email
    if (body.bio !== undefined) data.bio = body.bio
    if (body.nationality !== undefined) data.nationality = body.nationality
    if (body.birthYear !== undefined) {
      data.birthYear = body.birthYear ? Number(body.birthYear) : null
    }

    const author = await prisma.author.update({
      where: { id },
      data,
    })

    return NextResponse.json(author)
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? error.code
        : null

    if (code === "P2025") {
      return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 })
    }
    if (code === "P2002") {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 409 })
    }

    return NextResponse.json(
      { error: "Error al actualizar autor" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params

    await prisma.author.delete({ where: { id } })

    return NextResponse.json({
      message: "Autor eliminado correctamente",
    })
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? error.code
        : null

    return NextResponse.json(
      { error: code === "P2025" ? "Autor no encontrado" : "Error al eliminar autor" },
      { status: code === "P2025" ? 404 : 500 }
    )
  }
}
