# Investigación — Guion / copy para reels de PyME local

> Base para escribir la **skill `guionista`** de YourMKT: la IA que escribe el **texto hablado**
> (la locución) de los reels. Sintetiza copywriting clásico + data de retención de plataformas +
> recursos de creadores/agencias. Cada sección cita fuentes con URL. Donde hay desacuerdo, está
> marcado como **[Discrepancia]**.
>
> Alcance: español rioplatense (voseo argentino), reels de 12–30 s, voz en off TTS.
> Lo que SÍ y lo que NO le corresponde al guionista está al final (§12).

---

## 0. TL;DR operativo (la regla de bolsillo)

1. **Inferí el nivel de conciencia** de quien va a ver la pieza (§2). Por defecto en un reel de
   descubrimiento (frío): **Problem-Aware**. Eso decide **por dónde arranca el guion**.
2. **Ajustá la forma del claim** según la **sofisticación** de la categoría (§2.2): claim crudo si
   es virgen; **mecanismo único** si está saturada; **identidad** si está muerta.
3. **Esqueleto siempre = Hook → Story → Offer** (§3). Dentro de "Story" metés PAS / BAB / FAB /
   SB7 según el objetivo. El hook se filtra por las **4 U** + los **3 tests de Harry Dry**.
4. **Hook hablado: 5–10 palabras**, promesa/tensión en la **primera línea**. Abrí un **open loop**
   y cerralo en el **payoff** (§4). Dosificá la información, no la descargues.
5. **Soft-sell**: el producto aparece como **resolución de una tensión**, no como pitch. **Un solo
   CTA** (§5, §8).
6. **Escribí para el oído** (§9): frases cortas, una idea por frase, segunda persona, ~**2,5
   palabras/seg** (≈75–90 palabras en 30 s). Marcá pausas (`…`) y énfasis (MAYÚSCULAS).
7. **Specificity over everything** (§7): número/detalle concreto > adjetivo. Matá los tells de IA
   (§10): nada de "elevá / desbloqueá / en un mundo donde / no es solo X, es Y".

---

## 1. HOOKS / los primeros 3 segundos

### 1.1 La ventana real

