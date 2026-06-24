import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Marca, Sub } from "./types";
import { fontTexto } from "./fonts";

export const Subtitles: React.FC<{ subs: Sub[]; marca: Marca; hideRanges?: [number, number][]; emphasis?: number[] }> = ({
  subs,
  marca,
  hideRanges = [],
  emphasis = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (hideRanges.some(([a, b]) => t >= a && t < b)) return null;

  // Cada linea persiste hasta que ARRANCA la siguiente (sin huecos: no desaparece a mitad).
  const idx = subs.findIndex((s, i) => t >= s.from && (i + 1 >= subs.length || t < subs[i + 1].from));
  if (idx < 0) return null;
  const active = subs[idx];
  // offset global del bloque activo: la palabra i de este bloque es la global (before + i) en subs.json.
  // Asi el word_idx de escena.enfasis (índice plano) matchea la palabra que resaltamos. FUENTE ÚNICA.
  const before = subs.slice(0, idx).reduce((n, s) => n + s.words.length, 0);
  const emph = new Set(emphasis);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: 70, paddingBottom: 240 }}>
      <div style={{ maxWidth: "92%", textAlign: "center", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 2px" }}>
        {active.words.map((wd, i) => {
          const on = t >= wd.from && t < wd.to;
          const isEmph = emph.has(before + i); // la palabra clave de esta escena
          // pop cinético: la palabra activa entra con un golpe de escala y asienta en su beat.
          // La palabra de ÉNFASIS pega MÁS fuerte y queda un toque más grande (jerarquía: dirige el ojo).
          const pop = on
            ? interpolate(t, [wd.from, wd.from + 0.13], [isEmph ? 1.62 : 1.34, isEmph ? 1.08 : 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : isEmph ? 1.06 : 1;
          const activeBg = isEmph ? marca.colores.primario : marca.colores.acento;
          return (
            <span
              key={i}
              style={{
                fontFamily: fontTexto,
                fontWeight: isEmph ? 900 : 800,
                fontSize: 60,
                lineHeight: 1.1,
                letterSpacing: -0.5,
                textTransform: "lowercase",
                // la palabra clave pre-resalta (color de acento) aun cuando no esta activa: se ve la jerarquia
                color: on ? marca.colores.texto : isEmph ? marca.colores.acento : "#fff",
                background: on ? activeBg : "transparent",
                padding: "4px 12px",
                borderRadius: on ? 8 : 0,
                transform: on ? `rotate(-1.5deg) scale(${pop})` : isEmph ? `scale(${pop})` : "none",
                WebkitTextStrokeWidth: on || isEmph ? "0" : "7px",
                WebkitTextStrokeColor: marca.colores.texto,
                paintOrder: "stroke",
                boxShadow: on ? "0 6px 18px rgba(0,0,0,0.35)" : "none",
                display: "inline-block",
              }}
            >
              {wd.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
