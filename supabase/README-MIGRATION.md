# 🔄 Migración a Schema Simplificado

Este directorio contiene 3 scripts SQL para diferentes escenarios:

## 📝 Scripts Disponibles

### 1. `schema-simple.sql` - Setup Limpio (RECOMENDADO para nuevos proyectos)
**Usa este si:**
- Es un proyecto nuevo sin datos
- Quieres empezar de cero
- No te importa perder los datos actuales

**Qué hace:**
- ✅ DROP de todas las tablas viejas (profiles, accounts, budgets, etc.)
- ✅ Crea solo 2 tablas: `categories` + `transactions`
- ✅ Agrega columna `is_ignored`
- ✅ Crea vista `monthly_category_summary`
- ✅ Crea función `get_category_summary()`

```sql
-- Ejecuta este archivo completo en Supabase SQL Editor
```

---

### 2. `migrate-to-simple.sql` - Migración Segura (para proyectos con datos)
**Usa este si:**
- Ya tienes datos en la base de datos
- Quieres preservar transacciones y categorías existentes
- Quieres hacer la migración sin pérdida de datos

**Qué hace:**
1. 💾 Backup temporal de `categories` y `transactions`
2. 🗑️ DROP de todas las tablas viejas
3. 🆕 Crea schema simplificado
4. ♻️ Restaura los datos del backup
5. ✅ Verifica que todo se migró correctamente

```sql
-- Ejecuta este archivo completo en Supabase SQL Editor
-- Al final verás un mensaje con el conteo de registros migrados
```

---

### 3. `schema.sql` - Schema Original (7 tablas)
**Este es el schema viejo**
- Tiene 7 tablas (profiles, accounts, transactions, categories, budgets, rules, statements)
- Solo úsalo si necesitas el schema completo por alguna razón
- **NO RECOMENDADO** - demasiado complejo

---

## 🚀 Guía de Migración

### Escenario A: Proyecto Nuevo (Sin datos)

```bash
# 1. Ve a Supabase → SQL Editor
# 2. Ejecuta: schema-simple.sql
# 3. Listo! ✅
```

### Escenario B: Tienes datos que quieres conservar

```bash
# 1. Ve a Supabase → SQL Editor
# 2. Ejecuta: migrate-to-simple.sql
# 3. Verifica el mensaje de confirmación con los conteos
# 4. Verifica en Table Editor que tus datos están ahí
```

### Escenario C: Ya ejecutaste schema.sql viejo

```bash
# Opción 1: Migrar con datos
# - Ejecuta: migrate-to-simple.sql

# Opción 2: Empezar de cero
# - Ejecuta: schema-simple.sql
```

---

## 📊 Diferencias Entre Schemas

### Schema Viejo (7 tablas):
```
profiles
accounts
categories
transactions
budgets
categorization_rules
bank_statements
```

### Schema Simplificado (2 tablas):
```
categories
  - Categorías de gastos/ingresos
  - Campos: id, user_id, name, color, type, is_active

transactions
  - Todas las transacciones
  - Campos: id, user_id, category_id, date, vendor, amount, type
  - NUEVO: is_ignored (boolean) para excluir de reportes
```

---

## 🎯 Ventajas del Schema Simplificado

1. **Menos complejidad** - Solo 2 tablas vs 7
2. **Más rápido** - Menos JOINs, queries más simples
3. **Más flexible** - Menos constraints y foreign keys
4. **Ignorar transacciones** - Nueva columna `is_ignored`
5. **Resumen automático** - Vista `monthly_category_summary` con gastos netos

---

## 🔍 Verificación Post-Migración

Después de ejecutar cualquier script, verifica:

```sql
-- 1. Ver tablas creadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Contar registros
SELECT
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM transactions) as transactions_count;

-- 3. Ver políticas RLS
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- 4. Probar la vista
SELECT * FROM monthly_category_summary LIMIT 10;
```

---

## ⚠️ IMPORTANTE

**Antes de ejecutar cualquier migración:**

1. ✅ Haz backup de tus datos si son importantes
2. ✅ Lee el script completo para entender qué hace
3. ✅ Prueba primero en un proyecto de desarrollo/test
4. ✅ Verifica que tienes las credenciales correctas en `.env.local`

**Después de la migración:**

1. ✅ Reinicia tu app Next.js (`Ctrl+C` y `npm run dev`)
2. ✅ Verifica que puedes ver tus datos
3. ✅ Prueba crear una transacción
4. ✅ Prueba marcar una transacción como ignorada
5. ✅ Ve a `/summary` y verifica el resumen mensual

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
- **Causa:** No ejecutaste el script SQL
- **Solución:** Ejecuta `schema-simple.sql` o `migrate-to-simple.sql`

### Error: "permission denied for table"
- **Causa:** Políticas RLS mal configuradas
- **Solución:** Verifica que estás logueado con el usuario correcto

### No veo mis datos después de migrar
- **Causa:** Posiblemente el `user_id` cambió
- **Solución:** Verifica con:
```sql
SELECT DISTINCT user_id FROM transactions;
SELECT id FROM auth.users WHERE email = 'tu@email.com';
```

### La vista `monthly_category_summary` no funciona
- **Causa:** No tienes transacciones o están todas ignoradas
- **Solución:** Verifica:
```sql
SELECT COUNT(*) FROM transactions WHERE is_ignored = false;
```

---

## 📞 Más Ayuda

Si tienes problemas:
1. Revisa los logs de Supabase
2. Verifica que las tablas existen
3. Verifica que las políticas RLS están activas
4. Asegúrate de estar logueado en la app
