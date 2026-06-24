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
En el environment → **Environment variables**, pegá EXACTAMENTE este bloque (formato `.env`, una por
línea). Los valores `←` son secretos: copialos de tu `renderer/.env` local; **nunca** los subas al repo.
`scripts/_env.mjs` las lee de `process.env`.

```dotenv
# --- MÍNIMO (las 3 routines) ---
NEXT_PUBLIC_SUPABASE_URL=https://qhjuyxuastyubtlodwym.supabase.co
SUPABASE_SERVICE_ROLE_KEY=          ← pegá el valor de renderer/.env (secreto)

# --- Routine 3 (producción): generar imágenes/video con HF ---
HUGGIN_FACE_ACCESS_TOKEN=           ← pegá el valor de renderer/.env (secreto; cuenta maxisetton)

# --- Routine 3 opcional: música/SFX de bancos libres (solo si el spec los pide) ---
PIXABAY_API_KEY=                    ← opcional
FREESOUND_API_CLIENT=               ← opcional
FREESOUND_API_SECRET=               ← opcional
```

No necesitás `NEXT_PUBLIC_SUPABASE_ANON_KEY` (se usa la service-role), ni `MODAL_*`/`GOOGLE_APi_KEY`
(el camino por HF + OmniVoice no los usa).

> **Modelos ya verificados** (token `maxisetton`, `canPay: true`) — no hace falta instalarlos, son
> inferencia remota facturada a tu cuenta HF: `FLUX.1-dev` (stills nuevos · fal-ai), `FLUX.2-dev`
> (edición de imagen · fal-ai), `Wan-AI/Wan2.2-TI2V-5B` (t2v · fal-ai) y `Wan-AI/Wan2.2-I2V-A14B`
> (i2v 14B · wavespeed) están **live** en sus providers. Para forzar otro provider: `HF_T2V_PROVIDER`
> / `HF_I2V_PROVIDER` / `HF_IMG_PROVIDER` (alternativos live: replicate, together, wavespeed).

### 4. Allowlist de red (egress)
Por defecto el environment solo llega a registries/GitHub. En la **network policy** del environment
agregá estos dominios (o las llamadas fallan). **Obligatorios:**

```
qhjuyxuastyubtlodwym.supabase.co     # DB + Storage (las 3 routines)
router.huggingface.co                # inferencia HF: FLUX + Wan (Routine 3)
huggingface.co                       # descarga de pesos OmniVoice + faster-whisper (setup + Routine 3)
cdn-lfs.huggingface.co               # idem (LFS)
cdn-lfs-us-1.huggingface.co          # idem (LFS)
cas-bridge.xethub.hf.co              # idem (HF Xet, pesos grandes nuevos)
download.pytorch.org                 # wheel CPU de torch (setup.sh)
```

**Sumar SOLO si falla la descarga del resultado de un provider** (algunos devuelven el archivo por su
propio CDN en vez de por el router): `fal.media`, `*.fal.run`, `*.wavespeed.ai`, `*.replicate.delivery`,
`api.together.xyz`. **Opcionales** (solo si usás `fetch:audio`): `freesound.org`, `cdn.freesound.org`,
`pixabay.com`.

> Si la plataforma te ofrece un modo "allow all egress" para el environment y estás cómodo (el sandbox
> es efímero y privado), es lo más simple para el preview; si no, usá la lista de arriba.

### 5. Migración en Supabase (una vez)
Las Routines 2↔3 se pasan el spec por `posts.spec`. Corré en el SQL editor:
```sql
alter table public.posts add column if not exists spec jsonb;
```

### 6. Creá las 3 routines
La creación práctica **se hace en la UI** (claude.ai/code/routines) o por CLI (`/schedule`): el trigger
necesita un **environment ya configurado** (el de los pasos 2–4) y el `POST /v1/code/triggers` exige un
`session_request`/`job_config` que lo referencia — por eso no se puede crear "en seco" desde afuera antes
de tener el environment. Creá 3 routines apuntando al repo + environment, y en el **prompt guardado** de
cada una pegá el puntero correspondiente de "Prompts guardados" de abajo. No hace falta schedule: se
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

> ⚠️ **El endpoint/headers EXACTOS los da la página de cada routine en claude.ai** (suele tener un botón
> "copiar curl" para dispararla). Usá ESE como fuente de verdad — en el preview convive `api.anthropic.com/
> v1/claude_code/routines/{id}/fire` (docs) con `claude.ai/v1/code/triggers/{id}/run`, y el header
> `anthropic-beta` cambia de versión. Lo único estable es el patrón: **POST + Bearer token de la routine +
> body con el campo `text`**. La respuesta trae la URL de la sesión para seguir la corrida.

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
