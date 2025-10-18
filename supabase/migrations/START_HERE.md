# 🚀 Setup Completo - Sistema de Paquetes de Templates

Ejecuta estos **4 archivos en orden** en **Supabase SQL Editor**:

---

## 📋 Paso 1: Crear Template System

**Archivo:** `01_create_template_system.sql`

**Qué hace:**
- Crea la tabla `template_categorization_rules`
- Inserta 22 reglas predefinidas base (Uruguay)

**Ejecutar:**
```
Supabase Dashboard → SQL Editor → Pegar contenido → Run
```

**Resultado esperado:**
```
✅ Created template_categorization_rules table
✅ Inserted 22 template rules
```

---

## 📋 Paso 2: Crear Funciones SQL

**Archivo:** `02_create_functions.sql`

**Qué hace:**
- Crea `get_template_rules_summary(package_id)` - Obtiene resumen
- Crea `copy_template_rules_to_user(user_id, package_id)` - Copia reglas
- Da permisos necesarios

**Ejecutar:**
```
Supabase Dashboard → SQL Editor → Pegar contenido → Run
```

**Resultado esperado:**
```
✅ Created 2 SQL functions successfully
```

---

## 📋 Paso 3: Exportar Reglas de Usuario

**Archivo:** `03_export_user_rules_to_templates.sql`

**Qué hace:**
- Busca usuario `figlesias221` (o actualiza el email en el script)
- Exporta sus reglas existentes como templates
- Las marca como paquete personalizado

**Ejecutar:**
```
Supabase Dashboard → SQL Editor → Pegar contenido → Run
```

**Resultado esperado:**
```
✅ Found user: [uuid]
✅ Exported X rules from user to templates
Summary by category:
  • Restaurantes (expense) - 10 rules
  • ...
```

**⚠️ IMPORTANTE:** Si el script no encuentra al usuario, actualiza la línea 13:
```sql
WHERE email LIKE '%TU_EMAIL_AQUI%'
```

---

## 📋 Paso 4: Crear Sistema de Paquetes

**Archivo:** `04_create_template_packages.sql`

**Qué hace:**
- Crea tabla `template_packages`
- Define 2 paquetes:
  - **🇺🇾 Paquete Base Uruguay** (reglas predefinidas)
  - **⭐ Mis Reglas Personales** (de figlesias221)
- Actualiza funciones para soportar selección de paquetes
- Crea función `get_template_packages()` para listar opciones

**Ejecutar:**
```
Supabase Dashboard → SQL Editor → Pegar contenido → Run
```

**Resultado esperado:**
```
========================================
✅ TEMPLATE PACKAGES CREATED!
========================================

Packages available: 2
  • default (Uruguay Base): 22 rules
  • figlesias221 (Personal): X rules

Functions updated:
  • get_template_packages()
  • get_template_rules_summary(package_id)
  • copy_template_rules_to_user(user_id, package_id)

🎉 Users can now choose between packages!
```

---

## 🔄 Paso 5: Reiniciar App

En tu terminal:
```bash
# Detener servidor (Ctrl+C)
# Reiniciar
npm run dev
```

---

## 🎨 Paso 6: Probar Onboarding

1. Abre http://localhost:3000
2. **Logout** si ya tienes sesión
3. **Signup** con cuenta nueva
4. ¡Deberías ver 2 paquetes para elegir!

**Pantalla de Onboarding mostrará:**
```
┌────────────────────────┐  ┌────────────────────────┐
│ 🇺🇾 Paquete Base      │  │ ⭐ Mis Reglas         │
│    Uruguay             │  │    Personales          │
│                        │  │                        │
│ 22 reglas incluidas    │  │ X reglas incluidas     │
│ Supermercados, etc.    │  │ Personalizadas         │
└────────────────────────┘  └────────────────────────┘

[ Usar Paquete Seleccionado ]  [ Empezar desde Cero ]
```

---

## ✅ Verificación Completa

Ejecuta en **SQL Editor** para verificar:

