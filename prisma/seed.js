const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const data = [
  {
    name: "Gabriel García Márquez",
    email: "gabriel@example.com",
    nationality: "Colombia",
    birthYear: 1927,
    bio: "Escritor colombiano reconocido por sus novelas y cuentos.",
    books: [
      {
        title: "Cien años de soledad",
        isbn: "9780307474728",
        publishedYear: 1967,
        genre: "Novela",
        pages: 417,
        description: "Historia de la familia Buendía en Macondo."
      },
      {
        title: "El amor en los tiempos del cólera",
        isbn: "9780307389732",
        publishedYear: 1985,
        genre: "Romance",
        pages: 368,
        description: "Novela sobre el amor y el paso del tiempo."
      }
    ]
  },
  {
    name: "J. R. R. Tolkien",
    email: "tolkien@example.com",
    nationality: "Reino Unido",
    birthYear: 1892,
    bio: "Escritor y filólogo, autor de obras de fantasía.",
    books: [
      {
        title: "El Hobbit",
        isbn: "9780547928227",
        publishedYear: 1937,
        genre: "Fantasía",
        pages: 300,
        description: "Las aventuras de Bilbo Bolsón."
      }
    ]
  },
  {
    name: "Jane Austen",
    email: "austen@example.com",
    nationality: "Reino Unido",
    birthYear: 1775,
    bio: "Novelista inglesa conocida por sus obras sobre la sociedad.",
    books: [
      {
        title: "Orgullo y prejuicio",
        isbn: "9780141439518",
        publishedYear: 1813,
        genre: "Romance",
        pages: 432,
        description: "Historia de Elizabeth Bennet y Fitzwilliam Darcy."
      }
    ]
  },
  {
    name: "Stephen Hawking",
    email: "hawking@example.com",
    nationality: "Reino Unido",
    birthYear: 1942,
    bio: "Físico teórico y divulgador científico.",
    books: [
      {
        title: "Breve historia del tiempo",
        isbn: "9780553380163",
        publishedYear: 1988,
        genre: "Ciencia",
        pages: 212,
        description: "Introducción a la cosmología y el universo."
      }
    ]
  },
  {
    name: "F. Scott Fitzgerald",
    email: "fitzgerald@example.com",
    nationality: "Estados Unidos",
    birthYear: 1896,
    bio: "Novelista estadounidense del siglo XX.",
    books: [
      {
        title: "El gran Gatsby",
        isbn: "9780743273565",
        publishedYear: 1925,
        genre: "Novela",
        pages: 180,
        description: "Retrato de la sociedad estadounidense de los años veinte."
      }
    ]
  }
]

async function main() {
  for (const item of data) {
    const { books, ...authorData } = item

    const author = await prisma.author.upsert({
      where: { email: authorData.email },
      update: authorData,
      create: authorData,
    })

    for (const book of books) {
      await prisma.book.upsert({
        where: { isbn: book.isbn },
        update: { ...book, authorId: author.id },
        create: { ...book, authorId: author.id },
      })
    }
  }

  console.log("✅ Datos de ejemplo registrados correctamente")
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
