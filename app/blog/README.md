# Blog Structure - Ahorrín

Sistema de blog optimizado para SEO con soporte para markdown/MDX.

## Estructura

```
app/blog/
├── page.tsx                 # Blog index (lista de posts)
├── [slug]/
│   └── page.tsx            # Template para posts individuales
└── README.md               # Esta documentación
```

## Agregar un Nuevo Post

### 1. Agregar metadata del post

En `app/blog/page.tsx`, agregar el post al array `blogPosts`:

```typescript
{
  slug: 'tu-slug-aqui',
  title: 'Título del Post',
  excerpt: 'Resumen corto del post (150-160 caracteres para SEO)',
  category: 'Categoría', // Ej: "Educación Financiera", "Bancos Uruguay", etc.
  date: '2025-10-21',
  readTime: '10 min',
  image: '/blog/imagen.jpg',
  author: {
    name: 'Autor',
    avatar: '/avatar.jpg',
  },
}
```

### 2. Agregar contenido del post

En `app/blog/[slug]/page.tsx`, agregar el contenido al objeto `blogPosts`:

```typescript
'tu-slug-aqui': {
  slug: 'tu-slug-aqui',
  title: 'Título del Post',
  excerpt: 'Resumen...',
  content: `
    <h2>Subtítulo 1</h2>
    <p>Contenido del párrafo...</p>

    <h3>Subtítulo nivel 3</h3>
    <ul>
      <li>Punto 1</li>
      <li>Punto 2</li>
    </ul>
  `,
  category: 'Categoría',
  date: '2025-10-21',
  readTime: '10 min',
  author: { ... },
  keywords: ['keyword1', 'keyword2', 'keyword3'],
}
```

### 3. Actualizar sitemap

En `app/sitemap.ts`, agregar el post al array `blogPosts`:

```typescript
{
  slug: 'tu-slug-aqui',
  date: '2025-10-21',
}
```

## SEO Checklist para Cada Post

- [ ] **Título**: 50-60 caracteres, incluye keyword principal
- [ ] **Excerpt**: 150-160 caracteres, persuasivo y con keyword
- [ ] **Keywords**: 3-5 keywords relevantes del keyword research
- [ ] **Categoría**: Asignada correctamente
- [ ] **Contenido**: Mínimo 1,500 palabras para SEO óptimo
- [ ] **Headings**: Estructura H2/H3 lógica con keywords
- [ ] **Internal links**: Enlaces a otras páginas de Ahorrín
- [ ] **CTA**: Call-to-action claro al final
- [ ] **Imagen destacada**: Optimizada (WebP, <100KB)
- [ ] **Alt text**: Descriptivo para imágenes

## Categorías de Blog

1. **Educación Financiera**
   - Presupuestos, ahorro, inversión básica
   - Target: Usuarios principiantes

2. **Bancos Uruguay**
   - Comparativas, comisiones, servicios
   - Target: Keywords geo-específicas

3. **Tecnología**
   - Apps, automatización, IA en finanzas
   - Target: Early adopters, tech-savvy

4. **Consejos**
   - Tips rápidos, trucos, life hacks financieros
   - Target: Quick wins, viral potential

## Mejores Prácticas de Contenido

### Estructura de Post Ideal

```markdown
# Título Principal (H1) - Con Keyword

Introducción convincente (2-3 párrafos) que incluya:
- Hook emocional
- Keyword principal naturalmente
- Preview del valor que recibirán

## Subtítulo 1: El Problema (H2)

Contenido...

## Subtítulo 2: La Solución (H2)

Contenido con:
- Listas numeradas
- Ejemplos concretos
- Screenshots si aplica

## Subtítulo 3: Paso a Paso (H2)

### Paso 1 (H3)
### Paso 2 (H3)
### Paso 3 (H3)

## Conclusión

- Resumen de puntos clave
- CTA claro (probar Ahorrín, crear cuenta)
```

### Keywords en Contenido

- **Keyword principal**: 1-2% densidad
- **Keywords secundarias**: Mencionar 2-3 veces
- **LSI keywords**: Incluir naturalmente
- **Evitar**: Keyword stuffing

### Enlaces Internos

Incluir 3-5 enlaces internos por post a:
- Otras páginas del blog
- Landing pages (/bbva, /scotiabank, etc.)
- Features específicas (/ai, /dashboard)
- Signup/Login cuando relevante

## Migración Futura a MDX

Para escalar, migrar a MDX:

1. Instalar dependencias:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

2. Crear carpeta `content/blog/` con archivos `.mdx`

3. Usar `gray-matter` para frontmatter:
```yaml
---
title: "Título"
excerpt: "Resumen"
date: "2025-10-21"
category: "Categoría"
keywords: ["keyword1", "keyword2"]
---

Contenido en markdown...
```

4. Actualizar `[slug]/page.tsx` para leer archivos MDX

## Analytics & Tracking

Posts deben trackear:
- **Pageviews**: Automático con GA4
- **Read time**: Scroll depth events
- **CTA clicks**: Event tracking en botones
- **Social shares**: Share button events

## Content Calendar

Ver `/docs/content-calendar.md` para el schedule de publicaciones.

## Referencias

- **Keyword Research**: `/docs/keyword-research.md`
- **SEO Guidelines**: Este README
- **Brand Voice**: Casual, uruguayo, accesible
