import type { JourneyOverlayMode } from "@/lib/scrollytelling/scene-config";
import styles from "./loop-journey.module.css";

type JourneySceneGraphicProps = {
  mode: JourneyOverlayMode;
};

const ORDER_BANDS = [0, 1, 2, 3, 4] as const;
const DESIGN_FRAMES = [0, 1, 2] as const;
const BUILD_COLUMNS = [0, 1, 2, 3, 4, 5] as const;
const ADOPT_NODES = [0, 1, 2, 3, 4, 5, 6] as const;

function FieldGraphic() {
  return (
    <div className={`${styles.sceneGraphic} ${styles.fieldGraphic}`}>
      <span className={styles.fieldHorizon} />
      <span className={styles.fieldScan} />
      <span className={styles.fieldBracket} />
      <span className={styles.fieldPointA} />
      <span className={styles.fieldPointB} />
      <span className={styles.fieldPointC} />
    </div>
  );
}

function OrderGraphic() {
  return (
    <div className={`${styles.sceneGraphic} ${styles.orderGraphic}`}>
      <span className={styles.orderAxis} />
      <div className={styles.orderBands}>
        {ORDER_BANDS.map((band) => (
          <span key={band} />
        ))}
      </div>
    </div>
  );
}

function DesignGraphic() {
  return (
    <div className={`${styles.sceneGraphic} ${styles.designGraphic}`}>
      <span className={styles.designAxisX} />
      <span className={styles.designAxisY} />
      <div className={styles.designFrames}>
        {DESIGN_FRAMES.map((frame) => (
          <span key={frame} />
        ))}
      </div>
    </div>
  );
}

function BuildGraphic() {
  return (
    <div className={`${styles.sceneGraphic} ${styles.buildGraphic}`}>
      <div className={styles.buildColumns}>
        {BUILD_COLUMNS.map((column) => (
          <span key={column} />
        ))}
      </div>
      <span className={styles.buildDatum} />
    </div>
  );
}

function AdoptGraphic() {
  return (
    <div className={`${styles.sceneGraphic} ${styles.adoptGraphic}`}>
      <span className={styles.adoptFlow} />
      <div className={styles.adoptNodes}>
        {ADOPT_NODES.map((node) => (
          <span key={node} />
        ))}
      </div>
    </div>
  );
}

function ReturnGraphic() {
  return <div className={`${styles.sceneGraphic} ${styles.returnGraphic}`} />;
}

export function JourneySceneGraphic({ mode }: JourneySceneGraphicProps) {
  switch (mode) {
    case "field":
      return <FieldGraphic />;
    case "order":
      return <OrderGraphic />;
    case "design":
      return <DesignGraphic />;
    case "build":
      return <BuildGraphic />;
    case "adopt":
      return <AdoptGraphic />;
    case "return":
      return <ReturnGraphic />;
  }
}
