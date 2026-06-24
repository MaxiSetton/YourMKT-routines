# CONTEXT — Infra que necesitan las routines

Este repo (`YourMKT-routines`) es **standalone**. Acá está el contexto de infra que antes vivía en
el `CLAUDE.md` de la app. Las routines leen/escriben Supabase por **REST con la service-role key**
(la MCP de Supabase no tiene permiso sobre este proyecto).

---

## Supabase

- **Project ref:** `qhjuyxuastyubtlodwym` · región us-east-1.
- **URL:** `https://qhjuyxuastyubtlodwym.supabase.co` (env `NEXT_PUBLIC_SUPABASE_URL`).
- **Acceso:** REST a `/rest/v1/...` con headers `apikey` + `Authorization: Bearer <SERVICE_ROLE>`.
  La service-role **saltea RLS** (los scripts ya la usan). Nunca exponer esa key fuera del env.
- Storage: REST a `/storage/v1/object/<bucket>/<path>`.

> ⚠️ El proyecto vive en la org de Supabase de **Marcos** (gestionada por Vercel). No tocar/borrar
> ese proyecto de Vercel: se puede llevar la base. (Detalle en el CLAUDE.md de la app.)

## Esquema (public, RLS por `auth.uid()` vía `businesses.user_id`)

Las columnas marcadas con ✚ son las que el pipeline agregó sobre el esquema base de la app.

- **businesses** — `nombre`, `descripcion`, `rubro`, `propuesta_valor`, `publico_objetivo`,
  `tono_marca`, `tono_detalle`, `estetica_visual`, `ejemplos_posts`, `evitar`, `sitio_web`,
  `instagram` · ✚ `color_primario`, `color_acento`, `color_fondo`, `vibe_tipografico`,
  `voz_preferencia`, `logo_url`.
- **campaigns** — `business_id→`, `nombre`, `brief`, `que_promociona`, `objetivo`, `fecha_inicio`,
  `duracion_dias`, `elementos_especificos`, `estado` (`borrador|activa|finalizada`) · ✚
  `nivel_conciencia`, `audiencia_objetivo`.
- **campaign_assets** — `campaign_id→`, `tipo` (`imagen|video`), `categoria`
  (`producto|proceso|otro`), `url`, `nombre_archivo`, `descripcion` (NOT NULL) · ✚ `origen`
  (`a_pedir|a_generar|cliente`), `prompt`. Material por pieza; `url` queda `null` hasta que el
  cliente lo sube (a_pedir) o `gen:hf` lo genera (a_generar).
- **posts** — `campaign_id→`, `fecha`, `hora`, `formato` (`feed|story|reel|carrusel`), `texto`,
  `media_url`, `media_tipo`, `prompt_media`, `version`, `estado`
  (`borrador|aprobado|publicado`) · ✚ `rol`, `pilar`, `angulo`, `hook`, `hook_formula`, `cta`,
  `asset_ids` (uuid[]), `no_repetir` · ✚ **`spec` (jsonb)** — el `spec.<id>.json` que escribe la
  Routine 2 y consume la Routine 3 (ver migración abajo).
- **metrics** — `post_id→`, `alcance`, `likes`, `comentarios`, `guardados`.
- **baseline_metrics** — `business_id→`, métricas previas para comparar.

### Storage (buckets privados)
- `post-media` (media de posts) · `business-docs`.
- RLS: el **primer segmento del path = `auth.uid()`**. Convención del pipeline:
  `post-media/{userId}/{campaignId}/...`. Los assets de campaña se suben a
  `post-media/{userId}/{campaignId}/…`. La app **firma** la URL del bucket privado para mostrarla
  (no sirve archivos directo). Detalle de carpetas en [`PUBLISH.md`](PUBLISH.md).

### RLS de tablas hijas (patrón)
`… in (select c.id from campaigns c join businesses b on b.id = c.business_id where b.user_id = auth.uid())`.

---

## Migración requerida (correr UNA vez en el SQL editor de Supabase)

La Routine 2 escribe el spec y la Routine 3 lo lee desde la DB (cada corrida de routine es un clone
fresco — el `spec.<id>.json` no persiste entre corridas, así que vive en `posts.spec`).

```sql
-- spec dirigido por la Routine 2; lo consume la Routine 3.
alter table public.posts add column if not exists spec jsonb;
```

> Alternativa sin DDL: guardar el spec como objeto en Storage
> (`post-media/{userId}/{campaignId}/spec.{postId}.json`). Se eligió la columna `jsonb` porque la web
> puede mostrar/iterar el spec y es consultable. Si preferís la alternativa, ajustá las Routines 2 y 3.

---

## Env vars (se cargan en el environment de la routine en claude.ai → `process.env`)

`scripts/_env.mjs` las lee de `process.env` (cloud) y cae a `.env` local en dev. Claves:

| Clave | Para |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase (todas las routines) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase REST/Storage (todas) — **secreto** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (opcional) |
| `HUGGIN_FACE_ACCESS_TOKEN` | `gen:hf` imágenes/video (Routine 3) — **secreto** |
| `HF_IMG_PROVIDER` / `HF_T2V_PROVIDER` / `HF_I2V_PROVIDER` | (opcional) override de providers HF |
| `PIXABAY_API_KEY`, `FREESOUND_API_CLIENT`, `FREESOUND_API_SECRET` | `fetch:audio` música/SFX (Routine 3) |
| `MODAL_WAN_URL` / `MODAL_LTX_URL` / `MODAL_FLUX_URL` | (opcional) alt a HF para generar |

**Egress de red:** Supabase (`*.supabase.co`) y Hugging Face (`router.huggingface.co` + el host del
provider: `fal.ai`, `wavespeed.ai`, etc.) son dominios custom → hay que **allowlistearlos** en la
network policy del environment, o las routines no los alcanzan. (Ver [`routines/README.md`](routines/README.md).)
