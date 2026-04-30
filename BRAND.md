# Ahorrin — Brand Identity & Craft Rules

> Inspirado en la disciplina de Nothing (Colophon foundry, instrument-panel
> typography) sobre la base de marca de Ahorrin (emerald + warmth + dual
> light/dark). El objetivo no es copiar Nothing; es importar su rigor.

---

## 1. Voz visual en una frase

**Calma técnica.** Datos legibles, espacio que respira, una sola sorpresa por
pantalla. Nada decorativo: cada borde, padding, tracking gana su lugar. El
verde esmeralda es la marca; el monoespaciado en mayúsculas es la firma.

---

## 2. Tipografía

| Rol | Fuente | Cuándo |
| --- | --- | --- |
| Display / body | **DM Sans** (`font-sans`) | Títulos, copy, casi todo |
| Labels / data | **Space Mono** (`font-mono`) | Categorías, fechas, "Última revisión", abreviaturas, `12,3%`, números puros |

### Reglas duras

1. **Máximo 2 familias por pantalla.** DM Sans + Space Mono. No agregues una tercera.
2. **Máximo 3 tamaños y 2 pesos** por pantalla. Si necesitás un cuarto, probablemente sea un problema de spacing, no de tipografía.
3. **Labels en `font-mono uppercase tracking-widest`** — siempre. Categoría de blog, "ÚLTIMA REVISIÓN", "VER TAMBIÉN", role del autor, abreviatura del término. Tamaño típico `text-[11px]` o `text-xs`.
4. **Datos numéricos en `font-mono`** — fechas (cuando son técnicas, no narrativas), montos en calculadoras, ratios, porcentajes. Tracking normal (`tracking-wider`), no `widest`, en lowercase/normal-case.
5. **Títulos H1 en `tracking-tight`** — ahorra espacio horizontal y endurece la presencia. `text-4xl sm:text-5xl` es la escala estándar para H1 de páginas de info.
6. **Nunca uses `font-mono` para body text.** Sólo para labels, data, código.

### Snippet de label estándar

```tsx
<span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
  Impuestos
</span>
```

### Snippet de fecha técnica

```tsx
<time dateTime={iso} className="text-[11px] font-mono normal-case tracking-wider text-muted-foreground">
  29 abr 2026
</time>
```

---

## 3. Color

