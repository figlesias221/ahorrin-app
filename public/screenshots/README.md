# Screenshots de la App - Guía

Necesitas tomar 6 screenshots de la aplicación para mostrar en la landing page.

## Instrucciones para tomar screenshots:

### Configuración recomendada:
- **Resolución**: 1920x1200 px (16:10 aspect ratio)
- **Formato**: PNG para mejor calidad
- **Navegador**: Chrome/Edge en modo normal (no modo oscuro a menos que quieras mostrarlo)
- **Zoom**: 100% (sin zoom)

### Screenshots a tomar:

#### 1. `dashboard.png`
- **Ruta**: `/dashboard`
- **Qué mostrar**: Vista principal del dashboard con:
  - Cards de resumen (ingresos, gastos, balance)
  - Gráficos de gastos por categoría
  - Mini tabla de transacciones recientes
- **Tip**: Asegúrate de que haya datos para que se vea completo

#### 2. `transactions.png`
- **Ruta**: `/transactions`
- **Qué mostrar**: Tabla completa de transacciones con:
  - Filtros aplicados (mes actual)
  - Varias transacciones visibles con categorías asignadas
  - Los badges de categorías con colores
- **Tip**: Scroll hasta mostrar una buena variedad de transacciones

#### 3. `categories.png`
- **Ruta**: `/categories`
- **Qué mostrar**: Vista de categorías jerárquicas con:
  - Categorías padre expandidas mostrando subcategorías
  - Los totales de gastos por categoría
  - Botones de edición visible
- **Tip**: Expande al menos 2-3 categorías padre

#### 4. `rules.png`
- **Ruta**: `/rules`
- **Qué mostrar**: Lista de reglas configuradas con:
  - Varias reglas visibles (DISCO, ANTEL, UTE, etc.)
  - Las categorías asignadas a cada regla
  - El botón "Nueva regla" visible
- **Tip**: Muestra las reglas más representativas

#### 5. `summary.png`
- **Ruta**: `/summary`
- **Qué mostrar**: Página de reportes/resumen con:
  - Selector de período (mes/año)
  - Gráficos de gastos e ingresos
  - Desglose por categorías
- **Tip**: Selecciona un mes con buenos datos

#### 6. `upload.png`
- **Ruta**: `/upload`
- **Qué mostrar**: Pantalla de upload con:
  - Zona de drag & drop visible
  - Instrucciones claras
  - Opcionalmente: un archivo ya seleccionado o procesándose
- **Tip**: Captura el estado inicial o el momento de procesamiento

---

## Pasos para tomar los screenshots:

1. **Levantar la app localmente**:
   ```bash
   npm run dev
   ```

2. **Navegar a cada ruta** (en el orden de arriba)

3. **Tomar screenshot**:
   - **macOS**: Cmd + Shift + 4 → Espacio → Click en la ventana
   - **Windows**: Win + Shift + S → Seleccionar área
   - **Linux**: Print Screen o Shift + Print Screen

4. **Nombrar exactamente como se indica** (dashboard.png, transactions.png, etc.)

5. **Guardar en esta carpeta** (`/public/screenshots/`)

---

## Una vez que tengas todos los screenshots:

1. En el componente `/components/marketing/app-screenshots.tsx`:
   - **Descomentar** las líneas 55-59 (el componente Image)
   - **Eliminar** las líneas 62-70 (el placeholder)

2. ¡Listo! Los screenshots se mostrarán automáticamente en la landing

---

## Optimización de Imágenes ✅

**COMPLETADO**: Todas las screenshots han sido optimizadas a WebP con ahorros de 66-78%

| Screenshot | PNG Original | WebP Optimizado | Ahorro |
|-----------|--------------|-----------------|--------|
| dashboard | 222KB | 61KB | 72.6% |
| categories | 393KB | 96KB | 75.6% |
| transactions | 352KB | 80KB | 77.2% |
| upload | 327KB | 85KB | 74.0% |
| summary | 199KB | 52KB | 73.7% |
| rules | 326KB | 70KB | 78.6% |

### Cómo usar las imágenes optimizadas:

Usa el componente `OptimizedImage` para servir automáticamente WebP con fallback a PNG:

```tsx
import { OptimizedImage } from '@/components/optimized-image';

<OptimizedImage
  src="/screenshots/dashboard.webp"
  alt="Gasty Dashboard - Vista General Financiera"
  width={1200}
  height={800}
  loading="lazy"
/>
```

### Re-optimizar screenshots nuevos:

Si agregas nuevos screenshots, ejecuta:

```bash
node scripts/optimize-screenshots.mjs
```

Esto generará automáticamente versiones WebP optimizadas.
