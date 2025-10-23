# Plan de Contenido X/Twitter - Federico Iglesias (@figlesias221)

**Objetivo**: Posicionarte como AI Software Engineer usando Ahorrín como caso de estudio real.

**Meta**: 1-2 tweets/día | Balance 50/50 técnico-producto | Tono casual/auténtico

---

## 📅 Calendario Semanal (Template)

| Día | Tipo de Contenido | Objetivo |
|-----|------------------|----------|
| **Lunes** | Building in Public | Compartir progreso, métricas, decisiones |
| **Martes** | Tutorial Técnico | Mostrar código/arquitectura real |
| **Miércoles** | Product Update | Nueva feature o mejora de Ahorrín |
| **Jueves** | Building in Public | Challenges, aprendizajes, reflexiones |
| **Viernes** | Tutorial/Código | Tips rápidos, snippets útiles |
| **Sábado** | Product/Feedback | Mostrar uso real, testimonios |
| **Domingo** | AI Insights | Reflexión semanal, lecciones aprendidas |

---

## 🏗️ BUILDING IN PUBLIC (Lunes/Jueves)

### Métricas y Progreso

```
shipee categorias automaticas en gasty hace 2 dias. ya proceso 500+ transacciones sin que nadie se queje. validacion = usuarios que no se quejan

---

100 usuarios en gasty 🎉

lo loco: 80% llegaron por SEO organico. escribi un blog de finanzas en uruguay y exploto. el contenido funciona mas que cualquier ads que probe

---

gasty ahora tiene 3 bancos soportados. el mvp original solo parseaba itau. la leccion: empeza chico, escala cuando la gente lo pida

---

acabo de ver las metricas de gasty: los usuarios que usan AI chat gastan 10x mas tiempo en la app. obvio, es la feature mas adictiva. nota mental: doblar down en AI

---

pase gasty de cloudflare workers a vercel hace 1 mes. costo: $0 → $20/mes. performance: igual. la leccion? a veces el hype de "serverless barato" no importa si tenes 100 usuarios
```

### Decisiones Técnicas

```
hoy decidi reescribir el parser de PDFs de gasty. llevaba 3 meses con unpdf y fallaba random. cambie a pdf-parse + gpt-4 para extraer. ahora 95% accuracy vs 60%. a veces la solucion es tirar guita al problema

---

debate interno: supabase vs postgres self-hosted para gasty?

supabase pro: auth gratis, realtime, buena dx
contra: $25/mes, vendor lock-in

postgres: $5/mes, full control
contra: tengo que hacer auth yo

elegi supabase. el tiempo vale mas que $20

---

implemente rate limiting en gasty con upstash redis. costo: $0.20/mes. ahora nadie me puede spamear el endpoint de AI y fundirme en credits de openai. 10/10 recomiendo

---

hoy agregue google analytics a gasty y ya me arrepenti. 90% de las metricas no me importan. lo unico que miro: usuarios activos, conversion signup, y retention 7 dias. menos metricas = mas enfoque

---

gaste 4 horas optimizando una query de supabase que tardaba 3 segundos. la baje a 200ms. el truco? un index en la columna user_id. ridiculamente simple pero la mayoria no lo hace
```

### Reflexiones y Challenges

```
llevo 3 meses con gasty y la mayor leccion: nadie le importa tu stack. les importa si resuelve su problema. yo estaba orgulloso del rag implementation y los usuarios solo quieren que categorize bien

---

hoy un usuario me dijo "gasty cambio como veo mi plata". ese mensaje vale mas que cualquier metrica. reminder: estas construyendo para gente real

---

fail del dia: hice un landing con 5 features diferentes. conversion: 2%. lo simplifique a 1 feature (categorias automaticas). conversion: 12%. less is more no es joda

---

la parte mas dificil de gasty no fue el codigo. fue entender que problema resolver. pase 1 mes agregando features que nadie uso. ahora pregunto primero

---

debugging de produccion a las 3am es diferente. no podes hacer console.log y refreshear. tenes que pensar en logs, sentry, y rezar. gasty me enseno a logear mejor desde el dia 1
```

---

## 💻 TUTORIALES TÉCNICOS (Martes/Viernes)

### Next.js + AI