```sql
-- 1. Ver paquetes disponibles
SELECT * FROM get_template_packages();

-- 2. Ver resumen del paquete base
SELECT * FROM get_template_rules_summary('default');

-- 3. Ver resumen del paquete personalizado
SELECT * FROM get_template_rules_summary('figlesias221');

-- 4. Ver todas las reglas por paquete
SELECT package_id, category_name, COUNT(*) as rules
FROM template_categorization_rules
WHERE is_active = true
GROUP BY package_id, category_name
ORDER BY package_id, rules DESC;
```

---

## 🎯 Cómo Funciona

### Para Usuarios Nuevos:

1. Usuario hace signup
2. Se le redirige a `/onboarding`
3. Ve 2 opciones de paquetes:
   - **🇺🇾 Uruguay Base**: Reglas genéricas para Uruguay
   - **⭐ Personal**: Reglas basadas en tus hábitos (figlesias221)
4. Selecciona uno
5. Se copian todas las categorías y reglas del paquete
6. ¡Listo para usar! 🎉

### Para Agregar Más Paquetes:

```sql
-- 1. Insertar reglas con nuevo package_id
INSERT INTO template_categorization_rules
  (name, category_name, category_type, rule_type, match_value, priority, package_id)
VALUES
  ('Mi regla', 'Categoria', 'expense', 'vendor_contains', 'VENDOR', 90, 'mi_paquete');

-- 2. Registrar el paquete
INSERT INTO template_packages (id, name, description, icon, author)
VALUES ('mi_paquete', 'Mi Paquete', 'Descripción', '🎁', 'Autor');
```

---

## 🆘 Troubleshooting

### Error: "User not found" en Paso 3
**Solución:**
1. Busca tu usuario:
   ```sql
   SELECT id, email FROM auth.users;
   ```
2. Actualiza línea 13 del script:
   ```sql
   WHERE email LIKE '%tu_email_aqui%'
   ```

### Error: "Could not find function"
**Solución:**
1. Ejecuta archivos en orden (1 → 2 → 3 → 4)
2. Reinicia tu app
3. Hard refresh (Cmd+Shift+R)

### No veo el paquete personalizado
**Causas posibles:**
1. No ejecutaste paso 3 (export)
2. Usuario no tiene reglas para exportar
3. No ejecutaste paso 4 (packages)

**Verificar:**
```sql
SELECT COUNT(*) FROM template_categorization_rules WHERE package_id = 'figlesias221';
-- Debe ser > 0
```

### Onboarding muestra solo 1 paquete
**Causa:** Paso 3 o 4 no se ejecutó correctamente

**Solución:**
```sql
-- Ver qué paquetes existen
SELECT * FROM template_packages WHERE is_active = true;

-- Ver cuántas reglas tiene cada paquete
SELECT package_id, COUNT(*) FROM template_categorization_rules
WHERE is_active = true GROUP BY package_id;
```

---

## 📁 Resumen de Archivos

### ✅ USAR (en orden):
1. `01_create_template_system.sql` - Base de templates
2. `02_create_functions.sql` - Funciones SQL
3. `03_export_user_rules_to_templates.sql` - Exportar usuario
4. `04_create_template_packages.sql` - Sistema de paquetes

### 📖 DOCS:
- `START_HERE.md` - Este archivo
- `README_SETUP.md` - Guía detallada

### ❌ IGNORAR (obsoletos):
- Todos los demás archivos `add_*.sql` y `create_*.sql`

---

## 🎉 ¡Listo!

Después de seguir todos los pasos:
- ✅ Sistema de paquetes funcionando
- ✅ 2 paquetes disponibles (Base + Personal)
- ✅ Usuarios pueden elegir en onboarding
- ✅ Fácil agregar más paquetes

**Next steps:**
- Agrega más paquetes personalizados
- Crea paquetes temáticos (estudiantes, freelancers, etc.)
- Permite a usuarios compartir sus reglas

---

**¿Problemas?**
- Browser console (F12)
- Terminal (npm run dev logs)
- Supabase Dashboard → Logs
