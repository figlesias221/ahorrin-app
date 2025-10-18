# 🚀 Configuración Completa de la Base de Datos

Sigue estos pasos **en orden** para configurar tu base de datos Supabase completamente.

---

## 🔍 Paso 0: Verificar Estado Actual (OPCIONAL)

Si quieres ver qué te falta, ejecuta en **Supabase Dashboard** → **SQL Editor**:

```
VERIFY.sql
```

Esto te mostrará qué tablas, columnas y funciones faltan.

---

## 📋 Paso 1: Ejecutar Migración Completa

Ve a **Supabase Dashboard** → **SQL Editor** y ejecuta este archivo:

```
complete_setup.sql
```

Este archivo crea:
- ✅ Columna `currency` en `transactions`
- ✅ Tabla `bank_statements` con todas las columnas
- ✅ Columna `statement_id` en `transactions`
- ✅ Tabla `categorization_rules`
- ✅ Tabla `template_categorization_rules` con 22 reglas predefinidas
- ✅ Funciones SQL para copiar reglas

**Resultado esperado**: Verás un mensaje como:
```
✅ MIGRATION COMPLETE!
Tables: 5 of 5 created
Template rules: 22 loaded
```

---

## 📋 Paso 2: Arreglar Funciones RPC

Si ves el error:
```
Could not find the function public.copy_template_rules_to_user
```

Ejecuta este archivo en **SQL Editor**:

```
fix_rpc_functions.sql
```

Esto recrea las funciones SQL para que Supabase-js pueda encontrarlas.

**Resultado esperado**:
```
✅ Functions created successfully!
Available functions:
  - copy_template_rules_to_user(p_user_id UUID)
  - get_template_rules_summary()
```

---

## 📋 Paso 3: Reiniciar App

1. En tu terminal, presiona `Ctrl+C` para detener el servidor
2. Ejecuta de nuevo:
   ```bash
   npm run dev
   ```

---

## 📋 Paso 4: Probar Onboarding

1. Abre http://localhost:3000
2. Si ya tienes cuenta, **cierra sesión** (logout)
3. Crea una **cuenta nueva** (signup)
4. Deberías ver la pantalla de **Onboarding** con:
   - Opción para copiar 22 reglas predefinidas
   - Resumen de categorías incluidas (Restaurantes, Transporte, etc.)
   - Opción para "Empezar desde Cero"

---

## ✅ Verificación

Para verificar que todo está correcto, ejecuta en **SQL Editor**:

```sql
-- 1. Verificar tablas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('categories', 'transactions', 'bank_statements', 'categorization_rules', 'template_categorization_rules')
ORDER BY table_name;

-- Resultado esperado: 5 filas

-- 2. Verificar template rules
SELECT COUNT(*) as total_rules FROM template_categorization_rules;

-- Resultado esperado: 22

-- 3. Verificar funciones
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('copy_template_rules_to_user', 'get_template_rules_summary');

-- Resultado esperado: 2 filas

-- 4. Probar función de resumen
SELECT * FROM get_template_rules_summary();

-- Resultado esperado: JSON con categorías y conteos
```

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
**Causa**: No ejecutaste `complete_setup.sql`

**Solución**: Ejecuta `complete_setup.sql` primero

---

### Error: "Could not find function"
**Causa**: Supabase no refrescó el schema cache

**Solución**:
1. Ejecuta `fix_rpc_functions.sql`
2. Reinicia tu app Next.js
3. Si persiste, ve a Supabase Dashboard → Database → Functions y verifica que las funciones existan

---

### Onboarding no aparece
**Causa**: Ya tienes categorías en tu cuenta

**Solución**: La lógica solo muestra onboarding a usuarios nuevos sin categorías. Si quieres probarlo:
1. Elimina tus categorías existentes (o usa otra cuenta)
2. O visita directamente http://localhost:3000/onboarding

---

### Error: "Error loading template summary"
**Causa**: La función `get_template_rules_summary()` no existe

**Solución**: Ejecuta `fix_rpc_functions.sql`

---

## 📁 Archivos de Migración

Usa estos archivos en este orden:

1. ✅ **complete_setup.sql** - Setup completo (ejecutar primero)
2. ✅ **fix_rpc_functions.sql** - Fix para funciones RPC (si es necesario)
3. ℹ️ **check_migration_status.sql** - Para verificar estado (opcional)

**OBSOLETOS** (no usar):
- ❌ `safe_complete_migration.sql` - Reemplazado por `complete_setup.sql`
- ❌ `add_*.sql` - Ya incluidos en `complete_setup.sql`
- ❌ `create_*.sql` - Ya incluidos en `complete_setup.sql`

---

## 🎉 ¡Listo!

Después de seguir estos pasos:
- ✅ Base de datos completamente configurada
- ✅ 22 reglas de auto-categorización disponibles
- ✅ Sistema de onboarding funcionando
- ✅ Usuarios nuevos podrán empezar rápidamente

Si tienes problemas, revisa los logs de:
- **Browser console** (F12)
- **Terminal** (donde corre `npm run dev`)
- **Supabase logs** (Dashboard → Logs)