```
tip: si usas vercel ai sdk con streaming, envolve el componente que usa useChat() en suspense. next.js 15 te va a romper las bolas si no lo haces. me costo 2 horas debug esto

---

como hice el AI chat de gasty en 4 horas 🧵

1. vercel ai sdk (useChat hook)
2. route handler en /api/chat
3. gpt-4o con tools (11 funciones para analizar gastos)
4. streaming = gratis con streamText()

el 90% del laburo fue definir los tools bien

---

snippet del dia: como hacer que gpt-4 devuelva JSON valido siempre

const result = await generateObject({
  model: openai('gpt-4o'),
  schema: z.object({ ... }),
  prompt: '...'
})

zod + generateObject = nunca mas parsear responses a mano

---

implementar dark mode en next.js 15 app router sin next-themes

1. usa css variables
2. agrega clase "dark" al html
3. guarda preferencia en localStorage
4. done

no necesitas una libreria de 15kb para esto. gasty lo hace en 50 lineas

---

protip supabase: usa row level security (RLS) desde el dia 1

gasty arranque sin rls porque "era mas rapido"
2 semanas despues tuve que migrar 500 rows y agregar policies
aprendi por las malas: security first, no despues
```

### Arquitectura y Código Real

```
arquitectura de gasty en 280 caracteres:

- next.js 15 app router (frontend + api)
- supabase (db + auth + storage)
- openai gpt-4o (categorias + chat)
- vercel (hosting)
- upstash redis (rate limiting)

todo serverless, $50/mes con 200 usuarios

---

como manejar file uploads grandes en next.js sin que se muera vercel

problema: vercel tiene limite de 4.5mb en body
solucion: upload directo a supabase storage con signed url

1. cliente pide signed url al backend
2. cliente sube a supabase directo
3. backend procesa del storage

evitas el limite de vercel y es mas rapido

---

real talk: la mayoria de los bugs de gasty vienen de:

1. no validar inputs (40%)
2. asumir que las APIs nunca fallan (30%)
3. race conditions en react (20%)
4. typos en el codigo (10%)

la solucion? typescript + zod + try/catch everywhere

---

pattern que uso en todos los API routes de gasty:

export async function POST(req: Request) {
  try {
    // auth check
    // validate input con zod
    // business logic
    // return NextResponse.json()
  } catch (error) {
    // log to sentry
    // return error response
  }
}

simple, predecible, debuggeable

---

como optimice el bundle de gasty de 800kb a 250kb

1. dynamic imports para charts (recharts es pesado)
2. tree shaking manual de lucide icons
3. removi framer-motion de pages criticas
4. use next/dynamic con ssr: false

carga inicial: 4s → 1.2s
```

### Tips Rápidos

```
si tenes un array grande en javascript y necesitas buscar, usa Set en vez de .includes()

// slow (O(n))
array.includes(item)

// fast (O(1))
new Set(array).has(item)

aprendi esto cuando gasty tenia 10k transacciones y el filtro tardaba 3s

---

errorHandler reutilizable para todas las api routes

export function handleError(error: unknown) {
  if (error instanceof z.ZodError) return 400
  if (error.code === 'PGRST116') return 404
  console.error(error)
  return 500
}

uso esto en todas las routes de gasty. dry af

---

debugging tip: si tu componente re-renderiza como loco, usa React DevTools Profiler

en gasty tenia un componente que renderizaba 40 veces por segundo
el culprit? un objeto que se recreaba en cada render
solucion: useMemo()

---

next.js 15 gotcha: las cookies son async ahora

// antes (next 14)
const token = cookies().get('token')

// ahora (next 15)
const token = (await cookies()).get('token')

me rompio toda la auth de gasty por no leer el changelog

---

como hacer rate limiting sin libreria

const userRequests = new Map()

function rateLimit(userId: string) {
  const now = Date.now()
  const requests = userRequests.get(userId) || []
  const recent = requests.filter(t => now - t < 60000)

  if (recent.length >= 10) return false
  recent.push(now)
  userRequests.set(userId, recent)
  return true
}

10 req/min, no dependencies
```

---

## 🚀 PRODUCT UPDATES (Miércoles/Sábado)

### Nuevas Features

