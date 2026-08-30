export const DEFAULT_BLEND_START = 0.9;

/**
 * Physical scroll allocation for FIELD→ORDER, ORDER→DESIGN,
 * DESIGN→BUILD, BUILD→ADOPT, and ADOPT→RETURN.
 *
 * The early discovery scenes stay concise, BUILD receives enough room for the
 * System Window, and the final adoption/return segment is intentionally the
 * quietest. The weights sum to five so they remain easy to reason about.
 */
export const JOURNEY_SEGMENT_WEIGHTS = [0.78, 0.84, 0.88, 1.12, 1.38] as const;
export const JOURNEY_ENDPOINT_SCROLL_START = 0.92;

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

function getValidWeightTotal(weights: readonly number[]): number {
  if (
    weights.length === 0 ||
    weights.some((weight) => !Number.isFinite(weight) || weight <= 0)
  ) {
    throw new RangeError("Journey segment weights must be positive numbers.");
  }

  return weights.reduce((total, weight) => total + weight, 0);
}

/** Convert physical page scroll to the normalized timeline used by scenes. */
export function remapJourneyScrollProgress(
  scrollProgress: number,
  weights: readonly number[] = JOURNEY_SEGMENT_WEIGHTS,
): number {
  const total = getValidWeightTotal(weights);
  const progress = clampJourneyProgress(scrollProgress);

  if (progress >= JOURNEY_ENDPOINT_SCROLL_START) {
    return 1;
  }

  const weightedPosition =
    (progress / JOURNEY_ENDPOINT_SCROLL_START) * total;
  let elapsed = 0;

  for (let index = 0; index < weights.length; index += 1) {
    const segmentEnd = elapsed + weights[index];
    if (weightedPosition < segmentEnd) {
      const localProgress = (weightedPosition - elapsed) / weights[index];
      return (index + localProgress) / weights.length;
    }
    elapsed = segmentEnd;
  }

  return 1;
}

/** Convert a normalized scene timeline position back to physical page scroll. */
export function getWeightedJourneyScrollProgress(
  journeyProgress: number,
  weights: readonly number[] = JOURNEY_SEGMENT_WEIGHTS,
): number {
  const total = getValidWeightTotal(weights);
  const progress = clampJourneyProgress(journeyProgress);

  const scaled = progress * weights.length;
  const segmentIndex = Math.min(weights.length - 1, Math.floor(scaled));
  const localProgress = scaled - segmentIndex;
  const elapsed = weights
    .slice(0, segmentIndex)
    .reduce((sum, weight) => sum + weight, 0);

  return (
    ((elapsed + weights[segmentIndex] * localProgress) / total) *
    JOURNEY_ENDPOINT_SCROLL_START
  );
}

export function getJourneyEndpointProgress(scrollProgress: number): number {
  const progress = clampJourneyProgress(scrollProgress);
  return clampJourneyProgress(
    (progress - JOURNEY_ENDPOINT_SCROLL_START) /
      (1 - JOURNEY_ENDPOINT_SCROLL_START),
  );
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
