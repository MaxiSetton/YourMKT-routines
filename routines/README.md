# Routines de YourMKT — setup + integración con n8n

Las 3 routines de Claude Code que disparan el pipeline por API. n8n llama al API; estas routines
hacen el "pensar" (contra la suscripción de Claude, sin gastar créditos de IA de n8n) y escriben el
resultado en Supabase, que es lo que la web muestra.

| Routine | Archivo (prompt versionado) | Paso del flujo | Qué hace | Peso |
|---|---|---|---|---|
| **1 · Calendario** | [`1-calendario.md`](1-calendario.md) | 2 | Piensa los posts de cada día → siembra el calendario (posts borrador + plan de assets + qué pedir al usuario) | liviana |
| **2 · Dirección de pieza** | [`2-direccion-pieza.md`](2-direccion-pieza.md) | 3 + 4 | Piensa UN post a fondo → escribe `spec` validado en `posts.spec`. Itera con observaciones | liviana |
| **3 · Producción** | [`3-produccion.md`](3-produccion.md) | 5 | Genera recursos, renderiza y **publica** la pieza. Itera con observaciones | **pesada** |

Cómo se relacionan: la **DB es el bus**. Routine 1 siembra `posts`; Routine 2 lee un post y le escribe
`posts.spec`; Routine 3 lee `posts.spec`, produce y setea `posts.media_url`. Cada corrida es un clone
fresco del repo — por eso nada vive en disco entre corridas, todo pasa por Supabase.

---

## Setup en claude.ai (una sola vez)

> Las routines están en **research preview**. Detalles oficiales:
> <https://code.claude.com/docs/en/routines> · <https://code.claude.com/docs/en/claude-code-on-the-web>

### 1. Conectá el repo
En **claude.ai/code** autenticá GitHub (Claude GitHub App) y dale acceso al repo **`YourMKT-routines`**.
Las routines lo clonan fresco en cada corrida (branch default). No hace falta que commiteen nada: solo
leen el repo y escriben en Supabase vía REST.

### 2. Creá un environment con el setup script
En **claude.ai/code/routines** → Environments → nuevo environment para este repo. En su **setup script**
pegá el contenido de [`../setup.sh`](../setup.sh) (instala ffmpeg, Chromium, torch CPU, OmniVoice,
faster-whisper y las deps de Node). Se cachea ~7 días.

> El environment liviano (sin torch/Chromium) alcanza para las Routines 1 y 2. Si querés ahorrar, podés
> tener **dos environments**: uno mínimo (solo `npm install`) para 1 y 2, y el completo (setup.sh entero)
> para la 3. Más simple: un solo environment con todo.

### 3. Variables de entorno (secrets)
En el environment → Environment variables, pegá (formato `.env`, una por línea). Ver tabla completa en
[`../CONTEXT.md`](../CONTEXT.md):

```
NEXT_PUBLIC_SUPABASE_URL=https://qhjuyxuastyubtlodwym.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role key>            # secreto
HUGGIN_FACE_ACCESS_TOKEN=<hf token>                     # secreto (Routine 3)
PIXABAY_API_KEY=...
FREESOUND_API_CLIENT=...
FREESOUND_API_SECRET=...
```
`scripts/_env.mjs` las lee de `process.env`. **No** se commitea ningún `.env` al repo.

### 4. Allowlist de red (egress)
Por defecto el environment solo llega a registries/GitHub. Agregá a la **network policy** del environment
los dominios que el pipeline necesita, o las llamadas fallan:
- `*.supabase.co` — DB + Storage (las 3 routines).
- `router.huggingface.co` y el host del provider (`fal.ai`, `wavespeed.ai`, …) — `gen:hf` (Routine 3).
- `huggingface.co` / `cdn-lfs*.huggingface.co` — descarga de modelos OmniVoice/whisper (setup + Routine 3).
- `download.pytorch.org` — wheel CPU de torch (setup).
- `freesound.org`, `*.pixabay.com` — `fetch:audio` (Routine 3, opcional).

### 5. Migración en Supabase (una vez)
Las Routines 2↔3 se pasan el spec por `posts.spec`. Corré en el SQL editor:
```sql
alter table public.posts add column if not exists spec jsonb;
```

