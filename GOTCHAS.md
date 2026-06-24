# GOTCHAS — dificultades del pipeline (registro)

Problemas reales que aparecieron armando reels y cómo se resolvieron. Leer antes de pelear con lo mismo
de nuevo. Si algo de acá vuelve a fallar, **arreglá la causa genérica** (skill/script), no el output puntual.

## TTS / voz (OmniVoice)
- **`python` no está en el PATH** de los shells de automatización. OmniVoice vive en el **Anaconda base**
  (`C:\Users\maxis\anaconda3\python.exe`) — único env con `omnivoice`+`torch`+`soundfile`. Para correr
  `npm run tts`: desde PowerShell prependé `C:\Users\maxis\anaconda3;…\Library\bin;…\Scripts` al PATH y
  seteá `KMP_DUPLICATE_LIB_OK=TRUE` (si no → `OMP Error #15` por doble `libiomp5md.dll`). Lento en CPU.
- **La voz va SIEMPRE con OmniVoice, nunca EdgeTTS** (EdgeTTS solo se usaba como reloj). (memoria: `omnivoice-tts-voz`)
- **Onset espurio ("o" inicial) en CADA bloque.** La clonación zero-shot arrastra una vocal de la voz de
  referencia al arranque de cada generación. **Fix:** `omnivoice_local.py --trim_ms` recorta los primeros ms
  de cada bloque (default 120; `tts.mjs` lo pasa, override `TTS_TRIM_HEAD_MS`). Calibrar si se come la 1ª palabra.
- **Bug `tts.mjs`: subs explotaban a ~200s.** `edge-tts.getDuration()` estima la duración por bytes
  asumiendo PCM crudo → para MP3 da ~1.5s → `ratio = omni/edge ≈ 11×`. **Arreglado:** se usa el fin de la
  última palabra real (offsets en 100ns) como reloj.

## Karaoke / subtítulos (sincronía)
- **El "fantasma EdgeTTS escalado linealmente" driftea**: OmniVoice (speed 0.85, pausas) no respeta la
  proporción de tiempos de EdgeTTS. **Solución:** alineación forzada con los **segundos reales** del audio
  de OmniVoice → `scripts/align_words.py` (faster-whisper word-timestamps).
- **faster-whisper en Windows** falla al bajar el modelo por **symlinks** (`WinError 1314`, sin admin/
  developer-mode). **Fix:** `HF_HUB_DISABLE_SYMLINKS=1` (fuerza copias).
- **Whisper transcribe LIBRE** y mete errores (rellenos tipo "Bueno,", acentos perdidos, palabras mal
  oídas). Los **tiempos** son buenos, las **palabras** no → hay que **alinear el GUION** a esos tiempos
  (difflib entre tokens del guion y palabras oídas), no mostrar la transcripción cruda.

## Generación (gen:hf, HF router)
- **t2v vs i2v:** un `video_generado` toma como base i2v **cualquier imagen/asset_cliente de la MISMA
  escena** → se vuelve i2v (Wan-14B, el más caro). Para forzar t2v barato, no compartas escena con una
  imagen; usá un `kenburns` como fallback (no cuenta como base i2v).
- Pedir todo **ya en 9:16** (`spec.aspect`); FLUX necesita `image_size`, los i2v no reescalan.

## Render (Remotion)
- **`OffthreadVideo` reproduce desde el frame 0** de cada clip (no hay `startFrom`): para mostrar otro tramo
  del mismo video hay que **cortarlo en archivos separados** (ffmpeg). No hay slow-mo nativo: el "0.5x" se
  hornea en el clip.
- **Cada clip debe durar ≥ su escena** (`t_out − t_in`), si no congela el último frame.
- **Normalizá los clips de IA a CFR 30fps** (`normalize.mjs` o ffmpeg `-r 30 -vsync cfr`) o el seek falla.

## Audio de internet (bancos libres)
- **Pixabay audio API → 403** con la key actual. **Freesound (CC0) sí anda** vía el preview-hq-mp3 del CDN.
  Jamendo no está configurado (falta `JAMENDO_CLIENT_ID`).
- La música se **loopea** en `mix` (`-stream_loop -1`), así que un loop corto sirve.

## Datos / organización
- **Convivían specs de dos campañas** con nombres a mano (`dia1`/`dia4`/`cb-dia1`…) → ambigüedad. **La DB
  es la fuente de verdad**: usá `npm run fetch:piece -- <campaña> <día>` y solo los assets asignados al post.
- `public/` se organiza **por video** (`{marca}-{campaña}/`) + `anteriores/`; los resolvers de los scripts
  buscan **recursivamente** por nombre, así que el archivo puede estar en cualquier subcarpeta.
