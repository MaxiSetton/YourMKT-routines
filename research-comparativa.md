# Comparativa — research short-form IA vs. proyecto YourMKT

> Auditoría de las skills-director + pipeline contra mejores prácticas de generación de video
> corto con IA (TikTok/Reels). Hecha sin sesgo: primero el research (web), después la comparación.
> El research se quedó sin verificación adversarial (límite de sesión); las **direcciones** son
> confiables (coinciden con práctica establecida y con las propias skills), los **números exactos**
> (83% del "tell" de movimiento, 40% del grano, 15-40% de retención) son **blandos/indicativos**.

## Conclusión de cabecera

Las skills (`reel-director`, `guionista`, `audio-director`, `graphics-director`,
`campaign-director`) **ya están alineadas con casi todo el research**, y en varios puntos son más
finas que las fuentes (mix de costo, muro de licencias de cuentas Business, "no fallback mudo").

Por eso: **los 5 errores observados NO son huecos de doctrina — son fallas de ejecución, de handoff
entre skills, y un par de puntos ciegos estructurales.** Las skills *dicen* lo correcto; se rompe en
la mecánica entre escribir el spec y renderizar. La inversión correcta no es reescribir skills, sino
**cerrar los puntos de sincronización e instrumentar**.

## Huecos reales

### A. Ejecución / pipeline (acá viven los errores de timing y énfasis)

1. **Orden de generación rompe el timing (raíz de "mal timing").** El flujo correcto es VO → TTS →
   `align_words` → retimear escenas a `subs.json` → generar clips a la duración EXACTA de la escena.
   Pero los clips son lo caro y la presión de costo empuja a generarlos **antes** de lockear la voz.
   Si se generan antes, el retiming mueve los bordes de escena por debajo de los clips → freeze
   (clip < escena, `GOTCHAS`) o corte a mitad de movimiento. **Fix: lockear voz+subs PRIMERO,
   retimear, y recién ahí generar clips** (o generarlos +0.5s y trimear al borde lockeado).

2. **SFX caen a destiempo por diseño.** `mix-audio` ancla el cue a un segundo pero reproduce el
   archivo **desde su seg 0, sin trimear ni sincronizar**. Whoosh/impact largos "zumban"; ASMR de
   banco cae de cualquier lado. **Fix: auto-trim de cada SFX a la longitud del evento con onset
   alineado al transiente; colocar 1-2 frames después del corte.**

3. **Triple-sync (beat = pop visual = pop sonoro) sin fuente única de verdad.** Hoy guionista marca
   la palabra a enfatizar, graphics la anima y audio la puntúa **por separado**, leyendo cada uno el
   índice de `subs.json`. Si no apuntan al mismo `word_idx`, el pop visual y el sonoro caen en frames
   distintos → énfasis diluido. **Fix: un solo campo `escena.enfasis.word_idx` que las tres capas
   leen; el renderer coloca pop visual + SFX desde ese único campo.**

4. **Música ducked pero NO beat-matched.** La doctrina dice "golpes al beat" pero la música se
   loopea independiente de los cortes (que salen de la VO). "Sync al beat" es aspiracional. **Fix:
   elegir BPM que matchee la cadencia media de cortes y alinear el primer downbeat al hook, o detectar
   beats y snapear cortes.**

### B. Doctrina / estructura

5. **Sesgo de soft-sell → sub-branding ("poca mención a la marca").** El soft-sell está tan
   optimizado para retención que no garantiza presencia de marca. El research: 90% de brand TikToks
   muestran producto (lo que se evita es el hard-sell, no la marca). **Fix: brand-presence floor —
   sello visual siempre + ≥1 mención/aparición intencional + payoff brandeado, sin CTA duro.**

6. **Ideación por arquetipo (7) < ideación por formato (220+).** El research: el formato maneja la
   ideación. Falta una **librería de formatos**, sobre todo los **humanos de bajo costo**
   (walking-and-talking, "¿vale la pena?", reto+resultado, reacción). Alimenta "falta de creatividad".

7. **El pipeline AI-visual-first limita la creatividad de escena (raíz profunda de "falta de
   escenas atractivas").** Los formatos más potentes son humanos (talking-head, UGC,
   walking-and-talking, demo a cámara) — los que la blacklist evita por slop. El reel por defecto es
   B-roll IA + stills + Ken Burns, el formato menos atractivo y el más penalizado (-15-25% por
   etiqueta IA). La lucha anti-slop es en parte un workaround por usar Wan. **Lever estratégico: para
   piezas hero, un modelo de tier más alto (Kling barato / Veo calidad) desbloquea caras/movimiento
   real — atado al tope de costo.**

### C. Oportunidad transversal

