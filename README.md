# AlgorithmicsAI Backend

## Instalación y setup

```bash
# 1. Clona el repo y entra a la carpeta del backend
cd algorithmicsai-backend

# 2. Ejecuta el setup completo (instala dependencias, genera Prisma, compila)
npm run setup
```

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
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teach@algorithmics.com","password":"password123"}'
``` 