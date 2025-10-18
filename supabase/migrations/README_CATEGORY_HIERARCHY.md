# Migración: Sistema de Categorías Jerárquicas Mejorado

## Resumen

Esta migración mejora el sistema de categorías implementando restricciones para que:
1. **Solo las categorías "hoja"** (sin subcategorías) puedan tener transacciones asignadas
2. **Las categorías padre** muestren automáticamente totales agregados de todas sus subcategorías
3. **Prevención de errores** mediante validación en base de datos y frontend

## Problema Resuelto

### Antes:
- ❌ Categorías padre podían tener transacciones directamente
- ❌ Los totales solo mostraban transacciones directas, no agregadas de subcategorías
- ❌ Ambigüedad sobre dónde asignar transacciones

### Después:
- ✅ Solo subcategorías (o categorías sin hijos) pueden tener transacciones
- ✅ Categorías padre muestran totales agregados automáticamente
- ✅ Estructura clara y organizada

## Archivos Creados

### 1. `migrate_parent_category_transactions.sql`
Migra datos existentes antes de aplicar restricciones.

**Qué hace:**
- Identifica categorías padre con transacciones asignadas
- Crea subcategorías "General" automáticamente
- Mueve las transacciones a las subcategorías nuevas
- Genera log detallado del proceso

### 2. `restrict_parent_category_transactions.sql`
Implementa las restricciones y mejoras.

**Qué hace:**
- Crea función `category_has_children()` para verificar jerarquía
- Agrega triggers para validar transacciones en categorías hoja
- Crea vista `category_stats` con totales agregados recursivos
- Previene crear subcategorías bajo categorías con transacciones

## Pasos de Ejecución

### Paso 1: Backup (IMPORTANTE)
```sql
-- Crear backup de las tablas críticas
CREATE TABLE backup_categories AS SELECT * FROM public.categories;
CREATE TABLE backup_transactions AS SELECT * FROM public.transactions;
```

### Paso 2: Ejecutar migración de datos
```bash
# En Supabase SQL Editor
```
Copia y ejecuta el contenido de: `migrate_parent_category_transactions.sql`

**Verifica el output:**
- Debe mostrar cuántas categorías padre fueron procesadas
- Cuántas transacciones fueron movidas
- Confirmar "No parent categories have transactions"

### Paso 3: Aplicar restricciones
```bash
# En Supabase SQL Editor
```
Copia y ejecuta el contenido de: `restrict_parent_category_transactions.sql`

**Verifica la ejecución:**
- No debe haber errores
- Vista `category_stats` debe estar creada
- Triggers deben estar activos

### Paso 4: Verificar en la aplicación
1. Refresca la página de categorías
2. Verifica que categorías padre muestren "(Agregado)" y "(Total con subcategorías)"
3. Intenta crear una transacción en una categoría padre → debe fallar con mensaje claro
4. Verifica que los totales coincidan

## Componentes Actualizados en Frontend

### 1. `app/(dashboard)/categories/page.tsx`
- Usa `category_stats` view en lugar de cálculo manual
- Muestra indicadores "(Agregado)" en categorías padre
- Interfaz mejorada para jerarquía

### 2. `components/modals/transaction-modal.tsx`
- Valida que solo se seleccionen categorías hoja
- Muestra mensaje informativo
- Formatea select con jerarquía visual (Padre → Hijo)

### 3. Validación en BD
- Triggers automáticos previenen asignaciones incorrectas
- Mensajes de error claros en español

## Vista `category_stats`

Nueva vista SQL que calcula automáticamente:

```sql
SELECT * FROM public.category_stats;
```

**Columnas:**
- Todas las columnas de `categories`
- `transaction_count`: Total de transacciones (incluye subcategorías)
- `total_amount`: Suma total de montos (incluye subcategorías)
- `has_children`: Boolean indicando si es categoría padre

**Uso en código:**
```typescript
const { data } = await supabase
  .from('category_stats')
  .select('*')
  .eq('user_id', userId);
```

## Funciones Creadas

### `category_has_children(category_uuid UUID)`
Retorna `true` si la categoría tiene subcategorías.

### `validate_transaction_category()`
Trigger function que valida transacciones antes de INSERT/UPDATE.

### `validate_category_hierarchy()`
Trigger function que valida jerarquía de categorías antes de INSERT/UPDATE.

