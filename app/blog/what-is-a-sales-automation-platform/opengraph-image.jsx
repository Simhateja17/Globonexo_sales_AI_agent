import { ImageResponse } from "next/og";

export const alt =
  "What Is a Sales Automation Platform? And What It Actually Replaces — GNX Sales";
export const size = { width: 1200, height: 630 };
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
          padding: "64px 72px",
          color: "#f4fff9",
          background:
            "linear-gradient(135deg, #072419 0%, #103e2c 55%, #276b5f 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 74 74" fill="none">
            <g fill="#66eaa4">
              <path d="M36 36 8 12c-2-2 0-5 3-4l31 12c2 1 2 4 0 5z" />
              <path d="M36 36 22 66c-1 2-4 2-5-1l-6-30c0-2 2-4 4-3z" />
              <path d="M36 36 66 26c2-1 4 2 3 4L48 60c-1 2-4 2-5 0z" />
            </g>
          </svg>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ fontSize: 30, fontWeight: 700 }}>GNX Sales</span>
            <span style={{ color: "#a7c9b9", fontSize: 16, letterSpacing: 3 }}>
              BLOG
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              maxWidth: 1040,
              fontSize: 66,
              lineHeight: 1.06,
              fontWeight: 700,
              letterSpacing: -2.4,
            }}
          >
            What Is a Sales Automation Platform?
          </div>
          <div style={{ color: "#78e8ad", fontSize: 34, fontWeight: 600 }}>
            And What It Actually Replaces
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#c6ded3",
            fontSize: 20,
          }}
        >
          <span>Outbound, explained</span>
          <span style={{ color: "#78e8ad", fontWeight: 700 }}>gnxsales.com</span>
        </div>
      </div>
    ),
    size,
  );
}
