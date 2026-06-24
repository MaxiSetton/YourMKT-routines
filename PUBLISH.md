# Publicar media a la web

Cómo el renderer pone lo que genera (`out/`) dentro de la app para que aparezca en
**Campañas → Posts listos**. Hay un comando por tipo de pieza.

La app no sirve archivos: lee `posts.media_url`, firma la URL del bucket privado
`post-media` y la muestra. Publicar = **subir el archivo + setear `media_url`/`media_tipo`**
del post. Eso es justo lo que hacen los scripts de abajo.

## Convención de carpetas en `post-media` (clave)

```
{userId}/{campaignId}/archivo.mp4              ← VIDEO: archivo suelto
{userId}/{campaignId}/{postId}/slide-1.png     ← IMAGEN(ES): carpeta propia del post
```

- **Video:** la web firma exactamente ese archivo (`media_tipo = "video"`). Puede ir suelto.
- **Imagen / carrusel:** la web hace `dirOf(media_url)` y **lista la carpeta entera**,
  mostrando todo lo que haya ahí como slides (`media_tipo = "imagen"`). Por eso las imágenes
  van en una **carpeta propia por post** (`.../{postId}/...`): si las dejás sueltas en la
  carpeta de la campaña, se mezclan con otros archivos y aparecen de más.

El `userId` y el `campaignId` salen solos del `postId` (post → campaign → business). Solo
necesitás saber el **postId**, que ves en la app (pestaña Posts) o con `npm run` de abajo.

## Comandos

Desde `renderer/`. Corré **después** de renderizar (los archivos tienen que estar en `out/`).

### Una sola imagen (feed/story de 1 imagen)
```
npm run publish:imagen -- <postId> <archivo> [nombreEnStorage]
# ej:
npm run publish:imagen -- 296b790a-... dia3-portada.png
```
Sube la imagen a `{user}/{camp}/{postId}/` y deja `media_tipo = "imagen"`.
Extensiones: png, jpg, jpeg, webp. `<archivo>` puede ser una ruta o solo el nombre si está en `out/`.

### Carrusel (varias slides)
```
npm run publish:carrusel -- <postId> <specId>
# ej (usa out/bruma-dia3-educacion-slide-*.png):
npm run publish:carrusel -- 296b790a-... bruma-dia3-educacion
```
Sube todas las `out/{specId}-slide-*.png` en orden a la carpeta del post; la portada es la slide 1.

### Reel (video)
```
npm run publish:reel -- <postId> <storagePath> <archivo>
# ej:
npm run publish:reel -- 63c07276-... 1e04265d.../873c6f03.../dia2-deseo-reel.mp4 out/reel-final.mp4
```
Sube el `.mp4` y deja `media_tipo = "video"`.

## Después de publicar

La pieza pasa de **Ideas** a **Posts listos** en la app (la separación es por `media_url`).
Desde ahí se copia el texto, se descarga la media y se aprueba/publica.

> Re-publicar el mismo post pisa el archivo (upsert). Si un post tenía carrusel y le publicás
> una sola imagen, primero conviene vaciar su carpeta `{postId}/` para que no queden slides viejas.
