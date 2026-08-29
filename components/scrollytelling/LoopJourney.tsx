"use client";

import type { CSSProperties } from "react";
import {
  JOURNEY_TRACK_HEIGHT_SVH,
  SCENES,
  getSceneByIndex,
} from "@/lib/scrollytelling/scene-config";
import { DotDitherTransition } from "./DotDitherTransition";
import { JourneyDebug } from "./JourneyDebug";
import { JourneyOverlay } from "./JourneyOverlay";
import { JourneyStage } from "./JourneyStage";
import { useJourneyEngine } from "./useJourneyEngine";
import styles from "./loop-journey.module.css";

export function LoopJourney() {
  const {
    sectionRef,
    stickyRef,
    timeline,
    activeSceneIndex,
    viewportTier,
    metrics,
    jumpToScene,
  } = useJourneyEngine();
  const currentScene = getSceneByIndex(timeline.sceneIndex);
  const nextScene = getSceneByIndex(timeline.nextSceneIndex);
  const activeScene = getSceneByIndex(activeSceneIndex);
  const journeyStyle = {
    height: `${JOURNEY_TRACK_HEIGHT_SVH}svh`,
  } satisfies CSSProperties;
  const assetVariant = viewportTier === "mobile" ? "mobile" : "desktop";

  return (
    <section
      ref={sectionRef}
      className={styles.journey}
      style={journeyStyle}
      aria-labelledby="loop-journey-title"
    >
      <h2 id="loop-journey-title" className={styles.visuallyHidden}>
        L∞P six-scene still journey
      </h2>
      <ol className={styles.visuallyHidden}>
        {SCENES.map((scene) => (
          <li key={scene.id}>
            {scene.label}
            {scene.id === "build" ? (
              <span>
                ：現場を観測し、関係を整理し、構造を設計し、人とAIの役割を流れにし、
                反復可能な運用へ整え、使える仕組みとして出力する6段階。
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div ref={stickyRef} className={styles.sticky}>
        <JourneyStage
          currentScene={currentScene}
          nextScene={nextScene}
          showDestination={
            timeline.nextSceneIndex !== timeline.sceneIndex
          }
          assetVariant={assetVariant}
        />
        <DotDitherTransition />
        <JourneyOverlay
          currentScene={activeScene}
          onSceneSelect={jumpToScene}
        />
        <JourneyDebug metrics={metrics} />
      </div>
    </section>
  );
}
