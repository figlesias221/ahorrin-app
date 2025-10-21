# 💰 Gasty - Gestor de Gastos Personal con AI

Aplicación web moderna para gestionar tus finanzas personales en Uruguay con categorización automática mediante Inteligencia Artificial.

🌐 **Live**: [www.gasty.app](https://www.gasty.app)

## 🚀 Estado del Proyecto

✅ **MVP Funcional + SEO Optimizado** - Aplicación completa con marketing profesional

### ✅ Features Implementadas

**Core Features:**
- [x] Autenticación completa con Supabase (email + Google OAuth)
- [x] Dashboard principal con métricas en tiempo real
- [x] Gráficos de tendencias mensuales y por categoría
- [x] CRUD completo de transacciones y categorías
- [x] Categorización automática con OpenAI GPT-4
- [x] Upload de extractos bancarios (CSV, Excel, PDF)
- [x] Reglas de categorización personalizadas
- [x] AI Chat Assistant para análisis financiero
- [x] Filtros avanzados y búsqueda
- [x] Exportación de datos (Excel, CSV)
- [x] Layout responsive con sidebar
- [x] Dark mode support completo

**Marketing & SEO:**
- [x] SEO técnico profesional (Schema.org, meta tags, OpenGraph)
- [x] Google Analytics 4 con eventos personalizados
- [x] Blog con MDX y sistema de categorías
- [x] Landing pages específicas por banco (BBVA, Scotia, Itaú)
- [x] Sitemap dinámico y robots.txt optimizado
- [x] 87+ keywords investigadas y optimizadas
- [x] Imágenes optimizadas en WebP (70% reducción)
- [x] Core Web Vitals optimizados

### 🔄 En Desarrollo

- [ ] Mobile app (React Native)
- [ ] Presupuestos y alertas avanzadas
- [ ] Integración directa con bancos (Open Banking)
- [ ] Dashboard de inversiones
- [ ] Reportes PDF personalizados

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-4 + AI SDK
- **Analytics**: Google Analytics 4
- **Hosting**: Vercel
- **Content**: MDX para blog posts
- **SEO**: Schema.org structured data

## 📦 Instalación

```bash
# Clonar el repositorio
cd gasty-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - OPENAI_API_KEY
# - NEXT_PUBLIC_GA_MEASUREMENT_ID (opcional)

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

**📋 Setup Completo**: Ver `docs/SETUP.md` para configuración de Google Analytics y Search Console.

## 📁 Estructura del Proyecto

```
gasty-app/
├── app/
│   ├── (auth)/              # Rutas de autenticación (login, signup)
│   ├── (dashboard)/         # Rutas del dashboard (transacciones, categorías, etc.)
│   ├── (marketing)/         # Landing page y páginas públicas
│   ├── blog/                # Blog con MDX posts
│   ├── bbva/                # Landing page BBVA
│   ├── scotiabank/          # Landing page Scotiabank
│   ├── itau/                # Landing page Itaú
│   ├── api/                 # API routes (chat AI, upload, parse)
│   ├── sitemap.ts           # Sitemap dinámico
│   ├── robots.ts            # Robots.txt dinámico
│   └── globals.css          # Estilos globales
├── components/
│   ├── ui/                  # Componentes UI base
│   ├── charts/              # Componentes de gráficos
│   ├── tables/              # Componentes de tablas
│   ├── layout/              # Layout components (sidebar, header)
│   ├── marketing/           # Componentes de marketing (hero, features, CTA)
│   ├── analytics/           # Google Analytics tracking
│   └── ai/                  # AI Chat components
├── lib/
│   ├── utils/               # Utilidades (formatters, calculators)
│   ├── supabase/            # Cliente de Supabase + database types
│   ├── parsers/             # Parsers para extractos bancarios
│   └── ai/                  # Herramientas de AI
├── content/
│   └── blog/                # Blog posts en Markdown
├── docs/                    # Documentación (SEO, setup, keywords)
├── types/                   # Definiciones de TypeScript
└── hooks/                   # Custom React hooks
```

## 🎨 Features Destacadas

### 💰 Dashboard & Análisis
- **Metric Cards**: Resumen de ingresos, gastos y balance del mes
- **Trend Charts**: Gráficos de líneas, barras, dona, radar con tendencias
- **Category Analysis**: Análisis detallado por categoría con drill-down
- **Transactions Table**: Lista completa con filtros, búsqueda y paginación
- **AI Assistant**: Chat inteligente para análisis financiero en español

### 📊 Gestión de Datos
- **Import Automático**: Sube extractos de BBVA, Scotia, Itaú (PDF, Excel, CSV)
- **Categorización AI**: GPT-4 categoriza automáticamente tus transacciones
- **Reglas Personalizadas**: Crea reglas para auto-categorizar transacciones futuras
- **Bulk Edit**: Edita múltiples transacciones a la vez
- **Export**: Descarga tus datos en Excel o CSV

### 🎯 SEO & Marketing
- **Schema.org Markup**: FAQPage, HowTo, SoftwareApplication, BreadcrumbList
- **Blog Optimizado**: Artículos SEO-friendly con MDX
- **Landing Pages**: Páginas específicas por banco con keywords optimizadas
- **87+ Keywords**: Investigación exhaustiva para el mercado uruguayo
- **Google Analytics 4**: Tracking completo de eventos y conversiones

### 🎨 UI/UX
- **Dark Mode**: Soporte completo de tema oscuro con transiciones suaves
- **Responsive**: Diseño adaptable a móviles, tablets y desktop
- **Iconos**: Lucide React para iconografía consistente
- **Colores Semánticos**: Verde para ingresos, rojo para gastos
- **Optimizaciones**: WebP images, lazy loading, Core Web Vitals

## 📈 SEO & Content Strategy

### Content Calendar
- **6 meses planificados**: 15 artículos de alto valor SEO
- **Pillar content**: Guías exhaustivas de 2,500+ palabras
- **Comparativas**: Análisis de bancos uruguayos
- **Quick tips**: Consejos prácticos y accionables

### Keyword Research
- **87 keywords** identificadas y priorizadas
- **Primary keywords**: finanzas personales, control de gastos, app finanzas
- **Long-tail**: app control gastos uruguay, categorizar gastos automáticamente
- **Bank-specific**: extracto bancario bbva uruguay, scotiabank comisiones

### Expected SEO Growth
| Métrica | Mes 1 | Mes 3 | Mes 6 |
|---------|-------|-------|-------|
| Impresiones | 500 | 5,000 | 12,000 |
| Clicks | 20 | 150 | 500 |
| Keywords ranking | 10 | 30 | 50+ |
| Posición promedio | 30-50 | 20-30 | 10-20 |

**📖 Documentación**: Ver `docs/` para guías completas de SEO, analytics y content strategy.

## 📊 Analytics & Tracking

### Google Analytics 4
- **10+ eventos personalizados** trackeados
- **Conversiones**: signup, file_upload, create_rule, export_data
- **Scroll depth tracking**: 25%, 50%, 75%, 100%
- **Audiencias**: Usuarios activos, Power users, Usuarios inactivos

### Métricas Clave
- **Tasa de activación**: % usuarios que suben extracto
- **Retención**: Usuarios activos mes a mes
- **Engagement**: Promedio de eventos por usuario
- **Conversión por banco**: Preferencias de bancos

## 🚀 Deployment

La aplicación está deployada en Vercel con las siguientes configuraciones:

- **Domain**: www.gasty.app
- **SSL**: Automático via Vercel
- **Environment Variables**: Configuradas en Vercel Dashboard
- **Auto-deploy**: Push a `main` → deploy automático

### Deploy Manual

```bash
# Vercel CLI
npm i -g vercel
vercel --prod
```

## 📚 Documentación

- `docs/SETUP.md` - Setup de Google Analytics y Search Console
- `docs/google-analytics-setup.md` - Guía completa de GA4
- `docs/google-search-console-setup.md` - Guía completa de GSC
- `docs/keyword-research.md` - Investigación de keywords
- `docs/content-calendar-2025.md` - Calendario editorial 6 meses
- `docs/MARKETING_SEO_SUMMARY.md` - Resumen de trabajo SEO completo

## 🤝 Contribuir

Este es un proyecto personal, pero sugerencias son bienvenidas!

## 📄 Licencia

MIT

## 🙏 Créditos

- UI inspirado en [TailAdmin](https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template)
- Built with ❤️ by Federico Iglesias
- AI-powered by OpenAI GPT-4
- Hosted on Vercel
