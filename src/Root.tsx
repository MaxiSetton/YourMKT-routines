import { Composition } from "remotion";
import { Reel } from "./Reel";
import { Carrusel, type CarruselSpec } from "./Carrusel";
import type { ReelProps, Spec } from "./types";
import specJson from "../spec.dia1.json";
import carruselJson from "../spec.dia3.carrusel.json";

const spec = specJson as unknown as Spec;
const carruselSpec = carruselJson as unknown as CarruselSpec & { aspect: string };

const ASPECT_DIMS: Record<string, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "4:5": { width: 1080, height: 1350 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={Math.round(spec.duracion_seg * spec.fps)}
        fps={spec.fps}
        width={ASPECT_DIMS[spec.aspect]?.width ?? 1080}
        height={ASPECT_DIMS[spec.aspect]?.height ?? 1920}
        defaultProps={{ spec, subs: [], voiceExists: false, hideRanges: [] } as ReelProps}
        calculateMetadata={({ props }) => {
          const s = props.spec;
          const dims = ASPECT_DIMS[s.aspect] ?? { width: 1080, height: 1920 };
          return {
            durationInFrames: Math.round(s.duracion_seg * s.fps),
            fps: s.fps,
            width: dims.width,
            height: dims.height,
          };
        }}
      />
      <Composition
        id="Carrusel"
        component={Carrusel}
        durationInFrames={carruselSpec.slides.length}
        fps={1}
        width={ASPECT_DIMS[carruselSpec.aspect]?.width ?? 1080}
        height={ASPECT_DIMS[carruselSpec.aspect]?.height ?? 1350}
        defaultProps={{ spec: carruselSpec } as { spec: CarruselSpec }}
        calculateMetadata={({ props }) => {
          const dims = ASPECT_DIMS[(props.spec as CarruselSpec & { aspect: string }).aspect] ?? { width: 1080, height: 1350 };
          return {
            durationInFrames: Math.max(1, props.spec.slides.length),
            fps: 1,
            width: dims.width,
            height: dims.height,
          };
        }}
      />
    </>
  );
};
