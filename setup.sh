#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Setup del environment de las routines de Claude Code (Ubuntu 24.04, corre como
# root, su salida se CACHEA ~7 días). Provisiona TODO lo que el pipeline necesita.
#
# Pegá el contenido de este archivo en el "setup script" del environment, en
# claude.ai/code/routines (Settings del environment). Ver routines/README.md.
#
# Node y Python 3 ya vienen en la imagen; ffmpeg, Chromium y las libs de Python NO.
# Mantené el setup livianito (< ~5 min) para que el cache rinda. Las descargas de
# modelos (faster-whisper, OmniVoice) pueden tardar más la 1ª vez; quedan cacheadas.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"   # parado en la raíz del repo (donde está package.json)

echo "==> apt: ffmpeg + libsndfile + python"
apt-get update -y
# python-is-python3: tts.mjs invoca `python` (no `python3`). libsndfile1: lo necesita soundfile.
apt-get install -y --no-install-recommends ffmpeg libsndfile1 python3-pip python-is-python3

echo "==> Node deps (Remotion, ajv, etc.)"
npm install --no-audit --no-fund

echo "==> Chromium para Remotion (headless shell)"
npx --yes remotion browser ensure || echo "WARN: no pude pre-bajar Chromium; Remotion lo intenta en runtime"

echo "==> Python: torch (CPU) + OmniVoice + faster-whisper"
# Wheel CPU de torch (evita ~2GB de CUDA). Requiere allowlist de download.pytorch.org (ver README).
pip install --no-cache-dir --break-system-packages torch --index-url https://download.pytorch.org/whl/cpu \
  || pip install --no-cache-dir --break-system-packages torch
pip install --no-cache-dir --break-system-packages -r requirements.txt

echo "==> (opcional) pre-bajar modelos al cache — no es fatal si falla"
python -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')" \
  || echo "WARN: no pre-bajé faster-whisper 'base' (se baja en la 1ª corrida)"
python -c "from omnivoice import OmniVoice; OmniVoice.from_pretrained('k2-fsa/OmniVoice')" \
  || echo "WARN: no pre-bajé k2-fsa/OmniVoice (varios GB; se baja en la 1ª corrida de la Routine 3)"

echo "==> setup OK"
