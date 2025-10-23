# Configuración de Variables de Entorno en Cloudflare Pages

Este documento explica cómo configurar las variables de entorno necesarias para el deploy de Ahorrin en Cloudflare Pages.

## Variables Requeridas

### 1. OpenAI API Key (Para parser LLM con GPT-5-mini)
- **Variable**: `OPENAI_API_KEY`
- **Valor**: Tu API key de OpenAI (comienza con `sk-proj-...`)
- **Uso**: Parser universal de PDFs con GPT-5-mini (más rápido y económico que gpt-4o-mini)

### 2. Supabase (Ya configuradas)
- **Variable**: `NEXT_PUBLIC_SUPABASE_URL`
- **Variable**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Cómo Configurar en Cloudflare Pages

### Opción 1: Dashboard de Cloudflare (Recomendado)

1. **Accede a tu proyecto en Cloudflare Pages**:
   ```
   https://dash.cloudflare.com/ → Workers & Pages → ahorrin-app
   ```

2. **Ve a Settings → Environment Variables**

3. **Agrega las variables**:
   - Click en "Add variable"
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-8pbf...` (tu API key completa)
   - **Environment**: Selecciona "Production" y "Preview" (ambas)
   - Click "Save"

4. **Re-deploy** el proyecto para que tome las nuevas variables:
   - Ve a "Deployments" → Click en "..." → "Retry deployment"
   - O haz un nuevo push al repositorio

### Opción 2: CLI de Wrangler

```bash
# Configurar variable para producción
npx wrangler pages secret put OPENAI_API_KEY --project-name=ahorrin-app

# Cuando te lo pida, pega tu API key
# sk-proj-8pbf...

# Verificar que se configuró correctamente
npx wrangler pages deployment list --project-name=ahorrin-app
```

### Opción 3: Archivo wrangler.toml (NO RECOMENDADO para secrets)

⚠️ **NO agregues API keys al wrangler.toml** ya que se subirían al repositorio.

Solo usa `wrangler.toml` para variables públicas:

```toml
# wrangler.toml - Solo para variables públicas
[env.production.vars]
NEXT_PUBLIC_SUPABASE_URL = "https://fugfefskstsdpiiitkjt.supabase.co"
```

## Verificar Configuración

1. **Después del deploy**, verifica los logs:
   ```bash
   npx wrangler pages deployment tail --project-name=ahorrin-app
   ```

2. **Prueba el endpoint** de parseo de PDF:
   ```bash
   curl -X POST https://tu-app.pages.dev/api/statements/parse-pdf \
     -F "file=@test.pdf"
   ```

3. **Revisa la respuesta**:
   - Si ves `usedLLM: true` → ✅ La API key funciona
   - Si ves error de API key → ❌ Revisa la configuración

## Troubleshooting

### Error: "API key inválida o no configurada"

1. **Verifica que la variable existe**:
   - Dashboard → Settings → Environment Variables
   - Debe aparecer `OPENAI_API_KEY` (el valor estará oculto)

2. **Re-deploy el proyecto**:
   - Las variables nuevas requieren un nuevo deployment

3. **Verifica el runtime**:
   - En `app/api/statements/parse-pdf/route.ts` debe estar:
     ```typescript
     export const maxDuration = 30; // Importante para LLM
     ```

### Error: "Rate limit exceeded"

- Has alcanzado el límite de requests de OpenAI
- Espera unos minutos o aumenta tu límite en OpenAI dashboard

### Error: "Timeout"

- El PDF es muy grande o complejo
- Aumenta `maxDuration` en el route handler:
  ```typescript
  export const maxDuration = 60; // 60 segundos
  ```

## Seguridad

✅ **Buenas prácticas**:
- API keys SOLO en variables de entorno
- Nunca commitear `.env.local` (ya está en `.gitignore`)
- Usar variables diferentes para dev/prod si es posible
- Rotar API keys regularmente

❌ **Nunca hacer**:
- Hardcodear API keys en código
- Subir `.env.local` al repositorio
- Poner secrets en `wrangler.toml`
- Compartir API keys en chat/email

## Costos Estimados

Con esta configuración usando **GPT-5-mini**:
- **Bancos conocidos** (BBVA, Scotia, Itaú): $0.00
- **Bancos desconocidos** (GPT-5-mini): ~$0.005-0.01 por PDF (50% más barato que gpt-4o-mini)
- **Límite recomendado**: $10/mes (≈1000-2000 PDFs desconocidos)

## Links Útiles

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
