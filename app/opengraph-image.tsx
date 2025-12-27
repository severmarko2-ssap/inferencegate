import { ImageResponse } from "next/og";

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
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05 }}>
          InferenceGate
        </div>
        <div style={{ fontSize: 28, marginTop: 20, color: "#555555" }}>
          Cut LLM costs 65–75% without breaking UX.
        </div>
        <div style={{ fontSize: 18, marginTop: 40, color: "#555555" }}>
          ssap.io
        </div>
      </div>
    ),
    { ...size }
  );
}
