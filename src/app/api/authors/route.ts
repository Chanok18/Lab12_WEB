import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
        _count: { select: { books: true } },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(authors)
  } catch {
    return NextResponse.json(
      { error: "Error al obtener autores" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, bio, nationality, birthYear } = body

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nombre y email son obligatorios" },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const author = await prisma.author.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        bio: bio || null,
        nationality: nationality || null,
        birthYear: birthYear ? Number(birthYear) : null,
      },
    })

    return NextResponse.json(author, { status: 201 })
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Error al crear autor" },
      { status: 500 }
    )
  }
}
