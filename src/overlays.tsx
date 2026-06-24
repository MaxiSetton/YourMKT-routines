import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Marca } from "./types";
import { fontTitulo, fontMano, fontTexto } from "./fonts";

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    translateY: interpolate(p, [0, 1], [40, 0]),
    p,
  };
};

export const TituloIntro: React.FC<{ kicker?: string; titulo: string; marca: Marca }> = ({
  kicker,
  titulo,
  marca,
}) => {
  const e = useEnter(4);
  const k = useEnter(0);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ textAlign: "center", transform: `translateY(${e.translateY}px)`, opacity: e.opacity }}>
        {kicker && (
          <div
            style={{
              display: "inline-block",
              background: marca.colores.acento,
              color: marca.colores.texto,
              fontFamily: marca.fuenteTexto,
              fontWeight: 800,
              letterSpacing: 6,
              fontSize: 34,
              padding: "10px 26px",
              borderRadius: 999,
              marginBottom: 28,
              opacity: k.opacity,
            }}
          >
            {kicker}
          </div>
        )}
        <div
          style={{
            fontFamily: marca.fuenteTitulo,
            fontWeight: 700,
            color: marca.colores.textoInverso,
            fontSize: 150,
            lineHeight: 1,
            textShadow: "0 6px 40px rgba(0,0,0,0.45)",
          }}
        >
          {titulo}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC<{ texto: string; sub?: string; marca: Marca }> = ({
  texto,
  sub,
  marca,
}) => {
  const e = useEnter(2);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: 80, paddingBottom: 520 }}>
      <div style={{ transform: `translateY(${e.translateY}px)`, opacity: e.opacity }}>
        <div
          style={{
            display: "inline-block",
            background: marca.colores.primario,
            color: marca.colores.textoInverso,
            fontFamily: marca.fuenteTitulo,
            fontWeight: 700,
            fontSize: 64,
            padding: "16px 28px",
            borderRadius: 18,
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          {texto}
        </div>
        {sub && (
          <div
            style={{
              marginTop: 14,
              color: marca.colores.textoInverso,
              fontFamily: marca.fuenteTexto,
              fontWeight: 600,
              fontSize: 38,
              textShadow: "0 2px 16px rgba(0,0,0,0.6)",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const CTA: React.FC<{ titulo: string; sub?: string; accento?: string; marca: Marca }> = ({
  titulo,
  sub,
  accento = "te esperamos",
  marca,
}) => {
  const e = useEnter(3);
  const a = useEnter(0);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ textAlign: "center", transform: `scale(${interpolate(e.p, [0, 1], [0.92, 1])})`, opacity: e.opacity }}>
        {accento && (
          <div
            style={{
              fontFamily: fontMano,
              fontWeight: 700,
              color: marca.colores.acento,
              fontSize: 78,
              transform: "rotate(-4deg)",
              marginBottom: -6,
              opacity: a.opacity,
              textShadow: "0 4px 18px rgba(0,0,0,0.5)",
            }}
          >
            {accento}
          </div>
        )}
        <div
          style={{
            fontFamily: fontTitulo,
            fontWeight: 900,
            color: marca.colores.textoInverso,
            fontSize: 118,
            lineHeight: 1.0,
            textShadow: "0 6px 40px rgba(0,0,0,0.5)",
          }}
        >
          {titulo}
        </div>
        {sub && (
          <div
            style={{
              marginTop: 30,
              display: "inline-block",
              background: marca.colores.textoInverso,
              color: marca.colores.primario,
              fontFamily: fontTexto,
              fontWeight: 800,
              fontSize: 36,
              padding: "14px 30px",
              borderRadius: 999,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const PasoBadge: React.FC<{ numero: number; titulo: string; detalle?: string; marca: Marca }> = ({
  numero,
  titulo,
  detalle,
  marca,
}) => {
  const e = useEnter(2);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", padding: 70, paddingTop: 140 }}>
      <div style={{ transform: `translateY(${e.translateY}px)`, opacity: e.opacity, display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 999,
            background: marca.colores.acento,
            color: marca.colores.texto,
            fontFamily: marca.fuenteTitulo,
            fontWeight: 700,
            fontSize: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          {numero}
        </div>
        <div
          style={{
            fontFamily: marca.fuenteTitulo,
            fontWeight: 700,
            color: marca.colores.textoInverso,
            fontSize: 70,
            lineHeight: 1.05,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          {titulo}
        </div>
      </div>
      {detalle && (
        <div
          style={{
            marginTop: 24,
            maxWidth: "85%",
            color: marca.colores.textoInverso,
            fontFamily: marca.fuenteTexto,
            fontWeight: 600,
            fontSize: 42,
            lineHeight: 1.25,
            opacity: e.opacity,
            textShadow: "0 2px 16px rgba(0,0,0,0.6)",
          }}
        >
          {detalle}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const ListaBeneficios: React.FC<{ titulo?: string; items: string[]; marca: Marca }> = ({
  titulo,
  items,
  marca,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 80 }}>
      {titulo && (
        <div
          style={{
            fontFamily: marca.fuenteTitulo,
            fontWeight: 700,
            color: marca.colores.textoInverso,
            fontSize: 72,
            marginBottom: 36,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          {titulo}
        </div>
      )}
      {items.map((it, i) => {
        const delay = 6 + i * 8;
        const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 22,
              transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
              opacity: interpolate(p, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                background: marca.colores.acento,
                color: marca.colores.texto,
                fontWeight: 900,
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✓
            </div>
            <span
              style={{
                fontFamily: marca.fuenteTexto,
                fontWeight: 700,
                color: marca.colores.textoInverso,
                fontSize: 50,
                textShadow: "0 2px 16px rgba(0,0,0,0.6)",
              }}
            >
              {it}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Marca como SELLO/estampa: badge rotado con doble borde, tipo sello de cantina. No compite con el subtitulo.
// Si se pasa `logo` (archivo en public/, idealmente un PNG transparente y limpio), el sello usa el LOGO real
// sobre un chip claro; si no, cae al wordmark de texto. Pedí el logo aislado si lo unico que hay es un brand board.
export const BrandTag: React.FC<{ nombre: string; lugar?: string; logo?: string; marca: Marca }> = ({
  nombre,
  lugar,
  logo,
  marca,
}) => {
  const e = useEnter(0);
  const fondoStamp = logo ? marca.colores.fondo : marca.colores.primario;
  const textoStamp = logo ? marca.colores.primario : marca.colores.textoInverso;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: 50 }}>
      <div
        style={{
          transform: `rotate(-4deg) translateY(${interpolate(e.p, [0, 1], [-24, 0])}px)`,
          opacity: e.opacity,
          background: fondoStamp,
          color: textoStamp,
          border: `2px solid ${marca.colores.primario}`,
          outline: `2px solid ${fondoStamp}`,
          boxShadow: `0 0 0 4px ${marca.colores.primario}, 0 8px 24px rgba(0,0,0,0.35)`,
          padding: logo ? "12px 22px" : "10px 20px 12px",
          textAlign: "center",
        }}
      >
        {logo ? (
          <Img src={staticFile(logo)} style={{ height: 72, width: "auto", display: "block" }} />
        ) : (
          <div style={{ fontFamily: fontTitulo, fontWeight: 900, fontSize: 38, lineHeight: 1 }}>{nombre}</div>
        )}
        {lugar && (
          <div style={{ fontFamily: fontTexto, fontWeight: 700, fontSize: 18, letterSpacing: 3, textTransform: "uppercase", marginTop: 4, opacity: 0.9 }}>
            {lugar}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// PopUp: cartel/sticker que LLAMA LA ATENCIÓN — entra con pop+bounce (spring con overshoot), se sostiene
// con un pulso sutil y sale rápido al final de la escena. Para datos, precios, etiquetas, "señales".
// Sincronizá su entrada con un SFX "pop" (ver skill audio-director). No abuses: uno por beat.
export const PopUp: React.FC<{
  texto: string;
  sub?: string;
  emoji?: string;
  posicion?: "tl" | "tr" | "bl" | "br" | "cl" | "cr" | "center";
  color?: "acento" | "primario" | "fondo";
  rotacion?: number;
  delay?: number;
  marca: Marca;
  durationInFrames?: number;
}> = ({ texto, sub, emoji, posicion = "center", color = "acento", rotacion = -3, delay = 2, marca, durationInFrames = 90 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 11, mass: 0.6, stiffness: 190 } }); // overshoot
  const exitStart = Math.max(delay + 6, durationInFrames - 8);
  const exit = interpolate(frame, [exitStart, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.025 * Math.sin(((frame - delay) / fps) * Math.PI * 2 * 1.1); // respiración sutil
  const scale = Math.max(0, enter * pulse * exit);
  const opacity = Math.min(1, enter) * exit;

  const bg = color === "acento" ? marca.colores.acento : color === "primario" ? marca.colores.primario : marca.colores.fondo;
  const fg = color === "fondo" ? marca.colores.primario : marca.colores.textoInverso;
  const pos: Record<string, React.CSSProperties> = {
    tl: { justifyContent: "flex-start", alignItems: "flex-start" },
    tr: { justifyContent: "flex-start", alignItems: "flex-end" },
    bl: { justifyContent: "flex-end", alignItems: "flex-start" },
    br: { justifyContent: "flex-end", alignItems: "flex-end" },
    cl: { justifyContent: "center", alignItems: "flex-start" },
    cr: { justifyContent: "center", alignItems: "flex-end" },
    center: { justifyContent: "center", alignItems: "center" },
  };
  return (
    <AbsoluteFill style={{ display: "flex", padding: "200px 70px 360px", ...pos[posicion] }}>
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotacion}deg)`,
          opacity,
          background: bg,
          color: fg,
          borderRadius: 26,
          padding: sub ? "20px 36px" : "16px 32px",
          boxShadow: "0 14px 44px rgba(0,0,0,0.42)",
          border: `3px solid ${marca.colores.fondo}`,
          textAlign: "center",
          maxWidth: "82%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
          {emoji && <span style={{ fontSize: 62 }}>{emoji}</span>}
          <span style={{ fontFamily: fontTitulo, fontWeight: 900, fontSize: 66, lineHeight: 1 }}>{texto}</span>
        </div>
        {sub && (
          <div style={{ fontFamily: fontTexto, fontWeight: 700, fontSize: 33, marginTop: 8, opacity: 0.95 }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const OVERLAYS: Record<string, React.FC<any>> = {
  TituloIntro,
  LowerThird,
  CTA,
  PasoBadge,
  ListaBeneficios,
  BrandTag,
  PopUp,
};
