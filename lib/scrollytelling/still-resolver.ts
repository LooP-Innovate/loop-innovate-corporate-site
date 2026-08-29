import { JOURNEY_STILL_PUBLIC_DIRECTORY } from "#scrollytelling/scene-config";
import type {
  JourneyAssetVariant,
  JourneyFocalTier,
  JourneySceneConfig,
  ResolvedJourneyStill,
} from "#scrollytelling/journey-types";

export type ResolveJourneyStillOptions = {
  variant?: JourneyAssetVariant;
};

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
 * Resolve static Journey media without inventing or probing a URL. A compact
 * request may reuse the configured desktop asset; a desktop request never
 * selects a lower-resolution mobile-only source.
 */
export function resolveJourneyStill(
  scene: JourneySceneConfig,
  options: ResolveJourneyStillOptions = {},
): ResolvedJourneyStill {
  const requestedVariant = options.variant ?? "desktop";
  const still = selectVariantSource(
    scene.desktopStill,
    scene.mobileStill,
    requestedVariant,
  );

  if (still.src) {
    return {
      sceneId: scene.id,
      kind: "still",
      src: still.src,
      status: "ready",
      requestedVariant,
      sourceVariant: still.sourceVariant,
    };
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

/** Diagnostic contract path only. Renderers must use `resolveJourneyStill`. */
export function getJourneyStillContractPath(
  scene: JourneySceneConfig,
): string {
  return `${JOURNEY_STILL_PUBLIC_DIRECTORY}/${scene.contractStillFile}`;
}

export function resolveJourneyFocalPoint(
  scene: JourneySceneConfig,
  tier: JourneyFocalTier,
): string {
  switch (tier) {
    case "desktop":
      return scene.focalPointDesktop;
    case "tablet":
      return scene.focalPointTablet;
    case "mobile":
      return scene.focalPointMobile;
  }
}
