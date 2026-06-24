// Composicion de CARRUSEL (feed educativo): N slides graficas de marca, renderizadas por codigo
// (la IA no escribe texto limpio). Cada frame = una slide -> el script exporta una PNG por frame.
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import type { Marca } from "./types";
import { fontTitulo, fontTexto, fontMano } from "./fonts";

export interface Slide {
  variante: "portada" | "concepto" | "cierre";
  kicker?: string;
  titulo: string;
  cuerpo?: string;
  foto?: string; // archivo en public/ (opcional)
  pie?: string; // linea de cierre (cierre)
  swipe?: string; // hint de deslizar (portada)
}

export interface CarruselSpec {
  marca: Marca;
  slides: Slide[];
}

const PAD = 88;

const Header: React.FC<{ m: Marca }> = ({ m }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <span style={{ fontFamily: fontTitulo, fontWeight: 900, fontSize: 40, color: m.colores.primario, lineHeight: 1 }}>
      Bruma
    </span>
    <span style={{ width: 8, height: 8, borderRadius: 999, background: m.colores.acento }} />
    <span style={{ fontFamily: fontTexto, fontWeight: 700, fontSize: 19, letterSpacing: 4, textTransform: "uppercase", color: m.colores.secundario, opacity: 0.8 }}>
      Villa Crespo
    </span>
  </div>
);

const Kicker: React.FC<{ m: Marca; children: React.ReactNode }> = ({ m, children }) => (
  <div
    style={{
      alignSelf: "flex-start",
      background: m.colores.acento,
      color: m.colores.fondo,
      fontFamily: fontTexto,
      fontWeight: 800,
      fontSize: 26,
      letterSpacing: 4,
      textTransform: "uppercase",
      padding: "10px 22px",
      borderRadius: 999,
    }}
  >
    {children}
  </div>
);

const Dots: React.FC<{ total: number; active: number; m: Marca }> = ({ total, active, m }) => (
  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        style={{
          width: i === active ? 30 : 12,
          height: 12,
          borderRadius: 999,
          background: m.colores.primario,
          opacity: i === active ? 1 : 0.25,
        }}
      />
    ))}
  </div>
);

export const Carrusel: React.FC<{ spec: CarruselSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const i = Math.min(Math.max(frame, 0), spec.slides.length - 1);
  const s = spec.slides[i];
  const m = spec.marca;

  const body = (() => {
    if (s.variante === "portada") {
      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
          {s.kicker && <Kicker m={m}>{s.kicker}</Kicker>}
          <div style={{ fontFamily: fontTitulo, fontWeight: 900, fontSize: 132, lineHeight: 1.0, color: m.colores.primario, whiteSpace: "pre-line" }}>
            {s.titulo}
          </div>
          {s.cuerpo && (
            <div style={{ fontFamily: fontTexto, fontWeight: 700, fontSize: 46, lineHeight: 1.4, color: m.colores.texto, maxWidth: "90%" }}>
              {s.cuerpo}
            </div>
          )}
        </div>
      );
    }
    if (s.variante === "cierre") {
      return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
          <div style={{ fontFamily: fontTitulo, fontWeight: 900, fontSize: 92, lineHeight: 1.05, color: m.colores.primario, whiteSpace: "pre-line" }}>
            {s.titulo}
          </div>
          {s.cuerpo && (
            <div style={{ fontFamily: fontTexto, fontWeight: 700, fontSize: 46, lineHeight: 1.4, color: m.colores.texto }}>
              {s.cuerpo}
            </div>
          )}
          {s.pie && (
            <div style={{ marginTop: 10, alignSelf: "flex-start", background: m.colores.primario, color: m.colores.fondo, fontFamily: fontTexto, fontWeight: 800, fontSize: 34, padding: "16px 30px", borderRadius: 999 }}>
              {s.pie}
            </div>
          )}
        </div>
      );
    }
    // concepto
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        {s.foto && (
          <div style={{ width: "100%", height: 470, borderRadius: 28, overflow: "hidden", marginBottom: 16, boxShadow: "0 16px 50px rgba(58,42,30,0.20)" }}>
            <Img src={staticFile(s.foto)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        {s.kicker && <Kicker m={m}>{s.kicker}</Kicker>}
        <div style={{ fontFamily: fontTitulo, fontWeight: 900, fontSize: 104, lineHeight: 1.02, color: m.colores.primario }}>
          {s.titulo}
        </div>
        <div style={{ width: 96, height: 6, borderRadius: 999, background: m.colores.acento }} />
        {s.cuerpo && (
          <div style={{ fontFamily: fontTexto, fontWeight: 700, fontSize: 44, lineHeight: 1.45, color: m.colores.texto }}>
            {s.cuerpo}
          </div>
        )}
      </div>
    );
  })();

  return (
    <AbsoluteFill style={{ background: m.colores.fondo, padding: PAD, display: "flex", flexDirection: "column" }}>
      <Header m={m} />
      {body}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Dots total={spec.slides.length} active={i} m={m} />
        {s.swipe && (
          <span style={{ fontFamily: fontMano, fontWeight: 700, fontSize: 44, color: m.colores.acento }}>{s.swipe}</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
