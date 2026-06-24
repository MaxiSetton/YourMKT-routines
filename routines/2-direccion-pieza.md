# Routine 2 — Dirección de la pieza (spec)

**Pasos 3 y 4 del flujo.** Toma UNA pieza ya ideada (un día/post del calendario) y la **piensa a
fondo**: concepto, guion, escena por escena, gráficos y audio → escribe `spec.<id>.json` validado y
lo guarda en `posts.spec`. **Itera** la misma pieza cuando el usuario manda observaciones.

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

```json
{ "negocio": "bruma", "campania": "Conocé Bruma", "dia": 4, "formato": "reel",
  "observaciones": "" }
```

- `dia` — **1-indexado** (día 1 = `fecha_inicio`), igual que `fetch:piece`.
- `formato` — opcional; desambigua si un día tiene más de una pieza.
- `observaciones` — **vacío = primera dirección**. Con texto = **iteración**: revisá el spec
  existente aplicando esas notas (no empieces de cero).

Si falta `campania` o `dia`, reportá el faltante y salí.

---

## Pasos

1. **Traé la pieza** de la DB (la verdad es la DB, no un spec a mano):
   ```
   npm run fetch:piece -- "<campania>" <dia> "<negocio>" [formato]
   ```
   Escribe `piece.<piece_id>.json` con: el post (rol/pilar/ángulo/hook/hook_formula/cta/texto/
   no_repetir), los assets asignados (con `archivo_local` si ya están subidos, o `origen:a_generar`/
   `a_pedir` si no), la marca (colores, fuentes, voz, `evitar`) y el contexto de campaña. Leelo entero.

2. **Si es iteración** (`observaciones` no vacío): leé el spec actual desde la DB para revisarlo, no
   recrearlo. Traélo con la service-role key:
   ```
   GET {NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?id=eq.<post.id>&select=spec,version
       (headers apikey + Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>)
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

5. **Persistí** el spec en la DB y bumpeá la versión (con la service-role key):
   ```
   PATCH {URL}/rest/v1/posts?id=eq.<post.id>
     headers: apikey + Authorization: Bearer <KEY> + Content-Type: application/json + Prefer: return=representation
     body: { "spec": <contenido de spec.<piece_id>.json>, "version": <version+1> }
   ```
   (El spec vive en `posts.spec` porque cada corrida de routine es un clone fresco; la Routine 3 lo
   lee de ahí. Si no existe la columna, corré la migración de `CONTEXT.md`.)

---

## Salida (reportá esto)

- **Concepto** en una línea + por qué retiene (el test de tensión del reel-director).
- **Resumen del spec**: arquetipo, duración, nº de escenas, y el **manifiesto de recursos a generar**
  — qué `imagen_generada` / `video_generado` pide el spec (con sus prompts) y qué assets siguen
  `a_pedir` (faltantes que bloquean la producción).
- En **iteración**: qué cambiaste según las observaciones.
- Confirmación de que `validate:spec` dio ✓ y de que `posts.spec`/`version` quedaron actualizados.

## Errores y bordes

- `fetch:piece` dice que el día tiene varias piezas → pedí/usá `formato` para elegir.
- El spec no valida tras varios intentos → no persistas un spec inválido; reportá los errores del validador.
- Falta un asset `a_pedir` clave para el concepto → dirigí igual pero **declaralo**: la pieza no se
  podrá producir hasta que el cliente lo suba (lo maneja la Routine 3 / la web).
