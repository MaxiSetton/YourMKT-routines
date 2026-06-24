import os
import subprocess
import glob

print("1. Descargando audio de Darín usando yt-dlp...")
# Usamos un short o un clip corto
os.system('yt-dlp -f "ba" -o "temp_audio.%(ext)s" "ytsearch1:ricardo darin entrevista cortito"')

archivos = glob.glob("temp_audio.*")
if archivos:
    archivo_origen = archivos[0]
    print(f"2. Cortando exactamente 30 segundos del archivo {archivo_origen}...")
    
    # Buscamos la ruta de ffmpeg dentro del entorno de Conda
    ffmpeg_cmd = "ffmpeg"
    
    # Extraemos 30 segundos, saltando los primeros 10
    comando = f'{ffmpeg_cmd} -y -i "{archivo_origen}" -ss 00:00:10 -t 00:00:30 -c:a pcm_s16le -ar 44100 "darin_referencia.wav"'
    
    print("Ejecutando:", comando)
    os.system(comando)
    
    # Limpieza
    try:
        os.remove(archivo_origen)
    except:
        pass
        
    print("¡Éxito! El archivo darin_referencia.wav está listo (30 segundos).")
else:
    print("No se pudo descargar el archivo.")