```
nueva feature en gasty: bulk edit de transacciones

selecciona 50 transacciones → cambia categoria → done
antes tenias que hacerlo 1 por 1

lo pedian hace 2 meses y recien lo hice. leccion: escucha a tus usuarios

---

shipee modo oscuro en gasty porque 3 personas me lo pidieron

tarde 2 horas. conversion no cambio. engagement subio 0%.

pero los 3 usuarios me mandaron dm felices. a veces vale la pena hacer cosas que no escalan

---

gasty ahora categoriza automaticamente transacciones de 3 bancos uruguayos (itau, bbva, scotiabank)

upload extracto → AI lee el PDF → categoriza todo
tiempo: 10 segundos para 200 transacciones

mas rapido que netflix cargando

---

agregue export a excel en gasty

porque? 5 usuarios me dijeron "necesito esto para mi contador"

tarde 30 minutos. feature mas usada del mes.

leccion: las features simples a veces son las mas valiosas

---

el asistente AI de gasty ahora tiene 11 herramientas:

- analisis de gastos por categoria
- comparacion mes a mes
- deteccion de gastos raros
- proyeccion de fin de mes
- busqueda de transacciones
- vendor spending (donde gastas mas)
- etc

basicamente es tener un contador AI 24/7
```

### Mejoras y Fixes

```
arregle el bug mas molesto de gasty: las categorias custom no se guardaban bien

el problema? race condition en el form submit
la solucion? un simple debounce de 300ms

a veces los bugs mas molestos tienen fixes de 1 linea

---

optimice la carga inicial de gasty

antes: 4.2s first contentful paint
ahora: 1.1s

como? dynamic imports + prefetch de datos criticos + lazy loading de imagenes

los usuarios no saben que es FCP pero sienten cuando es rapido

---

migre todos los iconos de gasty de react-icons a lucide-react

bundle size: -120kb
look: mismo
breaking changes: 0

si todavia usas react-icons, lucide es 10x mejor. tree shaking real

---

gasty ahora valida extractos bancarios antes de procesarlos

antes: subia cualquier PDF → fallaba → confusion
ahora: detecta si es un extracto valido → rechaza si no lo es

mejor ux = menos support tickets

---

refactorice el dashboard de gasty 3 veces hasta que quedo bien

v1: 10 graficos (nadie miraba mas de 2)
v2: 5 graficos (mejor pero todavia busy)
v3: 3 graficos + overview cards (perfect)

iterar es parte del proceso. no te cases con tu primera version
```

### Feedback de Usuarios

```
un usuario me escribio: "gasty me ayudo a encontrar $200 dolares en suscripciones que no usaba"

eso es $2400 al año que se ahorro. mi precio: gratis (por ahora)

validation: ayudar a la gente a ahorrar plata es un buen modelo

---

feedback real de gasty: "la UI es muy simple, me gusta"

yo: *gaste 40 horas en animaciones y gradientes*

los usuarios: les gusta la simplicidad

leccion: lo que vos pensas que importa != lo que le importa al usuario

---

caso de uso que no esperaba: gente usando gasty para hacer budgets familiares

nunca pense en ese use case. lo construi para mi (tracking personal)

pero tiene sentido. las mejores features a veces vienen de casos de uso inesperados

---

3 meses de gasty y el feedback mas comun: "por que no existia esto antes?"

no es porque sea genio. es porque resolvi un problema real (controlar gastos en uruguay)

el mercado estaba ahi. solo habia que construirlo

---

usuario: "el AI chat es adictivo, lo uso todos los dias"

yo: *invente 3 semanas en el AI chat*

validation: las features en las que gastas mas tiempo suelen ser las que mas valor generan
```

---

## 🤖 AI INSIGHTS (Domingos / Reflexiones)

### Prompting y LLMs

```
despues de 1000 requests a gpt-4o para gasty, aprendi:

- system prompts largos funcionan mejor que cortos
- ejemplos > explicaciones
- structured outputs (json mode) son mas confiables
- temperatura 0.3 para tareas deterministicas
- temperature 0.8 para creatividad

prompting es 90% probar cosas

---

real talk sobre AI en produccion:

el 80% del tiempo no es "que prompt uso"
es "como manejo cuando el LLM se manda una"

rate limits, timeouts, fallbacks, validacion de outputs
eso es lo que nadie te cuenta en los tutorials

---

gpt-4o vs gpt-4o-mini en gasty:

gpt-4: mejor para categorizar transacciones ambiguas ($8/1M tokens)
gpt-4o-mini: suficiente para el 90% de casos ($0.60/1M tokens)

use mini por default, gpt-4 como fallback. ahorro: 70% en AI costs

---

implementar RAG en gasty fue mas simple de lo que pensaba

1. embeddings de todas las transacciones (openai ada-002)
2. vector search en supabase (pgvector)
3. retrieve top-k transactions relevantes
4. manda context a gpt-4 con el query del usuario

todo el setup: 6 horas. funciona al pelo

---

leccion de usar AI en produccion: SIEMPRE valida los outputs

gasty categorizaba "FROG SUPERMERCADO" como "Entretenimiento" (???)
el fix? schema validation + fallback categories

nunca confies 100% en el LLM. validate everything
```

