# YourMKT — Renderer

Paquete **aislado** de la app Next.js: vive en su **propio repo** (`YourMKT-routines`), separado del
repo de la app. Su trabajo: convertir un **`spec.<id>.json`** en la media final —reel `.mp4` o
carrusel de PNGs— y **subirla a la app**. La IA *dirige* (llena el spec); Node + Remotion + ffmpeg
*renderizan* sin azar: mismo spec ⇒ misma salida.

> Contexto de infra (Supabase, esquema de DB, Storage) — **autocontenido** en [`CONTEXT.md`](CONTEXT.md)
> (este repo es standalone; no hay `../CLAUDE.md`). Este archivo es el **pipeline**; las **3 routines**
> de Claude Code que lo disparan por API viven en [`routines/`](routines/) — empezá por
> [`routines/README.md`](routines/README.md).

---

## Regla de oro — cada etapa tiene su skill, respetala

No improvises una campaña, un reel, sus gráficos ni su audio "a mano". Cada etapa la **dirige una
skill** de `.claude/skills/`. Invocá la skill: ella produce el artefacto (calendario / spec /
overlays / cue sheet) con su método; los scripts de acá solo lo **ejecutan**.

Si el output de una skill sale mal, **arreglá la skill, no parchees el output puntual** —
research + fix genérico, así no vuelve a pasar. Las 5 skills-director son separadas a propósito,
unidas por el spec compartido. (memoria: `mejorar-skills-no-parchar`, `arquitectura-directores`)

---

## Las 5 etapas

| # | Etapa | Skill(s) que la dirige(n) | Produce | Herramientas |
|---|---|---|---|---|
| 1 | **Ideación de campaña** | `campaign-director` | Calendario: cada idea con objetivo/formato/hook → `posts` (borrador) | `seed:calendar`, `fetch:campaign` |
| 2 | **Dirección de la pieza** | `guionista` (el guion) + `reel-director` (integra: qué/cuándo) + `graphics-director` (overlays/FX) + `audio-director` (voz/música/SFX) | `spec.<id>.json` + manifiesto de recursos a generar | las skills escriben el spec; validalo vs `schemas/spec.schema.json` |
| 3 | **Generación de recursos** | (lo pide el manifiesto de la etapa 2) | Assets crudos en `public/` | `fetch:assets`, `gen:hf`, `fetch:audio`, `normalize` |
| 4 | **Render determinista** | — (Remotion + ffmpeg) | `out/<id>.mp4` o `out/<id>-slide-*.png` | `tts`, `render` / `render:carrusel`, `mix` / `post` |
| 5 | **Subir a la app** | — | Media en Supabase Storage + `posts.media_url` | `publish:reel` / `publish:imagen` / `publish:carrusel` |

Las etapas 2→4 trabajan **juntas**: la `guionista` escribe el guion (`audio.voz.texto`, en beats), el
`reel-director` lo **integra** —decide los cortes y el spec alrededor de lo que se dice—, el
`graphics-director` puebla los `overlays` (implementados en `src/`), y el `audio-director` llena
`spec.audio` (hace que OmniVoice **interprete** el guion + música + cue sheet de SFX anclado a los cortes y a
`subs.json`). No pegues música al final: el guion, la voz y los cues se diseñan con la pieza.

> **⚠️ ORDEN CANÓNICO (no negociable para que cuadre el timing).** La duración de cada clip de video la
> deriva `gen:hf` de `t_out − t_in`, y esos tiempos **recién son reales después de lockear la voz**. Por eso
> **la voz se lockea ANTES de generar los clips**, no después. Para un reel con `sync_word_idx`:
>
> ```
> tts → retime → gen:hf → normalize → render → align:music → mix
> ```
>
> 1. `tts` → `voice.mp3` + `subs.json` (timing por palabra real). 2. `retime` → fija `t_in/t_out` +
> `duracion_seg` desde `subs.json`. 3. **recién ahí** `gen:hf` genera cada clip a la duración **lockeada**.
> Generar clips antes de `tts`/`retime` los descuadra (freeze/corte) — `gen:hf` te avisa si falta `subs.json`.
> *(Las imágenes FLUX no dependen de la duración, así que pre-generarlas está bien; el riesgo es solo en los clips de video.)*

---

## Comandos (todo desde `renderer/`)

Pasá los argumentos después de `--`. El primer positional casi siempre es el spec.