8. **No hay loop de feedback de retención.** Hay `metrics`/`baseline_metrics` en la DB y
   campaign-director referencia "memoria de performance", pero nada computa retención/completion y la
   realimenta a la selección de hook/formato. **Fix: traer reach/completion de IG Insights por pieza,
   computar proxy de retención, alimentar la memoria de performance.**

## Mapa errores observados → causa raíz

| Error observado | Causa raíz | Tipo |
|---|---|---|
| Mal timing (video/audio/música/SFX/TTS) | A1 (orden de generación) + A2 (SFX sin sync) + A3 (triple-sync) + A4 (no beat-match) | ejecución |
| Ganchos mejorables | No se cumplen las 3-5 variantes + hook no validado como unidad (frame0+audio) + sin loop de feedback (#8) | handoff + infra |
| Poco énfasis en lo importante | A3 (palabra de énfasis sin fuente única) | handoff |
| Poca mención a la marca | B5 (soft-sell sin piso de marca) | doctrina |
| Falta de escenas atractivas/creatividad | B6 (sin librería de formatos) + B7 (pipeline AI-visual-first) | doctrina + estructural |

## Orden de implementación (impacto/esfuerzo)

1. Lockear voz+subs antes de generar clips (arregla la mayor parte del timing) — *pipeline, alto*
2. `escena.enfasis.word_idx` como fuente única (énfasis + ayuda timing) — *schema + 3 skills, bajo*
3. Auto-trim/sync de SFX (resto del timing) — *pipeline, medio*
4. Brand-presence floor (marca) — *doctrina, bajo*
5. Librería de formatos + formatos humanos (creatividad) — *doctrina, medio*
6. Loop de feedback de retención desde IG Insights — *infra, alto valor a largo plazo*
7. Re-evaluar tier de modelo para hero pieces — *estratégico, atado a costo*

## Extra — entrega de ideas al usuario

La presentación de ideas (Etapa 1, tab Ideas) tiene que **reflejar fielmente lo que se va a producir
después**: el concepto/tensión, el formato real, el rol, el hook, qué assets usa / pide / genera, y
el CTA — para que lo que el usuario aprueba sea lo que termina rendido, sin sorpresas en Etapa 2.

---

## Estado de implementación

**Hecho (verificado):**
- **A1 — orden canónico.** `retime` cableado en `package.json`; `retime.mjs` endurecido (sin
  `sync_word_idx` preserva la duración tentativa en vez de colapsar); `generate-hf.mjs` avisa si se
  generan clips antes de lockear la voz; orden `tts→retime→gen:hf→…→align:music→mix` documentado en
  `renderer/CLAUDE.md` y `reel-director`. Test funcional de retime: 7/7 PASS.
- **A2 — SFX.** `mix-audio.mjs` recorta cada SFX al largo del evento + fade-out (`SFX_MAXLEN` por tipo,
  `ambience` sostenida, override `sfx.dur`). Filtro validado contra ffmpeg real.
- **A3 — énfasis fuente única.** `escena.enfasis` en el schema + `types.ts`; `Subtitles.tsx` da pop
  EXTRA + pre-highlight a la palabra clave; `retime.mjs` resuelve `word_idx` desde `enfasis.texto`
  (case/acento-insensible); `mix-audio.mjs` auto-coloca el pop sonoro en la MISMA palabra; doctrina en
  guionista/graphics/audio. (También se agregó al schema `ocultarSubtitulos`, que faltaba y rompía la validación.)
- **B5 — piso de marca.** Sección nueva en `reel-director` + reglas en `guionista` y check en
  `campaign-director`.
- **B6 — librería de formatos.** Tabla de formatos (humanos + IA) en `reel-director`, con sesgo a lo
  humano; puntero desde `campaign-director`.
- **UI — entrega de ideas.** `idea-card.tsx`: línea "qué se produce" por formato + aviso de audio
  trending (el reel sale sin música y la canción va en IG).

**Pendiente (estratégico, fuera de un edit puntual):**
- **#8 — loop de feedback de retención.** Necesita integrar IG Insights (reach/completion por pieza) y
  alimentar la "memoria de performance" de `campaign-director`. Es una FEATURE, no un retoque: se deja
  documentada como próximo paso, no se simula.
- **#7 — tier de modelo para piezas hero.** El pipeline está hard-lockeado a HF Wan/FLUX (`gen:hf`).
  Subir a Veo/Kling para piezas hero requiere wiring de nuevos providers; se mantiene como decisión
  estratégica acá (no se mete en la skill operativa para no prometer lo que el pipeline no hace hoy).

**Nota de tipos:** `renderer/src/Root.tsx` tiene errores de TS pre-existentes (fricción de genéricos de
Remotion en `Composition`); no los introduje y no bloquean el render (usa esbuild). Quedan sin tocar.
