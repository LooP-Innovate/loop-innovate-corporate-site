import {
  type JourneyAssetVariant,
  type SceneConfig,
} from "@/lib/scrollytelling/scene-config";
import { JourneyStill, type JourneyStillRole } from "./JourneyStill";
import styles from "./loop-journey.module.css";

type JourneyStageProps = {
  currentScene: SceneConfig;
  nextScene: SceneConfig;
  showDestination: boolean;
  assetVariant: JourneyAssetVariant;
};

export function JourneyStage({
  currentScene,
  nextScene,
  showDestination,
  assetVariant,
}: JourneyStageProps) {
  const layers: Array<{ scene: SceneConfig; role: JourneyStillRole }> = [
    { scene: currentScene, role: "current" },
  ];

  if (showDestination) {
    layers.push({ scene: nextScene, role: "next" });
  }

  return (
    <div className={styles.stage} aria-hidden="true">
      {layers.map(({ scene, role }) => (
        <JourneyStill
          key={scene.id}
          scene={scene}
          role={role}
          assetVariant={assetVariant}
        />
      ))}
      <div className={styles.shade} />
    </div>
  );
}
