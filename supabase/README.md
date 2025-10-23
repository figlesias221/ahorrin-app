# 🗄️ Ahorrín Database Setup

Este directorio contiene el schema y los datos de inicialización (seed) para Ahorrín.

## 📁 Archivos

- **`schema.sql`** - Estructura completa de la base de datos (tablas, índices, políticas RLS)
- **`seed.sql`** - Datos iniciales con tus 30 categorías y 198 transacciones del Excel

## 🚀 Setup de Supabase

### Paso 1: Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una nueva organización (si no tienes una)
3. Crea un nuevo proyecto
   - Nombre: `gasty` o similar
   - Database Password: **guárdalo bien**
   - Región: Elige la más cercana

### Paso 2: Ejecutar el schema

1. Ve a **SQL Editor** en el panel de Supabase
2. Crea una nueva query
3. Copia y pega el contenido de `schema.sql`
4. Ejecuta la query
5. Verifica que las tablas se crearon:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

### Paso 3: Obtener tu User ID

Antes de ejecutar el seed, necesitas tu user ID:

**Opción A: Registrarte en la app**
1. Ve a tu app local: `http://localhost:3001`
2. Regístrate con tu email
3. Ve al SQL Editor de Supabase
4. Ejecuta:
   ```sql
   SELECT id, email FROM auth.users;
   ```
5. Copia tu user ID (UUID)

**Opción B: Crear usuario directamente**
```sql
-- Desde el SQL Editor de Supabase
-- Reemplaza con tu email y contraseña
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'tu@email.com',
  crypt('tu_password', gen_salt('bf')),
  now(),
  '{"name": "Tu Nombre"}'::jsonb,
  now(),
  now()
)
RETURNING id, email;
```

### Paso 4: Ejecutar el seed

1. Abre `seed.sql`
2. **Reemplaza TODAS las ocurrencias** de `'YOUR_USER_ID_HERE'` con tu user ID:
   - En VS Code: `Cmd+H` (Mac) o `Ctrl+H` (Windows)
   - Buscar: `YOUR_USER_ID_HERE`
   - Reemplazar: tu UUID (ej: `12345678-1234-1234-1234-123456789abc`)
   - Replace All
3. Copia el contenido modificado
4. Ve al SQL Editor de Supabase
5. Pega y ejecuta

### Paso 5: Verificar datos

```sql
-- Ver categorías
SELECT COUNT(*) FROM categories; -- Debe ser 30

-- Ver transacciones
SELECT COUNT(*) FROM transactions; -- Debe ser 198

-- Ver resumen
SELECT
  type,
  COUNT(*) as count,
  SUM(amount) as total
FROM transactions
GROUP BY type;
```

## 🔑 Variables de Entorno

Crea/actualiza el archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Dónde encontrar estas credenciales:**
1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Datos Incluidos en el Seed

### Categorías (30 total)

**Gastos (28):**
- Servicios Casa: GC, UTE, ANTEL, Montevideo Gas
- Propiedades: Contribuciones y tributos (Ellauri, Patria, Lamas)
- Suscripciones: Netflix, Spotify, Youtube, Amazon Prime
- Telefonía: ANTEL Móvil (2 líneas)
- Seguros: Automóvil Club, Seguro Auto
- Otros: Del Campo, Bigua, HB Papa/Fede, IRPF, etc.

**Ingresos (2):**
- Alquiler Patria 566
- Alquiler Lamas 112

### Transacciones (198 total)

- **182 gastos** (enero - diciembre 2025)
- **16 ingresos** (alquileres de enero a septiembre 2025)
- **Total Gastos**: $1,049,063.14
- **Total Ingresos**: $576,354.00
- **Balance Neto**: -$472,709.14

## 🔄 Re-generar el Seed

Si necesitas actualizar el seed con nuevos datos del Excel:

```bash
# Desde la raíz del proyecto /gasty
source .venv/bin/activate
python3 generate_seed.py
```

Esto regenera `ahorrin-app/supabase/seed.sql` con los últimos datos.

## 🧹 Limpiar Datos

Si necesitas empezar de cero:

```sql
-- Eliminar todas las transacciones y categorías
-- (mantiene las tablas y el schema)
TRUNCATE transactions CASCADE;
TRUNCATE categories CASCADE;
```

## 🐛 Troubleshooting

### Error: "duplicate key value violates unique constraint"

Significa que ya ejecutaste el seed antes. Opciones:

1. **Limpiar y re-ejecutar:**
   ```sql
   TRUNCATE transactions CASCADE;
   TRUNCATE categories CASCADE;
   -- Luego ejecuta seed.sql nuevamente
   ```

2. **Eliminar y recrear todo:**
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   -- Ejecuta schema.sql
   -- Ejecuta seed.sql
   ```

### Error: "permission denied for table"

Verifica que Row Level Security esté configurado correctamente:

```sql
-- Ver políticas RLS
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### No veo mis datos en la app

1. Verifica que estás logueado con el usuario correcto
2. Verifica que `YOUR_USER_ID_HERE` fue reemplazado correctamente:
   ```sql
   SELECT DISTINCT user_id FROM transactions;
   SELECT DISTINCT user_id FROM categories;
   ```

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
