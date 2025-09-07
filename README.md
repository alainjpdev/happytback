# HappyTribe Backend

## Estructura general de la app

- **server.ts**: Entry point. Arranca el servidor Express en el puerto definido.
- **app.ts**: Configura middlewares globales y monta todas las rutas principales bajo `/api`.
- **routes/**: Contiene los routers de cada entidad/página principal:
  - **modules.ts**: Gestión de módulos (crear, editar, eliminar, listar). Solo admin puede modificar.
  - **users.ts**: Gestión de usuarios (listar, ver, editar, eliminar). Solo admin puede listar/eliminar, los usuarios pueden editar/ver su propio perfil.
  - **auth.ts**: Login y registro de usuarios. Devuelve JWT.
  - **classes.ts**: Gestión de clases (listar, asignar profesor).
  - **assignments.ts**: Gestión de tareas (listar).
  - **materials.ts**: Gestión de materiales (listar).
  - **studentclasses.ts**: Inscripciones de estudiantes a clases (listar).
- **middleware/auth.ts**: Middlewares de autenticación y autorización (JWT, roles, permisos de edición).
- **prisma/schema.prisma**: Modelos de base de datos (User, Module, Class, Assignment, Material, StudentClass, Report).
- **prisma/seed.ts|js**: Scripts para poblar la base de datos con datos de ejemplo.

## Detalle de cada "page" (ruta principal)

### /api/modules
- **GET /**: Lista todos los módulos.
- **POST /**: Crea un módulo (solo admin, requiere JWT). Campos: title, description, url.
- **PUT /:id**: Edita un módulo (solo admin, requiere JWT).
- **DELETE /:id**: Elimina un módulo (solo admin, requiere JWT).

### /api/users
- **GET /**: Lista todos los usuarios (solo admin).
- **GET /:id**: Ver perfil (propio o admin).
- **PUT /:id**: Editar perfil (propio o admin).
- **DELETE /:id**: Eliminar usuario (solo admin).

### /api/login y /api/register
- **POST /api/login**: Login, devuelve JWT y datos del usuario.
- **POST /api/register**: Registro de usuario.

### /api/classes
- **GET /**: Lista todas las clases.
- **PUT /:id**: Asigna profesor a una clase.

### /api/assignments
- **GET /**: Lista todas las tareas.

### /api/assignment-module
- **POST /**: Guarda o actualiza el assignment personalizado de un usuario para un módulo. Body: `{ userId, moduleId, content }`. Si ya existe, lo actualiza; si no, lo crea.
- **GET /**: Consulta el assignment personalizado de un usuario para un módulo. Query: `?userId=...&moduleId=...`.

#### Buenas prácticas para endpoints personalizados
- Usa `upsert` para evitar duplicados y simplificar lógica de creación/actualización.
- Valida que los campos requeridos estén presentes (`userId`, `moduleId`, `content`).
- Devuelve siempre el objeto guardado o actualizado.
- Protege el endpoint si es necesario (por ejemplo, solo el propio usuario o admin puede guardar/consultar).
- Usa status 400 para errores de validación y 500 para errores inesperados.

#### Ejemplo de request
```bash
# Guardar assignment personalizado
curl -X POST https://<tu-backend>/api/assignment-module \
  -H "Content-Type: application/json" \
  -d '{"userId":"...","moduleId":"...","content":"Mi respuesta"}'

# Consultar assignment personalizado
curl "https://<tu-backend>/api/assignment-module?userId=...&moduleId=..."
```

### /api/materials
- **GET /**: Lista todos los materiales.

### /api/studentclasses
- **GET /**: Lista todas las inscripciones de estudiantes a clases.

## Modelos principales (Prisma)
- **User**: Usuarios (admin, teacher, student).
- **Module**: Módulos de contenido.
- **Class**: Clases asociadas a módulos y profesores.
- **Assignment**: Tareas de clase.
- **Material**: Materiales de clase.
- **StudentClass**: Inscripciones de estudiantes a clases.
- **Report**: Reportes de usuario.

## Middlewares clave
- **authenticateToken**: Verifica JWT y usuario.
- **requireRole**: Restringe acceso por rol (ej: solo admin).
- **canEditProfile**: Permite editar solo el propio perfil o si eres admin.

## Setup y comandos útiles

```bash
# 1. Clona el repo y entra a la carpeta del backend
cd happytribe-backend

# 2. Ejecuta el setup completo (instala dependencias, genera Prisma, compila, seed)
npm run setup
```

## Usuarios de prueba

El sistema incluye usuarios de prueba preconfigurados:

- **Estudiante**: `student@happytribe.com` / `happytribe123`
- **Profesor**: `teacher@happytribe.com` / `happytribe123`  
- **Admin**: `admin@happytribe.com` / `happytribe123`

Variables de entorno, comandos útiles y ejemplos de uso están más abajo en este archivo.

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```
DATABASE_URL="postgresql://usuario:contraseña@host:puerto/nombre_basedatos"
JWT_SECRET="tu_secreto"
```

## Comandos útiles

- `npm run dev` — desarrollo con ts-node
- `npm run build` — compila TypeScript a dist/
- `npm start` — ejecuta el backend en producción desde dist/

## Prisma

- `npx prisma generate --schema=prisma/schema.prisma` — genera el cliente Prisma
- `npx prisma migrate dev` — aplica migraciones (si usas migraciones)

## Test rápido

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@happytribe.com","password":"happytribe123"}'
``` 