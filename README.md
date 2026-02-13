# Mi Vida - Activity Tracker

App personal para gestionar y registrar tus actividades: libros, conciertos, viajes, peliculas, series, restaurantes y mas.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS v4
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticacion:** Supabase Auth
- **Graficas:** Recharts
- **Iconos:** Lucide React

## Funcionalidades

- Dashboard con estadisticas y graficas
- CRUD completo de actividades
- Categorias predefinidas: Libros, Conciertos, Viajes, Peliculas, Series, Restaurantes
- Categorias personalizadas con campos configurables
- Valoracion con estrellas (1-5)
- Etiquetas/tags
- Filtros por categoria, fecha, valoracion y busqueda
- Autenticacion con email/password
- Row Level Security (cada usuario solo ve sus datos)
- Responsive (mobile-first)

## Setup

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve al SQL Editor y ejecuta el contenido de `supabase/schema.sql`
3. En Settings > API, copia la URL y la Anon Key

### 2. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Instalar y ejecutar

```bash
npm install
npm run dev
```

### 4. Registrarse

Al registrar un nuevo usuario, las categorias predefinidas se crean automaticamente.

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
├── contexts/         # Auth context (React Context)
├── hooks/            # Custom hooks (useActivities, useCategories)
├── lib/              # Supabase client
├── pages/            # Paginas de la app
├── types/            # TypeScript types
├── App.tsx           # Router principal
└── main.tsx          # Entry point
supabase/
└── schema.sql        # Schema de base de datos
```
