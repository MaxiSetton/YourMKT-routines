# Routine 2 — Dirección de la pieza (spec)

**Pasos 3 y 4 del flujo.** Toma las piezas ya ideadas (el calendario) y las **piensa a fondo**:
concepto, guion, escena por escena, gráficos y audio → escribe el `spec` validado en `posts.spec`.
Por defecto dirige **TODAS** las piezas de la campaña de una; con `dia` dirige (o re-piensa) **una sola**.
**Itera** una pieza puntual cuando el usuario manda observaciones.

> Esta etapa la dirigen **4 skills** de `.claude/skills/`, y trabajan juntas alrededor del spec:
> - **`guionista`** — escribe el GUION (lo que se dice), partido en beats, para el oído.
> - **`reel-director`** — INTEGRA: concepto con tensión, hook al primer frame, cortes al beat, y por
>   cada plano decide la fuente del visual (pedir/stock/imagen IA/i2v/t2v). Arma la estructura del spec.
> - **`graphics-director`** — puebla los `overlays` (texto cinético, pop-ups, lower-thirds, CTA, FX).
> - **`audio-director`** — llena `spec.audio`: voz (que OmniVoice interprete), música por objetivo, y
>   SFX como cue sheet anclado a los cortes.
>
> No improvises la pieza "a mano": invocá las skills. Si algo sale mal, **arreglá la skill, no el
> spec puntual.** Para formatos que no son reel:
> - **carrusel** → `reel-director` + `graphics-director` diseñan las slides (`spec.<id>.carrusel.json`); no hay voz/SFX.
> - **feed/story de 1 imagen** → `reel-director` + `graphics-director` (composición de la imagen); audio solo si es story con video.

---

## Entrada (la pasa n8n en el `text`)

Dos modos, según venga o no `dia`:

```json
// TODAS las piezas de la campaña (modo por defecto, después de sembrar el calendario):
{ "negocio": "bruma", "campania": "Conocé Bruma" }

// UNA pieza puntual (dirigir o re-pensar ese día):
{ "negocio": "bruma", "campania": "Conocé Bruma", "dia": 4, "formato": "reel", "observaciones": "" }
```

- **Sin `dia`** → dirige **todas** las piezas de la campaña, una tras otra (batch).
- **Con `dia`** (1-indexado, día 1 = `fecha_inicio`) → solo esa pieza. `formato` desambigua si el día
  tiene más de una.
- `observaciones` — solo en modo un día. Vacío = primera dirección; con texto = **iteración** (revisá
  el spec existente aplicando las notas, no empieces de cero).
- `rethink` — opcional, solo en batch. `true` = re-dirige también las piezas que YA tienen spec. Por
  defecto **false**: el batch saltea las ya dirigidas (así es **resumible** si una corrida se cortó).

Si falta `campania`, reportá el faltante y salí.

---

## Pasos

### 0 · Resolvé el modo y la lista de piezas (service-role key)
```
GET {URL}/rest/v1/businesses?nombre=ilike.*<negocio>*&select=id
GET {URL}/rest/v1/campaigns?business_id=eq.<bizId>&select=id,nombre,fecha_inicio&order=created_at.desc
    (matcheá <campania> sin acentos; si hay varias, afiná)
GET {URL}/rest/v1/posts?campaign_id=eq.<campId>&select=id,fecha,formato,rol,spec&order=fecha,hora
```
- **Modo un día** (`dia` presente): la lista es esa sola pieza.
- **Modo batch** (sin `dia`): la lista son TODOS los posts; para cada uno `dia = (fecha − fecha_inicio en
  días) + 1`. Saltá los que ya tienen `spec` (salvo `rethink:true`) y anotá cuáles salteás.

### Por cada pieza de la lista, hacé estos 5 pasos:

