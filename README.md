# Cuba Connect

# SPECS.md — ToenCuba

Especificación funcional y técnica. Fuente de verdad para implementar y revisar.

Compañero requerido: `AGENTS.md`.

---

## 1. Concepto

Directorio web que conecta turistas con prestadores de servicios turísticos en

Cuba (hostales, taxis, restaurantes).

Modelo de negocio:

1. **Pujas por visibilidad (estilo outbid.lol)**

   - Lista COMPLETA de prestadores ordenada por monto de puja (`bid_amount DESC`).

   - Quien paga más aparece primero. Si alguien te supera, bajas de posición pero SIGUES en la lista.

   - Los que no pujan van al final, por `created_at DESC`.

2. **Subdominios personalizados** — el prestador compra su subdominio

   (`villad2.toencuba.app`) que muestra su página como si fuera suya.

3. **Banners publicitarios** — espacios patrocinados en las páginas de búsqueda/listado.

**Pagos**: manuales por WhatsApp (Transfermóvil, EnZona, USDT). NO pasarela de pago.

---

## 2. Stack

| Capa | Tecnología |

|---|---|

| Framework | Next.js 14+ (App Router), TypeScript |

| DB | Supabase (PostgreSQL) |

| Estilos | Tailwind CSS + shadcn/ui |

| Hosting | Vercel (wildcard domains `*.toencuba.app`) |

| Imágenes | Cloudinary (optimización automática `w=`/`q=`) |

| Package manager | pnpm |

---

## 3. Schema de base de datos

Migraciones en `supabase/migrations/`. Versión inicial: `001_init.sql`.

```sql

-- Prestadores y admin. Autenticación con Supabase Auth (auth.users).

create table profiles (

  id uuid primary key references auth.users(id) on delete cascade,

  email text not null,

  name text,

  whatsapp text,

  role text not null default 'prestador' check (role in ('admin','prestador')),

  created_at timestamptz default now()

);

create table properties (

  id uuid primary key default gen_random_uuid(),

  owner_id uuid references profiles(id) on delete set null,

  name text not null,

  slug text unique not null,             -- usado en /propiedad/[slug] y subdominio

  category text not null,                -- 'hostal' | 'taxi' | 'restaurante'

  zone text not null,                    -- 'vedado' | 'centro' | ... (constante en lib/constants.ts)

  description text,

  whatsapp text not null,                -- prefijo 53, formato wa.me

  photo_url text,                        -- Cloudinary principal

  cover_url text,                        -- Cloudinary detalle

  bid_amount numeric default 0,          -- puja actual en MLC/USD

  subdomain text unique,                 -- null = inactivo; 'villad2' = villad2.toencuba.app

  active boolean default false,          -- admin activa tras validación WhatsApp

  views bigint default 0,                -- estadísticas dashboard

  clicks bigint default 0,               -- clics en WhatsApp

  created_at timestamptz default now()

);

create index properties_leaderboard_idx on properties (category, zone, active, bid_amount desc, created_at desc);

create table banners (

  id uuid primary key default gen_random_uuid(),

  image_url text not null,               -- Cloudinary

  category text,                         -- null = todas las categorías

  zone text,                             -- null = todas las zonas

  target_url text,                       -- donde lleva el clic

  position text default 'top',           -- 'top' | 'between' dentro del listado

  active boolean default false,

  created_at timestamptz default now()

);

-- RLS: reads públicos con active=true; writes solo admin (rol). 

alter table properties enable row level security;

-- ... políticas en la migración.

```

Reglas del schema:

- Nueva puja = el admin hace `UPDATE properties SET bid_amount = N`. La posición

  se recalcula sola con el ORDER BY. Guardas para `active=true`.

- `views`/`clicks` se incrementan con RPCs ligeras desde el front (`increment_views`, `increment_clicks`).

- No hay triggers de negocio de pagos. No hay tabla de transacciones.

  *Ponytail*: si creciera la confianza, añadir tabla `bids` con histórico — no hoy.

---

## 4. Rutas y páginas

### Públicas

| Ruta | Función |

|---|---|

| `/` | Landing: hero con buscador segmentado, CTAs prestadores (3 opciones: pujar, subdominio, banners), testimonios |

| `/hostales`, `/taxis`, `/restaurantes` | Leaderboard COMPLETO de la categoría, filtrado por zona |

| `/[?zona=v]` | filtro de zona vía query param, no rutas anidadas |

| `/propiedad/[slug]` | Detalle + botón WhatsApp |

| `*.toencuba.app` | middleware rewrite → `/propiedad/[subdomain]` |

### Admin (`/admin`)

| Ruta | Función |

|---|---|

| `/admin` | Gestión de propiedades: cambiar `bid_amount`, activar/desactivar, activar subdominio |

| `/admin/bids` | Lista completa ordenada por puja; ajustar montos manualmente |

| `/admin/banners` | Subir imagen, configurar zona/categoría, activar/desactivar |

### Prestadores

| Ruta | Función |

|---|---|

| `/prestadores/registro` | Formulario: nombre, categoría, zona, WhatsApp, fotos → notifica admin por WhatsApp |