## Testing

### Test 1: Intentar asignar transacción a padre
```sql
-- Esto debe fallar
INSERT INTO transactions (
  user_id, category_id, date, vendor, amount, type
) VALUES (
  'tu-user-id',
  'categoria-padre-id',
  NOW(),
  'Test Vendor',
  100,
  'expense'
);
-- Error esperado: "Cannot assign transactions to parent categories"
```

### Test 2: Verificar totales agregados
```sql
-- Verificar que los totales de una categoría padre
-- suman las transacciones de todas sus subcategorías
SELECT
  c.name as categoria_padre,
  cs.transaction_count as total_transacciones,
  cs.total_amount as total_monto
FROM categories c
JOIN category_stats cs ON c.id = cs.id
WHERE c.parent_id IS NULL
  AND EXISTS (SELECT 1 FROM categories WHERE parent_id = c.id);
```

### Test 3: Crear subcategoría bajo categoría con transacciones
```sql
-- Esto debe fallar si la categoría padre tiene transacciones
INSERT INTO categories (
  user_id, name, parent_id, type, color
) VALUES (
  'tu-user-id',
  'Nueva Subcategoría',
  'categoria-con-transacciones-id',
  'expense',
  '#ff0000'
);
-- Error esperado: "Cannot create subcategories under a category that has transactions assigned"
```

## Rollback (Si necesitas revertir)

### Restaurar datos
```sql
-- Restaurar tablas desde backup
DELETE FROM public.categories;
DELETE FROM public.transactions;

INSERT INTO public.categories SELECT * FROM backup_categories;
INSERT INTO public.transactions SELECT * FROM backup_transactions;
```

### Eliminar restricciones
```sql
-- Eliminar triggers
DROP TRIGGER IF EXISTS enforce_leaf_category_on_insert ON public.transactions;
DROP TRIGGER IF EXISTS enforce_leaf_category_on_update ON public.transactions;
DROP TRIGGER IF EXISTS validate_category_hierarchy_on_insert ON public.categories;
DROP TRIGGER IF EXISTS validate_category_hierarchy_on_update ON public.categories;

-- Eliminar funciones
DROP FUNCTION IF EXISTS public.validate_transaction_category();
DROP FUNCTION IF EXISTS public.validate_category_hierarchy();
DROP FUNCTION IF EXISTS public.category_has_children(UUID);

-- Eliminar vista
DROP VIEW IF EXISTS public.category_stats;
```

## Preguntas Frecuentes

### ¿Qué pasa con mis transacciones existentes en categorías padre?
El script `migrate_parent_category_transactions.sql` las mueve automáticamente a subcategorías "General".

### ¿Puedo seguir usando categorías sin subcategorías?
Sí, las categorías top-level sin hijos funcionan normalmente y pueden tener transacciones.

### ¿Qué pasa si borro una subcategoría con transacciones?
Las transacciones se quedan sin categoría (category_id = NULL) debido a `ON DELETE SET NULL`.

### ¿Los totales se actualizan en tiempo real?
Sí, la vista `category_stats` calcula los totales dinámicamente cada vez que consultas.

## Soporte

Si encuentras problemas:
1. Verifica los logs de Supabase
2. Revisa que todos los triggers estén activos
3. Confirma que la vista `category_stats` existe
4. Revisa los mensajes de error en la consola del browser

## Ejemplo de Estructura Final

```
📁 Alimentación (Padre)
   ├─ Total: $5,000 (Agregado)
   ├─ Transacciones: 25 (Agregado)
   ├─ 🍔 Restaurantes → $2,000 (10 tx)
   ├─ 🛒 Supermercado → $2,500 (12 tx)
   └─ ☕ Café → $500 (3 tx)

📁 Transporte (Padre)
   ├─ Total: $1,500 (Agregado)
   ├─ 🚕 Taxi → $800 (8 tx)
   └─ ⛽ Combustible → $700 (4 tx)
```

En este ejemplo:
- ✅ "Alimentación" y "Transporte" NO pueden tener transacciones directas
- ✅ Solo "Restaurantes", "Supermercado", "Café", "Taxi", "Combustible" pueden tener transacciones
- ✅ Los totales de "Alimentación" y "Transporte" se calculan automáticamente
