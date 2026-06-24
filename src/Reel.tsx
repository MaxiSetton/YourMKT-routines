import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { Escena, Marca, ReelProps, ScrimModo, VisualResuelto } from "./types";
import { OVERLAYS } from "./overlays";
import { Subtitles } from "./Subtitles";

// Movimiento con intención: el plano arranca con energía y ASIENTA (ease-out), no un creep lineal.
// Variantes para que escenas seguidas no se muevan igual (variedad = más "editado", menos relleno).
const KenBurns: React.FC<{ src: string; fit?: "cover" | "contain"; durationInFrames: number; variant?: string }> = ({
  src,
  fit = "cover",
  durationInFrames,
  variant = "in",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  let scale = 1.1, tx = 0, ty = 0;
  if (variant === "in") scale = interpolate(p, [0, 1], [1.16, 1.0]); // punch-in que asienta
  else if (variant === "out") scale = interpolate(p, [0, 1], [1.0, 1.14]); // alejamiento lento
  else if (variant === "left") { scale = 1.14; tx = interpolate(p, [0, 1], [3.5, -3.5]); }
  else if (variant === "right") { scale = 1.14; tx = interpolate(p, [0, 1], [-3.5, 3.5]); }
  else if (variant === "up") { scale = 1.14; ty = interpolate(p, [0, 1], [3.5, -3.5]); }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: fit, transform: `scale(${scale}) translate(${tx}%, ${ty}%)` }}
      />
    </AbsoluteFill>
  );
};

const Background: React.FC<{ vis: VisualResuelto; marca: Marca; durationInFrames: number; variant?: string }> = ({
  vis,
  marca,
  durationInFrames,
  variant,
}) => {
  if (vis.kind === "image" && vis.src) {
    return vis.kenburns ? (
      <KenBurns src={vis.src} fit={vis.fit} durationInFrames={durationInFrames} variant={variant} />
    ) : (
      <AbsoluteFill>
        <Img src={staticFile(vis.src)} style={{ width: "100%", height: "100%", objectFit: vis.fit ?? "cover" }} />
      </AbsoluteFill>
    );
  }
  if (vis.kind === "video" && vis.src) {
    return (
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(vis.src)} muted toneMapped={false} style={{ width: "100%", height: "100%", objectFit: vis.fit ?? "cover" }} />
      </AbsoluteFill>
    );
  }
  // placeholder (dev): solo cuando ninguna fuente resolvio
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${marca.colores.primario} 0%, ${marca.colores.texto} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.45)", fontFamily: "monospace", fontSize: 26, textAlign: "center" }}>
        [pendiente]
        <br />
        {vis.intencion}
      </span>
    </AbsoluteFill>
  );
};

const Scrim: React.FC<{ modo: ScrimModo }> = ({ modo }) => {
  if (modo === "none") return null;
  const bg =
    modo === "bottom"
      ? "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0) 60%)"
      : modo === "top"
        ? "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0) 60%)"
        : "rgba(0,0,0,0.42)"; // full
  return <AbsoluteFill style={{ background: bg }} />;
};

const EscenaView: React.FC<{ escena: Escena & { resuelto?: VisualResuelto }; marca: Marca; fps: number; variant?: string }> = ({
  escena,
  marca,
  fps,
  variant,
}) => {
  const dur = Math.round((escena.t_out - escena.t_in) * fps);
  const vis = escena.resuelto ?? { kind: "placeholder", intencion: escena.visual.intencion };
  return (
    <AbsoluteFill>
      <Background vis={vis} marca={marca} durationInFrames={dur} variant={variant} />
      <Scrim modo={escena.scrim ?? "bottom"} />
      {(escena.overlays ?? []).map((ov, i) => {
        const Comp = OVERLAYS[ov.componente];
        return Comp ? <Comp key={i} {...(ov.props ?? {})} marca={marca} durationInFrames={dur} /> : null;
      })}
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = ({ spec, subs, voiceExists, hideRanges }) => {
  const fps = spec.fps;
  const musica = spec.audio.musica;
  // Palabras a enfatizar (fuente única: escena.enfasis.word_idx). Subtitles les da pop EXTRA.
  const emphasis = spec.escenas
    .map((e) => e.enfasis?.word_idx)
    .filter((n): n is number => typeof n === "number");
  return (
    <AbsoluteFill style={{ backgroundColor: spec.marca.colores.fondo }}>
      {spec.escenas.map((escena, i) => (
        <Sequence
          key={escena.id}
          from={Math.round(escena.t_in * fps)}
          durationInFrames={Math.round((escena.t_out - escena.t_in) * fps)}
        >
          <EscenaView escena={escena} marca={spec.marca} fps={fps} variant={["in", "left", "out", "right", "up"][i % 5]} />
        </Sequence>
      ))}

      <Subtitles subs={subs} marca={spec.marca} hideRanges={hideRanges} emphasis={emphasis} />

      {voiceExists && <Audio src={staticFile("voice.mp3")} />}
      {musica?.exists && <Audio src={staticFile(musica.src)} volume={musica.volumen} loop />}
    </AbsoluteFill>
  );
};
