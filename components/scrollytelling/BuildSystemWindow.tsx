import {
  BUILD_WINDOW_STEPS,
  type BuildWindowStep,
} from "@/lib/scrollytelling/interaction-timeline";
import styles from "./loop-journey.module.css";

const BUILD_WINDOW_CONTENT = {
  observe: {
    eyebrow: "FIELD SIGNAL",
    title: "OBSERVE",
    description: "Read the operating reality",
    trace: ["FIELD", "SIGNAL"],
  },
  structure: {
    eyebrow: "RELATION MAP",
    title: "STRUCTURE",
    description: "Clarify relationships and constraints",
    trace: ["SIGNAL", "RELATION"],
  },
  design: {
    eyebrow: "SYSTEM FRAME",
    title: "DESIGN",
    description: "Shape roles, data, and flow",
    trace: ["ROLE", "DATA", "FLOW"],
  },
  "ai-workflow": {
    eyebrow: "HUMAN + AI ROUTE",
    title: "AI WORKFLOW",
    description: "Connect judgment and assistance",
    trace: ["HUMAN", "AI", "HUMAN"],
  },
  automate: {
    eyebrow: "OPERATING SEQUENCE",
    title: "AUTOMATE",
    description: "Stabilize a repeatable operation",
    trace: ["TRIGGER", "ACTION", "CHECK"],
  },
  output: {
    eyebrow: "SYSTEM READY",
    title: "OUTPUT",
    description: "Release an operational structure",
    trace: ["READY", "HANDOFF"],
  },
} as const satisfies Record<
  BuildWindowStep,
  {
    eyebrow: string;
    title: string;
    description: string;
    trace: readonly string[];
  }
>;

function LensNode({ cx, cy, emphasis = false }: { cx: number; cy: number; emphasis?: boolean }) {
  return (
    <circle
      className={emphasis ? styles.buildLensNodeEmphasis : styles.buildLensNode}
      cx={cx}
      cy={cy}
      r={emphasis ? 3.2 : 2.1}
    />
  );
}