1. **Traé la pieza** de la DB (la verdad es la DB, no un spec a mano):
   ```
   npm run fetch:piece -- "<campania>" <dia> "<negocio>" [formato]
   ```
   Escribe `piece.<piece_id>.json` con: el post (rol/pilar/ángulo/hook/hook_formula/cta/texto/
   no_repetir), los assets asignados (con `archivo_local` si ya están subidos, o `origen:a_generar`/
   `a_pedir` si no), la marca (colores, fuentes, voz, `evitar`) y el contexto de campaña. Leelo entero.

2. **Si es iteración** (modo un día con `observaciones`): leé el spec actual desde la DB para revisarlo,
   no recrearlo:
   ```
   GET {URL}/rest/v1/posts?id=eq.<post.id>&select=spec,version
   ```
   Si `spec` es null, tratalo como primera dirección.

3. **Dirigí la pieza** invocando las skills en orden (`guionista` → `reel-director` integra →
   `graphics-director` → `audio-director`). Recordá el **orden canónico de producción** que esto
   habilita aguas abajo (Routine 3): para reel con `sync_word_idx`, la voz se lockea ANTES de generar
   clips, así que el guion y los cortes se diseñan pensando en eso. Heredá la marca de `piece.negocio`
   (colores → `spec.marca.colores`, fuentes, voz, y el `evitar`). Usá **exactamente** los assets de
   `piece.assets` (con su proporción/calidad ya validada); no re-repartas ni robes de otra pieza.

4. **Escribí `spec.<piece_id>.json`** siguiendo el contrato. Validá:
   ```
   npm run validate:spec -- spec.<piece_id>.json
   ```
   Tiene que dar **✓**. Si no valida, corregí el spec hasta que pase (el render exige que valide).

5. **Persistí** el spec en la DB y bumpeá la versión:
   ```
   PATCH {URL}/rest/v1/posts?id=eq.<post.id>
     headers: apikey + Authorization: Bearer <KEY> + Content-Type: application/json + Prefer: return=representation
     body: { "spec": <contenido de spec.<piece_id>.json>, "version": <version+1> }
   ```
   (El spec vive en `posts.spec` porque cada corrida de routine es un clone fresco; la Routine 3 lo
   lee de ahí. Si no existe la columna, corré la migración de `CONTEXT.md`.)

> **En batch, no canibalices entre piezas:** cada una usa solo SUS assets (`piece.assets`) y respeta su
> `no_repetir`. Pensá la campaña como conjunto (coherencia de marca), pero el spec de cada pieza es propio.
> Si una pieza falla (no valida, falta un asset crítico), **anotala y seguí con la siguiente** — no abortes
> todo el batch por una.

---

## Salida (reportá esto)

- **Modo un día**: **concepto** en una línea + por qué retiene (el test de tensión del reel-director);
  **resumen del spec** (arquetipo, duración, nº de escenas) y el **manifiesto de recursos a generar**
  (qué `imagen_generada`/`video_generado` pide, con prompts, y qué assets siguen `a_pedir`); en
  iteración, qué cambiaste; y confirmación de `validate:spec` ✓ + `posts.spec`/`version` actualizados.
- **Modo batch**: una **tabla** con cada pieza — `día · formato · rol` → **dirigida ✓** (con su manifiesto
  resumido) / **salteada** (ya tenía spec) / **falló** (motivo). Más un total: N dirigidas, M salteadas,
  K fallidas, y la lista consolidada de assets `a_pedir` faltantes de toda la campaña.

## Errores y bordes

- `fetch:piece` dice que el día tiene varias piezas → pedí/usá `formato` para elegir.
- El spec no valida tras varios intentos → no persistas un spec inválido; reportá los errores del validador.
- Falta un asset `a_pedir` clave para el concepto → dirigí igual pero **declaralo**: la pieza no se
  podrá producir hasta que el cliente lo suba (lo maneja la Routine 3 / la web).
- **En batch, una pieza que falla NO corta el batch**: anotala y seguí; al final reportá las fallidas.
