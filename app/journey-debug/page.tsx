import { notFound } from "next/navigation";
import { JourneyAssetDashboard } from "@/components/scrollytelling/JourneyAssetDashboard";

const debugEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_JOURNEY_DEBUG === "true";

export const metadata = {
  title: "Journey Asset Dashboard",
  robots: { index: false, follow: false },
};

export default function JourneyDebugPage() {
  if (!debugEnabled) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100svh",
        padding: "clamp(6rem, 10vw, 9rem) var(--gutter)",
        background: "var(--surface-dark)",
      }}
    >
      <div
        style={{
          width: "min(100%, var(--container-wide))",
          marginInline: "auto",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "var(--brand-cyan)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-size-xs)",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          DEVELOPMENT DIAGNOSTICS
        </p>
        <h1
          style={{
            maxWidth: "14ch",
            margin: "var(--space-sm) 0 var(--space-xl)",
            fontSize: "var(--font-size-xl)",
            lineHeight: "var(--leading-tight)",
          }}
        >
          Journey Asset Dashboard
        </h1>
        <JourneyAssetDashboard />
      </div>
    </main>
  );
}
