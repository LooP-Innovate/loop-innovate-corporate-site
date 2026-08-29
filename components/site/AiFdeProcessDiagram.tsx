import { useId } from "react";
import styles from "./site.module.css";

type StageKind = "field" | "order" | "design" | "build" | "adopt" | "return";

const STAGES = [
  { number: "01", name: "FIELD", kind: "field", desktopLines: ["現場を知る"], mobileLines: ["現場を知る"] },
  { number: "02", name: "ORDER", kind: "order", desktopLines: ["課題と業務を", "整理する"], mobileLines: ["課題と業務を整理する"] },
  { number: "03", name: "DESIGN", kind: "design", desktopLines: ["改善の仕組みを", "設計する"], mobileLines: ["改善の仕組みを設計する"] },
  { number: "04", name: "BUILD", kind: "build", desktopLines: ["AI・自動化を", "実装する"], mobileLines: ["AI・自動化を実装する"] },
  { number: "05", name: "ADOPT", kind: "adopt", desktopLines: ["現場に導入し", "定着させる"], mobileLines: ["現場に導入し定着させる"] },
  { number: "06", name: "RETURN", kind: "return", desktopLines: ["成果を検証し、", "次の改善に", "つなげる"], mobileLines: ["成果を検証し、", "次の改善につなげる"] },
] as const;

function StageGlyph({ kind, gradientId }: { kind: StageKind; gradientId: string }) {
  switch (kind) {
    case "field":
      return (
        <g aria-hidden="true">
          <circle r="24" fill="none" stroke="#328bd3" strokeWidth="1.2" strokeDasharray="2 6" />
          <circle r="6" fill="#328bd3" />
          <circle cx="-20" cy="12" r="3" fill="#7fcce8" />
          <circle cx="20" cy="-12" r="3" fill="#7fcce8" />
          <circle cx="18" cy="20" r="2" fill="#328bd3" />
          <path d="M-20 12 0 0 20-12M0 0 18 20" fill="none" stroke="#7fcce8" strokeWidth="1" />
        </g>
      );
    case "order":
      return (
        <g aria-hidden="true" fill="none" strokeLinecap="round">
          <path d="M-28-16H28M-28 0H28M-28 16H28" stroke="#c0cbd3" strokeWidth="1.2" />
          <circle cx="-12" cy="-16" r="4" fill="#328bd3" stroke="#328bd3" />
          <circle cx="12" r="4" fill="#7fcce8" stroke="#7fcce8" />
          <circle cx="-4" cy="16" r="4" fill="#328bd3" stroke="#328bd3" />
        </g>
      );
    case "design":
      return (
        <g aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-28" y="-24" width="56" height="48" rx="2" stroke="#328bd3" strokeWidth="1.2" />
          <rect x="-16" y="-12" width="32" height="24" rx="1" stroke="#7fcce8" strokeWidth="1.2" />
          <path d="M-28-8H-16M16 8H28M0-24V-12M0 12V24" stroke="#c0cbd3" strokeWidth="1" />
          <circle r="3" fill="#328bd3" stroke="#328bd3" />
        </g>
      );
    case "build":
      return (
        <g aria-hidden="true">
          <rect x="-26" y="-22" width="16" height="16" rx="2" fill="#328bd3" fillOpacity=".18" stroke="#328bd3" />
          <rect x="-8" y="-22" width="34" height="16" rx="2" fill="#7fcce8" fillOpacity=".18" stroke="#7fcce8" />
          <rect x="-26" y="-4" width="34" height="26" rx="2" fill="#7fcce8" fillOpacity=".12" stroke="#7fcce8" />
          <rect x="10" y="-4" width="16" height="26" rx="2" fill="#328bd3" fillOpacity=".18" stroke="#328bd3" />
          <circle cx="-18" cy="-14" r="2" fill="#328bd3" />
          <circle cx="18" cy="8" r="2" fill="#328bd3" />
        </g>
      );
    case "adopt":
      return (
        <g aria-hidden="true" fill="none" strokeLinecap="round">
          <circle cy="-10" r="8" fill="#328bd3" fillOpacity=".16" stroke="#328bd3" strokeWidth="1.2" />
          <path d="M-15 20C-13 5 13 5 15 20" stroke="#328bd3" strokeWidth="1.2" />
          <circle cx="-26" cy="-22" r="3" fill="#7fcce8" stroke="#7fcce8" />
          <circle cx="26" cy="-22" r="3" fill="#7fcce8" stroke="#7fcce8" />
          <circle cy="28" r="3" fill="#7fcce8" stroke="#7fcce8" />
          <path d="M-24-19-8-7M24-19 8-7M0 20V25" stroke="#c0cbd3" strokeWidth="1" />
        </g>
      );
    case "return":
      return (
        <g aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M-32 0C-24-22-7-22 0 0S24 22 32 0C24-22 7-22 0 0S-24 22-32 0"
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
          />
          <path d="M-3-7C0-3 1 3 4 7" stroke="#f7fbff" strokeWidth="2.5" />
        </g>
      );
  }
}