### Arquitectura de AI

```
como funciona el AI categorization de gasty 🧵

1. usuario sube extracto PDF
2. gpt-4 extrae transacciones del PDF (no regex, pure AI)
3. embeddings de descripcion de cada transaccion
4. vector search: encuentra transacciones similares ya categorizadas
5. si match > 0.85 → usa esa categoria
6. si no → gpt-4o-mini predice categoria
7. guarda en DB

accuracy: 94%

---

patron que uso para AI tools en gasty:

cada tool es una funcion pura que retorna JSON
el LLM solo decide que tool llamar y con que params
nunca le doy al LLM acceso directo a la DB

separation of concerns = menos bugs

---

error que cometi con AI en gasty:

al principio le daba TODO el historial de transacciones al LLM
1000 transacciones = 50k tokens = $$$

ahora: solo mando las ultimas 100 relevantes
costo: -85%
calidad: igual

context != mas es mejor

---

streaming AI responses en gasty fue game changer

antes: usuario espera 5s → ve respuesta completa → aburre
ahora: respuesta aparece en tiempo real → parece magia

tech: vercel ai sdk streamText()
esfuerzo: 20 lineas de codigo

---

regla de oro para AI features:

si tarda mas de 3 segundos → muestra loading state
si tarda mas de 10 segundos → ofrece hacer otra cosa
si tarda mas de 30 segundos → esta mal diseñado

en gasty nada tarda mas de 5s. si tarda mas, algo anda mal
```

### Costo y Performance

```
costos de AI en gasty (200 usuarios activos):

openai: $35/mes
supabase pgvector: $0 (en free tier)
rate limiting (upstash): $0.50/mes

total AI infra: $35.50/mes

si cobro $5/mes a 50 usuarios = $250
margin: 85%

AI no tiene por que ser caro si optimizas

---

benchmark real de gasty AI features:

categorizar 100 transacciones: 2.3s (gpt-4o-mini batch)
chat response (simple): 0.8s (gpt-4o streaming)
analisis mensual completo: 4.1s (gpt-4o con 11 tools)

como? batch requests + caching + buenos prompts

---

cache de embeddings saved my ass

antes: calculaba embeddings on-demand → $$$
ahora: calculo 1 vez, guardo en supabase, reuso

costo: $120/mes → $12/mes
tiempo: 3s → 0.1s

moral: cachea todo lo que puedas

---

descubri que el 70% de las queries al AI de gasty son las mismas 10 preguntas

"cuanto gaste este mes?"
"en que categoria gasto mas?"
"comparame con el mes pasado"

ahora las cacheo. hit rate: 60%. ahorro: $40/mes

low hanging fruit > optimizaciones complejas
```

---

## 📝 TEMPLATES REUTILIZABLES

### Building in Public

```
Template 1: Metrica + Learning
[METRICA] en gasty. lo loco: [INSIGHT INESPERADO]. leccion: [LEARNING]

Ejemplo:
50 signups esta semana en gasty. lo loco: el 80% vino de un blog post de 2 horas. leccion: el contenido escala mejor que cualquier ads

---

Template 2: Progreso
shipee [FEATURE] en gasty hace [TIEMPO]. ya [METRICA DE USO]. validacion = [SEÑAL DE EXITO]

Ejemplo:
shipee export a excel en gasty hace 3 dias. ya se exportaron 200 archivos. validacion = usuarios que usan la feature sin preguntar nada

---

Template 3: Decisión Técnica
debate interno: [OPCION A] vs [OPCION B] para gasty?

A: [PROS] / [CONTRAS]
B: [PROS] / [CONTRAS]

elegi [OPCION]. [RAZON]

---

Template 4: Fail
fail del dia: [QUE HICE MAL]. resultado: [METRICA MALA]. fix: [QUE CAMBIE]. leccion: [LEARNING]

Ejemplo:
fail del dia: agregue 5 features nuevas sin preguntar. resultado: 0% adoption. fix: pregunte que querian. leccion: build with users, not for users
```

### Tutoriales

