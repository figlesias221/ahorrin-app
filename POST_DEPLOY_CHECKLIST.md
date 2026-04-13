# Post-Deploy Checklist: Calculadora de Salario Líquido

## ✅ Deploy Status

**Commit:** `a309c4d`
**Branch:** `main`
**Pushed:** ✅ Exitoso

---

## 🔍 Verificaciones Post-Deploy (hacer después de que Vercel termine)

### 1. Funcionalidad Básica

- [ ] **Página principal de herramientas funciona**
  - URL: https://www.ahorrin.app/herramientas
  - Verificar que aparezca la calculadora de salario líquido en primera posición

- [ ] **Calculadora carga correctamente**
  - URL: https://www.ahorrin.app/herramientas/calculadora-salario-liquido
  - Probar ingreso de salario: $80,000
  - Verificar cálculo correcto: ~$65,100 líquido
  - Probar selector de hijos (0, 1, 2+)
  - Probar comparador de escenarios

- [ ] **Landing page actualizada**
  - URL: https://www.ahorrin.app
  - Scroll hasta sección "Herramientas Gratuitas"
  - Verificar que muestre 4 herramientas en grid
  - Badge "Nuevo" visible en calculadora salario

- [ ] **Blog post publicado**
  - URL: https://www.ahorrin.app/blog/calculadora-salario-liquido-uruguay-2025-irpf-bps-fonasa
  - Verificar formato MDX correcto
  - CTAs clicables hacia calculadora

---

### 2. SEO y Metadata

- [ ] **OG Image generado correctamente**
  - URL directa: https://www.ahorrin.app/herramientas/calculadora-salario-liquido/opengraph-image
  - Debe mostrar imagen PNG 1200x630
  - Diseño verde emerald con ejemplo $80k → $65.1k

- [ ] **Meta tags en HTML**
  ```bash
  curl -s https://www.ahorrin.app/herramientas/calculadora-salario-liquido | grep -i "og:image"
  ```
  - Debe incluir: `<meta property="og:image" content="...opengraph-image"`

- [ ] **Sitemap actualizado**
  - URL: https://www.ahorrin.app/sitemap.xml
  - Buscar: `/herramientas/calculadora-salario-liquido`
  - Priority debe ser: 0.95

- [ ] **Schema.org markup presente**
  ```bash
  curl -s https://www.ahorrin.app/herramientas/calculadora-salario-liquido | grep "WebApplication"
  ```
  - Debe incluir `@type: WebApplication`
  - Debe incluir `@type: FAQPage`

---

### 3. Social Media Preview

- [ ] **Facebook Sharing Debugger**
  1. Ir a: https://developers.facebook.com/tools/debug/
  2. Ingresar: `https://www.ahorrin.app/herramientas/calculadora-salario-liquido`
  3. Click "Scrape Again"
  4. Verificar:
     - ✅ Título correcto
     - ✅ Descripción completa
     - ✅ Imagen OG visible (1200x630)

- [ ] **Twitter Card Validator**
  1. Ir a: https://cards-dev.twitter.com/validator
  2. Ingresar URL
  3. Verificar preview card correcta

- [ ] **LinkedIn Post Inspector**
  1. Ir a: https://www.linkedin.com/post-inspector/
  2. Ingresar URL
  3. Verificar preview

- [ ] **Opengraph.xyz**
  1. Ir a: https://www.opengraph.xyz/
  2. Ingresar URL
  3. Ver preview en múltiples plataformas

---

### 4. Performance y UX

- [ ] **Lighthouse Score**
  - Abrir DevTools → Lighthouse
  - Correr audit en: https://www.ahorrin.app/herramientas/calculadora-salario-liquido
  - Target scores:
    - Performance: >90
    - Accessibility: >95
    - Best Practices: >95
    - SEO: 100

- [ ] **Mobile Responsive**
  - Abrir en móvil o DevTools mobile view
  - Verificar calculadora funciona en mobile
  - Free Tools Showcase responsive (1 columna)

- [ ] **Animaciones Framer Motion**
  - Verificar hover effects en cards
  - Transitions smooth
  - No lag en animaciones

---

### 5. Google Search Console (24-48 horas después)

