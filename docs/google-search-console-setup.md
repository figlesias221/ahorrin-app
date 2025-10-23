# Google Search Console - Setup Guide

Guía completa para configurar Google Search Console y comenzar a monitorear tu SEO.

## 🎯 ¿Qué es Google Search Console?

Google Search Console (GSC) te permite:
- Ver cómo Google indexa tu sitio
- Monitorear keywords que generan tráfico
- Identificar errores técnicos de SEO
- Submit sitemaps manualmente
- Ver CTR y posiciones promedio en Google

---

## Paso 1: Crear Cuenta y Verificar Dominio

### 1.1. Acceder a Search Console

1. Andá a [search.google.com/search-console](https://search.google.com/search-console)
2. Ingresá con tu cuenta de Google
3. Clickeá "Empezar"

### 1.2. Agregar Propiedad

Tenés 2 opciones. **Recomendamos Prefijo de URL** para empezar:

#### Opción A: Prefijo de URL (Más Fácil)
1. Seleccioná "Prefijo de URL"
2. Ingresá: `https://www.ahorrin.app`
3. Clickeá "Continuar"

#### Opción B: Dominio (Más Completo - Opcional)
1. Seleccioná "Dominio"
2. Ingresá: `ahorrin.app`
3. Vas a necesitar acceso al DNS (más complejo)

### 1.3. Verificar Propiedad

Google te da varias opciones de verificación. **Recomendamos la etiqueta HTML**:

#### Método 1: Etiqueta HTML (Recomendado)

1. Google te da un código como:
   ```html
   <meta name="google-site-verification" content="XXXXX..." />
   ```

2. Agregalo al `<head>` de tu sitio en `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  // ... resto del metadata
  verification: {
    google: 'XXXXX...', // Tu código de verificación
  },
};
```

3. Deploy los cambios a producción
4. Volvé a Google Search Console y clickeá "Verificar"

#### Método 2: Archivo HTML (Alternativa)

1. Descargá el archivo HTML que Google te da
2. Subilo a `/public/` en tu proyecto
3. Deploy
4. Verificá en GSC

---

## Paso 2: Submit Sitemap

### 2.1. Agregar Sitemap

1. En Search Console, andá al sidebar → "Sitemaps"
2. En "Agregar un nuevo sitemap" ingresá: `sitemap.xml`
3. Clickeá "Enviar"

**Tu sitemap está en**: `https://www.ahorrin.app/sitemap.xml`

### 2.2. Verificar Sitemap

1. Esperá 5-10 minutos
2. Refrescá la página
3. Deberías ver:
   - ✅ Estado: "Correcto"
   - URLs descubiertas: ~15 (aumentará con el blog)

---

## Paso 3: Solicitar Indexación de Páginas Clave

### 3.1. Indexar Página Principal

1. Andá a "Inspección de URLs" (barra superior)
2. Ingresá: `https://www.ahorrin.app`
3. Clickeá "Solicitar indexación"
4. Esperá la confirmación

### 3.2. Indexar Landing Pages de Bancos

Repetí el proceso para:
- `https://www.ahorrin.app/bbva`
- `https://www.ahorrin.app/scotiabank`
- `https://www.ahorrin.app/itau`

### 3.3. Indexar Blog Posts

Una vez publicados, indexá:
- `https://www.ahorrin.app/blog`
- `https://www.ahorrin.app/blog/organizar-finanzas-personales-uruguay-2025`

**Nota**: Podés solicitar hasta ~10-12 URLs por día.

---

## Paso 4: Configurar Preferencias

### 4.1. Configuración Regional

1. "Configuración" → "Segmentación internacional"
2. Aunque tu sitio está en español, NO configures país específico
3. Google lo detectará automáticamente por el contenido

### 4.2. Configuración de Rastreo

1. "Configuración" → "Estadísticas de rastreo"
2. Monitoreá:
   - Solicitudes de rastreo por día (debe aumentar)
   - Tamaño de descarga promedio
   - Tiempo de descarga

---

## Paso 5: Monitorear Métricas Clave

### 5.1. Rendimiento (Performance)

En "Rendimiento" verás:

| Métrica | Qué Significa | Meta |
|---------|---------------|------|
| **Clics totales** | Usuarios que clickean desde Google | 100+ /mes (3 meses) |
| **Impresiones** | Veces que apareció en Google | 5,000+ /mes (3 meses) |
| **CTR promedio** | % de impresiones que resultan en click | 3-5% |
| **Posición promedio** | Posición en resultados de búsqueda | Top 10 para keywords clave |

### 5.2. Keywords a Monitorear

Filtrá por "Consultas" para ver:

**Primeras semanas** (probablemente):
- "gasty"
- "gasty app"
- "gestor finanzas uruguay"

**Después de 3 meses** (objetivo):
- "app control gastos uruguay"
- "extracto bancario bbva uruguay"
- "categorizar gastos automáticamente"
- "como organizar finanzas personales uruguay"

### 5.3. Páginas Principales

Filtrá por "Páginas" para ver cuáles generan más tráfico:

**Meta 3 meses**:
1. Homepage (`/`)
2. Landing BBVA (`/bbva`)
3. Blog post principal (`/blog/organizar-finanzas...`)

---

## Paso 6: Identificar y Solucionar Problemas

### 6.1. Cobertura (Coverage)

"Cobertura" te muestra:
- ✅ Válidas: URLs indexadas correctamente
- ⚠️ Válidas con advertencias: Indexadas pero con issues menores
- ❌ Error: URLs con problemas
- 🔍 Excluidas: URLs que Google decidió no indexar

**Errores comunes y soluciones**:

| Error | Causa | Solución |
|-------|-------|----------|
| "Enviada, no indexada" | Google la conoce pero no la indexó aún | Esperar o solicitar indexación |
| "Rastreada, sin indexar" | Calidad o contenido duplicado | Mejorar contenido, agregar valor único |
| "Bloqueada por robots.txt" | robots.txt bloquea la URL | Verificar `/robots.ts` |
| "Página con redireccionamiento" | Redirige a otra URL | Verificar si es intencional |

### 6.2. Usabilidad Móvil

1. "Usabilidad móvil" (sidebar)
2. Verificá que todas las páginas sean "Aptas para móviles"
3. Si hay errores:
   - Texto demasiado pequeño
   - Elementos táctiles muy juntos
   - Contenido más ancho que pantalla

**Solución**: Ya estamos usando Tailwind responsive, no deberías tener issues.

### 6.3. Core Web Vitals

"Estadísticas de estado" → "Core Web Vitals"

Métricas importantes:
- **LCP** (Largest Contentful Paint): <2.5s ✅
- **FID** (First Input Delay): <100ms ✅
- **CLS** (Cumulative Layout Shift): <0.1 ✅

Nuestras optimizaciones WebP deberían ayudar mucho con LCP.

---

## Paso 7: Configurar Alertas por Email

### 7.1. Activar Notificaciones

1. "Configuración" → "Usuarios y permisos"
2. Hacé click en tu email
3. Activá:
   - ✅ Avisos de problemas de cobertura
   - ✅ Problemas de seguridad
   - ✅ Todas las notificaciones

### 7.2. Tipos de Alertas

Vas a recibir emails sobre:
- Nuevos errores críticos de indexación
- Problemas de seguridad (malware, phishing)
- Penalizaciones manuales (raro, pero importante)
- Mejoras de usabilidad móvil

---

## Paso 8: Análisis de Competencia (Opcional)

### 8.1. Usar Search Console para Research

1. En "Rendimiento" → "Consultas"
2. Ordená por "Posición" (de peor a mejor)
3. Keywords con:
   - Alta posición (11-20): Oportunidades fáciles de mejorar
   - Altas impresiones, bajo CTR: Mejorar title/description

### 8.2. Keywords de Oportunidad

Buscá keywords donde estás en posición 8-15:
- Pequeñas mejoras pueden llevarte a top 5
- Agregá más contenido sobre ese tema
- Mejorá internal linking

---

## Paso 9: Integración con Google Analytics

### 9.1. Link Accounts

1. En GA4 → "Admin" → "Product links" → "Search Console"
2. Elegí tu propiedad de Search Console
3. Link

Beneficios:
- Ver keywords en GA4
- Analizar conversiones por keyword
- CTR y posiciones en GA4

---

## Paso 10: Rutinas de Monitoreo

### Rutina Semanal (5 minutos)

1. Verificá errores nuevos en "Cobertura"
2. Revisá top 5 keywords en "Rendimiento"
3. Chequeá si hay URLs que cayeron en ranking

### Rutina Mensual (30 minutos)

1. Análisis completo de keywords
2. Identificar oportunidades (posición 8-20)
3. Verificar que todas las páginas nuevas estén indexadas
4. Comparar CTR mes a mes
5. Analizar qué contenido genera más impresiones

---

## Métricas de Éxito - Roadmap

### Mes 1-2: Establecer Baseline
```
Impresiones: 500-1,000
Clics: 20-50
Keywords ranking: 10-15
Posición promedio: 30-50
```

### Mes 3-4: Crecimiento Inicial
```
Impresiones: 3,000-5,000
Clics: 100-200
Keywords ranking: 25+
Posición promedio: 20-30
```

### Mes 5-6: Tracción Visible
```
Impresiones: 8,000-12,000
Clics: 300-500
Keywords ranking: 50+
Posición promedio: 10-20
```

### Mes 12: Objetivo Anual
```
Impresiones: 25,000+
Clics: 1,000+
Keywords ranking: 100+
Posición promedio: 5-10
Featured snippets: 3-5
```

---

## Troubleshooting

### "Propiedad no verificada"

1. Verificá que el meta tag esté en el `<head>`
2. Deploy a producción
3. Esperá 5 minutos y volvé a verificar
4. Usá modo incógnito para verificar que el tag esté en el HTML

### "Sitemap no encontrado"

1. Verificá que `https://www.ahorrin.app/sitemap.xml` funcione en el navegador
2. Chequeá que Next.js esté generando el sitemap
3. Redeploy la app

### "URLs bloqueadas por robots.txt"

1. Verificá `/robots.ts`
2. Asegurate de que las URLs importantes estén en `allow: '/'`
3. Dashboard y auth pages DEBEN estar en disallow

---

## Recursos Adicionales

- [Search Console Help Center](https://support.google.com/webmasters)
- [Google Search Central Blog](https://developers.google.com/search/blog)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

**Última actualización**: Octubre 2025
**Próximo paso**: Monitorear semanalmente y optimizar basándote en datos reales
