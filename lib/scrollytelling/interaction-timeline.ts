import type { SceneId } from "#scrollytelling/journey-types";

const PROGRESS_EPSILON = 1e-12;

export const BUILD_WINDOW_STEPS = [
  "observe",
  "structure",
  "design",
  "ai-workflow",
  "automate",
  "output",
] as const;

export type BuildWindowStep = (typeof BUILD_WINDOW_STEPS)[number];

export type OrderPhase = "reality" | "organizing" | "stable";
export type DesignPhase = "grid" | "structure" | "volume";
export type ReturnPhase = "base" | "breathing" | "dawn" | "complete";
export type ReturnExitPhase =
  | "hold"
  | "particles"
  | "erosion"
  | "wash"
  | "white";

export const BUILD_STEP_BOUNDARIES = [0, 0.16, 0.32, 0.48, 0.66, 0.82, 1] as const;
export const RETURN_PHASE_BOUNDARIES = [0, 0.25, 0.55, 0.8, 1] as const;
export const RETURN_FORMATION_START = 0.75;
export const RETURN_FORMATION_END = 1;
export const RETURN_ENDPOINT_HOLD_END = 0.5;

type TimelineSlice = {
  sceneIndex: number;
  nextSceneIndex: number;
  segmentProgress: number;
};

export type JourneyInteractionState = {
  orderPhase: OrderPhase;
  designPhase: DesignPhase;
  buildStep: BuildWindowStep;
  returnPhase: ReturnPhase;
  returnProgress: number;
  returnBaseOpacity: number;
  returnStarBreath: number;
  returnHorizonGlow: number;
  returnSkyLift: number;
  returnGridFlow: number;
  returnBlueParticles: number;
  returnExitPhase: ReturnExitPhase;
  returnExitProgress: number;
  returnExitParticles: number;
  returnExitErosion: number;
  returnExitWash: number;
  returnExitWhite: number;
  returnExitEdge: number;
  adoptLight: number;
};

export type ReturnExitVisualState = Pick<
  JourneyInteractionState,
  | "returnExitParticles"
  | "returnExitErosion"
  | "returnExitWash"
  | "returnExitWhite"
  | "returnExitEdge"
>;

export function clampUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function normalizeProgress(
  progress: number,
  start: number,
  end: number,
): number {
  if (!(end > start)) {
    throw new RangeError("Progress range end must be greater than start.");
  }

  return clampUnit((clampUnit(progress) - start) / (end - start));
}

function windowProgress(
  progress: number,
  enterStart: number,
  enterEnd: number,
  exitStart: number,
  exitEnd: number,
): number {
  const enter = normalizeProgress(progress, enterStart, enterEnd);
  const exit = 1 - normalizeProgress(progress, exitStart, exitEnd);

  return Math.min(enter, exit);
}

export function getOrderPhase(localProgress: number): OrderPhase {
  const progress = clampUnit(localProgress);

  if (progress < 0.3) {
    return "reality";
  }

  return progress < 0.7 ? "organizing" : "stable";
}

export function getDesignPhase(localProgress: number): DesignPhase {
  const progress = clampUnit(localProgress);

  if (progress < 0.34) {
    return "grid";
  }

  return progress < 0.7 ? "structure" : "volume";
}

export function getBuildWindowStep(
  localProgress: number,
  reducedMotion = false,
): BuildWindowStep {
  if (reducedMotion) {
    return "output";
  }

  const progress = clampUnit(localProgress);
  const stepIndex = BUILD_STEP_BOUNDARIES.findIndex(
    (boundary, index) => index > 0 && progress < boundary,
  );
  const resolvedIndex = stepIndex === -1 ? BUILD_WINDOW_STEPS.length - 1 : stepIndex - 1;

  return BUILD_WINDOW_STEPS[resolvedIndex];
}

/**
 * RETURN is the sixth anchor, not a sixth scroll interval. ADOPT remains a
 * people-first scene through 55%, shifts into a quiet technology phase, and
 * begins preparing RETURN at 75%. The visual crossfade starts at 90%.
 */
export function getReturnTransitionProgress(
  timeline: TimelineSlice,
  returnSceneIndex = 5,
): number {
  if (timeline.sceneIndex === returnSceneIndex) {
    return 1;
  }

  if (timeline.nextSceneIndex !== returnSceneIndex) {
    return 0;
  }

  return normalizeProgress(
    timeline.segmentProgress,
    RETURN_FORMATION_START,
    RETURN_FORMATION_END,
  );
}