| Token | Uso |
| --- | --- |
| `--primary` (#0d9488 light / #2dd4bf dark) | Marca, CTAs, énfasis. **No** decoración. |
| `--foreground` | Body principal |
| `--muted-foreground` | Metadata, labels, captions |
| `--border` | Bordes sutiles, divisores |
| `--success` / `--error` / `--warning` | Estados de datos. Aplicar al **valor**, no al label ni al fondo de la fila. |
| Charts (`--chart-1..5`) | Sólo en visualizaciones. No mezclar en chrome. |

### Reglas duras

1. **El rojo no es decorativo.** Si nada es urgente o de error, no hay rojo en pantalla.
2. **Una sola "moment of color" por sección.** Si todo es primary, nada lo es. Reservá el verde para CTAs, links y la una pieza que querés que la persona note primero.
3. **Bordes antes que sombras.** Las sombras tintadas existen pero son para hero/CTA — info cards usan sólo `border border-border`.
4. **Modos light + dark son first-class.** Si tocás algo, verificá ambos. No hay "default" derivado.

---

## 4. Spacing — proximidad como significado

Usamos los tokens `--space-*` definidos en `globals.css`. La regla:

| Distancia | Significado |
| --- | --- |
| `--space-xs` (4px) | Icon ↔ label, número ↔ unidad |
| `--space-sm` (8px) | Spacing interno de un componente |
| `--space-md` (16px) | Items de la misma lista, gap estándar |
| `--space-lg` (24px) | Separación entre grupos relacionados |
| `--space-xl` (32px) | Margen entre secciones |
| `--space-2xl` (48px) | Cambio mayor de sección |
| `--space-3xl` (64px) | Hero ↔ contenido |
| `--space-4xl` (96px) | Aire para respirar (uso raro, hero principal) |

### Reglas duras

1. **Si te tienta un divisor, probablemente falta spacing.** Sumá distancia antes de poner una línea.
2. **Padding de cards de info: 24px (`p-6`).** Compactas: 16px (`p-4`). Prominentes (CTA hero): 32px (`p-8`). No mezclés `p-5` y `p-6` en la misma pantalla.
3. **Vertical rhythm sobre las secciones**: `mb-10` o `mb-12` entre secciones de una página de info. Consistente.

---

## 5. Border radius — tres opciones, no más

| Token | Tailwind | Uso |
| --- | --- | --- |
| `--radius-sm` (4px) | `rounded` | Tags técnicos, code, chips densos |
| `--radius-md` (8px) | `rounded-lg` | Inputs, cards compactas |
| `--radius-lg` (12px) | `rounded-xl` | Info cards, secondary buttons |
| `--radius-xl` (16px) | `rounded-2xl` | Cards prominentes, modales |
| `--radius-pill` | `rounded-full` | Pills de label, primary CTA, nav |

**No inventes un cuarto valor.** Si no encaja en este set, repensá por qué.

---

## 6. Composición — la regla de las 3 capas

Cada pantalla tiene **exactamente 3 capas de jerarquía**:

1. **Primary**: la cosa principal. UN número, UN título, UN dato. Tamaño absurdamente grande comparado con el resto. Ejemplo: el H1 del hero de blog.
2. **Secondary**: contexto. Subtítulo, excerpt, body de párrafo. Agrupado cerca del primary (gap 8-16px).
3. **Tertiary**: metadata. Labels, fechas, tags. `font-mono uppercase tracking-widest`, en `--muted-foreground`. Empujado a los bordes o al fondo de la sección.

**Test del entrecierro de ojos.** Si entrecierro los ojos y dos cosas compiten por atención, una tiene que achicarse, desaturarse o moverse.

---

## 7. Anti-patterns — qué nunca hacer

- ❌ **Más de 2 familias tipográficas** por pantalla
- ❌ **Sombras decorativas en info cards** (sólo en CTA / modal / hero)
- ❌ **Border-radius mayor a 16px** en cards (excepto botones pill)
- ❌ **Iconos rellenos o multicolor.** Lucide/Phosphor outline, 1.5px stroke, hereda color del texto.
- ❌ **Animaciones bouncy/spring.** Sólo `ease-out` 150-300ms. Opacity > position.
- ❌ **Toasts pop-up para confirmar acciones.** Usá texto inline: "Guardado", "Error: ...".
- ❌ **Zebra striping** en tablas. Usá divisores horizontales si hace falta.
- ❌ **Gradientes en chrome** (botones, tags). Sólo en heroes y CTAs hero.
- ❌ **Mezclar Tailwind defaults con tokens** (`p-4` y `p-[18px]` en la misma pantalla).
- ❌ **Más de 4 colores** simultáneamente en chrome (excluyendo charts).

---

## 8. Identidad — la firma

Lo que hace que una pantalla "sea de Ahorrin":

1. **Categorías y fechas en `font-mono uppercase tracking-widest`** — donde otras apps ponen un pill de color, nosotros ponemos un label técnico.
2. **Hero con gradient emerald + grid mask** en blog y página principal — único lugar donde el verde aparece a pantalla completa.
3. **Cards rectangulares con borde fino**, sin sombra, padding 24px, contenido grupado por proximidad.
4. **Una sola pieza expresiva por sección.** El título grande. El número del cálculo. El badge de "Última revisión". Lo demás respira.

---

## 9. Checklist al editar una página

- [ ] ¿La página tiene exactamente UN H1?
- [ ] ¿Las metadata (categoría, fecha, role, "última revisión", labels secundarios) están en `font-mono uppercase tracking-widest`?
- [ ] ¿El padding de cards es `p-6` (info) o `p-4` (compacta)? ¿Consistente entre cards?
- [ ] ¿El border-radius respeta uno de los 5 tokens?
- [ ] ¿Hay UN solo elemento que reclama atención (el primary)?
- [ ] ¿Funciona en light y dark?
- [ ] ¿Se puede sacar algo? (Subtraer es la regla por defecto.)

---

## 10. Stack técnico

- Tailwind v4 con `@theme inline` block en `app/globals.css`
- Fonts: `DM_Sans` + `Space_Mono` cargadas en `app/layout.tsx` via `next/font/google`
- Tokens en `:root` de `globals.css` (`--space-*`, `--radius-*`, `--tracking-*`)
- Theme provider con dark/light en `contexts/theme-context.tsx`
- Componentes marketing en `components/marketing/*`
- Layouts compartidos: `app/(marketing)/layout.tsx`, `app/blog/layout.tsx`, `app/herramientas/layout.tsx`

---

_Última revisión: 2026-04-30_
