import { ImageResponse } from "next/og";

export const alt = "L∞P Innovate — 現場を、仕組みから変える。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#07111d",
          color: "#f7fbff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 84px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(127,204,232,.22), rgba(50,139,211,.04))",
            clipPath: "polygon(55% 0, 100% 0, 100% 100%, 18% 100%)",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            color: "#b8e3f2",
            display: "flex",
            fontSize: 30,
            letterSpacing: "0.08em",
          }}
        >
          ∞&nbsp;&nbsp;L∞P Innovate
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 70, letterSpacing: "-0.04em" }}>
            FIELD TO SYSTEM
          </div>
          <div style={{ color: "#b8e3f2", display: "flex", fontSize: 31 }}>
            AI / AUTOMATION / WORKFLOW APPLICATIONS
          </div>
        </div>
      </div>
    ),
    size,
  );
}
