# Google Analytics 4 - Setup Guide

Guía completa para configurar Google Analytics 4 en Gasty y comenzar a trackear métricas.

## 📋 Pre-requisitos

- Cuenta de Google (Gmail)
- Acceso al proyecto en Vercel o donde esté deployado Gasty

---

## Paso 1: Crear Propiedad en Google Analytics

### 1.1. Accedé a Google Analytics

1. Andá a [analytics.google.com](https://analytics.google.com)
2. Ingresá con tu cuenta de Google
3. Si es tu primera vez, clickeá "Empezar a medir"

### 1.2. Crear Cuenta de Analytics

1. **Nombre de la cuenta**: "Gasty" (o el nombre que prefieras)
2. Desmarcá las opciones de compartir datos si querés (opcional)
3. Clickeá "Siguiente"

### 1.3. Crear Propiedad

1. **Nombre de la propiedad**: "Gasty App"
2. **Zona horaria**: Seleccioná "(UTC-03:00) Montevideo"
3. **Moneda**: Peso Uruguayo (UYU)
4. Clickeá "Siguiente"

### 1.4. Información de la Empresa

1. **Categoría del sector**: "Finanzas"
2. **Tamaño de la empresa**: Seleccioná el que corresponda
3. **Cómo pensás usar Google Analytics**: Seleccioná todas las que apliquen
4. Clickeá "Crear"

### 1.5. Aceptar Términos

1. Seleccioná "Uruguay" como país
2. Aceptá los términos del servicio
3. Confirmá las preferencias de email

---

## Paso 2: Configurar Flujo de Datos (Data Stream)

### 2.1. Crear Flujo de Datos Web

1. Seleccioná "Web" como plataforma
2. **URL del sitio web**: `https://www.gasty.app`
3. **Nombre del flujo**: "Gasty Web"
4. **Enhanced measurement**: Dejá TODAS las opciones activadas:
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads
5. Clickeá "Crear flujo"

### 2.2. Copiar Measurement ID

1. Una vez creado, vas a ver tu **MEASUREMENT ID**
2. Se ve así: `G-XXXXXXXXXX`
3. **COPIALO** - lo vas a necesitar en el siguiente paso

---

## Paso 3: Agregar Measurement ID a Gasty

### 3.1. En Desarrollo Local

Agregá el Measurement ID a tu archivo `.env.local`:

```bash
# En la raíz del proyecto
nano .env.local
```

Agregá esta línea:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Reemplazá `G-XXXXXXXXXX` con tu Measurement ID real.

### 3.2. En Producción (Vercel)

1. Andá a tu proyecto en [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Agregá una nueva variable:
   - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (tu Measurement ID)
   - **Environment**: Production, Preview, Development (seleccioná todos)
4. Save
5. Redeploy tu aplicación para aplicar los cambios

---

## Paso 4: Verificar Instalación

### 4.1. Verificación en Tiempo Real

1. En Google Analytics, andá a "Reports" → "Realtime"
2. Abrí tu sitio en una pestaña nueva: `https://www.gasty.app`
3. Deberías ver tu visita aparecer en el reporte en tiempo real
4. Navegá por diferentes páginas y verificá que se trackeen

### 4.2. Usando Google Tag Assistant

1. Instalá la extensión [Google Tag Assistant](https://tagassistant.google.com/)
2. Abrí tu sitio web
3. Activá Tag Assistant
4. Deberías ver `Google Analytics: GA4 (G-XXXXXXXXXX)` en verde

---

## Paso 5: Configurar Conversiones (Events)

### 5.1. Eventos Automáticos Ya Configurados

Gasty ya tiene estos eventos listos para trackear:

| Evento | Descripción | Cuándo se Dispara |
|--------|-------------|-------------------|
| `sign_up` | Usuario crea cuenta | Signup exitoso |
| `login` | Usuario ingresa | Login exitoso |
| `file_upload` | Usuario sube extracto | Upload completo |
| `select_bank` | Usuario selecciona banco | Click en banco |
| `create_rule` | Usuario crea regla | Regla guardada |
| `create_category` | Usuario crea categoría | Categoría guardada |
| `export_data` | Usuario exporta datos | Export exitoso |
| `scroll` | Scroll depth tracking | 25%, 50%, 75%, 100% |
| `button_click` | Click en botón importante | Clicks CTAs |
| `ai_interaction` | Uso de IA | Chat, categorización, etc. |

### 5.2. Marcar Conversiones Clave

1. En GA4, andá a "Configure" → "Events"
2. Vas a ver todos los eventos que se están trackeando
3. Para marcar un evento como conversión:
   - Encontrá el evento (ej: `sign_up`)
   - Togglea "Mark as conversion" a ON
4. Marcá como conversión:
   - ✅ `sign_up` (Principal)
   - ✅ `file_upload` (Activación)
   - ✅ `export_data` (Engagement)
   - ✅ `create_rule` (Engagement)

---

## Paso 6: Crear Audiencias

### 6.1. Audiencia: Usuarios Activos

1. "Configure" → "Audiences" → "New audience"
2. Nombre: "Usuarios Activos"
3. Condiciones:
   - `file_upload` > 3 veces (últimos 30 días)
4. Save

### 6.2. Audiencia: Power Users

1. Nueva audiencia: "Power Users"
2. Condiciones:
   - `file_upload` > 10 veces (últimos 30 días)
   - `create_rule` > 5 veces (últimos 30 días)
3. Save

### 6.3. Audiencia: Usuarios Inactivos

1. Nueva audiencia: "Usuarios Inactivos"
2. Condiciones:
   - `sign_up` en los últimos 30 días
   - NO `file_upload` en los últimos 14 días
3. Útil para campañas de reactivación

---

## Paso 7: Configurar Reportes Personalizados

### 7.1. Reporte de Conversiones

1. "Reports" → "Library" → "Create new report"
2. Nombre: "Funnel de Conversión Gasty"
3. Métricas:
   - Total Users
   - New Users
   - Event Count (`sign_up`)
   - Event Count (`file_upload`)
   - Event Count (`export_data`)
4. Dimensiones:
   - Date
   - Source/Medium
5. Save

---

## Paso 8: Setup de Objetivos/Goals (KPIs)

### 8.1. KPIs Principales a Monitorear

Configurá en "Explore" → "Free Form" estos reportes:

**1. Tasa de Activación**
```
Métrica: (Usuarios que hicieron file_upload) / (Total sign_ups) × 100
Meta: >60% en 7 días
```

**2. Retención**
```
Métrica: Usuarios activos mes actual / Usuarios activos mes anterior
Meta: >80%
```

**3. Engagement**
```
Métrica: Promedio de events por usuario
Meta: >15 events/usuario/mes
```

**4. Conversión por Banco**
```
Dimensión: bank_name (de evento select_bank)
Métrica: Count
Goal: Identificar bancos más populares
```

---

## Paso 9: Configurar Alertas

### 9.1. Alerta de Caída de Tráfico

1. "Configure" → "Custom insights"
2. Nombre: "Caída de Tráfico"
3. Condición: "Daily active users decreased by 20% compared to previous period"
4. Email notification: Tu email

### 9.2. Alerta de Pico de Signups

1. Nueva alerta: "Pico de Signups"
2. Condición: "sign_up event count increased by 50%"
3. Útil para detectar si algo se volvió viral

---

## Paso 10: Integration con Search Console (Opcional pero Recomendado)

1. En GA4, andá a "Admin" → "Product links" → "Search Console links"
2. Clickeá "Link"
3. Seleccioná tu propiedad de Search Console
4. Confirm

Esto te permite ver:
- Queries de búsqueda que llevan a tu sitio
- CTR desde Google
- Posiciones promedio de keywords

---

## Eventos Personalizados - Guía de Uso

### Cómo Triggear Eventos en el Código

Usá el helper `analytics` que ya está configurado:

```typescript
import { analytics } from '@/components/analytics/google-analytics';

// Signup exitoso
analytics.signup('email'); // o 'google'

// Usuario sube archivo
analytics.uploadFile('pdf', 'bbva');

// Usuario crea regla
analytics.createRule('vendor');

// Usuario exporta
analytics.exportData('excel');

// Button click en CTA
analytics.clickButton('Sign Up Now', 'hero-section');

// Uso de IA
analytics.useAI('categorize');
```

---

## Troubleshooting

### No veo datos en tiempo real

1. Verificá que `NEXT_PUBLIC_GA_MEASUREMENT_ID` esté configurado
2. Abrí devtools → Console → buscá errores de gtag
3. Verificá que el Measurement ID sea correcto (empieza con G-)
4. Asegurate de estar en modo producción (no development)

### Los eventos no aparecen

1. Los eventos pueden tardar hasta 24 horas en aparecer en reportes
2. Usá "Realtime" para ver eventos inmediatamente
3. Verificá que el evento se esté llamando correctamente en el código

### Measurement ID incorrecto

Si pusiste el ID mal:
1. Corregilo en Vercel → Environment Variables
2. Redeploy la aplicación
3. Esperá 5 minutos y verificá

---

## Dashboard Recomendado - Primeros 30 Días

Enfocate en estas métricas:

| Métrica | Dónde Verla | Meta Realista |
|---------|-------------|---------------|
| Total Usuarios | Realtime Overview | 100+ users/mes |
| Signups | Events → sign_up | 20+ signups/mes |
| Tasa Activación | Custom report | 60%+ |
| File Uploads | Events → file_upload | 50+ uploads/mes |
| Scroll 100% | Events → scroll | 30%+ de visitas |
| Source/Medium | Acquisition → Traffic | Diversificado |

---

## Recursos Adicionales

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 YouTube Course](https://www.youtube.com/analyticsmania)
- [GA4 Debug View](https://support.google.com/analytics/answer/7201382)

---

**¿Dudas?** Consultá la documentación oficial de Google Analytics 4 o contactá al equipo técnico.

**Última actualización**: Octubre 2025
