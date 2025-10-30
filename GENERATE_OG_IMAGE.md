# Generar OG Image para Calculadora de Salario Líquido

Tenés 3 opciones para generar el OG image:

## Opción 1: Next.js OG Image (Automático) ⭐ RECOMENDADO

Next.js generará automáticamente el OG image cuando hagas deploy. El archivo ya está en:
`app/herramientas/calculadora-salario-liquido/opengraph-image.tsx`

**URL después del deploy:**
`https://www.ahorrin.app/herramientas/calculadora-salario-liquido/opengraph-image`

**Para verificar localmente:**
```bash
open http://localhost:3001/herramientas/calculadora-salario-liquido/opengraph-image
```

**Ventajas:**
- ✅ Se genera automáticamente en cada deploy
- ✅ Optimizado por Next.js
- ✅ Formato PNG correcto (1200x630)
- ✅ No requiere herramientas adicionales

---

## Opción 2: Screenshot del HTML Template (Manual)

Abrí el template HTML y capturá screenshot:

```bash
open http://localhost:3001/og-template-salary-calculator.html
```

**Pasos:**
1. Abrí el archivo en el navegador
2. Ajustá la ventana a 1200x630 (usa DevTools)
3. Capturá screenshot (Cmd+Shift+4 en Mac, o usa DevTools)
4. Guardá como `/public/og-salary-calculator.png`

**Usando DevTools para screenshot perfecto:**
1. Abrí DevTools (Cmd+Option+I)
2. Cmd+Shift+P → "Capture screenshot"
3. O usa "Capture full size screenshot"

---

## Opción 3: Herramientas Online

### 3.1 [OG Image Playground](https://og-playground.vercel.app/)

1. Pegá este código:

```jsx
<div
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
  }}
>
  <div style={{
    fontSize: '24px',
    fontWeight: 700,
    color: '#065f46',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: '12px 24px',
    borderRadius: '999px',
    marginBottom: '32px'
  }}>
    ✅ ACTUALIZADO 2025
  </div>

  <h1 style={{
    fontSize: '72px',
    fontWeight: 900,
    color: '#111827',
    textAlign: 'center',
    margin: '0 0 24px 0'
  }}>
    ¿Cuánto te queda después de impuestos?
  </h1>

  <div style={{
    fontSize: '48px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    backgroundClip: 'text',
    color: 'transparent',
    marginBottom: '40px'
  }}>
    Calculá tu salario líquido
  </div>

  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    backgroundColor: 'white',
    padding: '32px 48px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    marginBottom: '40px'
  }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '20px', color: '#6b7280' }}>Salario Nominal</span>
      <span style={{ fontSize: '56px', fontWeight: 900, color: '#111827' }}>$80,000</span>
    </div>
    <span style={{ fontSize: '64px', color: '#10b981' }}>→</span>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '20px', color: '#6b7280' }}>Salario Líquido</span>
      <span style={{ fontSize: '56px', fontWeight: 900, color: '#10b981' }}>$65,100</span>
    </div>
  </div>

  <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
    <span style={{
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '22px',
      fontWeight: 600,
      color: '#065f46'
    }}>IRPF 2025</span>
    <span style={{
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '22px',
      fontWeight: 600,
      color: '#065f46'
    }}>BPS 15%</span>
    <span style={{
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      padding: '12px 24px',
      borderRadius: '12px',
      fontSize: '22px',
      fontWeight: 600,
      color: '#065f46'
    }}>Fonasa 3-6%</span>
  </div>

  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <span style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>Ahorrin</span>
    <span style={{ fontSize: '24px', color: '#6b7280' }}>• www.ahorrin.app</span>
  </div>
</div>
```

2. Descargá el PNG generado
3. Guardá como `/public/og-salary-calculator.png`

### 3.2 [Canva](https://www.canva.com/)

**Template custom 1200x630:**
- Fondo: Gradiente verde (#f0fdf4 → #d1fae5)
- Texto principal: "¿Cuánto te queda después de impuestos?"
- Ejemplo: $80,000 → $65,100
- Badges: IRPF 2025, BPS 15%, Fonasa 3-6%
- Logo: Ahorrin + www.ahorrin.app

---

## Opción 4: Script Automatizado con Puppeteer (Avanzado)

Si querés automatizar en el futuro:

```bash
npm install puppeteer --save-dev
```

```javascript
// scripts/generate-og-images.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630 });
  await page.goto('http://localhost:3001/og-template-salary-calculator.html');
  await page.screenshot({
    path: 'public/og-salary-calculator.png',
    type: 'png'
  });

  await browser.close();
})();
```

---

## Validar OG Image

Una vez generado, validá que funcione:

### 1. Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

### 2. Twitter Card Validator
https://cards-dev.twitter.com/validator

### 3. LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

### 4. Opengraph.xyz
https://www.opengraph.xyz/url/https%3A%2F%2Fwww.ahorrin.app%2Fherramientas%2Fcalculadora-salario-liquido

---

## Verificación Local

Chequeá que los meta tags estén correctos:

```bash
curl -s http://localhost:3001/herramientas/calculadora-salario-liquido | grep -i "og:image"
```

Deberías ver:
```html
<meta property="og:image" content="https://www.ahorrin.app/herramientas/calculadora-salario-liquido/opengraph-image" />
```

---

## Siguiente Paso Recomendado

**Opción 1 es la mejor** porque:
- ✅ Se genera automáticamente en cada deploy
- ✅ Vercel optimiza el formato
- ✅ Se actualiza si cambiás el código
- ✅ No requiere mantenimiento manual

**Después del deploy:**
1. Verificá la URL: `https://www.ahorrin.app/herramientas/calculadora-salario-liquido/opengraph-image`
2. Testeá en Facebook/Twitter validators
3. ✅ Listo!
