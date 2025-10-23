# Respuestas Reddit - Ahorrín

## Para brisaabader16 (Falta Santander 😔)

```markdown
Dale que justo agregué algo que te va a servir!

Ahora podés subir CSV/Excel de **CUALQUIER banco** (incluido Santander) y el sistema te deja mapear las columnas vos mismo.

Básicamente:
- Subís el archivo
- Te muestra un preview
- Vos le decís "esta columna es la fecha, esta es el monto, etc"
- Listo, importa todo

Probalo y avisame si te anda! Si hay drama te ayudo a debuggearlo 👍
```

---

## Para macnikos (Santander y Scotia no reconocidos)

```markdown
Uff justo! Literal que implementé esto hace 2 días y resuelve exactamente tu problema.

Ahora hay un **sistema de preview** que te deja subir CSV/Excel de CUALQUIER banco. Ya no importa el formato que use cada banco.

Te lo explico rápido:

1. Subís tu CSV/Excel
2. Sale un preview con TODA la data
3. Vos asignás las columnas con dropdowns (Fecha, Monto USD, Monto UYU, Concepto, etc)
4. Para cada monto elegís si es Gasto o Ingreso
5. Podés editar celdas si hay boludeces
6. Te marca errores en rojo
7. Eliminás lo que no querés
8. Importás

Es súper flexible. Literalmente podés subir lo que sea y mapearlo.

**Probá de nuevo** con esos archivos de Santander y Scotia - ahora debería andar joya. Si seguís con problemas mandame los CSV por privado y lo checkeo.

Lo del tutorial está en la lista, mientras agregué una FAQ que explica cómo exportar de cada banco.

Gracias por el feedback che! 🙌
```

---

## Para Parking_Housing7099 (tickets, gasto hormiga)

```markdown
Te re entiendo lo del extracto bancario, a mí tampoco me copa subir eso.

Por eso justo **saqué el soporte de PDFs** - ahora Ahorrín NO acepta PDFs de extractos por tema privacidad (tienen cuenta, saldo, dirección, un montón de data al pedo).

Para lo tuyo del gasto hormiga tenés dos opciones:

**1. Meter a mano**
Carga rápida con el form, ideal para cafecito y esas cosas

**2. Excel tuyo**
Armás una planilla con tus gastos y la subís. El nuevo preview te deja mapear todo vos mismo, editar, sacar lo que no sirve, etc.

Nada de extractos si no querés.

¿Con qué app sacás foto de tickets? Me copa la idea para agregar después.

Probalo y contame! 👌
```

---

## Para RebelGatekeeper250 (30 repos abandonados)

```markdown
JAJAJA los 30 repos me re identifico 😂

Mal, el data input es un embole. Por eso le metí full a esto:

**Nuevo sistema de preview** que acepta CSV/Excel de lo que sea:
- Te muestra todo antes de importar
- Vos asignás las columnas
- Elegís si es gasto o ingreso
- Editás al toque lo que esté mal
- Te marca errores
- Importás solo lo bueno

**Sumale:**
- Reglas automáticas (DISCO → Supermercado)
- Normalización (DISCO MVD → DISCO)
- IA que categoriza

La idea es: cargás una vez, configurás reglas, y chau, después es automático.

¿Tenés alguna idea de cómo mejorarlo más? Tiro ideas siempre 🚀
```

---

## Para Cruel_realidad (gastos compartidos con pareja)

```markdown
Uff sí, gastos compartidos con pareja es re pedido.

Tengo en mente:
- Cuenta compartida
- Ver quién gastó qué
- Balance de "quién le debe a quién"
- Categorías compartidas

Por ahora con el nuevo CSV que hice podés:
- Cada uno sube su extracto
- El preview te deja ver y limpiar todo antes
- Categorizan juntos

Pero sí, falta la feature posta de gastos compartidos.

Probalo y después contame qué features específicas necesitás. Lo meto en la lista 📝
```

---

## Para Renmang (Apple Pay + Shortcuts automation)

```markdown
Esto es TERRIBLE idea! No había pensado en Apple Pay + Shortcuts 🤯

Lo del widget + automation + POST es re inteligente. Básicamente:
- Pagás con el celu
- Automation lo agarra
- POST a la API
- Aparece en "Pendientes"
- Categorizás

Es el posta para resolver el problema de data input.

Tendría que hacer:
- API pública con tokens
- Webhook para recibir
- UI de "pendientes"

**¿Ya lo tenés armado? ¿Cómo te fue?** Me re interesa saber si tiene alguna trampa.

Mientras tanto metí un preview re flexible para CSV/Excel que acepta cualquier cosa.

Gracias por la idea, la sumo! 🔥
```

---

## Para jepogamer (app similar con Gemini)

```markdown
Uh qué crack! Re copado que hayas hecho la tuya.

Lo del scraping de súpers para precios es terrible idea - yo había pensado lo mismo.

Lo del EAN en el súper es buenísimo. **¿Usaste alguna API para los códigos de barras o todo scraping custom** de las webs?

Si pintás compartir ideas o ver código mandame MD. Siempre está bueno ver cómo resolvió cada uno 👨‍💻
```

---

## Para JumpyAerie9862 (backend configurable)

```markdown
Gracias! Me gusta la idea del data store configurable.

¿Decís algo tipo "traé tu propia DB" o más bien self-hosting completo?

Ahora uso Supabase (PostgreSQL con RLS), pero podría estar bueno dejar que users técnicos hostien su propia instancia.

Lo meto en la roadmap - tiene sentido para gente que quiere control total 🔐
```

---

## Para SantiagoLorenzo (problema login resuelto)

```markdown
Uh qué bien que pudiste!

Sí el email a veces tarda, es Supabase que le pega la vuelta. Tengo que optimizar eso.

Cualquier cosa que veas rara avisame! Gracias por probar 🙏
```

---

## Notas

- Todas las respuestas están en Markdown listas para copy-paste en Reddit
- Enfoque principal: nuevo sistema de preview CSV/Excel
- Tono informal y cercano
- Destacar que ya NO se aceptan PDFs por privacidad
- Énfasis en flexibilidad del sistema (acepta cualquier banco/formato)
