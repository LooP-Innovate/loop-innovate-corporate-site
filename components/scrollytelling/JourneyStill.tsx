import Image from "next/image";
import type { CSSProperties } from "react";
import {
  type JourneyAssetVariant,
  type SceneConfig,
} from "@/lib/scrollytelling/scene-config";
import {
  resolveJourneyFocalPoint,
  resolveJourneyStill,
} from "@/lib/scrollytelling/still-resolver";
import { BuildSystemWindow } from "./BuildSystemWindow";
import { JourneyLayerStack } from "./JourneyLayerStack";
import { JourneySceneGraphic } from "./JourneySceneGraphic";
import styles from "./loop-journey.module.css";

export type JourneyStillRole = "current" | "next";

type JourneyStillProps = {
  scene: SceneConfig;
  role: JourneyStillRole;
  assetVariant: JourneyAssetVariant;
};

export function JourneyStill({
  scene,
  role,
  assetVariant,
}: JourneyStillProps) {
  const resolvedStill = resolveJourneyStill(scene, {
    variant: assetVariant,
  });
  const preload = role === "current" && scene.index === 0;
  const style = {
    "--scene-focal-desktop": resolveJourneyFocalPoint(scene, "desktop"),
    "--scene-focal-tablet": resolveJourneyFocalPoint(scene, "tablet"),
    "--scene-focal-mobile": resolveJourneyFocalPoint(scene, "mobile"),
  } as CSSProperties;

  return (
    <div
      className={`${styles.visualLayer} ${
        role === "current" ? styles.currentLayer : styles.nextLayer
      }`}
      data-visual-scene={scene.id}
      data-overlay-mode={scene.overlayMode}
      data-still-kind={resolvedStill.kind}
      data-asset-status={resolvedStill.status}
      data-source-variant={resolvedStill.sourceVariant ?? "none"}
      style={style}
    >
      <div className={styles.stillFrame}>
        {resolvedStill.src ? (
          <Image
            className={styles.sceneStill}
            src={resolvedStill.src}
            alt=""
            fill
            sizes={scene.id === "return" ? "1672px" : "100vw"}
            preload={preload}
            loading={preload ? undefined : "eager"}
            fetchPriority={preload ? "high" : "auto"}
            draggable={false}
            quality={scene.id === "return" ? 90 : undefined}
          />
        ) : (
          <div
            className={styles.stillFallback}
            data-scene={scene.id}
            aria-hidden="true"
          >
            <span>{scene.label}</span>
          </div>
        )}
        <JourneyLayerStack sceneId={scene.id} />
      </div>

      <div className={styles.stillAtmosphere} aria-hidden="true" />
      <JourneySceneGraphic mode={scene.overlayMode} />
      {scene.id === "build" ? <BuildSystemWindow /> : null}
    </div>
  );
}