```
Template 1: Snippet
[TITULO DEL TIP]

// codigo malo
[BAD CODE]

// codigo bueno
[GOOD CODE]

[EXPLICACION BREVE 1-2 LINEAS]

---

Template 2: Thread Tecnico
como [LOGRE ALGO] 🧵

1. [PASO 1 CON TOOL/TECH]
2. [PASO 2]
3. [PASO 3]
4. [RESULTADO/METRICA]

el [X]% del laburo fue [INSIGHT]

---

Template 3: Comparación
[TECH A] vs [TECH B] en gasty:

A: [PRO] pero [CONTRA]
B: [PRO] pero [CONTRA]

use [ELECCION]. [METRICA DE RESULTADO]

---

Template 4: Gotcha
[FRAMEWORK] gotcha: [PROBLEMA]

// antes
[CODIGO VIEJO]

// ahora
[CODIGO NUEVO]

me rompio [FEATURE] por no leer el changelog
```

### Product Updates

```
Template 1: Nueva Feature
nueva feature en gasty: [FEATURE]

[DESCRIPCION BREVE DE QUE HACE]
antes: [COMO ERA ANTES]
ahora: [COMO ES AHORA]

lo pedian hace [TIEMPO]. leccion: [INSIGHT]

---

Template 2: Mejora/Fix
[ARREGLE/OPTIMICE] [COSA] en gasty

antes: [METRICA MALA]
ahora: [METRICA BUENA]

como? [EXPLICACION TECNICA BREVE]

---

Template 3: User Feedback
un usuario me [DIJO/ESCRIBIO]: "[QUOTE]"

[TU REACCION/INSIGHT]

validation: [APRENDIZAJE]

---

Template 4: Caso de Uso
caso de uso que no esperaba: [DESCRIPCION]

nunca pense en [ESO]. pero tiene sentido porque [RAZON]

las mejores features a veces vienen de [INSIGHT]
```

### AI Insights

```
Template 1: Learning
despues de [N] [COSA] con [AI MODEL], aprendi:

- [LEARNING 1]
- [LEARNING 2]
- [LEARNING 3]

[CONCLUSION]

---

Template 2: Costo/Performance
costos de AI en gasty:

[BREAKDOWN DE COSTOS]

total: [TOTAL]

si cobro [PRECIO] a [N] usuarios = [REVENUE]
margin: [MARGIN]%

---

Template 3: Comparación de Modelos
[MODEL A] vs [MODEL B] para [USE CASE]:

A: [CARACTERISTICA + COSTO]
B: [CARACTERISTICA + COSTO]

use [CHOICE]. ahorro: [METRICA]

---

Template 4: Pattern/Arquitectura
patron que uso para [COSA] en gasty:

[DESCRIPCION DE PATRON EN 2-3 LINEAS]

[BENEFICIO 1]
[BENEFICIO 2]

resultado: [METRICA]
```

---

## 🎯 PRIMERAS LINEAS QUE FUNCIONAN (Hooks)

Estas primeras líneas capturan atención y te hacen scrollear:

```
"shipee [FEATURE] en [TIEMPO]. el truco? [INSIGHT]"

"[NUMERO] usuarios en gasty y [STAT INESPERADO]"

"gaste [TIEMPO] [HACIENDO ALGO] y ya me arrepenti. [RAZON]"

"real talk sobre [TOPIC]: [HOT TAKE]"

"debugging de produccion a las 3am es diferente"

"leccion del dia: [LEARNING CONTRAINTUITIVO]"

"fail del dia: [DESCRIPCION BREVE]"

"como hice [COSA IMPRESIONANTE] en [POCO TIEMPO] 🧵"

"[TECH] vs [TECH]: [HOT TAKE]"

"nadie te cuenta esto sobre [TOPIC]:"

"despues de [N] [COSA], aprendi:"

"tip rapido: [SOLUCION SIMPLE A PROBLEMA COMUN]"

"errorHandler reutilizable para [USE CASE]"

"pattern que uso en todos [LUGAR]:"

"un usuario me [DIJO/ESCRIBIO]: [QUOTE IMPACTANTE]"
```

---

## 🚫 QUE NO HACER (Anti-Patterns)

**Evitar**:
- ❌ "Excited to announce..." (muy corporativo)
- ❌ Emojis excesivos 🎉🚀✨💪 (max 1-2 por tweet)
- ❌ "I'm thrilled to share..." (nadie habla así)
- ❌ Hashtags spam #AI #SaaS #Startup #Tech (max 1 hashtag)
- ❌ Tweets sin contenido: "Working on something cool 👀" (teasing vacío)
- ❌ Grammar perfecto / capitalización perfecta (demasiado pulido)
- ❌ Hilos de 20 tweets (nadie lee tanto, max 5-7)
- ❌ Humblebrags: "Can't believe I hit 1000 users by accident"
- ❌ Pedir RT/likes explícitamente

