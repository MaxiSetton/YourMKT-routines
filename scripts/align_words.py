"""Alineacion forzada de palabras: saca los segundos REALES de cada palabra del audio de OmniVoice
(faster-whisper, word timestamps) y escribe subs.json para la karaoke. Reemplaza el "fantasma EdgeTTS
escalado linealmente", que driftea porque OmniVoice no respeta la proporcion de tiempos de EdgeTTS.
Uso: python scripts/align_words.py --audio public/voice.wav --text "<guion>" --out public/subs.json --max 4
"""
import argparse, json, os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
# Windows sin admin/developer-mode no puede crear symlinks -> el cache de HF falla (WinError 1314).
# Forzamos COPIAS en vez de symlinks para bajar el modelo de faster-whisper.
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS", "1")
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", required=True)
    ap.add_argument("--text", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--max", type=int, default=4)
    ap.add_argument("--model", default="base")
    a = ap.parse_args()

    from faster_whisper import WhisperModel
    print(f"Cargando faster-whisper '{a.model}' (CPU)...")
    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    segments, _info = model.transcribe(a.audio, language="es", word_timestamps=True, vad_filter=False)

    heard = []
    for seg in segments:
        for w in (seg.words or []):
            t = w.word.strip()
            if t:
                heard.append({"w": t, "from": float(w.start), "to": float(w.end)})
    if not heard:
        print("ALIGN_EMPTY: Whisper no devolvio palabras")
        raise SystemExit(1)

    # Whisper transcribe LIBRE (mete errores: rellenos, acentos perdidos, palabras mal oidas).
    # Los TIEMPOS son reales y buenos, pero las PALABRAS hay que tomarlas del GUION. Alineamos las dos
    # secuencias con difflib y le pasamos a cada token del guion el tiempo de la palabra de Whisper que le toca.
    toks = a.text.split() if a.text else [h["w"] for h in heard]

    import difflib, unicodedata, re

    def norm(s):
        s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
        return re.sub(r"[^a-z0-9]", "", s.lower())

    tnorm = [norm(t) for t in toks]
    hnorm = [norm(h["w"]) for h in heard]
    times = [None] * len(toks)  # (from,to) por token del guion
    sm = difflib.SequenceMatcher(a=tnorm, b=hnorm, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("equal", "replace"):
            n, m = i2 - i1, j2 - j1
            for k in range(n):
                jj = j1 + (min(m - 1, k * m // n) if m else -1)
                if 0 <= jj < len(heard):
                    times[i1 + k] = (heard[jj]["from"], heard[jj]["to"])
        # 'delete' (token del guion sin oido) y 'insert' (oido de mas, p.ej. "Bueno") -> se rellenan/ignoran

    # Rellenar huecos por interpolacion entre vecinos conocidos.
    known = [(i, t) for i, t in enumerate(times) if t]
    if not known:
        print("ALIGN_EMPTY: no se pudo alinear el guion")
        raise SystemExit(1)
    for i in range(len(times)):
        if times[i]:
            continue
        prev = max((k for k in known if k[0] < i), default=None, key=lambda x: x[0])
        nxt = min((k for k in known if k[0] > i), default=None, key=lambda x: x[0])
        if prev and nxt:
            f = prev[1][1]; t = nxt[1][0]
        elif prev:
            f = t = prev[1][1]
        else:
            f = t = nxt[1][0]
        times[i] = (f, t)

    words = [{"w": toks[i], "from": float(times[i][0]), "to": float(times[i][1])} for i in range(len(toks))]

    # Fix de cola: whisper no cronometra bien numeros/nombres propios al FINAL y los deja PEGADOS
    # (mismo from/to). Si quedo habla despues de la ultima palabra alineada, repartimos esas palabras
    # colapsadas hasta el fin del habla, para que el karaoke y el corte no se adelanten.
    try:
        audio_end = float(_info.duration)
    except Exception:
        audio_end = words[-1]["to"] if words else 0.0
    if words and (audio_end - words[-1]["to"]) > 0.4:
        last_to = words[-1]["to"]
        j = len(words) - 1
        while j > 0 and abs(words[j - 1]["to"] - last_to) < 1e-3:
            j -= 1
        start = words[j]["from"]
        end = max(start + 0.1, audio_end - 0.2)
        n = len(words) - j
        step = (end - start) / n
        for k in range(n):
            words[j + k]["from"] = round(start + k * step, 3)
            words[j + k]["to"] = round(start + (k + 1) * step, 3)
        print(f"ALIGN_FIX_TAIL: reparti {n} palabra(s) finales {start:.2f}->{end:.2f}s (whisper las colapso en {last_to:.2f}s)")

    # Agrupado en bloques (mismo criterio que tts.mjs): tope de palabras o pausa natural.
    cap = max(a.max, 5)
    PAUSA = 0.3
    subs, cur = [], []
    for i, wd in enumerate(words):
        cur.append(wd)
        nxt = words[i + 1] if i + 1 < len(words) else None
        gap = (nxt["from"] - wd["to"]) if nxt else 1e9
        if len(cur) >= cap or gap > PAUSA or nxt is None:
            subs.append({"from": cur[0]["from"], "to": cur[-1]["to"], "words": cur})
            cur = []

    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(subs, f, ensure_ascii=False, indent=2)
    print(f"ALIGN_OK words={len(words)} blocks={len(subs)} last={words[-1]['to']:.2f}s aligned_to_script={bool(toks) and len(toks) == len(words)}")


if __name__ == "__main__":
    main()
