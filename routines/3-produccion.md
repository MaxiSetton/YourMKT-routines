# Routine 3 — Producción (render + publicar)

**Paso 5 del flujo.** Toma el `spec` ya dirigido (Routine 2) y **hace el post**: genera los recursos,
renderiza la pieza determinista, mezcla el audio y la **sube a la app**. **Itera** con observaciones
(re-genera un clip, cambia la música, re-renderiza) y re-publica.

> Esta etapa **no tiene skill**: es el pipeline determinista (Remotion + ffmpeg + OmniVoice). Tu
> trabajo es **ejecutar la cadena en el orden correcto** y resolver lo que falte. No re-dirijas la
> pieza (eso es la Routine 2); si el spec está mal, devolvelo a la Routine 2.

> ⚠️ **Routine pesada.** Necesita ffmpeg, Chromium (Remotion) y OmniVoice (TTS por CPU, modelo
> multi-GB). El environment los provisiona en `setup.sh`. Si la voz por CPU no termina en tiempo
> razonable, ver "Degradación" abajo. Esto es lo que el smoke-test día-1 valida (ver `routines/README.md`).

---

## Entrada (la pasa n8n en el `text`) — igual que la Routine 2

```json
{ "negocio": "bruma", "campania": "Conocé Bruma", "dia": 4, "formato": "reel",
  "observaciones": "" }
```

- `observaciones` vacío = **primera producción**. Con texto = **iteración** (re-hacé solo lo afectado).

---

## Pasos

1. **Resolvé el post y traé su spec** desde la DB (la Routine 2 ya lo escribió en `posts.spec`):
   ```
   npm run fetch:piece -- "<campania>" <dia> "<negocio>" [formato]
   ```
   Con el `post.id` del `piece.<id>.json`, traé el spec (service-role key):
   ```
   GET {URL}/rest/v1/posts?id=eq.<post.id>&select=spec,version,media_url
   ```
   Si `spec` es **null** → abortá: "corré la Routine 2 (dirección) primero". Escribí el spec a
   `spec.<piece_id>.json` (el resto del pipeline lee archivos del repo).

2. **Bajá los recursos reales** a `public/`:
   ```
   npm run fetch:assets -- "<negocio>"
   ```
   `fetch:piece` ya dejó los assets `a_pedir` cumplidos en `public/<carpeta>/`. **Verificá los
   `a_pedir` faltantes**: si un asset que el spec necesita sigue sin `url`, la pieza saldrá con
   placeholder en ese plano (el render igual corre — "lo que hay es lo que hay"). Reportalo.

3. **Voz de referencia** (para clonar con OmniVoice): el TTS clona desde `public/audio-[vocals].mp3`.
   En un clone fresco `public/` viene vacío → bajá la referencia de la marca antes del `tts` (de
   Storage, según dónde la guarde la web; ver `voz_preferencia`/sample del negocio). Si no hay
   referencia disponible, ver "Degradación".

4. **Producí según el formato del spec.** Respetá el **ORDEN CANÓNICO** (no negociable para que cuadre
   el timing — la duración de cada clip de video sale de `t_out − t_in` **lockeado**, y eso recién es
   real después de la voz):

   ### reel
   ```
   npm run tts        -- spec.<id>.json     # voz public/voice.mp3 + subs.json (timing real por palabra)
   npm run retime     -- spec.<id>.json     # LOCKEA t_in/t_out + duracion_seg desde subs.json
   npm run gen:hf     -- spec.<id>.json     # genera imágenes (FLUX) + clips (Wan i2v/t2v) a la duración lockeada
   npm run normalize                        # re-encode de clips i2v para que Remotion pueda hacer seek
   npm run render     -- spec.<id>.json     # arma el reel → out/<id>.mp4
   npm run align:music -- spec.<id>.json    # elige musica.start_seg (swells en las pausas de la voz)
   npm run mix        -- spec.<id>.json      # voz + música (ducking) + SFX al frame, −14 LUFS → out/<id>-final.mp4
   ```
   - **`tts`/`retime` van ANTES de `gen:hf`** para los clips de video. Las imágenes FLUX no dependen
     de la duración (pre-generarlas está bien); el riesgo de descuadre es solo en los clips de video.
   - Si el spec **no** tiene `audio.sfx`/`audio.musica`, usá `npm run post -- <id>` en vez de `mix`
     (solo normaliza loudness a −14 LUFS → `out/<id>-final.mp4`).

   ### carrusel
   ```
   npm run gen:hf          -- spec.<id>.carrusel.json    # imágenes que pidan las slides
   npm run render:carrusel -- spec.<id>.carrusel.json    # una PNG por slide → out/<id>-slide-N.png
   ```

   ### feed/story de 1 imagen
   ```
   npm run gen:hf -- spec.<id>.json     # la imagen (FLUX) → public/
   # la pieza final es esa imagen renderizada/compuesta en out/
   ```

5. **Publicá** (sube a `post-media` + setea `posts.media_url`/`media_tipo` → la pieza pasa de *Ideas* a
   *Posts listos*). El `userId`/`campaignId` se deducen solos del `postId`:
   ```
   # reel:
   npm run publish:reel     -- <post.id> "dia<N>-<rol>-reel.mp4" out/<id>-final.mp4
   # carrusel (sube out/<id>-slide-*.png en orden):
   npm run publish:carrusel -- <post.id> <id>
   # imagen:
   npm run publish:imagen   -- <post.id> out/<archivo>.png
   ```
   **Verificá** que el script imprima el `media_url` seteado.

---

## Iteración (observaciones)

Interpretá las observaciones y re-hacé **solo lo afectado**, respetando el orden canónico de lo que toques:
- "cambiá la música / el SFX" → `align:music` + `mix` (no re-renderiza el video).
- "regenerá tal clip / la imagen X" → borrá ese archivo de `public/`, `gen:hf` (regenera lo que falte),
  `normalize`, `render`, `mix`.
- "el texto/timing está mal" → eso suele ser el spec → ajuste menor del spec o devolver a Routine 2;
  si cambió el guion, **re-corré desde `tts`** (la voz cambió → el timing también).
- Re-publicá con el mismo comando (upsert pisa el archivo). Bumpeá `posts.version`.

## Degradación (que la pieza salga igual)

- **Sin referencia de voz / TTS no termina** → renderizá sin voz (mudo o solo música) y dejá el reel
  con subtítulos/overlays; reportá que falta la voz. No bloquees toda la pieza por el TTS.
- **Asset `a_pedir` faltante** → placeholder en ese plano (el render lo maneja); reportá qué falta para
  que la web le pida al cliente y se re-produzca después.

## Salida (reportá esto)

- Qué se produjo (formato, duración, `out/<id>-final.mp4` o slides), `media_url` publicado.
- Recursos generados (clips/imágenes IA) y faltantes que quedaron en placeholder.
- En iteración: qué se re-hizo. Cualquier paso que se haya degradado.
