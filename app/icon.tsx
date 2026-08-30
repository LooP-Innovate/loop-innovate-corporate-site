import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#07111d",
          color: "#b8e3f2",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 46,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        ∞
      </div>
    ),
    size,
  );
}