| `/prestadores/dashboard` | Estadísticas (visitas, clics WhatsApp), editar propiedad, POSICIÓN actual ("Estás en el puesto #4 de 15 hostales en Vedado"), cuánto paga el #1 y cuánto falta para superarlo, botón "Solicitar puja" (WhatsApp prellenado) |

---

## 5. Middleware — subdominios wildcard

`middleware.ts` (raíz):

- Detectar host `*.toencuba.app`. `villad2.toencuba.app` → `NextResponse.rewrite('/propiedad/villad2')`.

- Si host es `toencuba.app` o `www.toencuba.app` → pasar normal.

- En detalle, buscar propiedad por `slug = subdomain` y que tenga `subdomain` activo.

- URL de imagen de prueba y navegación: los links a `toencuba.app` NO llevan subdominio.

```ts

// pseudocódigo

const host = request.headers.get('host') ?? '';

const base = 'toencuba.app';

if (host !== base && host !== `www.${base}` && host.endsWith(`.${base}`)) {

  const sub = host.slice(0, -(`.${base}`.length));

  return NextResponse.rewrite(new URL(`/propiedad/${sub}`, request.url));

}

```

---

## 6. Lógica de ordenamiento (leaderboard)

```sql

SELECT * FROM properties

WHERE category = :cat AND zone = :zone AND active = true

ORDER BY bid_amount DESC, created_at DESC;

```

- `bid_amount > 0` → arriba, orden por monto.

- `bid_amount = 0` → abajo, orden por antigüedad.

- Puesto #1 = fila 0. Posición del prestador = `row_number()` sobre esa query.

Cálculo para dashboard del prestador:

```sql

WITH ranked AS (

  SELECT id, ROW_NUMBER() OVER (ORDER BY bid_amount DESC, created_at DESC) AS pos,

         COUNT(*) OVER () AS total, MAX(bid_amount) OVER () AS top_bid

  FROM properties

  WHERE category=:cat AND zone=:zone AND active=true

)

SELECT pos, total, top_bid FROM ranked WHERE id = :id;

```

Falta para superar al #1: `top_bid - bid_amount + 1` (o `+ 0.01` si se permiten decimales — decidir y fijar).

---

## 7. Diseño visual

### Paleta

| Token | Hex | Uso |

|---|---|---|

| `--primary` | `#FF6B35` | Naranja vibrante — energía, acción, CTAs, badges de puja |

| `--secondary` | `#004E89` | Azul oscuro — confianza, profesionalismo, header/footer, links |

| `--accent` | `#F7C59F` | Durazno — calidez, testimonios, highlights suaves |

| `--background` | `#FAFAFA` | Gris muy claro — fondo general |

| `--foreground` | `#1A1A1A` | Negro suave — texto |

### Tipografía

- Inter, títulos bold 700, cuerpo regular 400. Fuente via `next/font`.

### Componentes shadcn/ui

`Button, Card, Input, Select, Table, Badge, Dialog` (+ `Skeleton`, `Textarea` si hacen falta).

Personalizar `primary`/`secondary` en `globals.css` con los hex de arriba.

---

## 8. Flujos de usuario

### Turista

1. `toencuba.app` → hero con buscador segmentado

2. Filtra por zona y categoría

3. Ve la lista COMPLETA ordenada por puja

4. Click en propiedad → detalle + botón WhatsApp

5. WhatsApp directo al prestador

### Prestador

1. `/prestadores/registro` — formulario (nombre, categoría, zona, WhatsApp, fotos)

2. Admin recibe aviso (WhatsApp/panel), valida y activa → aparece al final con `bid_amount=0`

3. Dashboard muestra: puesto actual ("#8 de 12"), cuánto paga el #1

4. "Pujar" → WhatsApp al admin con mensaje prellenado

5. Paga (Transfermóvil/EnZona/USDT) → admin actualiza `bid_amount`

6. Sube en la lista automáticamente

### Admin

1. WhatsApp del prestador queriendo pujar

2. Verifica el pago

3. `/admin/bids` → cambia `bid_amount`

4. Frontend reordena solo

---

## 9. No hacer (límites duros)

- ❌ NO pagos automáticos, no pasarela, no Stripe, no webhooks de pago.

- ❌ NO Top 3 — siempre lista completa.

- ❌ NO autoactivación de subdominios — siempre manual.

- ❌ NO descartar zonas/categorías: constantes de código, fáciles de extender.

- ❌ NO imágenes sin Cloudinary (velocidad de carga, lazy loading, `w=`/`q=`).

## 10. SEO

- Metadata por página (title/description), Open Graph con imagen de Cloudinary.

- `app/sitemap.ts` generando URLs de categorías y propiedades activas.

- Mobile-first: 80% del tráfico móvil.

## 11. Definición de hecho (DoD)

- `pnpm build` verde.

- Mobile-first ok en 375px.

- Leaderboard = lista completa, orden verificable con SQL de la sección 6.

- Migración SQL aplicable en Supabase fresh.

- Sin dependencias no aprobadas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a35d3649-d3d0-42fe-98dc-798840252197).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