### Etapa 1 — Ideación
```
npm run fetch:campaign -- [negocio]        # lee marca + campañas + material de Supabase (default: bruma)
npm run seed:calendar  -- <calendar.json>  # siembra el calendario que produce la skill campaign-director: posts borrador + plan de assets + setea fecha_inicio. --force para resembrar
npm run fetch:piece    -- <campaña> <dia> [negocio] [formato]   # trae de la DB la pieza de UN día (día 1 = fecha_inicio) → piece.<slug>-diaN.json para dirigir. La DB es la verdad, no los spec a mano. <campaña> matchea sin acentos
```
La pieza (no el spec a mano) es el puente entre etapas: pedís el día que querés y el `piece.*.json`
trae el post real de la DB (rol/pilar/ángulo/hook/cta + assets asignados + marca) para que el
reel-director escriba `spec.<piece_id>.json`. Así "el reel del día 4 de tal campaña" siempre resuelve
a la pieza correcta, sin colisiones de nombre entre campañas.

### Etapa 3 — Recursos → `public/`
```
npm run fetch:assets -- [negocio]                          # baja el material real del cliente
npm run gen:hf       -- spec.<id>.json                     # genera imágenes (FLUX) + video (Wan i2v/t2v) que pide el spec, al aspecto final. CLIPS DE VIDEO: corré tts+retime ANTES (la duración sale de t_out-t_in lockeado) — ver ORDEN CANÓNICO arriba
npm run fetch:audio  -- <pixabay|freesound|jamendo> "<query>" public/<dest> [idx]   # música/SFX libres
npm run normalize    -- [a.mp4 b.mp4 ...]                  # re-encode de clips i2v para que Remotion pueda hacer seek; sin args = todos los public/*.mp4 crudos
# alternativa a gen:hf por endpoints Modal propios (MODAL_WAN_URL/MODAL_LTX_URL/MODAL_FLUX_URL):
npm run gen:modal    -- spec.<id>.json
```
`normalize` guarda el crudo como `<nombre>.src.mp4` (cache: no rebaja si ya existe). Lo que falte
en `public/` sale como placeholder, así el reel renderiza igual y vas reemplazando de a uno
(ver `ASSETS.md`).

### Etapa 4 — Render → `out/`
```
npm run tts            -- spec.<id>.json          # voz public/voice.mp3 con OmniVoice (clona una voz de ref, local en CPU, lento) + subs.json (timing por palabra REAL: align_words.py / faster-whisper alinea el guion al audio)
npm run retime         -- spec.<id>.json          # LOCKEA t_in/t_out + duracion_seg desde subs.json (corta sobre la voz por sync_word_idx). Corré ENTRE tts y gen:hf
npm run render         -- spec.<id>.json [--draft]   # arma el reel → out/<id>.mp4 (resuelve la cadena de fuentes vs public/)
npm run render:carrusel -- spec.<id>.carrusel.json   # una PNG por slide → out/<id>-slide-N.png
npm run align:music    -- spec.<id>.json          # elige musica.start_seg para que los swells de la música caigan en las pausas de la voz. Corré DESPUÉS de tts+retime, ANTES de mix
npm run mix            -- spec.<id>.json [out/<id>.mp4]   # voz + música (ducking) + SFX al frame, -14 LUFS → out/<id>-final.mp4
npm run post           -- <id|archivo>            # solo loudness -14 LUFS (cuando NO hay SFX) → out/<id>-final.mp4
npm run build                                     # = tts + render (reel rápido, sin mezcla)
npm run studio                                    # Remotion Studio (preview interactivo)
```
**TTS (OmniVoice):** la voz se **clona** desde una referencia en `public/audio-[vocals].mp3` y se
sintetiza **local en CPU** (lento; baja el modelo `k2-fsa/OmniVoice` la 1ª vez), a `speed=0.85` con
pausas forzadas para ritmo de reel. El timing por palabra de `subs.json` (karaoke) sale de **alineación
forzada REAL**: `scripts/align_words.py` (faster-whisper) saca los segundos de cada palabra del audio de
OmniVoice y se los pasa al guion (no el viejo "fantasma EdgeTTS escalado", que driftea). Corre con el mismo
python de Anaconda + `HF_HUB_DISABLE_SYMLINKS=1`.

**`mix` vs `post`:** usá `mix` si el spec tiene `audio.sfx`/`audio.musica` (mezcla + ducking);
`post` si solo hace falta normalizar el loudness. Ambos generan el `-final.mp4` que se publica.

