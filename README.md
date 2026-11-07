# 📚 BookSpace — Sistema de Gestión de Biblioteca Digital

## Descripción

BookSpace es una aplicación web desarrollada con Next.js que permite administrar autores y libros mediante una interfaz sencilla y responsive.

El proyecto fue realizado como parte del Laboratorio 12 del curso de Desarrollo de Aplicaciones Web Avanzado de TECSUP, aplicando API Routes, Prisma ORM y PostgreSQL con Supabase.

## Tecnologías utilizadas

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Prisma ORM 6
- PostgreSQL
- Supabase
- Lucide React
- Open Library Covers API
- Vercel

## Funcionalidades

### Gestión de autores
- Registrar nuevos autores.
- Consultar la lista de autores.
- Editar información de autores.
- Eliminar autores.
- Visualizar sus libros.
- Consultar estadísticas de publicaciones.

### Gestión de libros
- Registrar libros asociados a un autor.
- Listar y consultar libros.
- Actualizar y eliminar registros.
- Buscar libros por título.
- Filtrar por género y autor.
- Ordenar resultados.
- Paginar el catálogo.
- Mostrar portadas mediante Open Library.

### Estadísticas
- Cantidad total de libros.
- Primer y último libro publicado.
- Promedio de páginas.
- Géneros registrados.
- Libro más largo y más corto.

## Estructura del proyecto

```text
next-api-routes/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── authors/
│   │   │   └── books/
│   │   ├── authors/[id]/
│   │   ├── books/
│   │   └── page.tsx
│   ├── components/
│   │   ├── BookCover.tsx
│   │   ├── LibraryLayout.tsx
│   │   ├── LibraryShowcase.tsx
│   │   └── Ui.tsx
│   └── lib/
│       └── prisma.ts
├── package.json
└── README.md
```

## Instalación

**1. Clonar el repositorio**

```bash
git clone URL_DEL_REPOSITORIO
cd next-api-routes
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar la base de datos**

Crear el archivo `.env` con la variable:

```env
DATABASE_URL="URL_POSTGRESQL_DE_SUPABASE"
```

**4. Generar Prisma Client y crear las tablas**

```bash
npx prisma generate
npx prisma db push
```

**5. Registrar datos de ejemplo**

```bash
node prisma/seed.js
```

**6. Ejecutar la aplicación**

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/authors` | Listar autores |
| POST | `/api/authors` | Registrar autor |
| GET | `/api/authors/:id` | Consultar autor |
| PUT | `/api/authors/:id` | Actualizar autor |
| DELETE | `/api/authors/:id` | Eliminar autor |
| GET | `/api/authors/:id/books` | Libros del autor |
| GET | `/api/authors/:id/stats` | Estadísticas |
| GET | `/api/books` | Listar libros |
| POST | `/api/books` | Registrar libro |
| GET | `/api/books/:id` | Consultar libro |
| PUT | `/api/books/:id` | Actualizar libro |
| DELETE | `/api/books/:id` | Eliminar libro |
| GET | `/api/books/search` | Búsqueda avanzada |

## Diseño

La interfaz está inspirada en Open Library, utilizando colores crema, tipografía clásica, estanterías digitales y portadas de libros obtenidas mediante ISBN.

## Pruebas

El proyecto cuenta con compilación de producción y verificación de TypeScript satisfactorias. Las pruebas de integración con Supabase y las solicitudes HTTP mediante Postman se realizarán después de configurar la base de datos.

## Autor

**Kevin Quispe Ccolque**  
TECSUP — Diseño y Desarrollo de Software  
Curso: Desarrollo de Aplicaciones Web Avanzado  
Laboratorio 12 — API's Integradas

GitHub: https://github.com/Chanok18