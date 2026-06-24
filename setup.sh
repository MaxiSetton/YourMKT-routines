#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Setup del environment de las routines de Claude Code (Ubuntu 24.04, corre como
# root, su salida se CACHEA ~7 días). Provisiona TODO lo que el pipeline necesita.
#
# Pegá el contenido de este archivo en el "setup script" del environment, en
# claude.ai/code/routines (Settings del environment). Ver routines/README.md.
#
# Node y Python 3 ya vienen en la imagen; ffmpeg, Chromium y las libs de Python NO.
# El setup corre PARADO EN LA RAÍZ DEL REPO (no le hagas `cd $(dirname $0)`: el
# script se guarda en /tmp y eso te saca del repo → npm no encuentra package.json).
# ─────────────────────────────────────────────────────────────────────────────
set -uo pipefail   # sin -e: que un paso opcional no tumbe el setup entero; abajo se avisa con WARN.

# Asegurar que estamos en la raíz del repo (donde está package.json). Normalmente ya lo estamos;
# si no, lo buscamos (fallback) sin frenar el setup.
if [ ! -f package.json ]; then
  REPO_DIR="$(find "$HOME" /workspace /root /repo . -maxdepth 4 -name package.json -path '*routines*' 2>/dev/null | head -1)"
  [ -n "${REPO_DIR:-}" ] && cd "$(dirname "$REPO_DIR")"
fi
echo "==> cwd: $(pwd)"

echo "==> apt: ffmpeg + libsndfile + python"
apt-get update -y
# python-is-python3: tts.mjs invoca `python` (no `python3`). libsndfile1: lo necesita soundfile.
apt-get install -y --no-install-recommends ffmpeg libsndfile1 python3-pip python-is-python3

echo "==> Python: torch (CPU) + OmniVoice + faster-whisper (global, no necesita el repo)"
# Wheel CPU de torch (evita ~2GB de CUDA). Requiere allowlist de download.pytorch.org (ver README).
pip install --no-cache-dir --break-system-packages torch --index-url https://download.pytorch.org/whl/cpu \
  || pip install --no-cache-dir --break-system-packages torch
if [ -f requirements.txt ]; then
  pip install --no-cache-dir --break-system-packages -r requirements.txt
else
  pip install --no-cache-dir --break-system-packages omnivoice==0.1.5 faster-whisper soundfile imageio-ffmpeg numpy
fi

echo "==> Node deps (calienta el cache de npm; node_modules se reinstala por sesión si hizo falta)"
if [ -f package.json ]; then
  npm install --no-audit --no-fund || echo "WARN: npm install en setup falló; la routine lo reintenta en su corrida"
  npx --yes remotion browser ensure || echo "WARN: no pre-bajé Chromium; Remotion lo intenta en runtime"
else
  echo "WARN: no encontré package.json en $(pwd); las deps de Node las instala la routine"
fi

echo "==> pre-bajar modelos al cache — no es fatal si falla"
python -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')" \
  || echo "WARN: no pre-bajé faster-whisper 'base' (se baja en la 1ª corrida)"
python -c "from omnivoice import OmniVoice; OmniVoice.from_pretrained('k2-fsa/OmniVoice')" \
  || echo "WARN: no pre-bajé k2-fsa/OmniVoice (varios GB; se baja en la 1ª corrida de la Routine 3)"

echo "==> setup terminado (revisá los WARN de arriba: si algo no se instaló, se resuelve en runtime)"
