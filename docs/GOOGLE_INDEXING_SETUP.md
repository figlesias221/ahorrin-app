# Configuración de Google Indexing API

Esta guía explica cómo configurar la Google Indexing API para solicitar la indexación de URLs en Google Search Console.

## ¿Por qué usar la Indexing API?

- **Más rápido**: Google procesa las solicitudes en horas en vez de días/semanas
- **Control directo**: No esperar a que Google rastree el sitemap
- **Priorización**: Indicar explícitamente qué URLs son importantes
- **Notificaciones**: Informar a Google sobre contenido nuevo o actualizado

## Pasos de Configuración

### 1. Crear Service Account en Google Cloud

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto nuevo (o usar uno existente)
3. Ir a **IAM & Admin** → **Service Accounts**
4. Click **"Create Service Account"**
   - **Name**: `ahorrin-indexing`
   - **Description**: `Service account for Google Indexing API`
5. Click **"Create and Continue"**
6. **Skip** los permisos (no son necesarios para este paso)
7. Click **"Done"**

### 2. Descargar Credenciales JSON

1. En la lista de Service Accounts, click en el email del service account recién creado
2. Ir a la tab **"Keys"**
3. Click **"Add Key"** → **"Create new key"**
4. Seleccionar **JSON**
5. Click **"Create"**
6. Se descargará un archivo JSON con las credenciales

### 3. Guardar Credenciales de forma Segura

**Opción A - Variable de entorno (Recomendado para local)**

```bash
# Mover el archivo a una ubicación segura
mv ~/Downloads/ahorrin-xxxxx.json ~/.config/gcloud/ahorrin-indexing.json

# Agregar a .bashrc o .zshrc
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/ahorrin-indexing.json"

# Recargar shell
source ~/.zshrc  # o ~/.bashrc
```

**Opción B - .env.local (No commitear)**

```bash
# En el root del proyecto
echo 'GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json' >> .env.local
```

**Opción C - Vercel (Para CI/CD)**

1. Ir a Vercel Dashboard → Project Settings → Environment Variables
2. Agregar variable:
   - **Name**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value**: Copiar todo el contenido del JSON
   - **Environment**: Production, Preview, Development

### 4. Habilitar Web Search Indexing API

1. Ir a [API Library](https://console.cloud.google.com/apis/library)
2. Buscar **"Web Search Indexing API"**
3. Click **"Enable"**

### 5. Agregar Service Account a Search Console

Este paso es **CRÍTICO** - sin esto, las solicitudes fallarán:

1. Copiar el email del service account (termina en `@developer.gserviceaccount.com`)
2. Ir a [Google Search Console](https://search.google.com/search-console)
3. Seleccionar la propiedad `https://www.ahorrin.app`
4. Ir a **Settings** → **Users and permissions**
5. Click **"Add user"**
6. Pegar el email del service account
7. Seleccionar permisos: **Owner** (necesario para Indexing API)
8. Click **"Add"**

## Uso del Script

### Verificar Configuración

```bash
# Verificar que la variable de entorno esté configurada
echo $GOOGLE_APPLICATION_CREDENTIALS

# Verificar que el archivo exista
cat $GOOGLE_APPLICATION_CREDENTIALS | jq .project_id
```

### Ejecutar Script de Indexación

```bash
# Desde el root del proyecto
npm run request-indexing
```

El script:
- ✅ Solicita indexación para todos los blogs (14 URLs)
- ✅ Usa `URL_UPDATED` para notificar contenido nuevo/actualizado
- ✅ Incluye delay de 1 segundo entre requests (evitar rate limiting)
- ✅ Muestra progreso y resumen al final

### Output Esperado

```
🚀 Iniciando solicitud de indexación...

📄 Solicitando indexación: https://www.ahorrin.app/blog/afap-uruguay-2025...
✅ Éxito: https://www.ahorrin.app/blog/afap-uruguay-2025...

📄 Solicitando indexación: https://www.ahorrin.app/blog/aguinaldo-uruguay-2025...
✅ Éxito: https://www.ahorrin.app/blog/aguinaldo-uruguay-2025...

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
🔍 Verifica el estado en: https://search.google.com/search-console
```

## Solución de Problemas

### Error: "Permission denied"

**Causa**: El service account no tiene permisos en Search Console

**Solución**:
1. Verificar que el email del service account esté agregado en Search Console
2. Verificar que tenga rol de **Owner** (no Restricted)

### Error: "GOOGLE_APPLICATION_CREDENTIALS not found"

**Causa**: Variable de entorno no configurada

**Solución**:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
```

### Error: "API not enabled"

**Causa**: Web Search Indexing API no está habilitada

**Solución**:
1. Ir a [API Library](https://console.cloud.google.com/apis/library)
2. Buscar "Web Search Indexing API"
3. Click "Enable"

### Error: "Rate limit exceeded"

**Causa**: Demasiadas solicitudes en poco tiempo

**Solución**: El script ya incluye delay de 1 segundo. Si persiste, esperar unas horas.

## Límites de la API

- **Quota diaria**: 200 solicitudes por día (suficiente para nuestro caso)
- **Rate limit**: ~10 requests por segundo (nuestro script usa 1 req/segundo)
- **Tiempo de procesamiento**: Google procesa en horas/días (no instantáneo)

## Verificar Indexación

### Método 1 - Search Console

1. Ir a [Search Console](https://search.google.com/search-console)
2. URL Inspection → Pegar URL del blog
3. Ver estado: "URL is on Google" = indexada

### Método 2 - Google Search

```
site:www.ahorrin.app/blog/nombre-del-blog
```

Si aparece en resultados = indexada

## Agregar Nuevas URLs

Editar `/scripts/request-indexing.ts` y agregar las URLs al array `BLOG_URLS`:

```typescript
const BLOG_URLS = [
  '/blog/url-existente',
  '/blog/nueva-url-para-indexar',  // ← Agregar aquí
];
```

Luego ejecutar:
```bash
npm run request-indexing
```

## Seguridad

⚠️ **IMPORTANTE**:
- **NUNCA** commitear el archivo JSON de credenciales
- **NUNCA** compartir las credenciales públicamente
- Agregar `*.json` (credenciales) a `.gitignore`
- En CI/CD, usar variables de entorno encriptadas

## Referencias

- [Google Indexing API Docs](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [Search Console Help](https://support.google.com/webmasters)
- [Service Account Guide](https://cloud.google.com/iam/docs/service-accounts)
