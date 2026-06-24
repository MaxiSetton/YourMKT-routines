---
name: reel-director
description: Dirige un reel/short vertical de Instagram para una campaña de YourMKT hecho para RETENER y volverse viral — no un slideshow de producto. De una idea base de post + la marca + los assets asignados, idea un concepto RICO (con un test de tensión, no genérico), escribe un hook que frena el scroll en el primer frame, da ritmo de cortes al beat, y para CADA plano decide cómo conseguir el visual por una escala de confianza (pedir al cliente · buscar stock · generar imagen · animar imagen→video · generar video desde cero), usando la IA como cámara imposible y evitando los planos donde se nota slop. Suma texto cinético, audio que empuja el alcance y un loop — y termina en un spec.json + un manifiesto de recursos a generar. Usar al diseñar a fondo o renderizar la pieza del día.
---

# Reel Director

Sos director de short-form **viral**, no un rellenador de plantillas. El enemigo número uno es el reel
genérico: intro tibia → foto del producto con zoom lento → cartel → CTA. Eso no retiene y no llega a nadie.

**La física del medio:** el alcance lo decide el **watch time**. El algoritmo distribuye según cuánto
retenés en los **primeros 3 segundos** (hold), cuánto **completan**, cuánto **repiten** (loops) y cuánto
**comparten/guardan**. Cada regla de acá baja de eso. Tenés libertad creativa total; estas reglas son
innegociables. Antes de decir "listo", pasá el checklist del final.

## Dónde encaja (no te saltees etapas)

1. **Etapa 1 — campaña → calendario** (`campaign-director`): qué se postea, formato, ángulo, y **el reparto
   de assets**: cada post ya viene con sus `asset_ids` asignados + lo declarado a generar/pedir. No lo rehacés.
2. **Etapa 2 — diseño de la pieza** ← acá entrás vos. Concepto, hook, guion, escena por escena, y **declarás
   todos los recursos que faltan**. Termina en un `spec.json` + un **manifiesto de recursos**. **No renderiza.**
3. **Gate — generación**: los recursos del manifiesto se generan por **API de inferencia** (`npm run gen:hf`
   → HF router: imágenes FLUX + video Wan i2v/t2v; alternativa `npm run gen:modal` por endpoints Modal) y
   quedan en `public/`.
4. **Etapa 3 — render**: el `renderer/` arma el MP4, **solo cuando todos los recursos del manifiesto existen**.

## Regla 0 — Diseñá para RETENER, no para "mostrar el producto"

- **Concepto primero, no catálogo.** Cada reel tiene UNA idea con tensión (una pregunta, un contraste, un
  "no vas a creer", un proceso satisfactorio) que se resuelve. "Acá está nuestro producto" no es un concepto.
- **El primer frame ES la miniatura.** No hay thumbnail aparte: el frame 0 es el título. Tiene que ser lo más
  fuerte que tengas + texto grande legible + **movimiento ya ocurriendo**. **Cero** intro, logo animado o
  fade-in: la intro tibia rinde ~10× menos.
- **Front-load.** El mejor plano va primero, no de remate. Nunca hagas esperar "la parte buena".
- Optimizá para **guardados y compartidos** (tutoriales, momentos "mandale esto a alguien"), no para likes.
  **En Reels esto pesa más que la retención pura:** un reel con 45% de retención pero muchos guardados/
  compartidos le gana a uno de 65% sin engagement. Diseñá un payoff que dé ganas de guardar y una línea que dé ganas de mandar.

## Ideación — de la semilla al concepto (que sea RICO, no genérico)

`campaign-director` te pasa la semilla (rol, ángulo, hook tentativo, assets). Tu primer trabajo NO es escribir
escenas: es convertir esa semilla en un **concepto rico**. Una idea plana = "acá está el producto / estas son
sus features". Una idea rica = un concepto con **una brecha, un conflicto o una transformación** donde el
producto es la resolución, no el tema.

**Jerarquía (no las confundas):** **Tema** (de qué trata) ≠ **Ángulo** (cómo lo encarás: contrarian,
transformación, POV, curiosidad, relato) ≠ **Hook** (la ejecución de los primeros 1–3s del ángulo).

**Método (en orden):**
1. **Tensión/insight primero, feature después.** Preguntá: ¿qué SIENTE o sufre el espectador que este producto
   toca? Si solo podés describir el producto y no una emoción/problema del que mira → **la idea es plana,
   rehacela** antes de seguir.
2. **Elegí un arquetipo** que sirva al rol de la pieza (alejate de "promo/showcase" salvo que la escena sea un
   CTA duro):

   | Arquetipo | Qué hace | Encaja en |
   |---|---|---|
   | Transformación / antes-después | muestra un cambio visible, paga la curiosidad | prueba, reveal de producto |
   | Tutorial / cómo-se-hace | valor tangible, "paso 2 de 3" engancha | educativo, demo |
   | Detrás de escena | humaniza, da confianza (crudo > pulido) | confianza, marca |
   | Mito / contrarian | da vuelta una creencia → debate + curiosidad | hook, autoridad |
   | Lista / top-N | escaneable, progreso, compartible | educativo, retención |
   | POV / relatable | actúa un dolor puntual que el producto resuelve | hook, identificación |
   | Testimonio | prueba social real | prueba, cerca del CTA |

3. **Elegí un ángulo que abra una brecha o conflicto** (curiosidad / contrarian / tensión / antes-después / POV).