### Etapa 5 — Subir (ver `PUBLISH.md` para la convención de carpetas)
```
npm run publish:reel     -- <postId> <storagePath> <archivo>   # sube el .mp4, media_tipo=video
npm run publish:imagen   -- <postId> <archivo> [nombre]        # 1 imagen → carpeta {postId}/, media_tipo=imagen
npm run publish:carrusel -- <postId> <specId>                  # sube out/<specId>-slide-*.png en orden
```
Publicar = **subir el archivo a `post-media` + setear `posts.media_url`/`media_tipo`**. La app no
sirve archivos: firma la URL del bucket privado y la muestra. Eso mueve la pieza de **Ideas** a
**Posts listos**. El `userId`/`campaignId` salen solos del `postId`.

---

## El contrato: `spec.<id>.json`

Validá siempre contra **`schemas/spec.schema.json`** (draft-07). Top-level: `id`, `arquetipo`,
`formato` (reel|post|carrusel), `aspect`, `fps`, `duracion_seg`, `marca`, `escenas`, `audio`,
`subtitulos`, `copy`. Dos ideas centrales:

- **Cadena de fuentes (fallback).** Cada escena declara `visual.intencion` + `fuentes[]`
  ordenadas (`asset_cliente` → `video_generado` / `imagen_generada` → `kenburns`). El render usa
  **la primera que resuelva** contra `public/`. "Lo que hay es lo que hay" vive en `render.mjs`.
- **Audio como cue sheet.** `audio.voz` (texto + voz_tts) → TTS. `audio.musica` (con `duck`).
  `audio.sfx[]`: cada cue se ancla por `t` (seg), `corte` (id de escena → su `t_in`) o `palabra`
  (índice en el flujo de palabras de `subs.json`). Los resuelve `mix-audio.mjs`.

Los `overlays` (texto cinético, lower-thirds, CTA, pop-ups…) son componentes de `src/` que el
`graphics-director` referencia desde cada escena.

---

## Herramientas y `.env`

- **ffmpeg/ffprobe**: build estático en `.tools/` (los scripts lo detectan solo; cae al PATH si no está).
- **Hugging Face Inference Router** (imágenes/video): token `HUGGIN_FACE_ACCESS_TOKEN`. Providers
  override: `HF_IMG_PROVIDER`/`HF_T2V_PROVIDER`/`HF_I2V_PROVIDER`. (memoria: `hf-inference`)
- **Supabase** por **REST con la service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) — la MCP no
  tiene permiso sobre este proyecto. (memoria: `supabase-access`)
- **Bancos de audio libres**: `PIXABAY_API_KEY`, `FREESOUND_API_CLIENT`/`_SECRET`, (Jamendo).
- **Modal** (opcional, alt a HF): `MODAL_WAN_URL` / `MODAL_LTX_URL` / `MODAL_FLUX_URL`
  (deploy: `infra/modal_wan_i2v.py`).

**Dónde lee cada script el `.env`** (footgun — mantené las dos en sync para las claves comunes):
- Supabase + Modal (`fetch-campaign`, `fetch-assets`, `seed-calendar`, `publish*`, `gen:modal`) → **`../.env`** (el de la app).
- HF + audio (`gen:hf`, `fetch:audio`) → **`renderer/.env`**.

Nunca subas claves al repo. Los `.env` están gitignored en ambos lados.

---

## Estructura y qué es scratch

```
src/        Composiciones Remotion: Reel, Carrusel, Subtitles, overlays.tsx, types, fonts (Root registra las comps)
scripts/    El pipeline (.mjs). Todos cableados como npm run (arriba)
schemas/    spec.schema.json — el contrato
infra/      modal_wan_i2v.py — endpoint serverless de video (opcional)
spec.*.json Specs de la campaña activa (Bruma): dia1-4, notas, senales, dia3.carrusel
public/     Pool de ENTRADA (assets crudos + voice/subs). Gitignored. Lo que falte → placeholder
out/        SALIDAS. Gitignored y borrable — se regenera con render/mix
ASSETS.md   Qué assets necesita el demo y cómo conseguirlos
PUBLISH.md  Detalle de la etapa 5 (convención de carpetas en Storage)
```

`public/` y `out/` no van al repo: son binarios pesados y regenerables. `out/` se puede vaciar
cuando quieras (las piezas finales ya publicadas viven en Supabase).
