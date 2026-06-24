import os
import scipy.io.wavfile
from transformers import AutoProcessor, BarkModel

print("Cargando el modelo Bark (esto tomará un tiempo si es la primera vez que se descarga)...")
processor = AutoProcessor.from_pretrained("suno/bark-small")
model = BarkModel.from_pretrained("suno/bark-small")

text = "¡Hola! Cambiamos el origen del mes. Es un Etiopía Yirgacheffe, recién tostado, y nos tiene obsesionados. Pasá a probarlo."

print("Generando audio (procesando en CPU, puede demorar varios minutos)...")
voice_preset = "v2/es_speaker_9"
inputs = processor(text, voice_preset=voice_preset)

audio_array = model.generate(**inputs)
audio_array = audio_array.cpu().numpy().squeeze()

output_path = os.path.join(os.path.dirname(__file__), "public", "bark_out.wav")
scipy.io.wavfile.write(output_path, rate=model.generation_config.sample_rate, data=audio_array)

print(f"¡Audio generado con éxito en {output_path}!")