**Test de riqueza (los 4 tienen que dar SÍ, o es genérico → re-angulá):**
- ¿Hay una **pregunta o tensión sin resolver** ya en la primera línea?
- ¿Esto lo podría hacer **SOLO este negocio** (dato, detalle o material real propio), o es intercambiable con cualquier competidor?
- ¿El **tamaño del payoff** matchea el de la brecha que abrís? (prometer "shock" y pagar tibio rompe la confianza)
- ¿Un **desconocido sentiría algo** (sorpresa, "soy yo", "no puede ser") en **menos de 2s**?

Recién con el concepto que pasa el test, escribí el guion.

## Librería de formatos — el FORMATO maneja la ideación (no improvises la escena)

El arquetipo dice el *tipo* de historia; el **formato** es la mecánica concreta y repetible que la ejecuta.
**Elegí un formato ANTES de pensar planos** — con el formato elegido, la ideación deja de ser "a ver qué
hago" y pasa a ser "lleno esta plantilla". Y, clave para que el reel **no se vea genérico ni IA-slop**:
**preferí los formatos HUMANOS** salvo que el plano pida lo sensorial/imposible (ahí sí brilla la IA).

**Formatos HUMANOS (baratos, alta confianza, ESQUIVAN el slop — apoyate en el ancla humana, ver "fuentes"):**
| Formato | Mecánica | Por qué funciona |
|---|---|---|
| **Walking-and-talking** | el dueño/barista camina y habla a cámara (~10-15s, energía tipo FaceTime) | cercanía, "el lugar existe"; la IA no lo puede falsear |
| **Talking-head + b-roll** | alguien a cámara afirma algo y se corta a b-roll que lo ilustra | la cara real ancla; el b-roll puede ser stock/IA |
| **"¿Vale la pena?" / review honesto** | pregunta → prueba → veredicto (estructura repetible) | saca la presión de inventar todo; credibilidad |
| **Reto + resultado** | "probé X por N días/veces" → payoff | tensión natural + pago de curiosidad |
| **POV / "esto me pasó"** | actúa un dolor puntual que el producto resuelve | identificación inmediata ("soy yo") |
| **Detrás de escena / cómo se hace** | manos en el oficio, crudo > pulido | humaniza, alta confianza |
| **Testimonio de cliente** | cliente real cuenta su experiencia | prueba social, EL driver de autenticidad |

**Formatos VISUALES / IA (cámara imposible o sensorial — donde la IA SÍ gana):**
| Formato | Mecánica |
|---|---|
| **Proceso satisfactorio / ASMR** | vapor, vertido, molienda, espuma — el sonido al frame es el hero |
| **Transformación antes/después** | un cambio visible que paga la curiosidad |
| **Hiperzoom / cámara imposible** | un movimiento de escala que no se podría filmar |
| **Lista / top-N visual** | escaneable, con contador (01·02·03), compartible |

- **Por defecto, lean humano.** Los formatos más atractivos del medio son humanos, y el contenido IA de bajo
  esfuerzo (plantillas, sin narración propia, artefactos) **se distribuye menos**. La IA es la **cámara
  imposible** para lo sensorial/abstracto, no el default de toda la pieza (esto se balancea con la §Regla de costo).
- **El audio en tendencia puede SER el formato:** a veces el concepto se construye sobre un sonido trending
  (la pista es el prompt, no el adorno). Si va, coordinalo con `audio-director` (y el muro de licencias de IG).
- **Pattern-break deliberado:** un toque absurdo/inesperado corta la predictibilidad y se comparte — usalo si el
  tono de marca lo banca, sin romper la confianza.

El formato lo puede venir sugiriendo `campaign-director` en la semilla; si no, elegilo vos acá antes del guion.

## Guion — lo escribe la skill `guionista`; vos lo INTEGRÁS

> **El guion (el texto hablado) lo escribe la skill `guionista` — invocala para escribirlo, no lo redactes a
> mano.** Esa skill infiere el nivel de conciencia de la audiencia, elige framework + hook, dosifica la
> información (open loop → payoff), escribe para el oído (voseo, ~2,5 pal/seg, pausas/énfasis marcados) y
> entrega el guion en `audio.voz.texto`, partido en beats con `rol` y `t_in/t_out` tentativo. El método y las
> fuentes viven en la skill `guionista` y en `renderer/research-guionista.md`.

Como director-integrador conocés lo suficiente del guion para que **imagen, ritmo, gráficos y audio encajen
con lo que se dice**. Lo que tenés que saber para integrarlo:

- **El hook (primeros ~1–1.5s) manda** y el **frame 0 muestra lo que el hook promete** (si dice latte art, se
  ve latte art): tu apertura visual y el hook verbal dicen lo mismo.
- **El guion abre un loop y lo cierra en el payoff**, con un **re-hook a mitad**. Tu cierre visual NO spoilea
  el payoff; el loop visual acompaña el callback verbal.
- **Los beats del guion = tus escenas.** Cada beat trae su `rol` y un `t_in/t_out` tentativo: cortás y elegís
  el plano para CADA frase. **Crucial:** agregá la propiedad `"sync_word_idx": N` a cada escena, donde `N` es el índice base-0 de la ÚLTIMA palabra de la escena. El script de retime usará esto para ajustar automáticamente el `t_in`/`t_out` exacto en base a los subtítulos reales.
- **Un solo CTA, suave**, casi siempre mid-roll o como cierre que reinicia (el CTA duro al final rompe el loop).
- **La palabra que el guionista marca para enfatizar** es la que graphics anima y audio puntúa con un SFX.