- [ ] **Submit URL para indexación**
  ```
  URL: https://www.ahorrin.app/herramientas/calculadora-salario-liquido
  ```
  1. Ir a Google Search Console
  2. URL Inspection
  3. Request Indexing

- [ ] **Submit nuevo sitemap**
  ```
  Sitemap: https://www.ahorrin.app/sitemap.xml
  ```

- [ ] **Monitor impresiones (después de 7 días)**
  - Query: "calculadora salario liquido uruguay"
  - Query: "salario liquido uruguay 2025"
  - Query: "cuanto me queda de sueldo uruguay"

---

### 6. Analytics Tracking

- [ ] **Google Analytics Events**
  - Verificar pageview en `/herramientas/calculadora-salario-liquido`
  - Engagement time (target: >2 min)
  - Bounce rate (target: <40%)

- [ ] **Vercel Analytics**
  - Dashboard → Analytics
  - Verificar nueva ruta aparece

- [ ] **Conversión tracking**
  - Usuarios que van de calculadora → `/signup`
  - Click en CTAs dentro del blog post

---

### 7. Enlaces Internos

- [ ] **Navegación desde landing**
  - `/` → "Ver todas las herramientas" → `/herramientas`
  - `/herramientas` → Click en card "Calculadora Salario"

- [ ] **Blog post links**
  - Blog → 3 CTAs hacia calculadora funcionan
  - Link a `/herramientas` funciona
  - Link a `/signup` funciona

---

## 🐛 Troubleshooting

### Si OG image no aparece:
1. Verificar que Vercel lo generó: `/herramientas/calculadora-salario-liquido/opengraph-image`
2. Limpiar cache de Facebook: Use Sharing Debugger "Scrape Again"
3. Check console de Vercel por errores en build

### Si calculadora no funciona:
1. Abrir DevTools → Console
2. Buscar errores JS
3. Verificar que Framer Motion cargó correctamente

### Si no indexa en Google:
1. Wait 7-14 días
2. Request indexing manualmente en GSC
3. Compartir en redes sociales (backlinks)

---

## 📊 KPIs a Monitorear (primeras 4 semanas)

| Métrica | Target | Dónde medirlo |
|---------|--------|---------------|
| Pageviews calculadora | 100+/semana | GA4 |
| Time on page | >2 min | GA4 |
| Bounce rate | <40% | GA4 |
| Impresiones "calculadora salario" | 500+/mes | GSC |
| CTR desde SERP | >5% | GSC |
| Conversión calculadora → signup | 2-5% | GA4 Funnels |
| Shares en redes | 10+/mes | Manual tracking |
| Posición en Google | Top 10 en 30 días | GSC / Manual |

---

## 🎯 Próximos Pasos Sugeridos

### Semana 1-2:
- [ ] Monitor GSC para primeras impresiones
- [ ] Compartir calculadora en r/uruguay (no spam, valor real)
- [ ] Post en LinkedIn profesional
- [ ] Email a usuarios existentes (si tenés lista)

### Semana 3-4:
- [ ] Analizar keywords que están funcionando
- [ ] Optimizar meta description si CTR bajo
- [ ] Considerar Google Ads para acelerar tráfico
- [ ] Implementar siguiente herramienta (Gastos Hormiga)

### Mes 2:
- [ ] Guest post en blogs uruguayos (backlink)
- [ ] Crear video tutorial (YouTube SEO)
- [ ] A/B test CTA buttons
- [ ] Expandir FAQ basado en queries reales

---

## ✅ Quick Wins Inmediatos

1. **Compartir en tu red LinkedIn/Twitter ahora mismo**
   - Copy: "¿Cuánto te queda después de impuestos? Nueva calculadora actualizada 2025 🇺🇾"
   - Link: https://www.ahorrin.app/herramientas/calculadora-salario-liquido

2. **Submit a directorios de herramientas**
   - Product Hunt (si aplica)
   - BetaList
   - Directorios de fintech LATAM

3. **Email signature**
   - Agregar: "🧮 Calculá tu salario líquido: ahorrin.app/herramientas"

---

**Deploy completado:** ✅
**Checklist actualizada:** {{ fecha }}
**Responsible:** Federico Iglesias
