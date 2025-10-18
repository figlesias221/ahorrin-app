# 💰 Gasty - Gestor de Gastos Personal con AI

Aplicación web moderna para gestionar tus finanzas personales con categorización automática mediante Inteligencia Artificial.

## 🚀 Estado del Proyecto

✅ **MVP Funcional** - Dashboard con datos mock

### ✅ Features Implementadas

- [x] Dashboard principal con métricas
- [x] Gráficos de tendencias mensuales
- [x] Gráficos de gastos por categoría
- [x] Tabla de transacciones recientes
- [x] Layout responsive con sidebar
- [x] Dark mode support
- [x] UI components basados en TailAdmin

### 🔄 En Desarrollo

- [ ] Autenticación con Supabase
- [ ] CRUD de transacciones
- [ ] CRUD de categorías
- [ ] Categorización automática con OpenAI
- [ ] Upload de extractos bancarios (CSV/PDF)
- [ ] Filtros avanzados
- [ ] Presupuestos y alertas

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (próximamente)
- **AI**: OpenAI API (próximamente)

## 📦 Instalación

```bash
# Clonar el repositorio
cd gasty-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
gasty-app/
├── app/
│   ├── (auth)/              # Rutas de autenticación
│   ├── (dashboard)/         # Rutas del dashboard
│   │   ├── dashboard/       # Página principal
│   │   └── layout.tsx       # Layout con sidebar
│   ├── api/                 # API routes
│   └── globals.css          # Estilos globales
├── components/
│   ├── ui/                  # Componentes UI base
│   ├── charts/              # Componentes de gráficos
│   ├── tables/              # Componentes de tablas
│   └── layout/              # Layout components (sidebar, header)
├── lib/
│   ├── utils/               # Utilidades (formatters, calculators)
│   ├── mock-data.ts         # Datos mock para testing
│   └── supabase/            # Cliente de Supabase
├── types/                   # Definiciones de TypeScript
└── hooks/                   # Custom React hooks
```

## 🎨 Features Destacadas

### Dashboard
- **Metric Cards**: Resumen de ingresos, gastos y balance del mes
- **Trend Chart**: Gráfico de líneas mostrando tendencias mensuales
- **Category Chart**: Gráfico de barras de gastos por categoría
- **Transactions Table**: Lista de transacciones recientes con filtros

### UI/UX
- **Dark Mode**: Soporte automático de tema oscuro
- **Responsive**: Diseño adaptable a móviles, tablets y desktop
- **Iconos**: Lucide React para iconografía consistente
- **Colores Semánticos**: Verde para ingresos, rojo para gastos

## 🔜 Próximos Pasos

### Fase 2: Base de Datos
1. Configurar Supabase
2. Crear schema de base de datos
3. Implementar Row Level Security
4. Integrar autenticación

### Fase 3: Categorización AI
1. Integrar OpenAI API
2. Implementar prompt de categorización
3. Sistema de similarity search
4. Feedback loop de usuario

### Fase 4: Upload de Archivos
1. Parser de CSV
2. Parser de PDF para bancos uruguayos:
   - ITAU
   - BBVA
   - Scotiabank

## 📊 Datos Mock

El proyecto incluye datos mock basados en tu Excel actual:
- 15 transacciones de ejemplo
- 13 categorías predefinidas
- Datos de enero-octubre 2025

## 🤝 Contribuir

Este es un proyecto personal, pero sugerencias son bienvenidas!

## 📄 Licencia

MIT

## 🙏 Créditos

- UI inspirado en [TailAdmin](https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template)
- Built with ❤️ by Federico
