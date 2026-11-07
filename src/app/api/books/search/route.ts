import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams

    const search = params.get("search")?.trim() || ""
    const genre = params.get("genre") || ""
    const authorName = params.get("authorName")?.trim() || ""

    const rawPage = Number(params.get("page") ?? 1)
    const rawLimit = Number(params.get("limit") ?? 10)

    const page = Number.isFinite(rawPage) ? Math.max(1, Math.floor(rawPage)) : 1
    const limit = Number.isFinite(rawLimit)
      ? Math.min(50, Math.max(1, Math.floor(rawLimit)))
      : 10

    const allowedSort = ["title", "publishedYear", "createdAt"]
    const requestedSort = params.get("sortBy") || "createdAt"
    const sortBy = allowedSort.includes(requestedSort) ? requestedSort : "createdAt"
    const order = params.get("order") === "asc" ? "asc" : "desc"

    const where: Prisma.BookWhereInput = {
      ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      ...(genre ? { genre } : {}),
      ...(authorName ? {
        author: {
          name: { contains: authorName, mode: "insensitive" },
        },
      } : {}),
    }

    const [total, books] = await prisma.$transaction([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: { author: true },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Error en la búsqueda de libros" },
      { status: 500 }
    )
  }
}
