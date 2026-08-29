import { SCENES, getSceneByIndex } from "@/lib/scrollytelling/scene-config";
import { resolveJourneyStill } from "@/lib/scrollytelling/still-resolver";
import {
  JOURNEY_DEBUG_ENABLED,
  type JourneyRuntimeMetrics,
} from "./useJourneyEngine";
import styles from "./loop-journey.module.css";

type JourneyDebugProps = {
  enabled?: boolean;
  metrics: JourneyRuntimeMetrics;
};

export function JourneyDebug({
  enabled = JOURNEY_DEBUG_ENABLED,
  metrics,
}: JourneyDebugProps) {
  if (!enabled) {
    return null;
  }

  const assetVariant = metrics.viewportTier === "mobile" ? "mobile" : "desktop";
  const currentScene = getSceneByIndex(metrics.sceneIndex);
  const nextScene = SCENES.find((scene) => scene.id === metrics.nextSceneId) ?? currentScene;
  const activeStill = resolveJourneyStill(currentScene, {
    variant: assetVariant,
  });
  const nextStill = resolveJourneyStill(nextScene, {
    variant: assetVariant,
  });

  return (
    <details className={styles.debugPanel} aria-label="Journey diagnostics">
      <summary className={styles.debugTitle}>
        <span>L∞P JOURNEY DEBUG</span>
        <span className={styles.debugState} aria-hidden="true" />
      </summary>
      <div className={styles.debugBody}>
        <dl className={styles.debugList}>
          <div>
            <dt>Journey Progress</dt>
            <dd>{(metrics.journeyProgress * 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>Scene Index</dt>
            <dd>{metrics.sceneIndex}</dd>
          </div>
          <div>
            <dt>Scene ID</dt>
            <dd>{metrics.sceneId.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Next Scene</dt>
            <dd>{metrics.nextSceneId.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Local Progress</dt>
            <dd>{(metrics.segmentProgress * 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>Blend Progress</dt>
            <dd>{(metrics.blendProgress * 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>Render Mode</dt>
            <dd>{metrics.renderMode.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Transition</dt>
            <dd>{metrics.transitionState.toUpperCase()}</dd>
          </div>
          <div>
            <dt>BUILD Window</dt>
            <dd>{metrics.buildWindowStep.toUpperCase()}</dd>
          </div>
          <div>
            <dt>RETURN Phase</dt>
            <dd>{metrics.returnPhase.toUpperCase()}</dd>
          </div>
          <div>
            <dt>RETURN Progress</dt>
            <dd>{(metrics.returnProgress * 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>RETURN Exit</dt>
            <dd>{(metrics.returnExitProgress * 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>RETURN Exit Phase</dt>
            <dd>{metrics.returnExitPhase.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Overlay Mode</dt>
            <dd>{currentScene.overlayMode.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Asset Status</dt>
            <dd>{activeStill.status.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Still Kind</dt>
            <dd>{activeStill.kind.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Active Still</dt>
            <dd title={activeStill.src ?? "none"}>{activeStill.src ?? "none"}</dd>
          </div>
          <div>
            <dt>Next Still</dt>
            <dd title={nextStill.src ?? "none"}>{nextStill.src ?? "none"}</dd>
          </div>
          <div>
            <dt>Source Variant</dt>
            <dd>{activeStill.sourceVariant?.toUpperCase() ?? "NONE"}</dd>
          </div>
          <div>
            <dt>Viewport Tier</dt>
            <dd>{metrics.viewportTier.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Scroll Direction</dt>
            <dd>{metrics.scrollDirection}</dd>
          </div>
          <div>
            <dt>Reduced Motion</dt>
            <dd>{String(metrics.reducedMotion)}</dd>
          </div>
          <div>
            <dt>Journey In View</dt>
            <dd>{String(metrics.journeyInView)}</dd>
          </div>
        </dl>

        <div className={styles.assetMatrix} aria-label="Journey still matrix">
          {SCENES.map((scene) => {
            const still = resolveJourneyStill(scene, { variant: assetVariant });
            const status =
              still.kind === "placeholder"
                ? "MISSING"
                : `${still.kind.toUpperCase()} READY`;

            return (
              <div key={scene.id}>
                <span>{scene.label}</span>
                <strong data-status={still.status}>{status}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}
