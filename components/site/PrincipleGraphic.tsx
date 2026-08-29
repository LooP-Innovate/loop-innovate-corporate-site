import styles from "./site.module.css";

type PrincipleGraphicProps = {
  kind: "human" | "judgment" | "operation";
};

function HumanGraphic() {
  return (
    <>
      <path pathLength="1" d="M 0 64 H 48" />
      <path pathLength="1" d="M 48 64 C 64 28, 124 20, 172 52" />
      <path pathLength="1" d="M 52 84 C 84 108, 148 100, 180 64" />
      <ellipse pathLength="1" cx="112" cy="64" rx="42" ry="20" />
      <circle cx="112" cy="64" r="4" />
      <path pathLength="1" d="M 116 64 H 320" />
    </>
  );
}

function JudgmentGraphic() {
  return (
    <>
      <path pathLength="1" d="M 0 64 H 72" />
      <path pathLength="1" d="M 72 64 H 112 Q 120 64 120 56 V 32 H 168 Q 176 32 176 40 V 56 Q 176 64 184 64 H 240" />
      <path pathLength="1" d="M 72 64 H 240" />
      <path pathLength="1" d="M 72 64 H 112 Q 120 64 120 72 V 96 H 168 Q 176 96 176 88 V 72 Q 176 64 184 64 H 240" />
      <circle cx="240" cy="64" r="5" />
      <path pathLength="1" d="M 245 64 H 320" />
    </>
  );
}

function OperationGraphic() {
  return (
    <>
      <path pathLength="1" d="M 0 64 H 56" />
      <path pathLength="1" d="M 72 64 C 76 30, 112 16, 156 20 C 208 24, 240 48, 232 76 C 224 104, 176 112, 132 100 C 100 92, 80 76, 80 60" />
      <circle cx="92" cy="38" r="3.5" />
      <circle cx="164" cy="20" r="3.5" />
      <circle cx="232" cy="64" r="3.5" />
      <circle cx="156" cy="104" r="3.5" />
      <path pathLength="1" d="M 80 60 L 72 64 L 80 68" />
    </>
  );
}

function GraphicPaths({ kind }: PrincipleGraphicProps) {
  if (kind === "human") return <HumanGraphic />;
  if (kind === "judgment") return <JudgmentGraphic />;
  return <OperationGraphic />;
}

export function PrincipleGraphic({ kind }: PrincipleGraphicProps) {
  return (
    <svg
      className={styles.principleGraphic}
      viewBox="0 0 320 128"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.principleGraphicBase}>
        <GraphicPaths kind={kind} />
      </g>
      <g className={styles.principleGraphicActive}>
        <GraphicPaths kind={kind} />
      </g>
    </svg>
  );
}