function BuildWindowLens({ step }: { step: BuildWindowStep }) {
  return (
    <svg
      className={styles.buildWindowLens}
      data-build-lens={step}
      viewBox="0 0 260 190"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path className={styles.buildLensDatum} d="M20 159.5H240M20.5 35V160" />
      <path
        className={styles.buildLensGrid}
        d="M20 66.5H240M20 97.5H240M20 128.5H240M64.5 35V160M108.5 35V160M152.5 35V160M196.5 35V160"
      />
      <text className={styles.buildLensMicro} x="20" y="23">
        FIELD LENS
      </text>

      {step === "observe" ? (
        <g className={styles.buildLensObserve}>
          <path className={styles.buildLensBracket} d="M156 50h15M156 50v15M215 112h-15M215 112V97" />
          <circle className={styles.buildLensSignalRing} cx="185" cy="80" r="13" />
          <LensNode cx={47} cy={119} />
          <LensNode cx={78} cy={75} />
          <LensNode cx={116} cy={137} />
          <LensNode cx={145} cy={92} />
          <LensNode cx={185} cy={80} emphasis />
          <LensNode cx={218} cy={127} />
          <LensNode cx={226} cy={52} />
        </g>
      ) : null}

      {step === "structure" ? (
        <g className={styles.buildLensStructure}>
          <path className={styles.buildLensConstraint} d="M45 58H215M45 96H215M45 134H215" />
          <path
            className={styles.buildLensRelation}
            d="M48 119L83 75L124 96L164 61L211 96M83 75V134M124 96V134M164 61V134"
          />
          <LensNode cx={48} cy={119} />
          <LensNode cx={83} cy={75} emphasis />
          <LensNode cx={83} cy={134} />
          <LensNode cx={124} cy={96} emphasis />
          <LensNode cx={124} cy={134} />
          <LensNode cx={164} cy={61} />
          <LensNode cx={164} cy={134} />
          <LensNode cx={211} cy={96} emphasis />
        </g>
      ) : null}

      {step === "design" ? (
        <g className={styles.buildLensDesign}>
          <path className={styles.buildLensConstruction} d="M42 52H219V144H42ZM55 66H205V130H55ZM93 66V130M166 66V130" />
          <path className={styles.buildLensRelation} d="M74 98H111M147 98H185M130 82V114" />
          <rect className={styles.buildLensModule} x="55" y="83" width="38" height="30" />
          <rect className={styles.buildLensModuleEmphasis} x="111" y="76" width="36" height="44" />
          <rect className={styles.buildLensModule} x="166" y="83" width="39" height="30" />
          <text className={styles.buildLensNodeLabel} x="74" y="101" textAnchor="middle">H</text>
          <text className={styles.buildLensNodeLabel} x="129" y="101" textAnchor="middle">AI</text>
          <text className={styles.buildLensNodeLabel} x="185" y="101" textAnchor="middle">D</text>
        </g>
      ) : null}

      {step === "ai-workflow" ? (
        <g className={styles.buildLensWorkflow}>
          <path className={styles.buildLensRouteGhost} d="M50 103L128 70L210 111" />
          <path className={styles.buildLensRoute} d="M50 103L128 70L210 111" />
          <circle className={styles.buildLensFlowDot} cx="50" cy="103" r="2.7" />
          <circle className={styles.buildLensRole} cx="50" cy="103" r="14" />
          <circle className={styles.buildLensRoleEmphasis} cx="128" cy="70" r="15" />
          <circle className={styles.buildLensRole} cx="210" cy="111" r="14" />
          <text className={styles.buildLensNodeLabel} x="50" y="107" textAnchor="middle">H</text>
          <text className={styles.buildLensNodeLabel} x="128" y="74" textAnchor="middle">AI</text>
          <text className={styles.buildLensNodeLabel} x="210" y="115" textAnchor="middle">H</text>
          <text className={styles.buildLensRoleCaption} x="50" y="130" textAnchor="middle">JUDGE</text>
          <text className={styles.buildLensRoleCaption} x="128" y="98" textAnchor="middle">ASSIST</text>
          <text className={styles.buildLensRoleCaption} x="210" y="138" textAnchor="middle">DECIDE</text>
        </g>
      ) : null}

      {step === "automate" ? (
        <g className={styles.buildLensAutomate}>
          <path className={styles.buildLensSequenceGhost} d="M66 55H194V132H66V55" />
          <path className={styles.buildLensSequence} d="M66 55H194V132H66V55" />
          <path className={styles.buildLensSequenceArrow} d="M185 126l9 6-9 6" />
          <LensNode cx={66} cy={55} emphasis />
          <LensNode cx={194} cy={55} />
          <LensNode cx={194} cy={132} emphasis />
          <LensNode cx={66} cy={132} />
          <path className={styles.buildLensCheck} d="M118 92l8 8 17-20" />
          <text className={styles.buildLensRoleCaption} x="82" y="48">TRIGGER</text>
          <text className={styles.buildLensRoleCaption} x="162" y="48">ACTION</text>
          <text className={styles.buildLensRoleCaption} x="102" y="148">CHECK</text>
        </g>
      ) : null}

      {step === "output" ? (
        <g className={styles.buildLensOutput}>
          <path className={styles.buildLensConstruction} d="M54 47H192V145H54ZM67 60H179V132H67" />
          <rect className={styles.buildLensOutputModule} x="81" y="70" width="84" height="52" />
          <path className={styles.buildLensOutputRows} d="M96 84H151M96 96H138M96 108H145" />
          <circle className={styles.buildLensOutputStatus} cx="151" cy="108" r="3" />
          <path className={styles.buildLensHandoff} d="M165 96H222M215 90l7 6-7 6" />
          <path className={styles.buildLensCheck} d="M112 95l8 8 19-22" />
          <text className={styles.buildLensRoleCaption} x="123" y="139" textAnchor="middle">SYSTEM READY</text>
        </g>
      ) : null}
    </svg>
  );
}

export function BuildSystemWindow() {
  return (
    <div className={styles.buildSystemWindow} aria-hidden="true">
      <div className={styles.buildWindowHeader}>
        <span>L∞P / SYSTEM WINDOW</span>
        <span>LOCAL PROGRESS</span>
      </div>

      <div className={styles.buildWindowViewport}>
        {BUILD_WINDOW_STEPS.map((step, index) => {
          const content = BUILD_WINDOW_CONTENT[step];

          return (
            <article
              key={step}
              className={styles.buildWindowStep}
              data-build-window-step={step}
            >
              <span className={styles.buildWindowIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.buildWindowCopy}>
                <p>{content.eyebrow}</p>
                <strong>{content.title}</strong>
                <small>{content.description}</small>
                <div className={styles.buildWindowTrace}>
                  {content.trace.map((item, traceIndex) => (
                    <span key={`${item}-${traceIndex}`}>{item}</span>
                  ))}
                </div>
              </div>
              <BuildWindowLens step={step} />
            </article>
          );
        })}
      </div>

      <div className={styles.buildWindowRail}>
        {BUILD_WINDOW_STEPS.map((step) => (
          <span key={step} data-build-window-marker={step} />
        ))}
      </div>
    </div>
  );
}
