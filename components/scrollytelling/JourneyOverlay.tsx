import type { SceneConfig } from "@/lib/scrollytelling/scene-config";
import {
  JOURNEY_SCENE_COPY,
  SCENE_COUNT,
  SCENES,
} from "@/lib/scrollytelling/scene-config";
import styles from "./loop-journey.module.css";

type JourneyOverlayProps = {
  currentScene: SceneConfig;
  onSceneSelect: (sceneIndex: number) => void;
};

export function JourneyOverlay({
  currentScene,
  onSceneSelect,
}: JourneyOverlayProps) {
  const copy = JOURNEY_SCENE_COPY[currentScene.id];

  return (
    <div className={styles.overlay}>
      <div
        key={currentScene.id}
        className={styles.sceneStory}
        data-story-scene={currentScene.id}
      >
        <p aria-label={copy.main.desktop.join("")}>
          <span className={styles.headingLinesDesktop} aria-hidden="true">
            {copy.main.desktop.map((line) => (
              <span className={styles.headingLine} key={line}>{line}</span>
            ))}
          </span>
          <span className={styles.headingLinesMobile} aria-hidden="true">
            {copy.main.mobile.map((line) => (
              <span className={styles.headingLine} key={line}>{line}</span>
            ))}
          </span>
        </p>
        <div>
          {copy.sub.map((paragraph) => (
            <span key={paragraph}>{paragraph}</span>
          ))}
        </div>
      </div>
      <div className={styles.sceneReadout} aria-live="off">
        <span>
          {String(currentScene.index + 1).padStart(2, "0")} / {String(SCENE_COUNT).padStart(2, "0")}
        </span>
        <p>{currentScene.label}</p>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressFill} />
      </div>

      <nav className={styles.sceneRail} aria-label="Journey scenes">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            type="button"
            className={styles.railButton}
            aria-current={scene.index === currentScene.index ? "step" : undefined}
            aria-label={`Go to ${scene.label} scene`}
            onClick={() => onSceneSelect(scene.index)}
          >
            <span className={styles.railDot} aria-hidden="true" />
            <span>{scene.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
