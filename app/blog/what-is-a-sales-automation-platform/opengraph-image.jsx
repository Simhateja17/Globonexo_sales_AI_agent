import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const FONT_FILES = [
  ["Manrope", 500, "Manrope-Medium.ttf"],
  ["Manrope", 700, "Manrope-Bold.ttf"],
  ["Manrope", 800, "Manrope-ExtraBold.ttf"],
  ["Space Grotesk", 600, "SpaceGrotesk-SemiBold.ttf"],
  ["Space Grotesk", 700, "SpaceGrotesk-Bold.ttf"],
];

async function loadFonts() {
  return Promise.all(
    FONT_FILES.map(async ([name, weight, file]) => ({
      name,
      weight,
      style: "normal",
      data: await readFile(join(process.cwd(), "assets", "fonts", file)),
    })),
  );
}

export const alt =
  "What Is a Sales Automation Platform? And What It Actually Replaces — GNX Sales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Chip({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "11px 20px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.07)",
        color: "#eafaf2",
        fontSize: 17,
        fontWeight: 700,
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8df27a"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {children}
    </div>
  );
}

export default async function OpenGraphImage() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          backgroundImage: [
            "radial-gradient(900px 760px at 12% 0%, rgba(0,194,122,0.34) 0%, rgba(0,194,122,0.12) 45%, rgba(4,40,26,0) 78%)",
            "radial-gradient(880px 760px at 96% 100%, rgba(21,196,192,0.32) 0%, rgba(21,196,192,0.10) 48%, rgba(4,40,26,0) 80%)",
            "radial-gradient(620px 520px at 62% 2%, rgba(141,242,122,0.14) 0%, rgba(141,242,122,0) 70%)",
            "linear-gradient(135deg, #04281a 0%, #06311f 45%, #075a3e 100%)",
          ].join(", "),
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="46" height="46" viewBox="0 0 74 74">
              <g fill="#00e089">
                <path d="M36 36 8 12c-2-2 0-5 3-4l31 12c2 1 2 4 0 5z" />
                <path d="M36 36 22 66c-1 2-4 2-5-1l-6-30c0-2 2-4 4-3z" />
                <path d="M36 36 66 26c2-1 4 2 3 4L48 60c-1 2-4 2-5 0z" />
              </g>
            </svg>
            <span
              style={{
                fontFamily: "Space Grotesk",
                fontSize: 29,
                fontWeight: 600,
                letterSpacing: -0.6,
                color: "#ffffff",
              }}
            >
              GNX Sales
            </span>
            <div
              style={{
                display: "flex",
                marginLeft: 14,
                paddingLeft: 16,
                borderLeft: "1px solid rgba(255,255,255,0.2)",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(198,244,222,0.72)",
              }}
            >
              BLOG
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: 900,
                fontFamily: "Space Grotesk",
                fontSize: 76,
                lineHeight: 1.04,
                fontWeight: 600,
                letterSpacing: -3.4,
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex" }}>What is a sales</div>
              <div style={{ display: "flex", gap: 14 }}>
                <span>automation</span>
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, #8df27a, #15c4c0)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  platform?
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                maxWidth: 860,
                fontSize: 25,
                lineHeight: 1.55,
                fontWeight: 500,
                color: "rgba(214,246,231,0.86)",
              }}
            >
              And what it actually replaces. What it runs, what it is not,
              what your team should still control, and the questions to ask a
              vendor.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Chip>Outbound, explained</Chip>
            <Chip>9 min read</Chip>
            <div
              style={{
                marginLeft: "auto",
                fontSize: 19,
                fontWeight: 800,
                color: "#8df27a",
              }}
            >
              gnxsales.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