La decisión de quedarse o deslizar es refleja y ocurre en **~1 segundo**, no en 3; "3 segundos"
es la métrica que reporta la plataforma, no la ventana de decisión del viewer. Por eso el **hook
verbal** debe decirse en **5–10 palabras** y la promesa/tensión tiene que estar en el **primer
frame** y la **primera línea de voz**, sin build-up.
([OpusClip](https://www.opus.pro/blog/tiktok-hook-formulas),
[vidIQ](https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/),
[vexub](https://vexub.com/blog/viral-short-form-video-hooks))

Un buen hook hace **dos cosas a la vez**: (1) **interrumpe el scroll** y (2) **da una razón para
seguir** (abre un loop de curiosidad o promete valor claro). Lo ideal es que **tres capas digan lo
mismo**: visual + texto en pantalla + voz. *(El guionista controla la capa voz; las otras dos las
dirige reel-director / graphics-director — ver §11.)*
([vidIQ](https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/))

### 1.2 Los disparadores psicológicos (por qué frenan el scroll)

- **Curiosidad / open loop / brecha de información.** Loewenstein (1994): la curiosidad es la
  tensión de percibir una **brecha específica y acotada** entre lo que sé y lo que quiero saber.
  Clave contraintuitiva: **la ignorancia total NO genera curiosidad** — motiva el *conocimiento
  parcial* que revela la brecha. Por eso se da "una pizca" de info como cebo, no todo.
  Relacionado: **efecto Zeigarnik** (lo incompleto queda "abierto" en la mente).
  ([Loewenstein, CMU PDF](https://www.cmu.edu/dietrich/sds/docs/golman/Information-Gap%20Theory%202016.pdf),
  [Psychology Fanatic](https://psychologyfanatic.com/information-gap-theory/))
- **Pattern interrupt.** Algo que rompe el flujo esperado. **Debe conectar con lo que sigue**; el
  caos aleatorio fracasa. ([OpusClip](https://www.opus.pro/blog/tiktok-hook-formulas))
- **Auto-relevancia / "esto es para vos".** El target explícito ("Si te sangran las encías…") sube
  la retención porque el viewer se reconoce. ([vexub](https://vexub.com/blog/viral-short-form-video-hooks))
- **Emoción / arousal (intensidad).** Berger & Milkman (Wharton, ~7.000 notas del NYT): la
  viralidad la impulsa el **arousal**, no la valencia. Alto arousal (asombro, enojo, ansiedad) se
  comparte; bajo arousal (tristeza) no.
  ([Berger & Milkman, JMR](https://journals.sagepub.com/doi/10.1509/jmr.10.0353))
- **Negatividad / controversia / contrarian.** El sesgo de negatividad sube la **atención**.
  **[Discrepancia]**: Berger & Milkman muestran que, en neto, lo *positivo* se comparte más — el
  driver real es el alto arousal, no "ser negativo". Práctica: usá lo contrarian para **frenar**
  ("Dejá de…"), sin abusar (erosiona la confianza de marca).
  ([Nature Human Behaviour](https://www.nature.com/articles/s41562-023-01538-4),
  [Enleaf](https://enleaf.com/negativity-bias-in-marketing/))
- **Especificidad.** Números/resultados exactos vencen a lo vago. "Ayudé a cientos" < "0 a 50.000
  en 90 días". ([OpusClip](https://www.opus.pro/blog/tiktok-hook-formulas))
- **Stakes / FOMO / prueba social.** Lo que está en juego, el miedo a quedar afuera, "otros ya lo
  validaron". ([vexub](https://vexub.com/blog/viral-short-form-video-hooks))

### 1.3 Hook ↔ retención / hold-rate (qué números son "buenos")

Una vista de 3 s y una de 30 s cuentan como 1 view pero dicen cosas distintas. **No hay benchmark
oficial de Instagram** → compará contra el promedio de tu propia cuenta.

| Métrica | "Bueno" | Fuente |
|---|---|---|
| Retención a los 3 s (hold de hook) | **≥ 65 %** (perder >35 % en 3 s = hook débil) | [OpusClip](https://www.opus.pro/blog/tiktok-hook-formulas) |
| Retención a los 3 s (otra fuente) | **≥ 80 %** | [Shortimize](https://www.shortimize.com/blog/youtube-shorts-retention-rate) |
| "Viewed vs Swiped Away" objetivo | **~70 %+** | [vidIQ](https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/) |
| % promedio visto (Shorts) | **≥ 70 %** = "engaging" | [Shortimize](https://www.shortimize.com/blog/youtube-shorts-retention-rate) |
| Swipe-away rate sano | **10–30 %**; >40 % = bandera roja | [Shortimize](https://www.shortimize.com/blog/how-to-analyze-youtube-shorts-performance) |

**[Discrepancia]** el umbral "bueno" a los 3 s va de **65 % a 80 %** según fuente.

**Diagnóstico de la curva** (útil para iterar guiones): caída fuerte en los **primeros 1–2 s** →
problema de **hook/frame de apertura**. Retención que aguanta 5–7 s y **luego** se desploma → el
hook funcionó pero el **contenido no cumplió la promesa** (no entregó payoff/prueba a los ~10–15 s).
([OpusClip](https://www.opus.pro/blog/tiktok-hook-formulas))

### 1.4 Errores que entierran el hook

- **Saludo genérico** ("hola a todos", "bienvenidos") — el que más mata la retención.
- **Slow build / backstory primero** — sirve en formato largo, es muerte en reel.
- **Branding primero** (logo/intro/jingle): se pierde 30–40 % en los primeros 5 s. Brandeá por
  tono y visual, el logo va después.
- **Hablar *sobre* el video** ("en este video les voy a contar…") en vez de empezarlo.
- **Vaguedad** ("¿querés más ventas?") — sin especificidad no hay tensión.
- **Promesa incumplida / clickbait** sin payoff → cae retención y confianza.
- **Dos ideas en un hook** — un solo trigger por hook (combinar máximo dos).
([ScaleLab](https://scalelab.com/en/hooks-for-intros-how-to-engage-users-from-the-first-5-seconds),
[OpusClip](https://www.opus.pro/blog/tiktok-hook-formulas))

> **Proceso:** nunca uses tu primer hook. Generá **3–5 variantes** con fórmulas distintas y elegí
> la de más tensión. ([vidIQ](https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/))

### 1.5 LIBRERÍA DE FÓRMULAS DE HOOK (22, rellenables)

Cada plantilla es **una línea hablada**, 5–14 palabras. `[corchetes]` = huecos a rellenar.
Combinar **máximo dos** disparadores.

**Grupo A — Curiosidad / open loop / brecha de información**
1. **Secreto del rubro** — "Nadie en [rubro] te va a contar esto: [afirmación sorprendente]."
   · *Perfumería:* "Nadie en perfumería te dice por qué tu fragancia desaparece a las 2 horas."
2. **Lo que no sabías** — "Resulta que [dato contraintuitivo] y no lo podía creer."
   · *Panadería:* "Resulta que tu pan se pone duro más rápido en la heladera."
3. **¿Y si…?** — "¿Y si te dijera que [creencia común] está completamente al revés?"
   · *Gimnasio:* "¿Y si te dijera que hacer más abdominales no te marca la panza?"
4. **Historia inconclusa** — "Casi [mal resultado]… hasta que descubrí [una cosa]."
   · *Dentista:* "Casi pierdo una muela… hasta que entendí algo que nadie me había explicado."
5. **Lo que esconden** — "Esto es lo que [los del rubro] no quieren que sepas sobre [tema]."
   · *Perfumería:* "Esto es lo que las grandes marcas no quieren que sepas del precio del perfume."
6. **Tease numerado** — "El número [N] de esta lista te va a cambiar el/la [aspecto]."
   · *Gimnasio:* "El tercero de estos errores es el que no te deja bajar de peso."

**Grupo B — Contrarian / controversia / pattern interrupt verbal**
7. **"Dejá de…"** — "Dejá de [hacer X] si querés [resultado Y]."
   · *Dentista:* "Dejá de cepillarte apenas comés si querés cuidar el esmalte."
8. **Opinión impopular** — "Opinión impopular: [afirmación audaz sobre el rubro]."
   · *Panadería:* "Opinión impopular: el pan integral del súper no es más sano que el blanco."
9. **Todo está mal** — "Todo lo que sabés sobre [tema] está mal."
   · *Gimnasio:* "Todo lo que sabés sobre estirar antes de entrenar está mal."
10. **Mata-mito** — "Pará de [práctica común] — esto es lo que de verdad funciona."
    · *Perfumería:* "Pará de frotarte el perfume en las muñecas — así dura de verdad."

**Grupo C — Auto-relevancia / "esto es para vos"**
11. **Target directo** — "Si [situación específica del cliente], esto es para vos."
    · *Dentista:* "Si te sangran las encías al cepillarte, esto es para vos."
12. **Empatía / problema** — "Si peleás con [problema], mirá esto antes de rendirte."
    · *Gimnasio:* "Si entrenás hace meses y no ves cambios, mirá esto antes de rendirte."
13. **Frustración relatable** — "¿Por qué nadie habla de [cosa molesta del rubro]?"
    · *Perfumería:* "¿Por qué nadie habla de lo rápido que se evapora un perfume barato?"
14. **Aspiración** — "Imaginate [escenario soñado] sin [esfuerzo/dolor habitual]."
    · *Panadería:* "Imaginate pan recién horneado cada mañana sin levantarte a amasar."

**Grupo D — Especificidad / resultado / prueba**
15. **Resultado concreto** — "[Resultado exacto] en [plazo corto] haciendo esto."
    · *Gimnasio:* "Bajé 6 kilos en 8 semanas cambiando una sola comida del día."
16. **Prueba primero** — "Mirá lo que pasa cuando [acción]…" *(resultado en frame 1)*
    · *Panadería:* "Mirá lo que pasa cuando dejás fermentar la masa 24 horas."
17. **Prueba social con número** — "Esto ayudó a [número] de mis [clientes] a [resultado]."
    · *Dentista:* "Este truco ayudó a más de 200 pacientes a perderle el miedo al blanqueamiento."
18. **Antes/después** — "Así estaba [X] antes… y así quedó después de [acción]."
    · *Perfumería:* "Así olía a la mañana… y así seguía oliendo a las 8 de la noche."

**Grupo E — Stakes / FOMO / advertencia**
19. **Advertencia de error** — "Estás arruinando tu [tema] con [hábito] sin darte cuenta."
    · *Dentista:* "Estás arruinando tu blanqueamiento con esta bebida sin darte cuenta."
20. **FOMO** — "Todos en [rubro/zona] ya hacen esto menos vos."
    · *Gimnasio:* "Todos en el barrio ya entrenan así menos vos."
21. **Costo de no hacer** — "Si seguís [hábito], en [plazo] te va a costar [consecuencia]."
    · *Panadería:* "Si seguís comprando pan envasado, en un mes gastaste el doble por la mitad de sabor."

**Grupo F — Utilidad directa (curiosidad + valor)**
22. **Hack simple** — "Un truco simple para [objetivo] sin [costo/esfuerzo]."
    · *Perfumería:* "Un truco simple para que tu perfume dure el doble sin gastar más."

> Plantillas extra para combinar (verbatim de fuentes): "¿Sabías que…?", "X vs Y", "3 cosas que
> hago antes de…", "[N] errores que comete [audiencia] en su primer [hito]".
> ([vidIQ](https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/),
> [vexub](https://vexub.com/blog/viral-short-form-video-hooks))

---

## 2. NIVELES DE CONCIENCIA DE LA AUDIENCIA (Eugene Schwartz) — el eje central

Schwartz (*Breakthrough Advertising*, 1966) cruza **dos** ejes que NO son lo mismo:
- **Conciencia** = cuánto sabe **el prospecto** (problema → solución → tu producto). Decide
  **DÓNDE arranca el guion**.
- **Sofisticación** = cuántas promesas ya escuchó **el mercado entero** para esa categoría
  (fatiga/escepticismo). Decide **QUÉ FORMA adopta el claim** cuando llegás al producto.

### 2.1 Los 5 niveles de conciencia

| Nivel | Qué SABE | Qué CREE | Regla de Schwartz |
|---|---|---|---|
| **1. Unaware** | No sabe que tiene un problema ni reconoce la categoría | "Estoy bien / esto es normal" | No menciones producto NI deseo. Solo identificación emocional ("echoing an emotion") |
| **2. Problem-Aware** | Siente el dolor, no sabe que hay solución/causa | "Me molesta, no sé qué hacer" | Nombrá y dramatizá el problema; la salida recién al final |
| **3. Solution-Aware** | Sabe que existe un *tipo* de solución, no eligió | "Hay formas; ¿cuál?" | Nombrar deseo → probar que se satisface → posicionar tu enfoque como el mejor |
| **4. Product-Aware** | Conoce TU producto, no se decidió | "Lo conozco, ¿es para mí / mejor / vale?" | Reforzar deseo, mecanismo nuevo, prueba, romper objeciones |
| **5. Most-Aware** | Lo sabe todo y confía | "Lo quiero; dame una razón para AHORA" | Solo nombre + oferta + CTA |

Cita que ordena todo: **"Cuanto más consciente es tu mercado, más fácil es la venta y menos
necesitás decir."**
([gameofconversions](https://gameofconversions.com/customer-awareness-stages/),
[leadgen-economy](https://www.leadgen-economy.com/blog/five-stages-awareness-lead-generation/))

### 2.2 Las 5 etapas de sofisticación (distinto de conciencia)

| Etapa | Estado del mercado | Movida del claim |
|---|---|---|
| **1. Primero** | Nunca vio la categoría | **Claim directo y simple**, la promesa más fuerte |
| **2. Competencia** | El claim aún funciona | **Amplificar**: superá el claim al límite |
| **3. "Lo escuché todo"** | El claim pelado ya no convence | **Mecanismo nuevo**: el *cómo* va al titular |
| **4. Competitivo** | Cansado pero con esperanza | **Elaborar el mecanismo**: más rápido/fácil/seguro |
| **5. Saturado** | Escéptico total | **Identificación**: conectá con la *identidad*, no con la promesa |

([motiveinmotion](https://www.motiveinmotion.com/market-sophistication/),
[valchanova](https://valchanova.me/breakthrough-advertising-copywriting-book-review/))

> **[Discrepancia]** Copy Posse y otros etiquetan las **5 etapas de sofisticación** como "5 levels
> of market awareness". Es un error de nombre frecuente. Son ejes separados — no los confundas.

**Cómo se combinan:** una audiencia *Problem-Aware* en una categoría *etapa-3* → arrancás por el
dolor (conciencia) **pero** cuando llegás a la solución liderás con un **mecanismo único**, no con
la promesa pelada (sofisticación).

### 2.3 Cómo cambia el GUION en cada nivel (la tabla maestra)

| Nivel | Dónde ARRANCA | Qué LIDERA el hook | Cuánto hablar del producto | Prueba que necesita | NO hagas |
|---|---|---|---|---|---|
| **Unaware** | Lejos del producto: emoción / escena / identidad | Pattern interrupt + identificación / mini-historia | Casi nada; aparece tarde o no aparece | Relato/caso ajeno, relatabilidad | Nombrar features, deseo técnico, "comprá", jerga |
| **Problem-Aware** | En el dolor del viewer | Callout del problema + agitación | Recién al final, como salida; categoría > marca | Validar que el problema es real y común | Saltar a vender en el seg 1; listar specs |
| **Solution-Aware** | En el tipo de solución / el after | Diferenciación + visión del resultado | Sí, como "el mejor camino dentro de la categoría" | Comparación, testimonios, demo del mecanismo | Educar sobre el problema (ya lo saben) |
| **Product-Aware** | En tu producto | Razón nueva / mecanismo / objeción rota | Mucho: features, beneficios, demo, garantía | Casos, demo, reseñas, antes/después, garantía | Re-explicar la categoría; esconder el precio sin razón |
| **Most-Aware** | En la oferta | Oferta + urgencia/escasez | Asumido: nombre + oferta + CTA | Mínima (prueba social que confirma) | "Vender" de nuevo; diluir el CTA |

Regla transversal: **niveles 1–3 = registro emocional; niveles 4–5 = registro lógico/prueba.**
([brittanymcbean](https://brittanymcbean.com/the-5-stages-of-awareness-you-need-to-know-for-your-next-launch/),
[betweenthelinescopy](https://betweenthelinescopy.com/blog/stages-of-awareness/))

### 2.4 Cómo INFERIR el nivel desde el brief (heurísticas para el agente)

No se mide directo; se infiere de **categoría + notoriedad de marca + fuente de tráfico +
palabras del cliente**.

- **Por categoría.** Categoría conocida (gym, perfume, café, peluquería) → **Solution-Aware como
  mínimo**; no empieces explicando "necesitás entrenar". Producto/mecanismo novedoso que nadie
  busca → **Unaware/Problem-Aware** (hay que educar). Commodity saturado → **alta sofisticación**
  (necesitás mecanismo o identidad).
- **Por notoriedad de marca.** Marca local con seguidores/recurrencia → su audiencia tibia es
  **Product/Most-Aware**. Marca nueva que nadie busca → para frío es **Unaware/Problem-Aware**.
- **Por fuente de tráfico (la heurística más fuerte en social):**
  - **Reel de descubrimiento / FYP / frío** → asumí el **nivel más bajo plausible** de la
    categoría (Unaware/Problem-Aware). Hook = problema o pattern interrupt; **sin precio**.
  - **Retargeting / seguidores / quien ya interactuó** → **Product/Most-Aware**: oferta, demo, CTA.
  - **Búsqueda con intención** ("mejor X cerca", "X vs Y") → **Solution/Product-Aware**:
    diferenciación, comparación.
- **Por palabras del cliente** (si hay comentarios/reseñas): habla del síntoma → Problem; compara
  opciones → Solution; pregunta por tu producto/precio → Product/Most.

> **Default para reels de un negocio chico:** un mismo negocio vive en **varios niveles a la vez**.
> Por eso el calendario tiene piezas frías (Problem-Aware, alcance) y tibias (Product/Most,
> conversión). **La colocación/objetivo de cada pieza define su nivel.** En la práctica el
> `campaign-director` ya asigna objetivo/ángulo a cada pieza; el guionista lee eso e infiere el
> nivel.
> ([sophiavegadigitalmarketing](https://sophiavegadigitalmarketing.com/what-is-customer-awareness-the-5-levels-every-service-provider-must-know/),
> [medium/cold-vs-warm](https://medium.com/illumination/cold-traffic-vs-warm-traffic-understanding-the-difference-d436bd2354f9))

### 2.5 Ejemplo trabajado — mismo producto, distinto nivel

**Perfume artesanal local ("Bruma"):**
- **Unaware:** "Hay un olor que te devuelve a un lugar al que no podés volver." *(evocación; nada de "comprá")*
- **Problem-Aware:** "Usás el mismo perfume que media oficina. Por eso no te recuerdan a vos."
- **Solution-Aware:** "Los perfumes de nicho cuestan una fortuna. Te muestro cómo conseguir esa complejidad, hecha a mano, acá."
- **Product-Aware:** "Por qué Bruma dura 8 horas y el de farmacia, 2: maceración de 30 días."
- **Most-Aware:** "Volvió Bruma 'Higo & Sal'. 30 frascos. Link en bio."

**Gimnasio de barrio:**
- **Unaware:** "Llegás a tu casa, te tirás al sillón, y mañana otra vez igual."
- **Problem-Aware:** "No es falta de voluntad. Es que el gym te queda a 40 minutos y nunca vas."
- **Solution-Aware:** "Entrenar funciona — pero entrenar en grupo y a la vuelta de tu casa es lo que hace que vuelvas."
- **Product-Aware:** "En [Gym] entrenás en grupos de 6, con plan que se ajusta cada semana. Mirá una clase real."
- **Most-Aware:** "Inscripción sin matrícula esta semana. Quedan 10 lugares en el turno 7 am."

### 2.6 Conciencia → framework + tipo de hook

| Nivel | Framework de copy | Tipo de hook |
|---|---|---|
| **Unaware** | AIDA / storytelling / BAB | Pattern interrupt / relatable / mini-historia |
| **Problem-Aware** | **PAS** (mejor calce) | Problem callout / contrarian / curiosity gap |
| **Solution-Aware** | BAB / comparación | Visión del after / "X anda, pero hay algo mejor" / "X vs Y" |
| **Product-Aware** | FAB + mecanismo único + risk reversal | Razón-para-elegirte / objeción rota / demo |
| **Most-Aware** | Oferta directa / FOMO | Oferta + escasez/urgencia |

> **[Discrepancia]** PAS sirve para problema **ya sentido** (problem-aware); BAB para **revelar** un
> problema/transformación aún no visualizado (más cerca de unaware/solution-aware). La elección
> depende del nivel, no del gusto del copywriter.

---

## 3. FRAMEWORKS DE COPY (adaptados a 15–30 s de voz)

| Framework | Pasos (1 línea) | Mejor para (rol de la pieza) |
|---|---|---|
| **PAS** | Problema → Agitación → Solución | **Deseo/conversión** con dolor ya sentido |
| **AIDA** | Atención → Interés → Deseo → Acción | **Default / general**, awareness→conversión |
| **BAB** | Before → After → Bridge | **Deseo/transformación** (encaja con before/after visual) |
| **4 P (Promise-Picture-Proof-Push)** | Promesa → imagen del problema resuelto → prueba → empuje | **Prueba/conversión** (Proof es el diferencial) |
| **4 P (Problem-Promise-Proof-Proposal)** | Problema → promesa → prueba → propuesta | Igual, pero menos "aspiracional", más serio |
| **FAB** | Feature → Advantage → Benefit | **Comparación / "por qué nosotros"**, audiencia consciente |
| **StoryBrand SB7** | Personaje (cliente=héroe) → problema → guía (marca=Yoda) → plan → CTA → fracaso → éxito | **Awareness / claridad de marca** |
| **Hook-Story-Offer** | Hook → historia → oferta | **El molde nativo del reel** (esqueleto base) |
| **4 U** (hooks) | Useful · Urgent · Unique · Ultra-specific | **Filtro del primer segundo** (no es pieza completa) |

> **[Discrepancia]** "4 P" tiene dos escuelas: Promise-**Picture**-Proof-Push (aspiración) vs
> Problem-Promise-Proof-**Proposal** de Ray Edwards (cuando "pintar una imagen" suena chamuyero).
> No es error, son escuelas distintas.

**Regla de anidamiento (lo más importante):** el reel **siempre** es **Hook-Story-Offer**; el
contenido de la "Story" usa PAS / BAB / FAB / SB7 según objetivo; el hook se filtra con las **4 U**
+ los **3 tests de Harry Dry** (§7).
([Copyhackers](https://copyhackers.com/2015/10/copywriting-formula/),
[Animus Studios](https://www.animusstudios.com/blog/ad-formats-and-structures-combining-copywriting-formulas-with-storytelling-frameworks),
[Hook-Story-Offer (Brunson)](https://www.breakthroughmarketingsecrets.com/blog/hook-story-offer-ad-copywriting-formula-russell-brunson-from-clickfunnels/))

### Tabla de decisión — OBJETIVO → framework

| Objetivo / rol de la pieza | Framework(s) |
|---|---|
| Awareness / frenar el scroll | **Hook-Story-Offer** (esqueleto) + **4 U** (filtro del hook) |
| Awareness / claridad de marca | **StoryBrand SB7** |
| Deseo (dolor conocido) | **PAS** |
| Deseo (transformación) | **BAB** |
| Prueba / vencer desconfianza | **4 P** (Proof) |
| Comparación / audiencia consciente | **FAB** |
| Conversión directa | **AIDA** o **PAS** con CTA fuerte |
| No sé cuál (default) | **AIDA** dentro de **Hook-Story-Offer** |

**Ejemplos cortos (cada uno ≈20–30 s de voz):**
- *PAS (peluquería):* "¿Pagás una fortuna por color y a las 3 semanas ya se te ve el crecimiento?
  Y volver al salón cada mes es plata y una tarde perdida. Por eso hacemos balayage de bajo
  mantenimiento: te dura 3 meses sin retoque. Reservá en el link."
- *BAB (uñas):* "Antes: te las hacías en casa, se descascaraban en 4 días. Ahora: kapping en gel
  que aguanta 3 semanas. El puente es venir una vez al mes — agendá hoy."
- *FAB (panadería):* "Masa madre fermentada 24 horas — por eso se digiere más fácil que el pan
  común — así comés tu tostada sin sentirte pesado."
- *Hook-Story-Offer (food truck):* "Casi cierro el food truck en enero. Vendía 20 hamburguesas
  por noche hasta que cambié una cosa: pan brioche hecho acá. Ahora hago 120. Vení esta semana
  a Plaza Mitre y probá por qué."

---

## 4. SECUENCIA / "cuándo decir cada cosa"

**Estructura base: Hook → Body → Payoff → (CTA/loop).**
([Socialync](https://www.socialync.io/blog/short-form-video-structure-guide-2026))

- **Open loops / re-hook.** Abrí un mini-loop **antes** de que el viewer decida si se queda ("ya
  te cuento por qué esto importa…"). Numerá el progreso ("paso 2 de 3"). Re-hook visual/verbal cada
  3–5 s ("pero acá está lo importante…").
- **Information gap (Loewenstein) + Zeigarnik.** La curiosidad nace de un vacío **acotado**;
  dosificá. **Regla anti-clickbait:** todo gap que abrís lo tenés que **cerrar** con valor real.
  ([Zeigarnik/open loops](https://blog.neuromarket.co/the-power-of-open-loops-using-the-zeigarnik-effect-to-create-irresistible-content))
- **Payoff.** Entregá **exactamente** lo prometido. Si el hook dijo "3 cosas", el tercero tiene que
  aparecer. Tipos: reveal, transformación, twist, loopback (cierre que reconecta con el frame inicial
  y "reinicia" el video → sube watch-time).

### Beat sheet — reel 30 s (voz)

| Seg | Beat | Qué decir |
|---|---|---|
| 0–1.5 | **Hook** | Promesa/tensión ultra-específica (filtrá por 4 U). Abrí el loop. |
| 1.5–4 | **Re-afirmar el gap** | "…y lo que pasó te va a sorprender". Numerá si aplica. No resuelvas. |
| 4–12 | **Body parte 1** | Primer punto/escena; empezás a pagar de a poco. |
| 12–14 | **Mid-roll re-hook + CTA suave** | "pero esperá, la 3 cambia todo" + "guardalo para no perderlo". |
| 14–24 | **Body parte 2** | Puntos 2 y 3, escalando al mejor para el final. |
| 24–28 | **Payoff** | Resolvé el loop del hook. Concreto. |
| 28–30 | **CTA único + loop** | Un solo CTA; loopback opcional al frame inicial. |

**Variante 15 s:** hook (0–1.5) → un solo punto/loop (1.5–10) → payoff (10–13) → CTA (13–15).
Sin mid-roll.

---

## 5. PROMOCIONAR SIN SONAR A VENDEDOR (soft-sell)

- **Soft sell vs hard sell.** Hard = pide la compra directo. Soft = aporta valor y deja que el
  producto aparezca como consecuencia. La gente entra a redes a socializar, no a que la bombardeen.
  ([Jera Bean](https://www.jerabean.com/blog/selling-on-social-hard-sell-vs-soft-sell))
- **Value-first.** Ratios de referencia (guías, no leyes): **80/20**, **4-1-1** (de 6 piezas: 4
  valor, 1 soft, 1 hard). El valor genera engagement → amplifica alcance → hace que el 20 % promo
  rinda más. *(Esto es decisión de `campaign-director`; el guionista debe respetar el rol asignado
  a la pieza.)*
  ([Lift Digital](https://lift-digital.net/blog/what-is-the-80-20-rule-in-social-media/))
- **Producto = resolución de una tensión.** El producto aparece como parte de la solución de una
  mini-historia, no como un logo parado. Story-led ≈ 86 % recall vs 65 % del pre-roll. "Para cuando
  aparece el link, no se siente vendido." (= el bloque "Story" de Hook-Story-Offer / el "Bridge" de
  BAB.) ([MGID](https://www.mgid.com/blog/how-storytelling-in-native-ads-drives-higher-affiliate-conversions))
- **Un solo CTA por pieza.** Varios CTAs confunden y bajan la acción.
- **Pieza de valor (mayoría)** = educar/entretener, producto roza al pasar, audiencia fría.
  **Pieza de hard-sell (minoría)** = oferta + CTA de compra, audiencia tibia. El valor previo es lo
  que hace que el hard-sell ocasional convierta.

---

## 6. HABLAR DE LA COMPETENCIA

- **Comparativa indirecta > directa para PyME.** Comparar contra la **categoría / la vieja forma**,
  no contra un nombre. "Punch up" (challenger chico vs grande) genera simpatía; el grande
  comparándose con el chico parece bully — el negocio local es naturalmente el David.
  ([Shopify](https://www.shopify.com/blog/comparative-advertising),
  [MasterClass](https://www.masterclass.com/articles/comparative-advertising))
- **Ángulo contrarian / "el anti-X".** Elegí un **enemigo real**: un mal hábito, un proceso roto,
  una creencia falsa, el método viejo. Fórmula: nombrar el enemigo → a quién ayudás → el problema
  caro que resolvés → prueba. (Liquid Death vs plástico; Oatly vs convenciones.)
  ([blog.mean.ceo](https://blog.mean.ceo/anti-marketing-stand-out/))
- **Diferenciador → hook:** "La mayoría de [categoría] hace X — nosotros hacemos Y."
  - *Perfumería:* "Los perfumes de góndola gastan el 80 % en una caja que vas a tirar. Nosotros lo
    gastamos en aceite esencial."
  - *Gimnasio:* "En las cadenas sos un número de socio. Acá el profe sabe tu nombre."
  - *Panadería:* "El pan del súper dura una semana porque tiene conservantes. El nuestro se pone
    duro al día siguiente — porque es pan de verdad." *(convierte una "debilidad" en prueba)*
- **Salvedades éticas/legales.** **[Discrepancia]**: Shopify/MasterClass tratan la comparativa
  directa como herramienta legítima; las fuentes legales la marcan como zona de **alto riesgo**
  (Lanham Act §43(a): incluso claims literalmente ciertos pueden ser engañosos si se presentan mal;
  caso Listerine). **Síntesis para PyME: ángulo anti-categoría sin nombre propio**, todo claim
  **verdadero y verificable**, respaldado con prueba propia. Nunca ensuciar al rival (te ves
  inseguro; costo de confianza).
  ([Luthor/FTC](https://www.luthor.ai/blog-post/ftc-comparative-advertising),
  [Bona Law](https://www.bonalaw.com/insights/legal-resources/do-i-have-a-lanham-act-claim-against-my-competitor-for-false-advertising))

---

## 7. DRIVERS EMOCIONALES Y STORYTELLING

### 7.1 Qué emoción para qué objetivo (shares vs saves vs comments — son distintos)

- **Shares (alcance):** alto arousal — **asombro/awe (25 %), risa (17 %), diversión (15 %)** son lo
  más compartido (BuzzSumo); + lo relatable ("esto sos vos").
- **Saves (autoridad/resurfaceo):** contenido **educativo, paso a paso, de referencia** —
  checklist, receta, rutina, tutorial. Instagram lee el save como "valor duradero".
- **Comments:** favorecen a TikTok; los Reels tienden a "engagement silencioso" (más saves/shares).
- **Implicancia:** decidí el objetivo **antes** de escribir. No se optimiza para los tres a la vez.
([Berger/STEPPS](https://english.ckgsb.edu.cn/knowledge/article/contagious-jonah-berger-on-why-some-things-catch-on/),
[Smart Insights/BuzzSumo](https://www.smartinsights.com/content-management/content-marketing-creative-and-formats/social-media-emotions/),
[Metricool](https://metricool.com/instagram-reels-guide/))

> **[Discrepancia]** BuzzSumo 2020: el **fraseo explícitamente emocional ya está quemado** — rinde
> más el superlativo y el headline instructivo. → **Provocá la emoción mostrando, no anunciándola.**
> ([BuzzSumo headlines](https://buzzsumo.com/blog/most-shared-headlines-study/))

### 7.2 Estructuras narrativas que entran en <30 s

- **Hook → Problema → Solución → CTA** (el patrón viral; ≈75–85 palabras en 30 s).
- **PAS** (dolor ya sentido) · **Before/After** (la tensión vive en el contraste).
- **Mini hero's journey (plantilla Pixar):** "Había una vez ___. Todos los días ___. Un día ___.
  Por eso ___. Hasta que finalmente ___." Pixar regla #2: importa lo interesante *para la
  audiencia*. Admirá al personaje **por intentar**, no por triunfar.
  ([Pixar 22 rules](https://industrialscripts.com/pixar-storytelling-rules/))
- **POV / momento relatable / "un día en la vida":** primera persona, situación reconocible —
  máquina de shares.
- **StoryBrand:** **cliente = héroe, marca = guía (Yoda, no Luke).** En 30 s: personaje (el cliente)
  + problema + costo de no actuar + un paso claro.

### 7.3 Especificidad y detalle sensorial (specificity builds belief)

El cerebro filtra: **vago = "cualquiera puede decirlo = probablemente mentira"; específico =
"alguien tuvo que saber esto = probablemente real".** "Resultados de alta calidad" no convence;
"37 % menos de churn en 90 días" sí. Los superlativos son gratis; la especificidad **cuesta algo**.

**Los 3 tests de Harry Dry** (aplicá a cada hook/claim):
1. **¿Lo puedo visualizar?** → "mejor servicio" → "respondemos en menos de 10 minutos".
2. **¿Lo puedo falsar?** → "el mejor" → "calificado el mejor por el 90 % en una encuesta".
3. **¿Nadie más puede decir esto?** → diferenciación. ("Worn by supermodels in London and dads in
   Ohio").

**Método zoom-in:** ante un claim vago preguntá "¿qué quiero decir *exactamente*?" y re-zoomeá
hasta algo visualizable.
([Upgrow/Harry Dry](https://www.upgrow.io/blog/harry-dry-copywriting-3-rules),
[vijaywrites/specificity](https://vijaywrites.substack.com/p/specificity))

### 7.4 Story vs lista de features

Una **historia con un personaje** y un conflicto le gana a una lista de atributos (la lista no
genera arousal ni recuerdo). **Show don't tell:** no "es artesanal" sino "lo hace Marta a mano,
tanda de 12 frascos por semana". Un protagonista, un conflicto.

---

## 8. CTA

- **Tipos:** seguir · guardar · comentar palabra · link en bio · visitar · DM · comprar/reservar.
- **Un solo CTA por pieza** (un objetivo: comentarios, guardados, shares, clicks o follows).
- **Soft vs hard.** Soft = teasea el siguiente paso (*Mirá, Probá, Guardá, Seguí*) → audiencia fría.
  Hard = acción comprometida (comprar, reservar, visitar) → audiencia tibia.
- **Placement.** **[Discrepancia]:** mid-roll convierte más en general (atención en pico), pero
  para video **<30 s** las fuentes recomiendan inicio/final. Táctica: plantar el CTA en mid-roll
  y **repetir el mismo** al final (no dos objetivos distintos).
- **Loop:** "guardalo" / "seguime para la parte 2" + cierre que reconecta con el hook → reinicia el
  video. El **payoff cierra antes** del CTA para no romper el loop.
- **Por objetivo:** alcance → seguir/compartir (soft, final) · engagement → comentar/guardar (soft,
  mid+final) · prueba → "mirá el caso"/link/DM (soft, final) · conversión → reservar/comprar (hard,
  final).
- **⚠️ Engagement-bait (Instagram):** pedir comentar una palabra/emoji *para hackear alcance* puede
  hacer que NO te recomienden. Engagear genuino sí. Es la salvedad fuerte al "comentá X".
  ([iubenda](https://www.iubenda.com/en/blog/mastering-the-call-to-action-instagram/),
  [Social Media Today](https://www.socialmediatoday.com/news/instagram-clarifies-advice-single-word-ctas-longer-reels/718151/))

---

## 9. ESCRIBIR PARA EL OÍDO (locución)

### 9.1 Principios

- **Escribí como hablás.** Palabras cortas, tono conversacional, contracciones. Es para el **oído,
  no el ojo**.
- **Frases cortas, una idea por frase.** Variá el largo (así hablamos). Sacá adjetivos/adverbios
  superfluos. Las subordinadas son difíciles de seguir de oído.
- **Segunda persona / hablale a una persona** ("vos / te"). Que suene a alguien hablándote, no a
  texto leído.
- **Test read-aloud.** Leelo en voz alta a ritmo natural: ahí saltan los trabalenguas y las frases
  sin aire.
([Voice123](https://voice123.com/blog/voice-over-scripts/conversational-writing/),
[Bunny Studio](https://bunnystudio.com/blog/how-to-write-and-read-voiceover-scripts-the-right-way/))

### 9.2 Pacing (números concretos)

| Ritmo | WPM | Palabras/seg | Uso |
|---|---|---|---|
| Lento | 100 | ~1,7 | técnico |
| Normal/conversacional | 130 | ~2,2 | lectura conversacional |
| Rápido/enérgico | 160 | ~2,7 | spots, reads enérgicos |

| Duración | Lento (100) | Normal (130) | Rápido (160) |
|---|---|---|---|
| 15 s | ~25 | ~32 | ~40 |
| 30 s | ~50 | ~65 | ~80 |

**Regla para reel:** un reel enérgico de 30 s entra cómodo en **~75–90 palabras** (≈2,5 pal/seg).
**Hook hablado: 5–10 palabras** (≈2–4 s de voz). Conviene **dejar aire** — no llenar cada segundo.
([Boords Script Timer](https://boords.com/script-timer),
[provoiceactor](https://www.provoiceactor.co.uk/blog/words-to-time/))

> **Nota YourMKT:** el TTS del pipeline (OmniVoice) corre a **speed 0.85** con pausas forzadas. Si
> el guion ya está pensado a ~2,5 pal/seg, calcular la duración real con ese factor; un guion de 80
> palabras a 0.85 dura más que el cálculo nominal. Validar contra `duracion_seg` del spec.

### 9.3 Marcar énfasis / pausas / emoción en el texto

- **Puntuación = control del flujo.** Coma = pausa corta; punto = pausa media; **`…` (elipsis) o
  salto de línea = pausa dramática a mano**. En TTS, la puntuación es la palanca principal.
- **Énfasis:** **MAYÚSCULAS** o **negrita** en la palabra a acentuar.
- **Un beat por línea:** romper en una idea por línea marca el ritmo y crea micro-pausas naturales.
- **Emoción:** el texto plano no transmite tono (eso lo pone la voz). Se sugiere con la elección de
  palabras y el largo de frase (cortas = urgencia/energía; pausas = peso/drama); en TTS, con SSML
  (`<break>`, `<emphasis>`, `prosody`) si el motor lo soporta.
([Speechify](https://speechify.com/blog/8x8-text-to-speech-pause/),
[Speechactors](https://speechactors.com/article/optimizing-tts-output-tips))

### 9.4 Hablado vs escrito

| Escrito (ojo) | Hablado (oído) |
|---|---|
| Se puede releer | Una sola pasada |
| Frases largas, subordinadas | Frases cortas, una idea |
| Vocabulario formal ("asimismo") | Cotidiano, contracciones |
| Tono/volumen ausentes | Pausa/énfasis = parte del mensaje |
| 3.ª persona / impersonal OK | 2.ª persona, directo |

---

## 10. ANTI-PATRONES del guion escrito por IA

**Vocabulario delator (prohibir):** elevá, desbloqueá, potenciá, liberá, "en un mundo donde / en
la era actual", "cabe destacar / es importante notar", "en definitiva / en resumen", "no busques
más". (En inglés: elevate, unleash, unlock, empower, "in today's fast-paced world".)

**Estructuras delatoras (prohibir):**
- **Simétricas:** "no es solo X, es Y" / "no se trata de X, sino de Y" / "no solo… sino también".
  El tell estructural más fuerte. → reescribir en afirmativo directo.
- **Carraspeo inicial** (throat-clearing) en vez de arrancar por el frame más fuerte.
- **Tono plano sin POV** · monotonía de frases de largo parejo · regla de tres mecánica · abuso del
  em dash · generalidades vagas que servirían para cualquier negocio.

**Reglas de reescritura (de blando a filoso):**
1. Cada adjetivo vago → dato concreto/falsable ("rápido" → "<10 min").
2. Matá el carraspeo: empezá por el frame más fuerte/raro.
3. Prohibí las construcciones simétricas.
4. Variá el largo de las frases; intercalá una muy corta. Usá voseo/contracciones ("mirá", "ya está").
5. **Tené un punto de vista** — nombrá un enemigo (§6). Copy sin opinión = tell #1.
6. Convertí la lista en una historia con un personaje.
7. Bajá los buzzwords a verbos concretos de lo que realmente pasa.
8. Pasá el filtro de Dry a la línea final (visualizable / falsable / exclusiva).
9. Meté un detalle específico casi "innecesario" (nombre propio, número raro, lugar) — la
   especificidad cuesta algo y por eso suena humana.
([Pangram](https://www.pangram.com/blog/comprehensive-guide-to-spotting-ai-writing-patterns),
[Siege Media](https://www.siegemedia.com/creation/how-to-spot-ai-generated-text))

---

## 11. CÓMO ENTREGAR EL GUION a las otras etapas (handoff)

El guion no es texto suelto: es el insumo del **spec** (`schemas/spec.schema.json`) que consumen
`audio-director` (voz/SFX/mezcla) y `reel-director`/`graphics-director` (visual). El guionista
escribe la **capa voz** y aporta metadata por beat para anclar lo demás.

**Lo que produce el guionista, mapeado al spec:**
- `audio.voz.texto` — **el guion completo**, ya escrito para el oído (pausas con `…`, énfasis con
  MAYÚSCULAS, una idea por línea). Es un string plano hoy → mantener el marcado liviano que el TTS
  respeta (puntuación, elipsis, saltos de línea).
- `audio.voz.voz_tts` + `rate` — sugerencia de voz/ritmo (p. ej. `es-AR-TomasNeural`), aunque la
  selección fina puede ser de `audio-director`.
- **Beats → escenas.** El guion se entrega **partido en beats** que mapean a `escenas[]` con su
  `rol` (`hook | producto | paso | beneficios | resultado | testimonio | cta | contexto`) y un
  `t_in/t_out` tentativo. Así `reel-director` sabe qué visual va con qué frase y `audio-director`
  ancla SFX por `corte` (= `escena.id` → su `t_in`) o por `palabra` (índice en `subs.json`).
- `copy.caption` + `copy.hashtags` — el texto del post (más largo que la locución; el guionista lo
  escribe, no es lo que se habla).
- `subtitulos` es **auto** (se genera del audio): el guionista NO escribe subtítulos a mano.

**Metadata útil que debería llevar cada línea/beat del guion** (para handoff limpio):
- `rol` del beat (hook / payoff / cta…), para que el resto sepa su función.
- **Nivel de conciencia** asumido y **objetivo** de la pieza (alcance/deseo/prueba/conversión) —
  contexto para que reel/graphics no rompan el tono.
- **Palabra/frase a enfatizar** (la que graphics puede sacar como texto cinético y audio puede
  marcar con un SFX `pop`/`impact`).
- **Dónde abre/cierra el loop** (para que el cierre visual no spoilee el payoff).
- **CTA marcado** (cuál es, soft/hard, dónde) — un solo CTA.

---

## 12. QUÉ DEBE SABER Y HACER LA SKILL `guionista` — y qué NO

### SÍ le corresponde (es su trabajo)
1. **Inferir el nivel de conciencia + sofisticación** desde el brief/objetivo de la pieza (§2.4) y
   decidir **por dónde arranca** el guion.
2. **Elegir framework + tipo de hook** según objetivo y nivel (§2.6, §3).
3. **Escribir el hook** (5–10 palabras, 3–5 variantes, elegir la de más tensión) y filtrarlo por
   4 U + 3 tests de Harry Dry.
4. **Estructurar la secuencia** (open loop → body → payoff → CTA), dosificando la información (§4).
5. **Escribir para el oído** (§9): pacing ~2,5 pal/seg, frases cortas, voseo, marcado de
   pausa/énfasis.
6. **Soft-sell + un solo CTA** (§5, §8); producto como resolución de tensión.
7. **Especificidad y POV** (§7); **evitar los tells de IA** (§10).
8. **Ángulo competitivo seguro** (anti-categoría sin nombre, claim verificable) (§6).
9. **Entregar el guion partido en beats con metadata** (§11): `audio.voz.texto`, `voz_tts`/`rate`,
   beats→escenas con `rol` y `t_in/t_out` tentativo, `copy.caption`/`hashtags`, marcas de énfasis y
   de loop/CTA.
10. **QC adversarial del propio guion:** ¿el hook frena el scroll? ¿el payoff cumple la promesa?
    ¿hay un solo CTA? ¿pasa los 3 tests de Dry? ¿tiene algún tell de IA?

### NO le corresponde (es de otras skills)
- **El concepto/visual de cada plano, los cortes al beat, la cadena de fuentes** → `reel-director`.
- **Texto cinético, pop-ups, lower-thirds, FX de edición, qué palabra se anima** → `graphics-director`.
- **Selección final de voz, colocación de SFX al frame, cama de música, ducking, mezcla −14 LUFS,
  el cue sheet de audio, `subs.json`** → `audio-director`.
- **Ideación de la campaña completa, balance de formatos, qué objetivo tiene cada pieza, el plan de
  assets** → `campaign-director` (el guionista *recibe* esto, no lo decide).
- **Render, subtítulos automáticos, publicación** → scripts del pipeline (etapas 4–5).

> Regla de borde: el guionista escribe **lo que se dice** y **en qué orden**, con la metadata
> mínima para que los directores integren imagen, gráficos y audio. No diseña la imagen, no coloca
> el SFX, no mezcla.

### Checklist del guionista (antes de entregar)
- [ ] Inferí nivel de conciencia + sofisticación y arranqué por donde corresponde.
- [ ] Hook ≤10 palabras, con tensión en la primera línea; probé 3–5 variantes.
- [ ] Hook pasa 4 U + (visualizable / falsable / exclusivo).
- [ ] Abrí un open loop y lo cierro en el payoff (la promesa se cumple).
- [ ] Framework elegido por objetivo, anidado en Hook-Story-Offer.
- [ ] Soft-sell: el producto resuelve una tensión, no es un pitch.
- [ ] Un solo CTA, soft/hard según audiencia, sin engagement-bait.
- [ ] Specificity: al menos un número/detalle concreto; cero adjetivos vagos.
- [ ] Cero tells de IA (sin "no es solo X, es Y" / "elevá" / carraspeo).
- [ ] Tiene POV / nombra un enemigo (si aplica el ángulo competitivo).
- [ ] Escrito para el oído: frases cortas, voseo, ~2,5 pal/seg, cabe en `duracion_seg`.
- [ ] Pausas (`…`) y énfasis (MAYÚSCULAS) marcados.
- [ ] Entregado en beats con `rol` + `t_in/t_out` tentativo + caption/hashtags.

---

## Apéndice — Fuentes (por tema)

**Hooks / triggers / retención**
- https://www.opus.pro/blog/tiktok-hook-formulas
- https://vidiq.com/blog/post/viral-video-hooks-youtube-shorts/
- https://vexub.com/blog/viral-short-form-video-hooks
- https://scalelab.com/en/hooks-for-intros-how-to-engage-users-from-the-first-5-seconds
- https://www.shortimize.com/blog/youtube-shorts-retention-rate · https://www.shortimize.com/blog/how-to-analyze-youtube-shorts-performance
- https://metricool.com/instagram-reel-analytics/ · https://blog.hootsuite.com/social-video-metrics/

**Psicología (curiosidad / emoción / negatividad)**
- https://www.cmu.edu/dietrich/sds/docs/golman/Information-Gap%20Theory%202016.pdf
- https://psychologyfanatic.com/information-gap-theory/
- https://journals.sagepub.com/doi/10.1509/jmr.10.0353 (Berger & Milkman)
- https://www.nature.com/articles/s41562-023-01538-4 · https://enleaf.com/negativity-bias-in-marketing/
- https://blog.neuromarket.co/the-power-of-open-loops-using-the-zeigarnik-effect-to-create-irresistible-content

**Niveles de conciencia / sofisticación (Schwartz)**
- https://gameofconversions.com/customer-awareness-stages/
- https://www.leadgen-economy.com/blog/five-stages-awareness-lead-generation/
- https://brittanymcbean.com/the-5-stages-of-awareness-you-need-to-know-for-your-next-launch/
- https://betweenthelinescopy.com/blog/stages-of-awareness/
- https://www.motiveinmotion.com/market-sophistication/ · https://valchanova.me/breakthrough-advertising-copywriting-book-review/
- https://copyposse.com/blog/5-levels-of-market-awareness-how-to-speak-to-your-target-audience-part-1/ (ojo: mal-etiqueta sofisticación como awareness)
- https://sophiavegadigitalmarketing.com/what-is-customer-awareness-the-5-levels-every-service-provider-must-know/
- https://medium.com/illumination/cold-traffic-vs-warm-traffic-understanding-the-difference-d436bd2354f9

**Frameworks de copy + secuencia + soft-sell + CTA**
- https://copyhackers.com/2015/10/copywriting-formula/
- https://leadenforce.com/blog/aida-pas-and-beyond-classic-copywriting-models-in-the-age-of-digital-ads
- https://instacopy.ai/blog/4-ps-copywriting-formula/ · https://www.gmass.co/blog/promise-picture-proof-push/
- https://instacopy.ai/blog/fab-copywriting-formula-explained-with-examples/
- https://www.socialrevver.com/blog/storybrand-framework · https://welldressedwalrus.com/7-parts-of-a-storybrand-framework/
- https://www.breakthroughmarketingsecrets.com/blog/hook-story-offer-ad-copywriting-formula-russell-brunson-from-clickfunnels/
- https://instacopy.ai/blog/4-us-copywriting-formula/ · https://www.upgrow.io/blog/harry-dry-copywriting-3-rules
- https://www.animusstudios.com/blog/ad-formats-and-structures-combining-copywriting-formulas-with-storytelling-frameworks
- https://www.socialync.io/blog/short-form-video-structure-guide-2026
- https://www.jerabean.com/blog/selling-on-social-hard-sell-vs-soft-sell · https://lift-digital.net/blog/what-is-the-80-20-rule-in-social-media/
- https://www.mgid.com/blog/how-storytelling-in-native-ads-drives-higher-affiliate-conversions
- https://www.iubenda.com/en/blog/mastering-the-call-to-action-instagram/ · https://www.socialmediatoday.com/news/instagram-clarifies-advice-single-word-ctas-longer-reels/718151/
- https://playplay.com/blog/video-cta-examples/ · https://www.teleprompter.com/blog/effective-video-ctas

**Competencia / emoción-share / storytelling / specificity / tells de IA**
- https://www.shopify.com/blog/comparative-advertising · https://www.masterclass.com/articles/comparative-advertising
- https://www.luthor.ai/blog-post/ftc-comparative-advertising · https://www.bonalaw.com/insights/legal-resources/do-i-have-a-lanham-act-claim-against-my-competitor-for-false-advertising
- https://blog.mean.ceo/anti-marketing-stand-out/ · https://create.vista.com/blog/anti-marketing/
- https://english.ckgsb.edu.cn/knowledge/article/contagious-jonah-berger-on-why-some-things-catch-on/
- https://www.smartinsights.com/content-management/content-marketing-creative-and-formats/social-media-emotions/ · https://buzzsumo.com/blog/most-shared-headlines-study/
- https://metricool.com/instagram-reels-guide/ · https://theoceanmarketing.com/blog/instagram-likes-saves-shares-which-one-matters-most/
- https://industrialscripts.com/pixar-storytelling-rules/ · https://www.gravityglobal.com/blog/complete-guide-storybrand-framework
- https://www.upgrow.io/blog/harry-dry-copywriting-3-rules · https://vijaywrites.substack.com/p/specificity
- https://www.pangram.com/blog/comprehensive-guide-to-spotting-ai-writing-patterns · https://www.siegemedia.com/creation/how-to-spot-ai-generated-text

**Escritura para el oído / locución / TTS**
- https://boords.com/script-timer · https://www.provoiceactor.co.uk/blog/words-to-time/
- https://voice123.com/blog/voice-over-scripts/conversational-writing/ · https://bunnystudio.com/blog/how-to-write-and-read-voiceover-scripts-the-right-way/
- https://speechify.com/blog/8x8-text-to-speech-pause/ · https://speechactors.com/article/optimizing-tts-output-tips

---

### Resumen de las discrepancias entre fuentes (consolidado)
1. **Hold a 3 s "bueno":** 65 % vs 70 % vs 80 % — sin cifra oficial de IG, comparar contra el propio promedio.
2. **Negatividad y viralidad:** sube atención, pero el driver real es el **alto arousal**, no la valencia (lo positivo se comparte más en neto).
3. **Largo del hook hablado:** 5–10 vs 10–14 palabras → para reel local, 5–10.
4. **Conciencia ≠ sofisticación:** error común de etiquetar las 5 etapas de sofisticación como "awareness".
5. **PAS vs BAB para frío:** PAS si el dolor ya se siente; BAB para revelar un problema/transformación no visto.
6. **"4 P":** dos escuelas (Picture vs Problem/Proposal) — elegir por aspiración vs seriedad.
7. **CTA placement:** mid-roll convierte más en general, pero <30 s → inicio/final; plantar en mid y repetir el mismo al final.
8. **Comparativa directa:** herramienta legítima (marketing) vs alto riesgo legal (Lanham) → PyME usa anti-categoría sin nombre.
9. **Fraseo emocional:** sigue viralizando la emoción, pero el fraseo *explícitamente* emocional ya está quemado → mostrar, no anunciar.