**En su lugar**:
- ✅ Ir directo al punto
- ✅ Números concretos y métricas reales
- ✅ Compartir fails y lessons learned
- ✅ Código real, screenshots reales
- ✅ Typos naturales ocasionales (pero no siempre)
- ✅ Lowercase en la mayoría del texto
- ✅ Insights contraintuitivos
- ✅ Tono de "te cuento algo que aprendí" no "les voy a enseñar"

---

## 📊 IDEAS CONCRETAS (50+ Tweets Listos)

### Semana 1

**Lunes (Building)**:
```
100 usuarios en gasty sin gastar $1 en ads

como?
- 1 blog post sobre finanzas en uruguay (posiciona en google)
- open source el extracto parser (github stars → traffic)
- responder en reddit finanzas uruguay (directo y util)

el contenido organico escala mejor que ads. change my mind
```

**Martes (Tutorial)**:
```
como hacer que next.js app router no se cuelgue con suspense

el error: "useSearchParams should be wrapped in suspense"

el fix:
<Suspense fallback={null}>
  <ComponentThatUsesSearchParams />
</Suspense>

next 15 es mas estricto con esto. me costo 2hs debug

guardalo para cuando te pase
```

**Miércoles (Product)**:
```
gasty ahora detecta suscripciones automaticamente

netflix $14/mes → detectado
spotify $7/mes → detectado
gym $45/mes que no usas hace 6 meses → detectado

el AI busca transacciones recurrentes y te avisa

feature pedida por 10 usuarios. tardo 1 dia implementar
```

**Jueves (Building)**:
```
llevo 3 meses con gasty y las metricas que importan:

❌ no importa: page views, time on site, bounce rate
✅ importa: usuarios activos semanales, retention 30 dias, conversion signup

menos metricas = mas foco en lo que mueve la aguja

obsesionarse con vanity metrics es una trampa
```

**Viernes (Tutorial)**:
```
rate limiting simple sin libreria

const limits = new Map()

function checkLimit(key: string, max = 10) {
  const now = Date.now()
  const times = limits.get(key)?.filter(t => now - t < 60000) || []
  if (times.length >= max) return false
  times.push(now)
  limits.set(key, times)
  return true
}

10 req/min, 0 dependencies
uso esto en gasty para evitar spam de AI requests
```

**Sábado (Product)**:
```
el feature request mas comun de gasty: "quiero ver gastos del año pasado"

yo: "hace 3 meses que no commiteo eso"

hoy lo shipee. tardo 2 horas. 15 usuarios ya lo usaron.

leccion: las features que postpones son las que mas piden. priorizacion > perfeccion
```

**Domingo (AI Insight)**:
```
despues de 2000+ categorizaciones automaticas con AI en gasty:

gpt-4o accuracy: 94%
gpt-4o-mini accuracy: 89%
diferencia de costo: 10x

conclusion: uso mini por default, gpt-4 solo para casos ambiguos

5% mas accuracy no justifica 10x el costo para la mayoria de casos
```

### Semana 2

**Lunes**:
```
gasty procesa extractos de 3 bancos uruguayos (itau, bbva, scotiabank)

el mas jodido? bbva. su PDF tiene una estructura rara que rompe todos los parsers

la solucion? tirar gpt-4 al problema. extrae todo sin regex, puro AI

a veces brute force > algoritmo elegante
```

**Martes**:
```
patron de error handling que uso en todas las API routes:

try {
  const body = await req.json()
  const data = schema.parse(body) // zod validation
  const result = await doSomething(data)
  return NextResponse.json(result)
} catch (e) {
  if (e instanceof ZodError) return error(400, e)
  console.error(e) // sentry log
  return error(500)
}

consistente, debuggeable, safe
```

**Miércoles**:
```
nueva feature: bulk edit en gasty

antes: editar 50 transacciones = 50 clicks
ahora: select all → cambiar categoria → 1 click

feature mas pedida del mes. implementarla tardo 4hs

lo que pensas que es dificil usualmente no lo es. solo escribi el codigo
```

