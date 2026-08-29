export const JOURNEY_SCENE_IDS = [
  "field",
  "order",
  "design",
  "build",
  "adopt",
  "return",
] as const;

export type SceneId = (typeof JOURNEY_SCENE_IDS)[number];

export type JourneyOverlayMode = SceneId;
export type JourneyFocalTier = "desktop" | "tablet" | "mobile";
export type JourneySceneStatus = "ready" | "missing";
export type JourneyAssetStatus = JourneySceneStatus | "optional";
export type JourneyAssetVariant = "desktop" | "mobile";
export type JourneyAssetKind = "video" | "poster" | "placeholder";
export type JourneyStillKind = "still" | "poster" | "placeholder";
export type JourneyDirection = -1 | 0 | 1;
export type JourneyPreloadHint = "eager" | "near" | "lazy";

export type JourneySceneAssetSources = {
  desktopStill: string | null;
  mobileStill: string | null;
  desktopVideo: string | null;
  mobileVideo: string | null;
  desktopPoster: string | null;
  mobilePoster: string | null;
  status: JourneySceneStatus;
};

type JourneySceneBase = JourneySceneAssetSources & {
  id: SceneId;
  index: number;
  label: string;
  contractStem: string;
  contractStillFile: `${string}.webp`;
  overlayMode: JourneyOverlayMode;
  blendStart: number;
  focalPointDesktop: string;
  focalPointTablet: string;
  focalPointMobile: string;
  preloadHint: JourneyPreloadHint;
};

/**
 * The five scroll segments are transition clips. Each segment is owned by its
 * starting scene and resolves into `transitionTo` at the next boundary.
 */
export type JourneyTransitionScene = JourneySceneBase & {
  mediaRole: "transition";
  transitionTo: SceneId;
  contractVideoFile: `${string}.mp4`;
};

/** RETURN is the p=1 endpoint and therefore does not own a scrub segment. */
export type JourneyEndpointScene = Omit<
  JourneySceneBase,
  "desktopVideo" | "mobileVideo"
> & {
  desktopVideo: null;
  mobileVideo: null;
  mediaRole: "endpoint";
  transitionTo: null;
  contractVideoFile: null;
};

export type JourneySceneDefinition =
  | JourneyTransitionScene
  | JourneyEndpointScene;

/**
 * `clipSrc` and `poster` keep the Phase 02 component API stable. They are
 * derived aliases, never a second source of asset configuration.
 */
export type JourneySceneConfig = JourneySceneDefinition & {
  clipSrc: string | null;
  poster: string | null;
};

export type JourneyAssetManifestEntry = JourneySceneAssetSources & {
  sceneId: SceneId;
  mediaRole: JourneySceneDefinition["mediaRole"];
  transitionTo: SceneId | null;
  contractStem: string;
  contractStillFile: `${string}.webp`;
  contractVideoFile: `${string}.mp4` | null;
  overlayMode: JourneyOverlayMode;
};

export type JourneyAssetManifest = Readonly<
  Record<SceneId, Readonly<JourneyAssetManifestEntry>>
>;

export type ResolvedJourneyAsset = {
  sceneId: SceneId;
  kind: JourneyAssetKind;
  src: string | null;
  status: JourneyAssetStatus;
  requestedVariant: JourneyAssetVariant;
  sourceVariant: JourneyAssetVariant | null;
};

export type ResolvedJourneyStill = {
  sceneId: SceneId;
  kind: JourneyStillKind;
  src: string | null;
  status: JourneySceneStatus;
  requestedVariant: JourneyAssetVariant;
  sourceVariant: JourneyAssetVariant | null;
};