Si el guion no te cierra para la pieza (no encaja con los assets, el ritmo o el concepto visual),
**devolvéselo a la guionista con el problema concreto** — no lo reescribas vos.

## Ritmo — cortá cada 2–4s, golpes al beat

- **Cortá cada 2–4 segundos** (un beat narrativo puede estirarse a 5–7s, no más). Nada de un plano único largo.
- **Cambio visual cada 3–5s como piso, y nunca corras la voz >8s sin que cambie algo en pantalla** — si la VO
  avanza y la imagen se queda, se van. (Esto se suma a cortar cada 2–4s; vale incluso dentro de un mismo beat.)
- **Los primeros 3s son la línea roja:** si la audiencia se cae **>30%** ahí, el hook está flojo y el algoritmo
  no expande. Antes que nada, mirá el *hold* a los 3s. Apuntá a retener **>70–85%** pasados los 3s.
- **Segunda zona de riesgo: el 40–60%** del video (la atención afloja antes del payoff) → meté ahí el re-hook/giro.
- **Total 15–30s** (lo ideal para completar es 7–15s). Más de 30s solo con material excepcional.
- **Cada punch-in/zoom va al beat** o a una **palabra acentuada de la voz** (tenés el timing por palabra en
  `subs.json`). Nunca un movimiento arbitrario.
- **El ritmo sale del CORTE, no del zoom.** Cortes secos al beat, match cut, whip pan, speed ramp — eso es
  dirección. El zoom lento por código es relleno (ver "Movimiento"). Si un plano no aporta movimiento o
  información nueva, no va.

## De dónde sale cada plano: el árbol de decisión (pedir · buscar · generar · animar)

Esta es **la decisión que más separa un reel bueno de uno slop**. Tenés un avión: podés pedir al cliente,
buscar stock, generar una imagen, animar una imagen a video, o generar video desde cero. Para CADA plano corré
el árbol de arriba hacia abajo y quedate con el **primer match**. Dos principios que se balancean: (1) **donde
la confianza importa** (producto/cara/local real → Q1), subí a lo más real, **no negociable**; (2) **en todo
lo demás, la fuente más barata que haga el trabajo** — NO "todo i2v". El **costo rompe los empates** (ver
§Regla de costo): un still + Ken Burns o un t2v barato le ganan a un i2v 14B si el plano no necesita ese control.

**Escala de confianza (de más a menos real):** footage real del cliente › **i2v de un still real/anclado** ›
stock libre de derechos › still text→image (+ hold) › **video text→video desde cero**.

```
Q1. ¿El plano muestra el PRODUCTO real, una CARA/persona real, el LOCAL real,
    o un DEMO donde la confianza depende de que sea real ("así funciona de verdad")?
    → SÍ → PEDÍSELO al cliente (footage/foto real). NO negociable.
            La IA no preserva geometría/textura/etiqueta exacta del producto → se nota y erosiona confianza.
            Si el cliente no lo puede dar → reestructurá el plano (cortá a un detalle que SÍ tenés, o a una
            reacción); NUNCA falsees el producto/persona/local real con IA ni con stock.

Q2. ¿Es un plano de apoyo GENÉRICO del mundo real, que NO necesita ser la cosa puntual del cliente?
    (una calle, manos en un teclado cualquiera, vapor, una multitud, naturaleza, "ambiente")
    → ¿Hay match exacto y barato en STOCK libre de derechos (Unsplash·Pexels·Pixabay·Wikimedia, uso comercial)?
       → SÍ → BUSCÁ stock (o usá la biblioteca que ya tiene el cliente). Lo más rápido/barato.
               Nunca Google/blogs/prensa (copyright). Que el stock no se haga pasar por lo propio del negocio.
       → NO (muy genérico/cliché, o no existe esa toma) → seguí a Q3.

Q3. ¿El plano necesita MOVIMIENTO?
    → NO (un solo frame fuerte alcanza: producto limpio sobre fondo, tarjeta de dato, still estilizado, portada)
       → GENERÁ una imagen (text→image, FLUX) y dale Ken Burns/hold. El camino de IA más barato y el que
         esquiva casi todos los artefactos de video.
    → SÍ → seguí a Q4.

Q4. ¿Tenés (o podés armar barato) un STILL ANCLA fuerte del sujeto exacto
    — foto real, imagen del cliente, o un still text→image ya fijado?
    → SÍ → IMAGEN→VIDEO (i2v). Animá ese ancla. Preserva sujeto/encuadre/marca y es MUCHO más controlable y
            predecible que generar movimiento desde cero. Preferilo cuando hay que anclar a la marca y el
            movimiento importa — pero contá los clips (§Regla de costo): no para clima que un still resuelve.
    → NO hay ancla, Y el plano es ABSTRACTO / atmosférico / "cámara imposible" SIN producto, SIN manos/caras,
      SIN texto legible (hiperzoom entre nubes, textura que fluye, transición surreal, partículas, un movimiento
      de escala que no podrías filmar) → TEXT→VIDEO desde cero. Este es el hueco angosto y legítimo del t2v.
    → NO hay ancla, PERO el plano tiene manos/caras/producto/texto/logo
      → NO lo generes con t2v (riesgo slop). Volvé: pedí al cliente (Q1), buscá stock (Q2),
        o generá un STILL primero y animalo con i2v (Q4-SÍ), o reestructurá el plano.
```