export function AiFdeProcessDiagram() {
  const instanceId = useId().replace(/:/g, "");
  const desktopNeutralArrow = `${instanceId}-desktop-neutral-arrow`;
  const desktopAccentArrow = `${instanceId}-desktop-accent-arrow`;
  const desktopGradient = `${instanceId}-desktop-return-gradient`;
  const mobileNeutralArrow = `${instanceId}-mobile-neutral-arrow`;
  const mobileAccentArrow = `${instanceId}-mobile-accent-arrow`;
  const mobileGradient = `${instanceId}-mobile-return-gradient`;
  const desktopTitle = `${instanceId}-desktop-title`;
  const desktopDesc = `${instanceId}-desktop-desc`;
  const mobileTitle = `${instanceId}-mobile-title`;
  const mobileDesc = `${instanceId}-mobile-desc`;
  const desktopX = [96, 296, 496, 696, 896, 1096] as const;
  const mobileY = [88, 224, 360, 496, 632, 768] as const;

  return (
    <figure className={styles.aiFdeProcessFigure}>
      <svg
        className={`${styles.aiFdeProcessSvg} ${styles.aiFdeProcessDesktop}`}
        viewBox="0 0 1200 448"
        role="img"
        aria-labelledby={`${desktopTitle} ${desktopDesc}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={desktopTitle}>AI-FDE 6段階プロセス</title>
        <desc id={desktopDesc}>
          FIELDで現場を知り、ORDERで課題と業務を整理し、DESIGNで改善の仕組みを設計し、BUILDでAI・自動化を実装し、ADOPTで現場へ導入・定着させ、RETURNで成果を検証して次の改善をFIELDへ戻す循環型の支援プロセス。
        </desc>
        <defs>
          <marker id={desktopNeutralArrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 8 4 0 8Z" fill="#69737b" />
          </marker>
          <marker id={desktopAccentArrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 8 4 0 8Z" fill="#328bd3" />
          </marker>
          <linearGradient id={desktopGradient} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#328bd3" />
            <stop offset="100%" stopColor="#7fcce8" />
          </linearGradient>
        </defs>

        <g aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {desktopX.slice(0, -1).map((x, index) => (
            <path
              key={x}
              d={`M${x + 60} 176H${desktopX[index + 1] - 60}`}
              stroke={index === 2 || index === 3 ? "#328bd3" : "#69737b"}
              strokeWidth="1.2"
              markerEnd={`url(#${index === 2 || index === 3 ? desktopAccentArrow : desktopNeutralArrow})`}
            />
          ))}
          <path
            d="M1156 176H1176V360Q1176 372 1164 372H108Q96 372 96 360V244"
            stroke="#69737b"
            strokeWidth="1.2"
            strokeDasharray="7 8"
            markerEnd={`url(#${desktopNeutralArrow})`}
          />
        </g>

        <g aria-hidden="true">
          <rect x="520" y="356" width="152" height="32" rx="16" fill="#f7f7f5" />
          <text x="596" y="376" className={styles.aiFdeFeedbackLabel} textAnchor="middle">検証結果を次の現場理解へ</text>
        </g>

        {STAGES.map((stage, index) => {
          const x = desktopX[index];
          const emphasized = stage.kind === "build" || stage.kind === "return";
          return (
            <g key={stage.name}>
              <text x={x} y="56" className={styles.aiFdeStageEnglish} textAnchor="middle">{stage.name}</text>
              <rect
                x={x - 60}
                y="116"
                width="120"
                height="120"
                rx="8"
                fill={emphasized ? "#328bd3" : "#f7f7f5"}
                fillOpacity={emphasized ? ".08" : "1"}
                stroke={emphasized ? "#328bd3" : "#cbd2d7"}
                strokeWidth={emphasized ? "1.2" : "1"}
              />
              <text x={x - 44} y="140" className={styles.aiFdeStageNumber}>{stage.number}</text>
              <g transform={`translate(${x} 176)`}>
                <StageGlyph kind={stage.kind} gradientId={desktopGradient} />
              </g>
              <text x={x} y="276" className={styles.aiFdeStageTitle} textAnchor="middle">
                {stage.desktopLines.map((line, lineIndex) => (
                  <tspan key={line} x={x} y={276 + lineIndex * 24}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <svg
        className={`${styles.aiFdeProcessSvg} ${styles.aiFdeProcessMobile}`}
        viewBox="0 0 360 924"
        role="img"
        aria-labelledby={`${mobileTitle} ${mobileDesc}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={mobileTitle}>AI-FDE 6段階プロセス</title>
        <desc id={mobileDesc}>
          FIELDからRETURNまでを上から順にたどり、RETURNの検証結果を次のFIELDへ戻す、スマートフォン向け縦型プロセス図。
        </desc>
        <defs>
          <marker id={mobileNeutralArrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 8 4 0 8Z" fill="#69737b" />
          </marker>
          <marker id={mobileAccentArrow} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 8 4 0 8Z" fill="#328bd3" />
          </marker>
          <linearGradient id={mobileGradient} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#328bd3" />
            <stop offset="100%" stopColor="#7fcce8" />
          </linearGradient>
        </defs>

        <g aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {mobileY.slice(0, -1).map((y, index) => (
            <path
              key={y}
              d={`M72 ${y + 52}V${mobileY[index + 1] - 52}`}
              stroke={index === 2 || index === 3 ? "#328bd3" : "#69737b"}
              strokeWidth="1.2"
              markerEnd={`url(#${index === 2 || index === 3 ? mobileAccentArrow : mobileNeutralArrow})`}
            />
          ))}
          <path
            d="M72 820V880Q72 892 84 892H324Q336 892 336 880V28Q336 16 324 16H84Q72 16 72 28V36"
            stroke="#69737b"
            strokeWidth="1.2"
            strokeDasharray="7 8"
            markerEnd={`url(#${mobileNeutralArrow})`}
          />
        </g>

        {STAGES.map((stage, index) => {
          const y = mobileY[index];
          const emphasized = stage.kind === "build" || stage.kind === "return";
          return (
            <g key={stage.name}>
              <rect
                x="24"
                y={y - 52}
                width="296"
                height="104"
                rx="8"
                fill={emphasized ? "#328bd3" : "#f7f7f5"}
                fillOpacity={emphasized ? ".08" : "1"}
                stroke={emphasized ? "#328bd3" : "#cbd2d7"}
                strokeWidth={emphasized ? "1.2" : "1"}
              />
              <text x="40" y={y - 28} className={styles.aiFdeStageNumber}>{stage.number}</text>
              <g transform={`translate(72 ${y + 4}) scale(.78)`}>
                <StageGlyph kind={stage.kind} gradientId={mobileGradient} />
              </g>
              <text x="128" y={y - 12} className={styles.aiFdeStageEnglish}>{stage.name}</text>
              <text x="128" y={y + 20} className={styles.aiFdeStageTitle}>
                {stage.mobileLines.map((line, lineIndex) => (
                  <tspan key={line} x="128" y={y + 20 + lineIndex * 24}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}

        <g aria-hidden="true">
          <rect x="120" y="876" width="144" height="28" rx="14" fill="#f7f7f5" />
          <text x="192" y="894" className={styles.aiFdeFeedbackLabel} textAnchor="middle">検証結果を次の現場理解へ</text>
        </g>
      </svg>
    </figure>
  );
}
