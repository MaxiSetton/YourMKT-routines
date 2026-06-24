# Investigación — Dirección de AUDIO para reels de PyME local

> Base para REESCRIBIR la skill **`audio-director`** de YourMKT. El audio-director NO escribe el guion (eso es
> `guionista`) ni diseña la imagen (`reel-director`/`graphics-director`): dirige las **tres capas de sonido**
> —voz interpretada · música · SFX— y la mezcla, atadas al `spec.audio` real. Cada sección cita fuentes con
> URL; donde discrepan está marcado **[Discrepancia]**.
>
> **Quejas que esta investigación resuelve** (del audio-director actual): (1) usa SIEMPRE el mismo efecto
> (whoosh) y en CADA corte; (2) o no pone música o pone música que **da sueño**; (3) no mira **trends**; (4)
> agarra **el primer resultado** en vez de elegir algo copado y alineado al objetivo.

---

## 0. TL;DR operativo (la regla de bolsillo)

1. **Decidí la estrategia de audio por el OBJETIVO de la pieza** (§8), no por inercia. No todo lleva la misma
   cama lofi ni un whoosh en cada corte.
2. **Voz primero:** OmniVoice **clona la emoción de la voz de referencia** → elegí/preparás la referencia con
   el tono y la energía que querés (cálido vs enérgico), y modelás el ritmo con **puntuación + `speed`**.
   OmniVoice **no** entiende SSML ni MAYÚSCULAS (§7).
3. **Música elegida, no la primera:** audicioná 3–5, elegí por **energía/mood/BPM/estructura** que matchee el
   objetivo (§3). La música puede ser cálida pero **con vida** (build/peak), nunca un loop plano que da sueño.
4. **SFX con criterio, no en cada corte:** el SFX **subraya un evento** (hook, reveal, dato), su **tipo matchea
   el movimiento** (§4). Menos es más; el silencio también dirige.
5. **Sonido diegético/ASMR es protagonista** en planos de producto/proceso (vapor, molienda, vertido) (§5).
6. **Mezcla:** ducking 15–25 dB, voz al frente, **−14 LUFS** / true peak ≤ −1 dBTP (§6).
7. **Trends:** palanca de **alcance ocasional**, y para cuentas de empresa es **zona de licencia** → por
   default audio propio; si va trend, **export SIN música + instrucción para que el humano lo agregue en IG** (§2).

---

## 1. Por qué el audio decide alcance (la física)