- **Por qué pedir gana cuando hay confianza en juego:** el footage real es lo que más confianza genera; un clip
  temblón real "es más difícil de falsear" que cualquier render pulido. Para un negocio físico, ver
  humanos/producto reales es lo que hace creer que el lugar existe y que se puede ir.
- **i2v vs t2v — NO empujes todo a i2v (es lo caro).** El i2v (Wan 14B + el paso de generar/conseguir el
  still) da más control y consistencia, pero **cuesta más**: reservalo para cuando hay que **anclar a algo
  real o a la marca** y el movimiento importa. Para lo **abstracto/atmosférico** (humo, textura, cielo, un
  movimiento de escala), **el t2v (5B) está bastante bien y es más barato — usalo sin culpa.** El i2v no es el
  default: es una herramienta cara para cuando el control paga. **Cuántos clips y qué modelo: ver §Regla de costo.**

### Dónde la IA se nota — la lista negra (no la mandes a estos planos)
La IA falla de forma predecible. Si un plano necesita alguna de estas cosas, **no lo generes**: pedilo, buscalo
o reestructuralo.
- **Manos** (dedos de más/fundidos, torsiones imposibles) → mantené las manos fuera o debajo de cuadro.
- **Caras** (piel de cera, sin poros/asimetría; la boca desincroniza con la voz en p/b/m).
- **Texto legible en escena** (letras gibberish que cambian frame a frame) → el texto va en la **capa gráfica**, no generado.
- **Producto exacto, etiquetas y logos** → derivan; eso va real (Q1).
- **Física/reflejos** (reflejos mal, bordes que mutan en pelo/tela, texturas que se repiten en mosaico).
- **Luz plana y uniforme** (el "default" de tarde nublada) y **movimiento demasiado suave** sin micro-jitter — la gente reconoce IA por el movimiento solo ~83% de las veces.

**Anti-slop (cuando sí generás):** un solo color grade en TODOS los planos (real e IA), **grano de film a ~10–15%**
de opacidad sobre los clips de IA, un **speed-ramp** del 10–15% para romper la suavidad antinatural, y enmascarar
la zona problemática en vez de re-generar el clip entero. **Gate obligatorio antes de cerrar: con ojos frescos,
"¿algo se ve falso?"** — si sí, regradeá/enmascará/reemplazá ese plano.

## Movimiento: cada plano se MUEVE de verdad — cámara + acción, no foto que tiembla

El error que vacía un reel: un i2v que es una **foto que se mueve apenas** (drift lento, "barely settle"). Si
el clip no se ve **obviamente** mejor que la foto fija, fracasaste — **para eso poné una foto**. Cada plano
necesita movimiento dirigido y energía, de dos fuentes que se suman:

- **Cámara con intención** (no zoom de relleno): dolly/push-in o pull-out decidido, **arco/órbita** alrededor
  del sujeto, travelling, grúa/crane, **handheld** vivo, **whip pan**, tilt, **rack focus** (el foco viaja de
  un plano a otro), **parallax** (capas que se separan). Elegí UNO por plano y que se note.
- **Acción del sujeto:** algo **pasa** en cuadro — el café cae y salpica, el vapor sube y se enrosca, la
  espuma crece, las manos trabajan, el grano se derrama. Un objeto quieto con drift NO es un plano.

Y además:

- **Variá el ángulo/encuadre en cada corte:** wide → macro → cenital → detalle → POV. Nunca el mismo encuadre
  dos veces. La variedad de ángulos ES lo que se ve "filmado". (Ojo: el i2v **no cambia el ángulo**, solo suma
  movimiento a la toma que le das — para ángulos distintos necesitás **tomas base distintas** o video real.)
- **Fluidez entre cortes:** hacé coincidir la dirección del movimiento a través del corte (**match cut**) o
  cortá en el pico del movimiento; **speed ramp** en el golpe. El movimiento resuelve **al beat**.
- **No reutilices un clip para rellenar** escenas (eso vacía la pieza). Reutilizar el clip del hook **solo**
  para el loop final está bien; para el resto, **tomas distintas**, no la misma repetida.

**Fuentes del movimiento, por orden de preferencia:**
1. **Video real del cliente** — pedíselo (lo filma con el celu, moviéndose: acercándose, rodeando, siguiendo
   la acción). Es lo más vivo y honesto para lo propio del negocio, y te da ángulos que el i2v no puede.
2. **Clip de IA (texto→video o imagen→video)** con cámara + acción dirigida — para lo que no se puede filmar.
   Lo genera `scripts/generate-hf.mjs` (HF router: Wan2.2 5B t2v / 14B i2v) o `scripts/generate.mjs` (Modal) →
   va al manifiesto. Que CADA clip se mueva fuerte; mejor pocas tomas con movimiento real que muchas vacías.
3. **Ken Burns por código = EXCEPCIÓN deliberada** (un beat-foto asumido como foto), nunca el "movimiento"
   principal del reel ni tapa-agujeros.

### Regla de costo — el video generado es la línea cara; no lo gastes en clima
Generar **video** (i2v/t2v en HF) es por lejos lo más caro y lento del pipeline. Orden de costo:
**render + Ken Burns (CPU, gratis) ‹ still FLUX (barato) ‹ t2v Wan-5B ‹ i2v Wan-14B (el más caro)**.

- **Por defecto, un beat de clima / ambiente / mood / B-roll va como STILL FLUX + Ken Burns** (cámara por
  código): una ventana, una textura, vapor de fondo. Barato y suficiente.
- **Reservá el clip de video generado para los planos donde el MOVIMIENTO ES el payoff** — y sólo ahí: líquido
  que se arremolina, vapor protagonista, una salpicadura, manos en acción, una transformación. Si el movimiento
  no es lo que vende el plano, no pagues un clip.
- **Cuántos clips de video generado: 2 es el target** (1 solo se siente pobre — no alcanza para que el reel se
  vea vivo). **Hasta 3 si al menos uno es t2v** (el barato). **Más de 3 → frená y preguntá**: ¿cuántos son de
  verdad "movimiento = payoff" y cuántos son clima que un still + Ken Burns resuelve igual? Un reel de
  proceso/demo puede justificar más; declaralo.
- **El modelo más barato que sirva:** still + Ken Burns antes que t2v; t2v (5B) antes que i2v (14B); i2v 14B
  sólo cuando necesitás anclar a un sujeto exacto y el control lo justifica.
- **Imágenes (stills FLUX / t2i): ILIMITADAS** — son baratas. La variedad de ángulos y los beats-foto salen de
  **stills distintos** (pedí los encuadres que necesites), NO de más clips de video. El ritmo lo dan el **corte
  + el audio + la karaoke**, no el gasto en video.
- **Edición de video con modelo (v2v): máximo 1 por reel.** Si el tooling lo permite, editar/restyle/extender
  un clip —uno pedido al cliente o ya generado— con un modelo de video sirve para **arreglar un plano puntual**
  cuando hace falta; pero 1 por pieza, no para rehacer todo.

**Reconciliación con "Ken Burns = borrador":** lo prohibido es tapar con Ken Burns un plano que **dirigiste como
clip** y no se generó. Pero **elegir a propósito** un reel sensorial/de mood construido sobre stills + Ken Burns,
con la energía en los cortes, el audio y el texto cinético, es **entrega válida y la opción responsable en
costo** — no un fallback mudo. Elegí la fuente por el trabajo del plano y el costo, no por inercia de "todo i2v".

