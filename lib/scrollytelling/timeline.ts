export const DEFAULT_BLEND_START = 0.9;

export type JourneyTimeline = {
  journeyProgress: number;
  sceneIndex: number;
  nextSceneIndex: number;
  segmentIndex: number;
  segmentProgress: number;
  blendProgress: number;
};

function assertSceneCount(sceneCount: number): void {
  if (!Number.isInteger(sceneCount) || sceneCount < 1) {
    throw new RangeError("sceneCount must be a positive integer.");
  }
}

function assertBlendStart(blendStart: number): void {
  if (!Number.isFinite(blendStart) || blendStart < 0 || blendStart >= 1) {
    throw new RangeError("blendStart must be greater than or equal to 0 and less than 1.");
  }
}

export function clampJourneyProgress(progress: number): number {
  if (Number.isNaN(progress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, progress));
}

export function calculateBlendProgress(
  segmentProgress: number,
  blendStart = DEFAULT_BLEND_START,
): number {
  assertBlendStart(blendStart);

  const progress = clampJourneyProgress(segmentProgress);
  return clampJourneyProgress((progress - blendStart) / (1 - blendStart));
}

export function calculateJourneyTimeline(
  progress: number,
  sceneCount: number,
  blendStart = DEFAULT_BLEND_START,
): JourneyTimeline {
  assertSceneCount(sceneCount);
  assertBlendStart(blendStart);

  const journeyProgress = clampJourneyProgress(progress);

  if (sceneCount === 1) {
    return {
      journeyProgress,
      sceneIndex: 0,
      nextSceneIndex: 0,
      segmentIndex: 0,
      segmentProgress: 0,
      blendProgress: 0,
    };
  }

  const transitionCount = sceneCount - 1;

  if (journeyProgress === 1) {
    const finalSceneIndex = sceneCount - 1;
    const finalSegmentIndex = transitionCount - 1;

    return {
      journeyProgress,
      sceneIndex: finalSceneIndex,
      nextSceneIndex: finalSceneIndex,
      segmentIndex: finalSegmentIndex,
      segmentProgress: 1,
      blendProgress: 0,
    };
  }

  const scaledProgress = journeyProgress * transitionCount;
  const segmentIndex = Math.floor(scaledProgress);
  const segmentProgress = scaledProgress - segmentIndex;
  const sceneIndex = segmentIndex;

  return {
    journeyProgress,
    sceneIndex,
    nextSceneIndex: sceneIndex + 1,
    segmentIndex,
    segmentProgress,
    blendProgress: calculateBlendProgress(segmentProgress, blendStart),
  };
}

export function getSceneJourneyProgress(
  sceneIndex: number,
  sceneCount: number,
): number {
  assertSceneCount(sceneCount);

  if (!Number.isInteger(sceneIndex) || sceneIndex < 0 || sceneIndex >= sceneCount) {
    throw new RangeError("sceneIndex must refer to a configured scene.");
  }

  if (sceneCount === 1) {
    return 0;
  }

  return sceneIndex / (sceneCount - 1);
}