### 6. Creá las 3 routines
La creación **no está en el API** del preview → se hace en la UI (claude.ai/code/routines) o por CLI
(`/schedule`). Creá 3 routines apuntando al repo + environment, y en el **prompt guardado** de cada una
pegá el puntero correspondiente de la sección "Prompts guardados" de abajo. No hace falta schedule: se
disparan por API. (Si querés además un barrido nocturno, dales un cron.)

Anotá el **routine_id** y el **token** de cada routine (los da su página) — n8n los usa.

---

## Disparar desde n8n (HTTP)

Cada routine se dispara con un POST. El cuerpo lleva un campo **`text`** que se inyecta en el prompt; ahí
va el JSON de parámetros (la routine lo parsea).

```
POST https://api.anthropic.com/v1/claude_code/routines/<ROUTINE_ID>/fire
Headers:
  Authorization: Bearer <ROUTINE_TOKEN>
  anthropic-beta: experimental-cc-routine-2026-04-01
  anthropic-version: 2023-06-01
  Content-Type: application/json
Body:
  { "text": "<JSON de parámetros como string>" }
```

> El header `anthropic-beta` cambia con el preview — confirmá el valor vigente en
> <https://platform.claude.com/docs/en/api/claude-code/routines-fire>. La respuesta trae
> `claude_code_session_url` para ver/seguir la corrida.

### Parámetros por routine (el `text`)

**Routine 1 — Calendario** (al lanzar la campaña):
```json
{ "negocio": "bruma", "campania": "Conocé Bruma", "reseed": false }
```

**Routine 2 — Dirección** (pensar/iterar un post). `observaciones` vacío = primera dirección:
```json
{ "negocio": "bruma", "campania": "Conocé Bruma", "dia": 4, "formato": "reel", "observaciones": "" }
```

**Routine 3 — Producción** (hacer/iterar el post) — mismos params que la 2:
```json
{ "negocio": "bruma", "campania": "Conocé Bruma", "dia": 4, "formato": "reel", "observaciones": "" }
```

- `dia` es 1-indexado (día 1 = `fecha_inicio` de la campaña). La web/n8n lo calcula de la fecha del post.
- Para **iterar** (pasos 4 y 5 del flujo), n8n re-dispara la misma routine con `observaciones` lleno.

---

## Prompts guardados (pegá esto en cada routine de claude.ai)

El prompt guardado es un **puntero fino** al archivo versionado del repo; la lógica real vive en
`routines/N-*.md` (así se versiona y se itera en git, no en la UI).

**Routine 1:**
```
Sos la Routine 1 de YourMKT (Calendario de campaña). Leé y seguí AL PIE DE LA LETRA
`routines/1-calendario.md` de este repo. No improvises el calendario: dirige la skill campaign-director.
Los parámetros vienen como JSON al final de este mensaje (los pasa n8n en el campo `text`).
Parámetros:
```

**Routine 2:**
```
Sos la Routine 2 de YourMKT (Dirección de la pieza). Leé y seguí AL PIE DE LA LETRA
`routines/2-direccion-pieza.md` de este repo. Dirigí con las skills guionista/reel-director/
graphics-director/audio-director; validá el spec y guardalo en posts.spec.
Los parámetros vienen como JSON al final de este mensaje (los pasa n8n en el campo `text`).
Parámetros:
```

**Routine 3:**
```
Sos la Routine 3 de YourMKT (Producción). Leé y seguí AL PIE DE LA LETRA
`routines/3-produccion.md` de este repo. Es el pipeline determinista: respetá el ORDEN CANÓNICO
(tts → retime → gen:hf → normalize → render → align:music → mix), no re-dirijas la pieza.
Los parámetros vienen como JSON al final de este mensaje (los pasa n8n en el campo `text`).
Parámetros:
```

---

## Smoke-test día 1 (antes de confiar en la Routine 3)

La Routine 3 corre ffmpeg + Chromium + OmniVoice (TTS por CPU, modelo multi-GB) en el sandbox. Antes de
producir en serio, validá en UNA corrida manual que el environment aguanta: que `setup.sh` termine, que
`npm run tts` genere voz, que `render` produzca un mp4 y que `publish:reel` suba a Supabase. Si el TTS por
CPU no rinde, ver "Degradación" en `3-produccion.md` (la pieza sale igual, sin voz, y se reporta). Esto
despeja los puntos que el Proyecto-idea.md dejó "pendiente de verificar" (runtime, egress, modelos).