- **~50% de la calidad percibida de un reel es sonido.** En mobile + auriculares el audio sucio se nota al
  instante: si la música tapa la voz, el viewer "pierde el mensaje y scrollea" → el audio limpio (ducking)
  **sube watch-time y retención** directamente. ([OpenClip](https://openclip.app/learn/audio-ducking))
- El **sonido sincronizado al frame** (un golpe en el corte, un ASMR en el gesto) sostiene el *completar* y
  dispara *guardar/compartir*. El audio es estructura, no decoración.

---

## 2. Trending audio y el MURO de licencias para cuentas de empresa (clave para PyME)

### El problema real
- Meta tiene deals con los sellos pero **limitados a uso personal/no comercial**. Las **cuentas Business** solo
  acceden a la **Meta Sound Collection (~14.000 tracks)** — el único catálogo **cleareado para comercial**.
  Personal/Creator ven la biblioteca grande (con los hits/trending) porque cubre uso individual no promocional.
- **Usar un trend con copyright en cuenta de empresa** → **audio muteado, contenido bajado, publicación
  bloqueada o distribución reducida**. Meta detecta audio incluso en vivo; reincidir traba la cuenta.
- El **workaround de cambiar a Creator/Entrepreneur** desbloquea la UI pero **NO autoriza** el uso ("que la
  plataforma te dé la opción no significa que tengas el derecho"). Por eso **no es el default**.
  ([trymaas](https://www.trymaas.com/blog/instagram-business-account-trending-music-risks/),
  [ProTunes One — Meta 2025](https://protunesone.com/blog/meta-copyright-rules-2025-how-to-legally-use-music-on-facebook-instagram/),
  [SocialSmarty](https://socialsmarty.co/post/instagram-reels-music-business-account))

### Cómo decide el audio-director
| Situación | Estrategia |
|---|---|
| Cuenta Business + pieza de marca/venta | **Audio propio**: VO + música pre-cleareada + SFX. Cero trend con copyright. |
| Querés el empuje de alcance de un trend (objetivo = alcance) | Export **con VO + SFX y SIN cama de música** + **instrucción para el humano**: "en IG agregá el sonido trending X por debajo (~15–20%) para que se oiga la voz". En el spec: `audio.modo="audio_nativo_ig"` + `audio.ig_audio`. |
| Música cleareada de verdad | Meta Sound Collection o bancos con derechos comerciales explícitos (§3). |

> **Detección de trends (la opera el humano en la app):** el **indicador de flecha "en aumento"** sobre el
> audio, las secciones de tendencia (SocialPilot/Dash Social publican rankings semanales), **guardar** el
> sonido desde un reel; ventana corta de **24–72h**. El agente solo deja la instrucción.
> ([SocialPilot](https://www.socialpilot.co/blog/instagram-reels-trends),
> [Dash Social](https://www.dashsocial.com/blog/trending-instagram-reels-songs))

---

## 3. Música — elegir por objetivo/mood/BPM (anti "da sueño") + sourcing

**Por qué "da sueño":** una cama plana, sin estructura ni energía, puesta igual en todo. La música buena tiene
**estructura** (intro → build → peak → resolución) que da **anclas** al montaje, y **energía** que matchea el
objetivo. El contraste (silencios, subidas) evita la monotonía. ([Mubert](https://mubert.com/blog/how-to-match-music-with-video-pacing))

### BPM ↔ ritmo/mood
| Contenido / cortes | BPM | Mood |
|---|---|---|
| Lento, contemplativo (planos 6s+) | **60–90** | refugio, nostalgia, calma; ambient/lofi cálido |
| Moderado (planos 3–6s) | **90–120** | flujo, marca, "feel good" |
| Enérgico / acción / promo | **140+** | urgencia, hype, venta |
| Triste | 60–80 | — |

Combiná **BPM + género + mood**; cortá **cada 2–4 beats** para dinámico (y **rompé** el patrón a veces para
que no sea predecible). **El BPM solo no garantiza el fit** — tienen que matchear también mood, estructura y
energía. ([Artlist BPM](https://artlist.io/blog/music-bpm/), [1SE](https://help.1se.co/en/articles/8205392))

### RÚBRICA para elegir/descartar (no el primer resultado) — audicioná 3–5 y puntuá:
1. **¿La energía matchea el OBJETIVO?** (refugio = cálido/lento; alcance = enérgico con build). Si no → descartá.
2. **¿Tiene estructura** (build/peak) o es un loop plano? Plano y largo = riesgo "da sueño".
3. **¿El BPM calza con el ritmo de cortes** del reel?
4. **¿El mood matchea el TONO de marca** (evitar lo que la marca evita: saturado, genérico)?
5. **¿Está cleareada para uso comercial?** (si no, no va).
El primer resultado casi nunca gana las 5. Elegí por fit, no por orden.

### Sourcing de calidad (con licencia)
| Banco | Licencia | Nota |
|---|---|---|
| **Meta Sound Collection** | cleareada para Business | baseline, se agrega en la app |
| **Freesound (CC0)** | uso comercial sin atribución | **anda por API en el pipeline** (`fetch:audio freesound`); más SFX/loops que camas pulidas |
| **Uppbeat** | freemium, comercial (atribución en free) | accesible para PyME/creators |
| **Epidemic Sound / Artlist / Soundstripe** | paga, **comercial explícito** | catálogo grande y bien masterizado (Epidemic ~55k, Artlist ~35k); lo mejor si hay presupuesto |
| **Pixabay audio** | libre comercial | ⚠️ **da 403 por API** en el pipeline; calidad variable |
| YouTube Audio Library | libre comercial | manual |

([Paste — guía 2025](https://www.pastemagazine.com/tech/epidemic-sound/royalty-free-music-for-creators),
[Epidemic vs Artlist](https://www.epidemicsound.com/blog/artlist-vs-epidemic-sound/),
[Soundstripe vs Uppbeat](https://www.soundstripe.com/blogs/soundstripe-vs-uppbeat-io))

### Objetivo → música (corta el "lofi en todo")
| Objetivo / rol | Música |
|---|---|
| Awareness / alcance frío | enérgica 100–120+ **con build**; que el peak caiga en el reveal |
| Deseo / refugio (calma) | cálida 70–90, lofi/acústica con vida, **bien por debajo** de la voz |
| Prueba / oficio | mínima; **dejá respirar el ASMR diegético** (§5) |
| Comunidad / barrio | media cálida, orgánica |
| Conversión | con drive y un **acento (drop/impact) cerca del CTA** |

---

## 4. Diseño sonoro / SFX — paleta + CUÁNDO cada uno (anti "mismo whoosh en cada corte")

El error tibio: un whoosh en cada corte. **Cansa y distrae** ("don't use too many transition SFX — it gets
annoying"). El SFX **subraya un evento**, no rellena cada transición.

### Paleta (qué es / cuándo)
| SFX | Qué es | CUÁNDO (match al movimiento/evento) |
|---|---|---|
| **Whoosh / swoosh** | barrido de aire corto | transición **rápida**: whip-pan, objeto/persona que cruza, swipe |
| **Riser / uplifter** | sube en tono y corta arriba | **construir tensión** antes de un drop/**reveal**; resuelve EN el corte |
| **Impact / hit / boom** | golpe grave | **enfatizar**: el reveal cae, un dato/precio aparece, el frame 0 del hook |
| **Sub-drop** | caída de graves | un **bajón** dramático / pasar a algo más calmo |
| **Pop / click / tick** | corto, agudo | algo que **entra**: pop-up, sticker, palabra cinética, contador (sincroniza con el pop visual) |
| **Drone** | textura grave sostenida | clima de **suspenso/misterio** (J-cut: entra antes de la escena) |
| **Sting / braam** | acento dramático/épico | momento creepy o épico/título; **raro** en PyME, solo si el concepto lo pide |

### Reglas de oro (resuelven la queja)
- **NO un SFX por corte.** Reservalos: **impact en el hook**, **riser→impact en un reveal/payoff**, **pop en
  un dato/elemento que entra**, y **algunas** transiciones clave. Si todo suena, nada destaca.
- **Variedad con criterio:** el **tipo** matchea el movimiento (whoosh=rápido; riser+impact=build→reveal;
  pop=entra). Repetir el mismo whoosh = trabajo tibio.
- **Layering** con sentido: riser **+** impact, o slow-mo **+** whoosh. No por layerear.
- **Volumen** por debajo de voz y música. **Timing:** 1–2 frames **después** del inicio de la transición (el
  oído percibe antes que el ojo); el riser resuelve en el corte.
  ([FlexClip](https://www.flexclip.com/learn/transition-sound-effects.html),
  [Soundstripe risers](https://www.soundstripe.com/blogs/what-are-cinematic-riser-sound-effects))

### En el `spec.audio.sfx[]`
Cue anclado por `t` (seg) · `corte` (id de escena → su `t_in`) · `palabra` (índice en `subs.json`). Tipos hoy:
`whoosh, riser, impact, pop, subdrop, ambience`. Ej.: `impact` en `corte:"hook"`; `pop` en la `palabra` del
dato; `riser` con `t` 0.4s antes del reveal + `impact` en el `corte` del reveal. **Variá el tipo; no whoosh en cada corte.**

---

## 5. Sonido diegético / ASMR como protagonista

- En planos de **producto/proceso**, el sonido es lo principal. Los **sonidos satisfactorios/diegéticos**
  (vapor, molienda, vertido, espuma, crujido, tapping, chisporroteo) **disparan watch-time, guardados y
  compartidos** (#asmr ~17M posts en IG / 28M en TikTok). ([Epidemic — ASMR](https://www.epidemicsound.com/blog/what-is-asmr/))
- **Usalo como HERO:** el chorro del vertido, el grano cayendo, el vapor de la leche — **sincronizado al
  visual**, con la **música mínima por debajo** (~0.2) o en silencio. El sonido al frame sostiene el completar.
- **Producción:** capturarlo limpio (buen mic) o **sourcear el SFX específico** (Freesound) y montarlo. ⚠️
  **Gotcha del pipeline:** el render **mutea el video** (`OffthreadVideo muted`), así que el diegético **no
  sale solo** del clip — hay que agregarlo como cue (`ambience`/SFX) anclado al `corte`/`t`, o sumar la pista
  real del clip en la mezcla. Si querés ASMR, **declaralo como cue**, no asumas que viene del clip.

---

## 6. Mezcla — ducking, niveles, −14 LUFS, EQ

- **Ducking (sidechain):** profundidad **15–25 dB**, **attack 10–30 ms**, **release 200–500 ms** (ajustar al
  tempo). La voz dispara la baja de la música. ([OpenClip](https://openclip.app/learn/audio-ducking))
- **Niveles:** voz al frente; música por debajo (`volumen 0.15–0.25`, **ducked**); SFX por debajo de ambas.
- **Loudness:** **−14 LUFS integrado, true peak ≤ −1 dBTP** → seguro en IG/YT/TikTok/Spotify. Un mix bien
  ducked se normaliza sin que el limiter distorsione.
  ([Lance Blair VO](https://lanceblairvo.com/lufs-voiceover-levels/),
  [Starsound LUFS social](https://starsoundstudios.com/blog/lufs-social-media-platform-standards-mastering-music))
- **EQ:** leve realce 2–5 kHz en la voz (presencia) + bajar 2–4 kHz en la música (hueco para la voz). Sin clipping.

*(Pipeline: `mix-audio.mjs` ya hace voz + música sidechain-ducked + SFX al frame + `loudnorm=I=-14:TP=-1.5`.
El audio-director llena el cue sheet; el script ejecuta la mezcla.)*

---

## 7. Interpretación de la voz en OmniVoice (expresividad real)

OmniVoice (`k2-fsa/OmniVoice`) es **TTS de clonación zero-shot**: la **prosodia y la emoción se TRANSFIEREN
de la voz de referencia** (igual que StyleTTS/GLM-TTS — "synthesizes speech with the prosody and emotion of
the reference audio"). Esto define qué palancas tiene el audio-director:

- **Palanca #1 — la voz de referencia** (`public/audio-[vocals].mp3`): la voz clonada **hereda el tono y la
  energía** del clip de referencia. Para una pieza de **refugio/calma** → referencia tranquila y cálida; para
  **alcance/hype** → referencia con más energía. Cambiar la referencia es lo que más cambia la emoción.
- **Palanca #2 — ritmo:** la **puntuación** (coma = pausa corta · punto = media · **`…` / salto de línea =
  pausa dramática**) + el **`speed`** (0.85 por defecto; más lento para drama/refugio, ~0.9–0.95 para energía).
- **Lo que NO funciona en OmniVoice:** **SSML** (`<break>`, `<emphasis>`, `prosody`) y **MAYÚSCULAS** no
  cambian el acústico — son sólo marcas que usa el guionista para que **graphics** anime y **audio** ponga un
  SFX. No esperes que OmniVoice "grite" una palabra en mayúscula.
- **Flujo:** el guionista entrega el texto marcado → el audio-director lo **afina para OmniVoice** (elige la
  referencia según el tono de marca, setea `speed`, mete pausas con puntuación/saltos, parte en segmentos si
  hace falta) → **escucha el resultado** y re-rola la referencia o re-puntúa si la emoción no quedó.
- **Futuro (opcional):** modelos que **desacoplan emoción/timbre** con control explícito de emoción/rate/pitch
  (IndexTTS2, GLM-TTS, Zonos) — si algún día se cambia el motor, habilitan dirección emocional por texto.
  ([Voice Cloning Survey](https://arxiv.org/html/2505.00579v1),
  [GLM-TTS](https://github.com/zai-org/GLM-TTS), [IndexTTS2](https://index-tts2.org/))

---

## 8. Marco OBJETIVO → estrategia de audio

| Objetivo / rol de la pieza | Voz | Música | SFX | Trend |
|---|---|---|---|---|
| **Awareness / alcance frío** | VO con energía (referencia enérgica) | enérgica con build, peak en el reveal | impact en hook + reveal | **opcional** (export sin música + nota humano) |
| **Deseo / refugio (calma)** | VO cálida, `speed` más lento | cama lofi/acústica cálida, baja, ducked | mínimos; transición suave | no |
| **Prueba / oficio** | VO clara | **mínima**, deja respirar | **ASMR diegético protagonista** + pop en el dato | no |
| **Comunidad / barrio** | VO cercana | media cálida orgánica | pocos, suaves | solo si el objetivo es alcance |
| **Conversión / venta** | VO con intención | con drive | un **acento (impact/drop) en el CTA** | no |

La densidad de SFX y el tipo de música **salen del objetivo**, no de un default. *(El objetivo/rol de cada
pieza lo fija `campaign-director`; el audio-director lo lee del `piece.json`.)*

---

## 9. Anti-patrones (con la regla correcta)

| Anti-patrón | Regla correcta |
|---|---|
| **Mismo whoosh en cada corte** | El SFX subraya un **evento** (hook/reveal/dato); el **tipo** matchea el movimiento; **no** en cada corte. |
| **Música que da sueño / lofi en todo** | Elegí por **objetivo/energía/BPM/estructura**; cama con **vida** (build/peak), no loop plano. |
| **El primer resultado** | Audicioná **3–5** y elegí por la **rúbrica** (§3); descartá lo que no matchea energía/mood/BPM/marca. |
| **SFX en cada corte / saturar** | **Menos es más**; el silencio y el contraste también dirigen. |
| **Música tapando la voz** | **Ducking 15–25 dB**, voz al frente, **−14 LUFS**. |
| **Ignorar el sonido diegético** | En producto/proceso el **ASMR es protagonista** (declarado como cue, el render mutea el clip). |
| **Trend con copyright en cuenta de empresa** | Riesgo de mute/baja → **export sin música + instrucción para el humano** en IG. |
| **Esperar que OmniVoice "actúe" por SSML/MAYÚSCULAS** | La emoción viene de la **voz de referencia**; el ritmo de **puntuación + speed**. |

---

## 10. Qué hace la skill `audio-director` (y qué NO) + mapeo a `spec.audio`

### SÍ le corresponde
1. **Elegir la estrategia de audio por el objetivo** de la pieza (§8): tipo de música, densidad de SFX, VO-led, trend sí/no.
2. **Dirigir la INTERPRETACIÓN de la voz en OmniVoice** (§7): elegir/preparar la voz de referencia según el
   tono de marca, setear `speed`, modelar pausas con puntuación, escuchar y re-ajustar. (NO reescribe el guion.)
3. **Elegir la música con rúbrica** (no el primer resultado), del mood/energía/BPM que matchea el objetivo, y
   **sourcearla legal** (Freesound CC0 por API hoy; Pixabay 403; bancos pagos para calidad).
4. **Armar el cue sheet de SFX variado y con criterio** (§4): tipo según el evento, anclado por `corte`/
   `palabra`/`t`; **no whoosh en cada corte**.
5. **Dirigir el sonido diegético/ASMR** en planos de producto/proceso (§5), declarado como cue.
6. **Definir la mezcla** (§6): ducking, niveles, −14 LUFS.
7. **Decidir trend sí/no** y, si va, **dejar la instrucción para el humano** + `audio.modo="audio_nativo_ig"`.

### NO le corresponde
- **Escribir el guion** (el texto) → `guionista`. · **Concepto/cortes/cadena de fuentes** → `reel-director`. ·
  **Texto cinético/pop-ups/qué palabra se anima** → `graphics-director`. · **Objetivo/rol/plan de la campaña**
  → `campaign-director` (lo recibe). · **Ejecutar el render/mezcla** → `mix-audio.mjs`/`tts.mjs`.

### Mapeo a `spec.audio`
- `voz.texto` = el guion del `guionista` (no lo reescribe). `voz.voz_tts` = la **referencia/voz** elegida.
  `voz.rate` = el `speed`/ritmo.
- `musica` = `{ src (track elegido por rúbrica), volumen 0.15–0.25, mood, duck:true }`.
- `sfx[]` = cue sheet **variado**, anclado por `t`/`corte`/`palabra`, tipos del catálogo.
- `modo="audio_nativo_ig"` + `ig_audio` cuando el plan es agregar un trend en la app (export sin música).

---

## Apéndice — Fuentes

**Licencias / trending (cuentas de empresa)**
- https://www.trymaas.com/blog/instagram-business-account-trending-music-risks/
- https://protunesone.com/blog/meta-copyright-rules-2025-how-to-legally-use-music-on-facebook-instagram/
- https://socialsmarty.co/post/instagram-reels-music-business-account · https://tripepismith.com/insights/music-in-reels-business-accounts/
- https://www.socialpilot.co/blog/instagram-reels-trends · https://www.dashsocial.com/blog/trending-instagram-reels-songs

**Música / BPM / sourcing**
- https://artlist.io/blog/music-bpm/ · https://mubert.com/blog/how-to-match-music-with-video-pacing · https://help.1se.co/en/articles/8205392
- https://www.pastemagazine.com/tech/epidemic-sound/royalty-free-music-for-creators
- https://www.epidemicsound.com/blog/artlist-vs-epidemic-sound/ · https://www.soundstripe.com/blogs/soundstripe-vs-uppbeat-io

**SFX / diseño sonoro / ASMR**
- https://www.flexclip.com/learn/transition-sound-effects.html · https://www.soundstripe.com/blogs/what-are-cinematic-riser-sound-effects
- https://www.krotosaudio.com/products/cinematic-whooshes-transitions-sound-effects-library/
- https://www.epidemicsound.com/blog/what-is-asmr/ · https://www.storyblocks.com/resources/blog/asmr-sounds

**Mezcla / LUFS**
- https://openclip.app/learn/audio-ducking · https://lanceblairvo.com/lufs-voiceover-levels/
- https://starsoundstudios.com/blog/lufs-social-media-platform-standards-mastering-music · https://pureaudioinsight.com/blogs/content-production/background-music-volume-how-loud-should-it-be

**TTS expresivo / clonación**
- https://arxiv.org/html/2505.00579v1 (Voice Cloning Survey) · https://github.com/zai-org/GLM-TTS · https://index-tts2.org/
- https://speechify.com/blog/8x8-text-to-speech-pause/ · https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup
