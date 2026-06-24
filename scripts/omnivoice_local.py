import sys
import argparse
import os
import imageio_ffmpeg

ffmpeg_dir = os.path.dirname(imageio_ffmpeg.get_ffmpeg_exe())
os.environ["PATH"] += os.pathsep + ffmpeg_dir
if hasattr(os, 'add_dll_directory'):
    os.add_dll_directory(ffmpeg_dir)

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

def main():
    parser = argparse.ArgumentParser(description="OmniVoice Local CPU TTS")
    parser.add_argument("--text", type=str, required=True, help="Texto a sintetizar")
    parser.add_argument("--ref_audio", type=str, required=True, help="Ruta al audio de referencia")
    parser.add_argument("--output", type=str, required=True, help="Ruta de salida del WAV")
    # OmniVoice (clonacion zero-shot) emite un ONSET ESPURIO al principio de CADA generacion
    # (una vocal tipo "o" arrastrada de la voz de referencia). Se recortan los primeros ms de cada
    # bloque para que no se oiga. Ajustable; ~120ms suele alcanzar sin comerse la 1a palabra.
    parser.add_argument("--trim_ms", type=int, default=120, help="ms a recortar del INICIO (artefacto de clonacion)")

    args = parser.parse_args()
    
    print("Cargando OmniVoice en CPU. Esto requerirá bastante RAM y tiempo...")
    
    try:
        import torch
        from omnivoice import OmniVoice
        import soundfile as sf
        
        # Forzar CPU
        device = "cpu"
        
        print("Instanciando el modelo k2-fsa/OmniVoice...")
        # Si es la primera vez, esto descargara varios GBs.
        model = OmniVoice.from_pretrained("k2-fsa/OmniVoice")
        model.to(device)
        
        print("Generando audio...")
        # OmniVoice acepta velocidad (speed)
        # sp = 0.85 para simular el ritmo de reel
        audios = model.generate(text=args.text, ref_audio=args.ref_audio, speed=0.85)
        audio = audios[0]
        sr = 24000 # OmniVoice outputs at 24kHz usually

        # --- Recortar el onset espurio de la clonacion ("o" inicial) + el silencio que lo sigue ---
        # OmniVoice (con esta ref) escupe: [burst corto "o"] -> [silencio largo] -> [habla real].
        # Arrancamos en el PRIMER tramo de habla SOSTENIDA (descarta el burst corto y el silencio),
        # robusto a que el largo del artefacto/silencio varie por bloque. Si no hay artefacto claro,
        # cae al floor fijo --trim_ms. Cap de seguridad para no comerse la 1a palabra.
        import numpy as np
        a = audio.detach().cpu().numpy() if hasattr(audio, "detach") else np.asarray(audio)
        a = np.asarray(a, dtype=np.float32).flatten()
        fl = max(1, int(0.01 * sr))                 # ventanas de 10ms
        n = len(a) // fl
        floor = int(max(0, args.trim_ms) * sr / 1000)
        cut = floor
        if n > 8:
            rms = np.sqrt((a[:n * fl].reshape(n, fl).astype(np.float64) ** 2).mean(axis=1) + 1e-12)
            thr = float(rms.max()) * 0.10
            minrun = int(0.15 / 0.01)               # 150ms sostenido = habla, no el burst "o"
            i, start_frame = 0, 0
            while i < n:
                if rms[i] > thr:
                    j = i
                    while j < n and rms[j] > thr:
                        j += 1
                    if (j - i) >= minrun:
                        start_frame = i
                        break
                    i = j
                else:
                    i += 1
            if start_frame > 0:                     # hubo artefacto+silencio antes del habla
                cut = start_frame * fl - int(0.04 * sr)   # 40ms de pre-roll
        cut = max(0, min(cut, int(0.9 * sr)))       # cap 0.9s
        if 0 < cut < len(a):
            a = a[cut:]
            print(f"Recortado onset+silencio inicial: {cut / sr * 1000:.0f}ms (artefacto de clonacion).")
        audio = a

        print(f"Guardando archivo en {args.output}...")
        sf.write(args.output, audio, sr)
        print("Completado.")
        
    except Exception as e:
        print(f"Error fatal en OmniVoice local: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
