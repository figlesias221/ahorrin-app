# 🚀 Guía Rápida: Indexar Blogs en Google

**TL;DR**: Script listo para enviar tus 14 blogs a Google para indexación rápida.

## Setup Rápido (5 minutos)

### 1. Crear Service Account

1. Ir a https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Create Service Account**
3. Name: `ahorrin-indexing` → **Create**
4. Skip permisos → **Done**
5. Click en el email recién creado
6. **Keys** tab → **Add Key** → **Create new key** → **JSON**
7. Se descarga `ahorrin-xxxxx.json`

### 2. Habilitar API

1. Ir a https://console.cloud.google.com/apis/library
2. Buscar **"Web Search Indexing API"**
3. Click **Enable**

### 3. Dar Permisos en Search Console

1. Copiar el email del service account (algo como `ahorrin-indexing@project.iam.gserviceaccount.com`)
2. Ir a https://search.google.com/search-console
3. Seleccionar propiedad `ahorrin.app`
4. **Settings** → **Users and permissions** → **Add user**
5. Pegar email del service account
6. Rol: **Owner** ⚠️ (crítico - no funciona con otros roles)
7. **Add**

### 4. Configurar Credenciales

**Opción A - Variable de entorno (recomendado)**

```bash
# Mover archivo a ubicación segura
mkdir -p ~/.config/gcloud
mv ~/Downloads/ahorrin-*.json ~/.config/gcloud/ahorrin-indexing.json

# Agregar a tu shell config (.zshrc o .bashrc)
echo 'export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/ahorrin-indexing.json"' >> ~/.zshrc

# Recargar
source ~/.zshrc
```

**Opción B - .env.local**

```bash
echo 'GOOGLE_APPLICATION_CREDENTIALS=/path/completo/a/credentials.json' >> .env.local
```

### 5. Ejecutar Script

```bash
npm run request-indexing
```

## ¿Qué hace el script?

- Envía 14 URLs de blogs a Google Indexing API
- Notifica que el contenido fue actualizado (`URL_UPDATED`)
- Delay de 1 segundo entre requests (evitar rate limit)
- Muestra progreso en tiempo real

## Output esperado:

```
🚀 Iniciando solicitud de indexación...

📄 Solicitando indexación: https://www.ahorrin.app/blog/afap-uruguay-2025...
✅ Éxito: https://www.ahorrin.app/blog/afap-uruguay-2025...

...

============================================================
📊 RESUMEN DE INDEXACIÓN
============================================================
✅ Exitosas: 14
❌ Errores: 0
📝 Total: 14
============================================================

🎉 Solicitudes enviadas exitosamente!
⏱️  Google procesará las URLs en las próximas horas/días.
```

## Errores Comunes

### ❌ "Permission denied"
→ Verificar que el service account tenga rol **Owner** en Search Console

### ❌ "GOOGLE_APPLICATION_CREDENTIALS not found"
→ Verificar variable de entorno: `echo $GOOGLE_APPLICATION_CREDENTIALS`

### ❌ "API not enabled"
→ Habilitar "Web Search Indexing API" en Google Cloud Console

## Verificar Indexación

**En Search Console:**
1. Ir a https://search.google.com/search-console
2. URL Inspection → pegar URL de blog
3. Ver estado de indexación

**En Google:**
```
site:www.ahorrin.app/blog/nombre-del-blog
```

## Próximos Pasos

- Google procesará las solicitudes en las próximas horas/días
- Revisar Search Console después de 24-48 horas
- Las URLs aparecerán en resultados de búsqueda gradualmente

## Agregar Nuevos Blogs

Editar `scripts/request-indexing.ts` → agregar URL al array → ejecutar script.

---

**📖 Guía completa**: Ver `docs/GOOGLE_INDEXING_SETUP.md` para más detalles.