**Jueves**:
```
fail: gaste 1 semana haciendo el dashboard "perfecto" de gasty

10 graficos, animaciones, gradientes everywhere

resultado: los usuarios solo miran 2 graficos (gastos del mes + categorias)

refactor: simplifique a 3 graficos principales

menos features, mejor ux
```

**Viernes**:
```
como hacer dark mode sin next-themes

1. css vars para colores
2. .dark class en html
3. toggle guarda preferencia en localStorage
4. useEffect para leer preferencia en mount

50 lineas de codigo vs 15kb bundle de libreria

gasty hace esto. funciona perfecto
```

**Sábado**:
```
usuario random: "gasty me ahorro $300 en suscripciones que no sabia que tenia"

yo: holy shit funciona

validation: cuando tu app le ahorra plata real a la gente, es un buen modelo

ahora el challenge: como monetizar sin ser un hdp
```

**Domingo**:
```
lecciones de usar AI en produccion (gasty edition):

1. SIEMPRE valida outputs con zod o similar
2. timeouts son necesarios (gpt-4 a veces se cuelga)
3. fallbacks para cuando la API falla
4. rate limiting para no fundirte
5. logging exhaustivo (vas a necesitar debuggear)

AI in production != AI en playground
```

### Semana 3

**Lunes**:
```
decision: migre gasty de cloudflare workers a vercel

razon? el edge runtime de cloudflare rompia con supabase-js random
debugging: imposible (no tenes logs buenos)

vercel: mas caro ($20/mes vs $0) pero funciona al 100%

a veces pagar es mejor que pelear con infra
```

**Martes**:
```
supabase tip: usa .select() con solo las columnas que necesitas

// mal (trae todo)
.select('*')

// bien (trae solo lo necesario)
.select('id, amount, description')

en gasty esto redujo el response time 60%
payload mas chico = mas rapido
```

**Miércoles**:
```
shipee export de transacciones en gasty

formatos: excel, csv, json

tardo 30 minutos implementar con sheetjs

es la feature mas usada esta semana (despues de categorias)

leccion: features utilitarias > features "wow". la gente quiere que las cosas funcionen
```

**Jueves**:
```
estadistica loca de gasty:

usuarios que categorizan >50 transacciones: retention 85%
usuarios que categorizan <10 transacciones: retention 12%

conclusion: el aha moment es cuando categorizan bocha de transacciones

ahora empujo mas a hacerlo en onboarding
```

**Viernes**:
```
debugging tip: si tenes un leak de memoria en react, usa React DevTools Profiler

en gasty tenia un component que crecia sin parar
el problema? event listeners que nunca limpiaba

siempre hace cleanup en useEffect:

useEffect(() => {
  window.addEventListener('scroll', handler)
  return () => window.removeEventListener('scroll', handler)
}, [])
```

**Sábado**:
```
feedback real: "el asistente AI de gasty me respondio en 2 segundos algo que me hubiera tomado 10 minutos calcular"

eso. ese es el value prop

AI no es un gimmick si le ahorra tiempo real a la gente

challenge: hacer que todos descubran esta feature
```

**Domingo**:
```
gpt-4o vs claude 3.5 sonnet para categorizar gastos en gasty:

gpt-4o: 94% accuracy, responde en 1.2s
claude: 91% accuracy, responde en 0.8s

me quede con gpt-4o. 3% mas accuracy importa mas que 0.4s

pero claude es mas barato ($3/M vs $5/M tokens)

considerando switchear para volumen alto
```

### Semana 4

**Lunes**:
```
200 usuarios en gasty 🎉

breakdown:
- 60% SEO organico (blog posts)
- 25% word of mouth
- 10% reddit/foros
- 5% twitter

MRR: $0 (todo gratis por ahora)
costos: $75/mes (supabase + vercel + openai)

runway: 3 meses hasta pricing
```

**Martes**:
```
como estructurar un proyecto next.js 15 app router

gasty structure:
/app - pages & api routes
/components - ui components
/lib - utils, db, helpers
/hooks - custom hooks
/types - typescript types

todo flat, no nested folders

simple > clever
```

**Miércoles**:
```
nueva feature: gasty te avisa cuando un gasto es unusual

"gastaste $150 en entretenimiento. tu promedio es $40"

como?
1. calculo promedio de categoria (ultimos 3 meses)
2. si nuevo gasto > 2x promedio → notificacion
3. AI genera explicacion custom

tardo 3 horas. super util
```