export function getReturnExitProgress(
  timeline: TimelineSlice,
  returnSceneIndex = 5,
  endpointProgress = 0,
): number {
  if (timeline.sceneIndex === returnSceneIndex) {
    return normalizeProgress(endpointProgress, RETURN_ENDPOINT_HOLD_END, 1);
  }

  return 0;
}

export function getReturnPhase(returnProgress: number): ReturnPhase {
  const progress = clampUnit(returnProgress);
  if (progress < 0.25 - PROGRESS_EPSILON) {
    return "base";
  }

  if (progress < 0.55 - PROGRESS_EPSILON) {
    return "breathing";
  }

  if (progress < 0.8 - PROGRESS_EPSILON) {
    return "dawn";
  }

  return "complete";
}

export function getReturnExitPhase(
  returnExitProgress: number,
  reducedMotion = false,
): ReturnExitPhase {
  const progress = clampUnit(returnExitProgress);

  if (reducedMotion) {
    if (progress < 0.2 - PROGRESS_EPSILON) {
      return "hold";
    }

    if (progress < 0.55 - PROGRESS_EPSILON) {
      return "particles";
    }

    if (progress < 0.72 - PROGRESS_EPSILON) {
      return "erosion";
    }

    return progress < 0.86 - PROGRESS_EPSILON ? "wash" : "white";
  }

  if (progress < 0.04 - PROGRESS_EPSILON) {
    return "hold";
  }

  if (progress < 0.2 - PROGRESS_EPSILON) {
    return "particles";
  }

  if (progress < 0.62 - PROGRESS_EPSILON) {
    return "erosion";
  }

  return progress < 0.9 - PROGRESS_EPSILON ? "wash" : "white";
}

export function getReturnExitVisualState(
  returnExitProgress: number,
  reducedMotion = false,
): ReturnExitVisualState {
  const progress = clampUnit(returnExitProgress);

  if (reducedMotion) {
    const erosion = progress >= 0.55 ? 1 : 0;

    return {
      returnExitParticles: progress >= 0.2 ? 0.86 : 0,
      returnExitErosion: erosion,
      returnExitWash: progress >= 0.72 ? 1 : 0,
      returnExitWhite: progress >= 0.86 ? 1 : 0,
      returnExitEdge: erosion === 1 ? -12 : 112,
    };
  }

  const erosion = normalizeProgress(progress, 0.12, 0.78);

  return {
    returnExitParticles: normalizeProgress(progress, 0.04, 0.58),
    returnExitErosion: erosion,
    returnExitWash: normalizeProgress(progress, 0.62, 0.9),
    returnExitWhite: normalizeProgress(progress, 0.82, 1),
    returnExitEdge: 112 - erosion * 124,
  };
}

export function getJourneyInteractionState(
  timeline: TimelineSlice,
  currentSceneId: SceneId,
  reducedMotion: boolean,
  endpointProgress = 0,
): JourneyInteractionState {
  const localProgress = clampUnit(timeline.segmentProgress);
  const returnProgress = getReturnTransitionProgress(timeline);
  const returnExitProgress = getReturnExitProgress(
    timeline,
    5,
    endpointProgress,
  );
  const exitVisual = getReturnExitVisualState(
    returnExitProgress,
    reducedMotion,
  );

  return {
    orderPhase: getOrderPhase(currentSceneId === "order" ? localProgress : 0),
    designPhase: getDesignPhase(currentSceneId === "design" ? localProgress : 0),
    buildStep:
      currentSceneId === "build"
        ? getBuildWindowStep(localProgress, reducedMotion)
        : "observe",
    returnPhase: getReturnPhase(returnProgress),
    returnProgress,
    returnBaseOpacity:
      reducedMotion
        ? currentSceneId === "return"
          ? 1
          : 0
        : currentSceneId === "return"
          ? 1
          : normalizeProgress(localProgress, 0.9, 1),
    returnStarBreath: windowProgress(returnProgress, 0.25, 0.38, 0.68, 0.82),
    returnHorizonGlow: normalizeProgress(returnProgress, 0.25, 0.8),
    returnSkyLift: normalizeProgress(returnProgress, 0.55, 0.95),
    returnGridFlow: windowProgress(returnProgress, 0.25, 0.4, 0.72, 0.9),
    returnBlueParticles: windowProgress(returnProgress, 0.55, 0.68, 0.86, 1),
    returnExitPhase: getReturnExitPhase(returnExitProgress, reducedMotion),
    returnExitProgress,
    ...exitVisual,
    adoptLight:
      currentSceneId === "adopt"
        ? normalizeProgress(localProgress, 0.55, 0.75)
        : 0,
  };
}