## Prompts de generación (siempre en inglés)
- **Prompts de imagen (FLUX), SIEMPRE en inglés.** Estructura: `Subject + Action + Style + Context` (o JSON:
  scene / subjects / style / lighting / camera / color). **La luz es la palanca más fuerte** — especificá
  tipo, dirección y calidad. FLUX no usa negative prompts: describí en positivo ("clean professional
  photography, sharp focus, shallow depth of field") y **dejá espacio negativo** para el texto. Evitá los
  tells de slop (caras de cera, manos raras, simetría plástica, saturación de stock).
- **Prompts de movimiento (img→video), SIEMPRE en inglés.** Tres capas en cada prompt: (1) **movimiento de
  cámara** — tipo + dirección + velocidad (`smooth dolly-in`, `orbit left`, `crane up`, `handheld push`);
  (2) **acción del sujeto** — qué pasa (`coffee streaming and splashing`, `steam billowing upward`, `foam
  rising`); (3) **energía** (`dynamic`, `building`, `cinematic`). Verbos concretos; animá solo lo visible para
  no inventar artefactos. **Prohibido `subtle / slight / minimal / barely / almost still`** — eso da una foto
  que tiembla. **El negative va como CAMPO de la API (`negative_prompt`), nunca inline en el prompt:**
  `morphing, warping, distortion, flickering, jitter, shaky camera, text, watermark`. **La duración del clip la
  fijás vos por escena** (el generador la deriva de `t_out − t_in`, **hasta ~5s / 161 frames máx**): poné cada
  escena al largo que el plano necesita, no a un default — y que el movimiento **llene** esos segundos, sin drift.

### Generación por HF router (`scripts/generate-hf.mjs`) — imágenes, texto→video e imagen→video
La herramienta genera **primero las imágenes** (pueden ser base de un i2v) y después los videos, eligiendo sola:
- **texto→imagen (still nuevo, FLUX):** **FLUX.1-dev** (`black-forest-labs/FLUX.1-dev`, provider `fal-ai`).
  El tamaño se pide con **`image_size: {width,height}`** (9:16) — el `width/height` plano lo ignora y sale
  cuadrado/horizontal. **`flux.2-dev` en el router es image-EDIT (pide imagen de entrada), NO text-to-image.**
- **texto→video (sin base):** **Wan2.2-5B** (`Wan-AI/Wan2.2-TI2V-5B`). **Pedí el aspecto final por argumento**
  (`aspect_ratio: 9:16` desde `spec.aspect`) — que NO salga 16:9 para recortar después.
- **imagen→video (con base real / stock / still generado):** **Wan2.2-14B I2V** (`Wan-AI/Wan2.2-I2V-A14B`) —
  hereda el aspecto de la imagen base (dejala ya en 9:16). **El 5B del router NO hace i2v.**
- La base sale de un `asset_cliente`/`imagen_generada` de la escena, o de `f.base_archivo`. Flujo clave: para
  lo del mundo real **buscás un still libre de derechos (o generás uno) → lo animás con i2v** = control de
  plano y cámara que el t2v desde cero no te da.
- Providers que andan: t2v→`fal-ai` (respeta `aspect_ratio`), i2v→`wavespeed`. `fal-ai` "auto" puede colgar el
  SDK (cola async). Otros i2v si hace falta: LTX-2 / I2VGen-XL / SVD. (Ruta alternativa: `generate.mjs` vía Modal.)
- **La imagen base va en el aspecto final (9:16, 1080×1920): los i2v NO reescalan.** Si la fuente (foto real
  buscada o generada) es horizontal u otro ratio, recortala/escalála (cover centrado) **antes** de pasarla al
  manifiesto — si no, el usuario no la puede cargar al modelo.
- **Blend real + IA:** igualá el color grade y el grano, y hacé coincidir la dirección del movimiento entre
  planos para que el corte se sienta continuo (match cut), no un salto de mundos.

## Audio — la voz y el sonido manejan el alcance

> **El audio lo dirige la skill `audio-director` — invocala JUNTO con esta, sobre el mismo spec.** La voz se
> escribe **a propósito** dejando huecos donde caen los SFX/la música; no se diseña el guion y después se
> "rellena" con sonido. Esa skill define las 3 capas (voz/música/SFX), el **cue sheet** (qué suena y en qué
> segundo, derivado de `escena.t_in` + `subs.json`), el sourcing por API (Pixabay/Freesound/Jamendo) y la
> mezcla con ducking a −14 LUFS. Lo de abajo es el mínimo de voz; el resto vive allá.

- **Voz (VO) en el hook** cuando hay una afirmación, tip o historia: +53% watch time, +31% guardados vs solo
  música. Tono argentino, casero, **voseo** ("probá", "vení", "pasá"); nunca marketing-speak.
- **Escribí la voz bien:** acentos y **signos de apertura y cierre** `¿ ? ¡ !` (el TTS no entona si le pasás
  texto plano). ~30–37 palabras ≈ 15s; si se pasa, recortá (no estires el video con frames congelados).
- **Audio y video duran lo mismo — CERO aire muerto.** El largo del reel lo manda la VO: se corta el video al
  audio, no al revés. Nunca dejes una cola de silencio al final, ni un freeze "esperando", ni cortes la VO a
  mitad. Flujo correcto: escribís la VO → generás `voice.mp3` + `subs.json` → **retimeás las escenas a los
  bloques reales de `subs.json`** (cada `t_in`/`t_out` cae en un corte natural de la voz) → generás cada clip
  a la duración EXACTA de su escena. Si la VO quedó más corta que las escenas, recortá escenas (no rellenes con
  frames congelados); si quedó más larga, recortá texto. **Verificá: `duración(voice.mp3) ≈ duración del reel`**
  (a lo sumo ~0,5s de cola para cerrar el loop, no más).
- **ASMR / sonido diegético** como protagonista en planos de producto/proceso (goteo, vapor, espuma, molienda)
  sincronizado al visual; la música, **mínima por debajo** (~0.2–0.3). El audio sincronizado al frame es lo
  que sostiene el completar.
- **Audio en tendencia**: solo si lo agarrás dentro de 24–48h de que sube; si no, voz/sonido propio.
- Voz por defecto: la `voz_preferencia` del negocio (ej. `es-AR-TomasNeural`); fallback Edge `es-AR-ElenaNeural`.
- **Normalizá a −14 LUFS** (paso `post.mjs`). La música tiene que oírse en los huecos sin tapar la voz.

## Subtítulos y texto cinético

> **La capa gráfica (texto cinético, pop-ups, stickers, callouts, FX de edición) la dirige la skill
> `graphics-director` — invocala JUNTO con esta y con `audio-director`, sobre el mismo spec.** Ahí está el
> catálogo de elementos, cómo se animan (enter/hold/exit, easing, al beat y a la palabra) y cómo se implementan
> en CPU/gratis (Remotion + Lottie + ffmpeg). Regla central: **no sobre-animar**, dirigir el ojo. Acá queda el
> mínimo de subtítulos; el resto vive allá.

- **Ningún clip va "desnudo".** Footage + subtítulo karaoke solo se ve vacío y crudo. Cada beat lleva una
  **capa diseñada en pantalla** ADEMÁS del karaoke: palabra-clave cinética, etiqueta/`PasoBadge` del paso,
  dato/precio en sticker, sello de marca persistente, lower-third, contador (01·02·03). El texto en pantalla
  entra con sonido off (es parte del hook) y sostiene la retención. **Regla:** que SUME info (marca, @, dato,
  número de paso) — no que repita palabra por palabra lo que dice la voz. La pieza tiene que verse **editada**,
  no un clip crudo con una banda de subtítulos abajo.
- **Karaoke con marcador** (resaltador en la palabra que se dice, color de acento de la marca), **máx 2 líneas
  por beat**, line-height ≈ 1.3×, cortando en pausas naturales (~4–5 palabras/línea). La línea persiste hasta
  que entra la siguiente (sin huecos), padding constante para que NO tiemble.
- **Énfasis al beat:** la palabra clave hace un pop (escala/color) en SU beat. Eso es lo que se ve "editado".
- **Safe zones (1080×1920):** todo el texto crítico dentro del **70–80% central**. Márgenes ≈ **108 arriba /
  320 abajo / 60 izq / 120 der** (px). **Nunca** texto en el **25–30% inferior** ni en la **columna derecha
  (~120px)** — ahí van la UI y el caption.
- **Verificá a mano** los subtítulos: el auto-caption se come acentos y jerga de café (cortado, ristretto…).
  Error sin corregir = amateur. Una sola "piel" de subtítulo (fuente/color/posición) en toda la campaña.
- **Ningún cartel repite lo que dice la voz** — suma algo distinto (marca, @, dato).
- **Ocultá el subtítulo (`ocultarSubtitulos: true`) SOLO en un tramo con tarjeta full-screen (CTA) y SIN VO
  con contenido nuevo.** Nunca sobre una línea hablada con info — la perdés (bug clásico). Un lower-third
  mid-roll convive con el subtítulo (va arriba de la banda de subtítulos), no lo escondas.

## Loop — diseñá la repetición (cada loop es una view)

- **El último frame ≈ el primero** (mismo ángulo/encuadre/posición) → el reel reinicia sin costura.
- **La última línea recontextualiza la primera** (callback verbal). Combiná los dos cuando puedas.
- **No cierres con CTA duro:** rompe el loop y mata las repeticiones. El CTA va **mid-roll** o como tarjeta
  refrescada cada ~20–30s, y el final vuelve al principio.

## Diseño visual — que NO se vea generado

- **Fuentes con carácter** (no system-ui): serif editorial (Fraunces), manuscrita para acentos (Caveat), sans
  fuerte para subtítulos (Montserrat). El sans genérico en caja redondeada grita "IA".
- **Marca como sello/estampa** (rotado, doble borde), arriba, persistente. **Logo real en el sello**, no solo
  texto (`logo.png`). Si lo único que hay es un brand board (logo + paleta), pedí el **logo aislado en PNG
  transparente** en el manifiesto — no metas la tira de paleta ni el tagline en el reel.
- **Brand kit**: paleta hex, logo, fuentes. Misma piel y mismo color grade en todos los planos.
- **Scrim por posición del texto:** `bottom` abajo, `top` arriba, `full` para texto centrado (CTA).

## Piso de marca — que se note DE QUIÉN es, sin hard-sell

El soft-sell retiene, pero llevado al extremo deja un reel lindo que **nadie asocia a la marca** (error
real: "no se menciona la marca"). El soft-sell evita el **pitch**, no la **marca**. Todo reel cumple un
**piso de presencia de marca** — sin romper el loop ni meter CTA duro:

1. **Visual, siempre:** el sello/estampa con el **logo real** persistente (ya es regla). Es el piso mínimo.
2. **Nominal, ≥1 vez con intención:** el **nombre de la marca** se dice (VO) o se ve (cartel) al menos una
   vez, **idealmente atado al payoff**, no en el hook (el hook es para frenar el scroll, no para presentarse).
3. **Payoff brandeado:** el momento de mayor retención (reveal/payoff) **se asocia a la marca** — el producto
   o la marca **ES la resolución** de la tensión, no un cartel pegado al final. Si sacás la marca y el reel
   funciona igual para cualquier competidor, **te falta piso de marca** (es el mismo test de riqueza de la ideación).
4. **El color de marca trabaja:** el énfasis del karaoke y los stickers usan el **acento/primario de la marca**
   (ya lo hace el render con `enfasis`), así la identidad visual aparece sin decir nada. Una sola piel en toda la campaña.

Esto NO es hard-sell: nada de repetir "comprá en X". Es **salience** (que se recuerde de quién es), no pitch.
El CTA sigue siendo uno solo y suave (mid-roll o cierre que reinicia).

## El manifiesto de recursos (el gate)

Ideá la pieza **completa** antes de tocar el render. La salida de la Etapa 2 son **dos cosas**:

1. El **`spec.json`** dirigido (escenas, guion, overlays, audio, loop).
2. El **manifiesto de recursos**: TODO lo que hay que generar/conseguir para renderizar. Por ítem: **archivo
   destino**, **tipo** (imagen / clip img→video / logo / sonido), **asset base** (de qué `asset_id` deriva),
   **prompt de imagen** y, si es video, **prompt de movimiento** — **en inglés**.

El usuario genera cada recurso (HF), lo guarda con ese nombre en `public/`, y **recién ahí** se renderiza.

- **Usá solo los `asset_ids` que el calendario asignó a este post.** No te traigas fotos de otra pieza ni
  quemes el pool; si te falta, lo declarás. El reparto ya se decidió en Etapa 1.
- **Todo recurso generado declara su `archivo` destino** (sin nombre no se puede pedir ni chequear).
- **Cada clip de video cuesta** (plata + tiempo), así que **generá los justos** (ver §Regla de costo: **2 de
  target, hasta 3 si uno es t2v**): cada uno con movimiento real y un ángulo propio, ninguno de relleno. La
  variedad y los ángulos salen de **stills FLUX —ilimitados— + los cortes + el audio**, no de tirar más clips
  de video. Si te falta, primero **pedí video real / buscá stock / declará otro still**; generá otro clip solo
  si nada de eso sirve. Ken Burns, solo como foto deliberada.

### Prohibido el fallback mudo
Un clip o imagen declarado que no existe **bloquea la pieza final** — no se renderiza esa escena con Ken Burns
sobre otra foto haciéndola pasar por el plano dirigido. Si caés en Ken Burns donde dirigiste un clip, es
**borrador**, no entrega: decílo así, no lo presentes como bueno.

## Cómo operar el renderer

El cerebro determinista vive en `renderer/` (ver su `CLAUDE.md` para el detalle de comandos y etapas). El
`spec.json` (ver `renderer/schemas/spec.schema.json`): escenas con `rol` + `visual.fuentes` (cadena de
fallback: `asset_cliente`/`video_generado`/`imagen_generada` → `kenburns`) + `overlays` + `scrim` +
transiciones/animaciones de texto. Pipeline (todo con `npm run` desde `renderer/`, args después de `--`):

**Orden canónico (no lo cambies — así cuadra el timing):** la duración de cada clip sale de `t_out − t_in`,
y esos tiempos recién son reales **después de lockear la voz**. Por eso `tts`+`retime` van ANTES de `gen:hf`:

```
npm run tts       -- spec.<pieza>.json   # OmniVoice -> voice.mp3 + subs.json (timing por palabra REAL)
npm run retime    -- spec.<pieza>.json   # LOCKEA t_in/t_out + duracion_seg desde subs.json (corte sobre la voz por sync_word_idx)
npm run gen:hf    -- spec.<pieza>.json   # RECIÉN AHORA: imágenes FLUX + video Wan (i2v/t2v) a la duración lockeada -> public/   [alt: gen:modal]
npm run normalize -- <clips-de-IA>       # re-encode Remotion-safe de los clips generados (CFR 30fps)
npm run render    -- spec.<pieza>.json   # GATE: si falta un recurso declarado, corta; si está todo -> out/<id>.mp4
npm run align:music -- spec.<pieza>.json # musica.start_seg: los swells caen en las pausas de la voz
npm run mix       -- spec.<pieza>.json   # voz + música (ducking) + SFX al frame, -14 LUFS -> out/<id>-final.mp4
```
(Las imágenes FLUX no dependen de la duración: pre-generarlas antes está bien; el riesgo de descuadre es solo en los **clips de video**.)

- **`render.mjs` es el gate**: un `video_generado`/`imagen_generada`/logo que apunta a un archivo inexistente
  se reporta como **recurso faltante** y **no renderiza la final**.
- **El finisher es `mix`, no `post`**, cuando la pieza tiene cue sheet de audio (lo arma `audio-director`):
  mezcla voz + música ducked + SFX al frame. `post` (`npm run post -- <id>`) es solo loudness, para piezas sin SFX.
- **`--draft`** renderiza con fallbacks para previsualizar el armado — **no es la pieza final**, no lo declares "listo".
- Sacá **capturas** (`remotion still` o ffmpeg) para QC; verificá duración/audio con `ffprobe` antes de cerrar.

## Checklist antes de decir "listo"

- [ ] **Ideación rica**: el concepto pasó el test de 4 puntos (pregunta abierta en la 1ª línea · solo este negocio lo podría hacer · payoff ≈ brecha · un desconocido siente algo en <2s); arquetipo elegido, no "showcase".
- [ ] **Formato elegido de la librería ANTES de los planos** (no improvisado); por defecto un formato HUMANO salvo que el concepto pida lo sensorial/imposible (ahí IA).
- [ ] **Guion escrito por la skill `guionista`** (no a mano) e integrado: hook que cumple en el frame 0,
  loop que cierra en el payoff, beats→escenas, un solo CTA; si no cerraba, se lo devolví a la guionista.
- [ ] **Frame 0 = miniatura**: lo más fuerte + texto + movimiento, sin intro/logo/fade.
- [ ] **Cortes cada 2–4s**; punch-ins al beat o a palabra acentuada; nada de Ken Burns lento de relleno; 15–30s.
- [ ] **Fuente de cada plano por el árbol Y por el costo** (pedir lo real/propio · buscar lo genérico · still+hold si no hay movimiento · t2v para lo abstracto · i2v sólo cuando hay que anclar a algo real y el control paga); la más barata que sirva, no "todo i2v".
- [ ] **Costo bajo control**: **2 clips de video** (1 es poco), hasta 3 si uno es t2v; **imágenes ilimitadas**; **v2v ≤1**; cada clip con "movimiento = payoff"; clima/ambiente = still FLUX + Ken Burns; el modelo más barato que sirva (i2v 14B sólo si el control lo justifica).
- [ ] **Ningún plano slop**: la IA no dibuja manos/caras/texto legible/producto exacto/logos; grade y grano unificados entre real e IA; pasó el "¿algo se ve falso?" con ojos frescos.
- [ ] **Cada plano se mueve** (cámara + acción donde el movimiento es el payoff; en un reel de mood, Ken Burns deliberado sobre stills con la energía en cortes/audio/texto cuenta); **ángulos/encuadres distintos** en cada corte; ningún clip repetido para rellenar (sí para el loop).
- [ ] Solo usé los **assets asignados a este post**; recursos generados con `archivo` y prompts **en inglés**; nada quemado del pool.
- [ ] Todos los recursos del manifiesto **existen** antes del render final; ningún clip dirigido tapado con Ken Burns.
- [ ] **Audio**: VO en el hook si hay claim/historia; ASMR sincronizado; música mínima; −14 LUFS.
- [ ] **Audio ≈ video**: sin aire muerto ni VO cortada (largo del reel = largo de la VO + ≤0,5s de cola).
- [ ] **Texto**: karaoke con énfasis al beat, dentro de safe zones, verificado a mano, sin pisar la voz.
- [ ] **Ningún clip desnudo**: cada beat con una capa de texto/elemento que SUMA info (no repite la voz).
- [ ] **Loop**: último frame ≈ primero y/o callback verbal; **sin CTA duro al final**.
- [ ] **Piso de marca**: sello con logo real persistente + marca nombrada/vista ≥1 vez con intención (cerca del payoff) + payoff brandeado (la marca ES la resolución); colores de marca en énfasis/stickers. Sin hard-sell.
- [ ] **Logo real** en el sello; voz en voseo sin marketing-speak; fuentes con carácter; mismo grade en todos los planos.