**Jueves**:
```
real talk: gasty no es perfecto

bugs conocidos:
- sync de google auth a veces falla
- algunos PDFs de itau no parsean bien
- el dashboard mobile podria ser mejor

pero los usuarios igual lo usan todos los dias

ship iteratively. perfeccion mata momentum
```

**Viernes**:
```
truco para hacer queries rapidas en supabase:

1. index en columnas que filtras (user_id, created_at)
2. limit() siempre que puedas
3. select solo columnas necesarias
4. usa .range() para paginacion

en gasty todas las queries son <200ms con 50k rows

indexes > todo
```

**Sábado**:
```
un usuario uso gasty para trackear gastos de su negocio

no estaba diseñado para eso pero funciona

ahora estoy considerando pivotear a "finanzas para pymes"

las mejores ideas vienen de ver como la gente usa tu producto mal
```

**Domingo**:
```
balance de 1 mes usando AI en produccion (gasty):

requests: 12,450
costo: $38
revenue: $0
satisfaction: 95% (usuarios aman el AI chat)

conclusion: AI puede ser barato si optimizas
next step: monetizar para que los numeros cierren
```

---

## 🎨 ESTILO Y TONO - CHECKLIST

Antes de postear, verificá:

- [ ] ¿Está en lowercase mayormente? (excepto nombres propios, siglas)
- [ ] ¿Tiene 1-2 typos naturales max? (no forzar, pero ok si pasa)
- [ ] ¿Evité palabras corporativas? (announce, thrilled, excited, pleased)
- [ ] ¿Tiene números concretos? (métricas, timings, costos)
- [ ] ¿Es directo al punto? (sin intro innecesaria)
- [ ] ¿Suena como yo en una conversación? (no como documentación)
- [ ] ¿Tiene un learning/insight? (no solo descripción)
- [ ] ¿Evité emojis excesivos? (max 1-2)
- [ ] ¿Agregué contexto de Ahorrín si es relevante? (usar como ejemplo)
- [ ] ¿Es útil para otros devs/founders? (no solo autopromoción)

---

## 📈 ESTRATEGIA DE CRECIMIENTO

**Objetivo 90 días**: 1000 seguidores + engagement alto

**Tácticas**:
1. **Consistencia**: 1-2 tweets/día sin falta
2. **Engagement**: Responder todos los comments (especialmente primeros 30min)
3. **Threads**: 1 thread técnico por semana (domingo AI insights)
4. **Timing**: Postear 9-10am o 7-9pm Uruguay (cuando más actividad)
5. **Cross-promote**: Mencionar Ahorrín naturalmente (no spam)
6. **Networking**: Retweet y comentar en builders similares
7. **Authenticity**: Compartir fails, no solo wins

**KPIs a trackear**:
- Seguidores (meta: +30/semana)
- Engagement rate (meta: >5%)
- Clicks a Ahorrín desde bio (meta: 20/semana)
- Signups de Twitter (meta: 5/semana)

---

## 🔥 BONUS: IDEAS ESPECÍFICAS USANDO GASTY

### Código Real de Ahorrín

```
thread idea: "como construi el parser de extractos bancarios de gasty"

1. problema: PDFs tienen formatos random
2. solucion: gpt-4 + regex fallback
3. architecture diagram
4. snippet de codigo
5. resultados: 95% accuracy

engagement gold: codigo real + problema real
```

### Métricas Reales

```
"gasty metrics update (semana 12):

usuarios activos: 180 (+15%)
transacciones procesadas: 45k (+30%)
accuracy AI: 94% (+2%)
costos mensuales: $62 (-10%)

lo que funciona: SEO + word of mouth
lo que no: twitter (todavia)"

transparencia = credibilidad
```

### Fails Documentados

```
"top 3 fails building gasty:

1. pase 2 semanas en un feature que nadie usa (graficos comparativos)
2. no valide inputs del form, ahora tengo data corrupta
3. use una libreria de charts de 400kb, el bundle se fue a la mierda

cada fail = leccion. documentalos"
```

---

**Nota Final**: Este plan es una guía, no una biblia. Adaptalo a lo que funcione para vos. Lo importante: consistencia + autenticidad + utility. El resto se acomoda solo.

**Next Steps**:
1. Pick 7 tweets de este doc para la semana que viene
2. Scheduleá en Buffer/Hypefury (o postea manual)
3. Trackea que funciona (engagement, clicks)
4. Itera el tono basado en feedback
5. Repite

Let's build in public 🚀
