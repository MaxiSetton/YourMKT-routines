# Modal app: Wan 2.2 I2V-A14B (flagship image-to-video) como web endpoint.
# Mismo contrato JSON que el resto del pipeline (lo consume scripts/generate.mjs):
#   POST { prompt, image_base64, width, height, num_frames, fps, guidance_scale?, num_inference_steps?, negative_prompt? }
#   -> { success, video_base64, num_frames, fps }
# A14B = MoE de dos expertos (high/low noise). enable_model_cpu_offload() los intercambia por fase
# -> entra en una sola A100-80GB sin OOM, con un único swap (no penaliza por step). Modelo horneado en el build.
# Deploy:  modal deploy renderer/infra/modal_wan_i2v.py
import modal

MODEL_ID = "Wan-AI/Wan2.2-I2V-A14B-Diffusers"
DEFAULT_NEG = (
    "blurry, low quality, distorted, deformed, warped, morphing, melting, flickering, jitter, "
    "oversaturated, overexposed, watermark, text, extra fingers, bad hands, static frozen image"
)


def _download():
    from huggingface_hub import snapshot_download
    snapshot_download(MODEL_ID)


image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git", "ffmpeg")
    .pip_install("torch==2.7.0", "torchvision==0.22.0", index_url="https://download.pytorch.org/whl/cu126")
    .pip_install(
        "git+https://github.com/huggingface/diffusers",
        "transformers>=4.49.0",
        "accelerate",
        "ftfy",
        "imageio",
        "imageio-ffmpeg",
        "pillow",
        "numpy",
        "huggingface_hub",
        "fastapi[standard]",
    )
    .env({"HF_HOME": "/models"})
    .run_function(_download)
)

app = modal.App("video-toolkit-wan-i2v")


@app.cls(gpu="H200", timeout=3600, scaledown_window=300, image=image)
class Wan:
    @modal.enter()
    def load(self):
        import torch
        from diffusers import WanImageToVideoPipeline, AutoencoderKLWan

        vae = AutoencoderKLWan.from_pretrained(MODEL_ID, subfolder="vae", torch_dtype=torch.float32)
        self.pipe = WanImageToVideoPipeline.from_pretrained(MODEL_ID, vae=vae, torch_dtype=torch.bfloat16)
        self.pipe.to("cuda")  # H200 (141GB) entra la MoE de 2 expertos entera -> sin offload, rápido

    @modal.fastapi_endpoint(method="POST")
    def generate(self, request: dict):
        import base64, io
        from PIL import Image
        from diffusers.utils import export_to_video

        prompt = request.get("prompt", "")
        neg = request.get("negative_prompt") or DEFAULT_NEG
        width = int(request.get("width", 704))
        height = int(request.get("height", 1280))
        num_frames = int(request.get("num_frames", 121))
        fps = int(request.get("fps", 24))
        steps = int(request.get("num_inference_steps", 40))
        guidance = float(request.get("guidance_scale", 5.0))

        img = Image.open(io.BytesIO(base64.b64decode(request["image_base64"]))).convert("RGB").resize((width, height))
        try:
            frames = self.pipe(
                image=img,
                prompt=prompt,
                negative_prompt=neg,
                height=height,
                width=width,
                num_frames=num_frames,
                guidance_scale=guidance,
                num_inference_steps=steps,
            ).frames[0]
        except Exception as e:
            return {"success": False, "error": repr(e)}

        out = "/tmp/out.mp4"
        export_to_video(frames, out, fps=fps)
        with open(out, "rb") as f:
            data = f.read()
        return {"success": True, "video_base64": base64.b64encode(data).decode(), "num_frames": num_frames, "fps": fps}
