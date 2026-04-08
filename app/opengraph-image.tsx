import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 20%, #38bdf8 0%, #0f172a 42%, #020617 100%)",
          color: "#e2e8f0",
          padding: "64px",
          fontFamily: "Inter, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 420,
            height: 420,
            borderRadius: "9999px",
            background: "rgba(56, 189, 248, 0.25)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: -140,
            bottom: -180,
            width: 520,
            height: 520,
            borderRadius: "9999px",
            background: "rgba(14, 165, 233, 0.2)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#38bdf8",
              boxShadow: "0 0 18px rgba(56, 189, 248, 0.9)",
            }}
          />
          SENAI GAME HUB
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 940 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#f8fafc",
            }}
          >
            SENAI Dr. Celso Charuri
          </div>
          <div
            style={{
              fontSize: 44,
              lineHeight: 1.12,
              fontWeight: 600,
              color: "#bae6fd",
            }}
          >
            Jogos criados por alunos de Programação de Jogos Digitais
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#cbd5e1",
          }}
        >
          <div>Explore • Avalie • Compartilhe</div>
          <div style={{ fontWeight: 700, color: "#7dd3fc" }}>senaigamehub.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
