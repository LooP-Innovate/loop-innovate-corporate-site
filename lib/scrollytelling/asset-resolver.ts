import type {
  JourneyAssetVariant,
  JourneyDirection,
  JourneySceneConfig,
  ResolvedJourneyAsset,
} from "#scrollytelling/journey-types";

export type ResolveJourneyAssetOptions = {
  variant?: JourneyAssetVariant;
  reducedMotion?: boolean;
};

export type JourneyPreloadWindowOptions = {
  activeSceneIndex: number;
  sceneCount: number;
  direction: JourneyDirection;
  variant: JourneyAssetVariant;
};

export const JOURNEY_CROSSFADE_MEDIA_ENTER_PROGRESS = 0.02;
export const JOURNEY_CROSSFADE_MEDIA_EXIT_PROGRESS = 0.005;

type VariantSource = {
  src: string | null;
  sourceVariant: JourneyAssetVariant | null;
};

function selectVariantSource(
  desktopSource: string | null,
  mobileSource: string | null,
  requestedVariant: JourneyAssetVariant,
): VariantSource {
  if (requestedVariant === "mobile" && mobileSource) {
    return { src: mobileSource, sourceVariant: "mobile" };
  }

  if (desktopSource) {
    return { src: desktopSource, sourceVariant: "desktop" };
  }

  return { src: null, sourceVariant: null };
}

/**
 * Resolve one scene without inventing a URL. Mobile may reuse the configured
 * desktop source; reduced motion never resolves a video.
 */
export function resolveJourneyAsset(
  scene: JourneySceneConfig,
  options: ResolveJourneyAssetOptions = {},
): ResolvedJourneyAsset {
  const requestedVariant = options.variant ?? "desktop";

  if (!options.reducedMotion) {
    const video = selectVariantSource(
      scene.desktopVideo,
      scene.mobileVideo,
      requestedVariant,
    );

    if (video.src) {
      return {
        sceneId: scene.id,
        kind: "video",
        src: video.src,
        status: "ready",
        requestedVariant,
        sourceVariant: video.sourceVariant,
      };
    }
  }

  const poster = selectVariantSource(
    scene.desktopPoster,
    scene.mobilePoster,
    requestedVariant,
  );

  if (poster.src) {
    return {
      sceneId: scene.id,
      kind: "poster",
      src: poster.src,
      status: "ready",
      requestedVariant,
      sourceVariant: poster.sourceVariant,
    };
  }

  return {
    sceneId: scene.id,
    kind: "placeholder",
    src: null,
    status: "missing",
    requestedVariant,
    sourceVariant: null,
  };
}

function assertWindowOptions(options: JourneyPreloadWindowOptions): void {
  if (!Number.isInteger(options.sceneCount) || options.sceneCount < 1) {
    throw new RangeError("sceneCount must be a positive integer.");
  }

  if (
    !Number.isInteger(options.activeSceneIndex) ||
    options.activeSceneIndex < 0 ||
    options.activeSceneIndex >= options.sceneCount
  ) {
    throw new RangeError("activeSceneIndex must refer to a configured scene.");
  }

  if (![1, 0, -1].includes(options.direction)) {
    throw new RangeError("direction must be -1, 0, or 1.");
  }
}

/**
 * Ordered preload priority. Desktop keeps current + both neighbours (max 3),
 * preferring scroll direction. Mobile keeps current + directional neighbour
 * (max 2). Returned indexes are unique and always in range.
 */
export function getJourneyPreloadWindow(
  options: JourneyPreloadWindowOptions,
): number[] {
  assertWindowOptions(options);

  const { activeSceneIndex, direction, sceneCount, variant } = options;
  const preferredOffset = direction < 0 ? -1 : 1;
  const candidates =
    variant === "mobile"
      ? [activeSceneIndex, activeSceneIndex + preferredOffset]
      : [
          activeSceneIndex,
          activeSceneIndex + preferredOffset,
          activeSceneIndex - preferredOffset,
        ];

  return candidates.filter(
    (index, position) =>
      index >= 0 &&
      index < sceneCount &&
      candidates.indexOf(index) === position,
  );
}

/**
 * Keeps neighbour media stable when scroll input oscillates around the start
 * of a blend. The separate enter/exit thresholds form a small deadband.
 */
export function resolveJourneyCrossfadeMediaState(
  blendProgress: number,
  currentlyActive: boolean,
): boolean {
  if (!Number.isFinite(blendProgress)) {
    return false;
  }

  const progress = Math.min(1, Math.max(0, blendProgress));

  return currentlyActive
    ? progress > JOURNEY_CROSSFADE_MEDIA_EXIT_PROGRESS
    : progress >= JOURNEY_CROSSFADE_MEDIA_ENTER_PROGRESS;
}
