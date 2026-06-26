# Routine 1 — Calendario de campaña

**Paso 2 del flujo.** El usuario lanzó una campaña; esta routine **piensa los posts de cada día**:
entra a la base, ve todo lo del negocio y la campaña, y produce el calendario — qué pieza va cada
día (rol, formato, ángulo, hook, CTA) y **qué assets se le piden al usuario**.

> 🔴 **Regla de oro — subir todo a la web, SÍ O SÍ.** Cada corrida es un **clone efímero**: lo que no
> quede en **Supabase** se PIERDE al terminar la sesión. No termines con el trabajo solo en archivos
> locales. Acá: el calendario tiene que quedar **sembrado en la DB** (`seed:calendar` → posts +
> `campaign_assets`), no solo en `calendar.<slug>.json`. **Verificá** que los posts existan en la DB
> antes de cerrar. Si algo salió parcial, subí lo que haya + dejá la nota.

> Dirige esta etapa la skill **`campaign-director`** (en `.claude/skills/`). No improvises el
> calendario "a mano": invocá la skill, ella aplica el método (arco, pilares, balance de formatos,
> reels topeados, anclas humanas, cohesión visual, QC adversarial). Los scripts de acá solo ejecutan.
> Si el output sale flojo, **arreglá la skill, no parchees el JSON puntual.**

---

## Entrada (la pasa n8n en el `text` del trigger)

JSON. Si llega texto libre, inferí estos campos:

```json
{ "negocio": "bruma", "campania": "Conocé Bruma", "reseed": false }
```

- `negocio` — substring del nombre del negocio (sin importar acentos).
- `campania` — substring del nombre de la campaña a planificar.
- `reseed` — opcional. `true` solo si querés re-sembrar una campaña que YA tiene posts (pasa `--force`
  a `seed:calendar`). Por defecto **false**: si ya hay posts, NO dupliques — reportá y salí.

Si falta `negocio` o `campania`, **no inventes**: reportá el faltante y terminá.

---

## Pasos

> **Preparación (primero, siempre):** corré `npm install` antes de cualquier `npm run`. El repo se clona
> fresco por corrida (sin `node_modules`); el `setup.sh` dejó el cache de npm caliente, así que es rápido.

1. **Cargá el contexto** de Supabase:
   ```
   npm run fetch:campaign -- "<negocio>"
   ```
   Imprime negocio (identidad, voz, marca visual, `evitar`) + sus campañas + el material existente.
   Ubicá la campaña pedida en esa salida y leé sus campos: `objetivo`, `que_promociona`, `brief`,
   `fecha_inicio`, `duracion_dias`, `nivel_conciencia`, `audiencia_objetivo`, `elementos_especificos`.

2. **Chequeá insumos mínimos** para `campaign-director`. Si falta alguno crítico, no abortes el
   calendario, pero **declaralo como faltante** en la salida (la skill lo exige):
   - `fecha_inicio` — **bloqueante para sembrar** (los posts se fechan desde ahí). Si la campaña no la
     tiene y la entrada no la trae, reportá que falta y no siembres.
   - `nivel_conciencia` de la audiencia — calibra TODO (regla R1 de la skill). Si falta, inferilo del
     `publico_objetivo` + `brief` y dejalo anotado como supuesto.
   - `objetivo` / `que_promociona` — sin esto el arco no tiene norte.

3. **Invocá la skill `campaign-director`** con ese contexto. Que produzca el calendario completo:
   resumen (objetivo, audiencia+nivel, arco en 3 fases, pilares, paleta, fuentes), las piezas (cada
   una con rol/pilar/ángulo/hook/CTA/texto/no_repetir/assets) y el plan de assets
   (pedir/buscar/generar). Pasá el checklist final de la skill antes de cerrar.

4. **Materializá el calendario** en `calendar.<slug>.json` (slug = de la campaña) con **exactamente**
   esta forma (la que consume `seed:calendar` — ver `scripts/seed-calendar.mjs` y el ejemplo
   `calendar.conoce-bruma.json`):

   ```jsonc
   {
     "campaign": "<substring del nombre de la campaña>",   // matchea la campaña en la DB
     "negocio": "<substring del negocio>",
     "fecha_inicio": "YYYY-MM-DD",                          // solo si la campaña aún no la tiene
     "resumen": { "objetivo": "...", "audiencia": "...", "arco": "...", "fases": {...},
                  "pilares": [...], "balance_valor_venta": "...", "paleta": {...},
                  "fuentes": "...", "preset": "...", "hashtags_base": [...] },
     "assets": [
       { "key": "local-interior", "tipo": "video|imagen", "categoria": "producto|proceso|otro",
         "origen": "a_pedir|a_generar", "prompt": null | "prompt FLUX/Wan en inglés",
         "descripcion": "qué es y para qué pieza; si es a_pedir, redactá el pedido al cliente" }
     ],
     "pieces": [
       { "d": 0, "hora": "08:30", "formato": "reel|feed|story|carrusel",
         "rol": "gancho", "pilar": "...", "angulo": "concepto con tensión (semilla para reel-director)",
         "hook": "...", "hook_formula": "...", "cta": "...", "texto": "caption del post",
         "no_repetir": "qué NO tocar (lo abre otra pieza)",
         "assets": ["key1", "key2"] }   // keys que referencian assets[].key; van a posts.asset_ids
     ]
   }
   ```
   - `d` es **0-indexado** (día 0 = `fecha_inicio`). `seed:calendar` fecha cada post = `fecha_inicio + d`.
   - `assets[].key` es interno del JSON; `seed:calendar` lo mapea al uuid real e inserta los assets
     `a_pedir`/`a_generar` en `campaign_assets`, y guarda los uuid en `posts.asset_ids`.
   - Respetá las reglas duras de la skill: **reels ≤ ~40% del calendario** (por cada 2 reels, ≥3
     no-reel), **≥1 de cada 3 piezas con ancla humana real**, **≤5 pedidos al cliente por 7 posts y
     ninguno en el Día 1**, cada archivo en ≤2 piezas.

5. **Sembrá**:
   ```
   npm run seed:calendar -- calendar.<slug>.json            # agregá --force SOLO si reseed=true
   ```
   Esto inserta los posts en `borrador`, crea los slots de asset (`a_pedir`/`a_generar`) y setea
   `fecha_inicio` si faltaba. **Verificá** que imprima los N posts esperados sin error.

---

## Salida (reportá esto — la web/n8n lo usa)

- **Resumen** de la campaña (objetivo, nivel de conciencia, arco, pilares, paleta).
- **Tabla del calendario**: día · fecha · formato · rol · hook · assets asignados.
- **Qué pedirle al usuario**: la lista de assets `origen='a_pedir'` con su descripción/encuadre
  (esto es lo que la web le muestra al cliente para que filme/suba). Ya quedaron en `campaign_assets`.
- **Faltantes/supuestos**: insumos que faltaban y qué asumiste.

## Errores y bordes

- **La campaña ya tiene posts** y `reseed` no es true → no siembres, reportá que ya está sembrada.
- **Sin `fecha_inicio`** → no siembres; pedí que se setee.
- `fetch:campaign` o `seed:calendar` fallan → reportá el error crudo (status + body); no sigas como si nada.
