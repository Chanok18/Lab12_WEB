# BookSpace - Pasos pendientes

## 1. Crear proyecto en Supabase
- Crear un proyecto PostgreSQL.
- Copiar la cadena de conexión de la base de datos.
- Preferir Session Pooler si el entorno no soporta IPv6.
- No compartir ni subir contraseñas a GitHub.

## 2. Configurar .env
Reemplazar DATABASE_URL por la URL real de Supabase.

Si la contraseña tiene caracteres especiales, codificarlos para URL.

## 3. Crear las tablas
npx prisma validate
npx prisma db push
npx prisma generate

## 4. Insertar datos de prueba
node prisma/seed.js

## 5. Iniciar el proyecto
npm run dev

## 6. Probar endpoints
GET    /api/authors
POST   /api/authors
GET    /api/authors/:id
PUT    /api/authors/:id
DELETE /api/authors/:id
GET    /api/authors/:id/books
GET    /api/authors/:id/stats

GET    /api/books
POST   /api/books
GET    /api/books/:id
PUT    /api/books/:id
DELETE /api/books/:id

GET    /api/books?genre=Novela
GET    /api/books/search?search=amor
GET    /api/books/search?genre=Novela&page=1&limit=5
GET    /api/books/search?authorName=Gabriel&sortBy=title&order=asc

## 7. Evidencias
- Supabase con tablas Author y Book.
- Prisma db push exitoso.
- Autores y libros registrados.
- Dashboard con datos.
- Catálogo con portadas.
- Búsqueda y filtros.
- Estadísticas de autor.
- Pruebas GET, POST, PUT y DELETE en Postman.
- Repositorio GitHub.
- Despliegue Vercel.

## 8. Despliegue
- Subir el proyecto a GitHub.
- Importar el repositorio en Vercel.
- Configurar DATABASE_URL en Vercel.
- Verificar que Prisma Client se genere durante el build.
- Probar la aplicación desplegada.
