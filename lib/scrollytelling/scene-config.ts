import {
  JOURNEY_SCENE_IDS,
  type JourneyAssetManifest,
  type JourneyAssetManifestEntry,
  type JourneySceneConfig,
  type JourneySceneDefinition,
  type SceneId,
} from "#scrollytelling/journey-types";
import { DEFAULT_BLEND_START } from "#scrollytelling/timeline";

export { DEFAULT_BLEND_START } from "#scrollytelling/timeline";
export { JOURNEY_SCENE_IDS as SCENE_IDS } from "#scrollytelling/journey-types";
export type {
  JourneyAssetKind,
  JourneyAssetManifest,
  JourneyAssetManifestEntry,
  JourneyAssetStatus,
  JourneyAssetVariant,
  JourneyDirection,
  JourneyEndpointScene,
  JourneyFocalTier,
  JourneyOverlayMode,
  JourneyPreloadHint,
  JourneySceneAssetSources,
  JourneySceneConfig,
  JourneySceneDefinition,
  JourneySceneStatus,
  JourneyStillKind,
  JourneyTransitionScene,
  ResolvedJourneyAsset,
  ResolvedJourneyStill,
  SceneId,
} from "#scrollytelling/journey-types";

export type SceneConfig = JourneySceneConfig;

export type SceneTransition = {
  index: number;
  from: SceneId;
  to: SceneId;
  clipSrc: string | null;
  desktopVideo: string | null;
  mobileVideo: string | null;
  desktopPoster: string | null;
  mobilePoster: string | null;
  contractVideoFile: `${string}.mp4`;
  blendStart: number;
};

export const JOURNEY_MEDIA_PUBLIC_ROOT = "/media/journey";
export const JOURNEY_STILL_PUBLIC_DIRECTORY = `${JOURNEY_MEDIA_PUBLIC_ROOT}/still`;
export const JOURNEY_VIDEO_PUBLIC_DIRECTORY = `${JOURNEY_MEDIA_PUBLIC_ROOT}/video`;
export const JOURNEY_POSTER_PUBLIC_DIRECTORY = `${JOURNEY_MEDIA_PUBLIC_ROOT}/poster`;
export const LEGACY_FIELD_VIDEO_PATH = "/video/field-v01.mp4";

export const JOURNEY_STILL_CONTRACT_PATHS = {
  field: `${JOURNEY_STILL_PUBLIC_DIRECTORY}/01-field.webp`,
  order: `${JOURNEY_STILL_PUBLIC_DIRECTORY}/02-order.webp`,
  design: `${JOURNEY_STILL_PUBLIC_DIRECTORY}/03-design.webp`,
  build: `${JOURNEY_STILL_PUBLIC_DIRECTORY}/04-build.webp`,
  adopt: `${JOURNEY_STILL_PUBLIC_DIRECTORY}/05-adopt.webp`,
  return: `${JOURNEY_STILL_PUBLIC_DIRECTORY}/06-return.webp`,
} as const satisfies Readonly<Record<SceneId, string>>;

function defineScene<const T extends JourneySceneDefinition>(
  scene: T,
): T & Pick<JourneySceneConfig, "clipSrc" | "poster"> {
  const configured = {
    ...scene,
    clipSrc: scene.desktopVideo,
    poster: scene.desktopStill ?? scene.desktopPoster,
  } as T & Pick<JourneySceneConfig, "clipSrc" | "poster">;

  return configured;
}

/**
 * The only authored scene/asset source. Asset manifests and compatibility
 * aliases below are derived from this tuple.
 */
export const SCENES = [
  defineScene({
    id: "field",
    index: 0,
    label: "FIELD",
    mediaRole: "transition",
    transitionTo: "order",
    contractStem: "01-field-to-order",
    contractStillFile: "01-field.webp",
    contractVideoFile: "01-field-to-order.mp4",
    overlayMode: "field",
    desktopStill: JOURNEY_STILL_CONTRACT_PATHS.field,
    mobileStill: null,
    desktopVideo: LEGACY_FIELD_VIDEO_PATH,
    mobileVideo: null,
    desktopPoster: null,
    mobilePoster: null,
    status: "ready",
    blendStart: DEFAULT_BLEND_START,
    focalPointDesktop: "center center",
    focalPointTablet: "12% center",
    focalPointMobile: "12% center",
    preloadHint: "eager",
  }),
  defineScene({
    id: "order",
    index: 1,
    label: "ORDER",
    mediaRole: "transition",
    transitionTo: "design",
    contractStem: "02-order-to-design",
    contractStillFile: "02-order.webp",
    contractVideoFile: "02-order-to-design.mp4",
    overlayMode: "order",
    desktopStill: JOURNEY_STILL_CONTRACT_PATHS.order,
    mobileStill: null,
    desktopVideo: null,
    mobileVideo: null,
    desktopPoster: null,
    mobilePoster: null,
    status: "ready",
    blendStart: DEFAULT_BLEND_START,
    focalPointDesktop: "center center",
    focalPointTablet: "center center",
    focalPointMobile: "center center",
    preloadHint: "near",
  }),
  defineScene({
    id: "design",
    index: 2,
    label: "DESIGN",
    mediaRole: "transition",
    transitionTo: "build",
    contractStem: "03-design-to-build",
    contractStillFile: "03-design.webp",
    contractVideoFile: "03-design-to-build.mp4",
    overlayMode: "design",
    desktopStill: JOURNEY_STILL_CONTRACT_PATHS.design,
    mobileStill: null,
    desktopVideo: null,
    mobileVideo: null,
    desktopPoster: null,
    mobilePoster: null,
    status: "ready",
    blendStart: DEFAULT_BLEND_START,
    focalPointDesktop: "center center",
    focalPointTablet: "55% center",
    focalPointMobile: "58% center",
    preloadHint: "near",
  }),
  defineScene({
    id: "build",
    index: 3,
    label: "BUILD",
    mediaRole: "transition",
    transitionTo: "adopt",
    contractStem: "04-build-to-adopt",
    contractStillFile: "04-build.webp",
    contractVideoFile: "04-build-to-adopt.mp4",
    overlayMode: "build",
    desktopStill: JOURNEY_STILL_CONTRACT_PATHS.build,
    mobileStill: null,
    desktopVideo: null,
    mobileVideo: null,
    desktopPoster: null,
    mobilePoster: null,
    status: "ready",
    blendStart: DEFAULT_BLEND_START,
    focalPointDesktop: "center center",
    focalPointTablet: "center center",
    focalPointMobile: "center center",
    preloadHint: "near",
  }),
  defineScene({
    id: "adopt",
    index: 4,
    label: "ADOPT",
    mediaRole: "transition",
    transitionTo: "return",
    contractStem: "05-adopt-to-return",
    contractStillFile: "05-adopt.webp",
    contractVideoFile: "05-adopt-to-return.mp4",
    overlayMode: "adopt",
    desktopStill: JOURNEY_STILL_CONTRACT_PATHS.adopt,
    mobileStill: null,
    desktopVideo: null,
    mobileVideo: null,
    desktopPoster: null,
    mobilePoster: null,
    status: "ready",
    blendStart: DEFAULT_BLEND_START,
    focalPointDesktop: "center center",
    focalPointTablet: "72% center",
    focalPointMobile: "72% center",
    preloadHint: "near",
  }),
  defineScene({
    id: "return",
    index: 5,
    label: "RETURN",
    mediaRole: "endpoint",
    transitionTo: null,
    contractStem: "06-return",
    contractStillFile: "06-return.webp",
    contractVideoFile: null,
    overlayMode: "return",
    desktopStill: JOURNEY_STILL_CONTRACT_PATHS.return,
    mobileStill: null,
    desktopVideo: null,
    mobileVideo: null,
    desktopPoster: null,
    mobilePoster: null,
    status: "ready",
    blendStart: DEFAULT_BLEND_START,
    focalPointDesktop: "center center",
    focalPointTablet: "38% center",
    focalPointMobile: "36% center",
    preloadHint: "lazy",
  }),
] as const satisfies readonly JourneySceneConfig[];

export type JourneySceneCopy = {
  main: {
    desktop: readonly string[];
    mobile: readonly string[];
  };
  sub: readonly string[];
};

export const JOURNEY_SCENE_COPY = {
  field: {
    main: {
      desktop: ["現場を、", "そのまま見る。"],
      mobile: ["現場を、", "そのまま見る。"],
    },
    sub: [
      "人、業務、情報、制約。",
      "まずは、今を捉える。",
    ],
  },
  order: {
    main: {
      desktop: ["複雑さを、", "ほどく。"],
      mobile: ["複雑さを、", "ほどく。"],
    },
    sub: [
      "散らばる情報。重なる手順。曖昧な判断。",
      "見える形に整える。",
    ],
  },
  design: {
    main: {
      desktop: ["人とAIの役割を、", "設計する。"],
      mobile: ["人とAIの役割を、", "設計する。"],
    },
    sub: [
      "人が決めること。AIに任せること。",
      "役割を分け、流れを設計する。",
    ],
  },
  build: {
    main: {
      desktop: ["仕組みを、", "動く形へ。"],
      mobile: ["仕組みを、", "動く形へ。"],
    },
    sub: [
      "考えた仕組みを、",
      "小さく試せる実装へ。",
    ],
  },
  adopt: {
    main: {
      desktop: ["使われてこそ、", "変わる。"],
      mobile: ["使われてこそ、", "変わる。"],
    },
    sub: [
      "導入して終わらない。",
      "現場で使い、確かめ、育てる。",
    ],
  },
  return: {
    main: {
      desktop: ["現場へ、", "還す。"],
      mobile: ["現場へ、", "還す。"],
    },
    sub: [
      "結果を確かめ、次の改善へ。",
      "循環は、ここから続く。",
    ],
  },
} as const satisfies Readonly<Record<SceneId, JourneySceneCopy>>;

export const SCENE_COUNT = SCENES.length;
export const TRANSITION_COUNT = SCENE_COUNT - 1;
export const JOURNEY_VIEWPORT_HEIGHT_SVH = 100;
export const JOURNEY_SEGMENT_HEIGHT_SVH = 82;
export const JOURNEY_TRACK_HEIGHT_SVH =
  JOURNEY_VIEWPORT_HEIGHT_SVH + TRANSITION_COUNT * JOURNEY_SEGMENT_HEIGHT_SVH;

export const TRANSITIONS: readonly SceneTransition[] = SCENES.slice(0, -1).map(
  (scene, index): SceneTransition => {
    if (scene.mediaRole !== "transition") {
      throw new Error(`Scene "${scene.id}" does not own a transition clip.`);
    }

    return {
      index,
      from: scene.id,
      to: scene.transitionTo,
      clipSrc: scene.clipSrc,
      desktopVideo: scene.desktopVideo,
      mobileVideo: scene.mobileVideo,
      desktopPoster: scene.desktopPoster,
      mobilePoster: scene.mobilePoster,
      contractVideoFile: scene.contractVideoFile,
      blendStart: scene.blendStart,
    };
  },
);

function createAssetManifest(
  scenes: readonly JourneySceneConfig[],
): JourneyAssetManifest {
  const entries = scenes.map((scene) => {
    const entry: JourneyAssetManifestEntry = {
      sceneId: scene.id,
      mediaRole: scene.mediaRole,
      transitionTo: scene.transitionTo,
      contractStem: scene.contractStem,
      contractStillFile: scene.contractStillFile,
      contractVideoFile: scene.contractVideoFile,
      overlayMode: scene.overlayMode,
      desktopStill: scene.desktopStill,
      mobileStill: scene.mobileStill,
      desktopVideo: scene.desktopVideo,
      mobileVideo: scene.mobileVideo,
      desktopPoster: scene.desktopPoster,
      mobilePoster: scene.mobilePoster,
      status: scene.status,
    };

    return [scene.id, Object.freeze(entry)] as const;
  });

  return Object.freeze(Object.fromEntries(entries)) as JourneyAssetManifest;
}

export const JOURNEY_ASSETS = createAssetManifest(SCENES);
export const journeyAssets = JOURNEY_ASSETS;

export type SceneConfigIssueCode =
  | "scene-count"
  | "duplicate-id"
  | "scene-order"
  | "scene-index"
  | "blend-start"
  | "overlay-mode"
  | "focal-point"
  | "asset-status"
  | "compatibility-alias"
  | "media-role"
  | "transition-target"
  | "still-contract-file"
  | "contract-file";

export type SceneConfigIssue = {
  code: SceneConfigIssueCode;
  message: string;
  sceneId?: SceneId;
};

export function validateSceneConfig(
  scenes: readonly JourneySceneConfig[],
): SceneConfigIssue[] {
  const issues: SceneConfigIssue[] = [];
  const seenIds = new Set<SceneId>();

  if (scenes.length !== JOURNEY_SCENE_IDS.length) {
    issues.push({
      code: "scene-count",
      message: `Expected ${JOURNEY_SCENE_IDS.length} scenes, received ${scenes.length}.`,
    });
  }

  scenes.forEach((scene, position) => {
    if (seenIds.has(scene.id)) {
      issues.push({
        code: "duplicate-id",
        message: `Scene id "${scene.id}" is duplicated.`,
        sceneId: scene.id,
      });
    }
    seenIds.add(scene.id);

    if (scene.id !== JOURNEY_SCENE_IDS[position]) {
      issues.push({
        code: "scene-order",
        message: `Scene at position ${position} must be "${JOURNEY_SCENE_IDS[position] ?? "none"}".`,
        sceneId: scene.id,
      });
    }

    if (scene.index !== position) {
      issues.push({
        code: "scene-index",
        message: `Scene "${scene.id}" must use sequential index ${position}.`,
        sceneId: scene.id,
      });
    }

    if (
      !Number.isFinite(scene.blendStart) ||
      scene.blendStart < 0 ||
      scene.blendStart >= 1
    ) {
      issues.push({
        code: "blend-start",
        message: `Scene "${scene.id}" blendStart must be in [0, 1).`,
        sceneId: scene.id,
      });
    }

    if (!JOURNEY_SCENE_IDS.includes(scene.overlayMode as SceneId)) {
      issues.push({
        code: "overlay-mode",
        message: `Scene "${scene.id}" uses invalid overlay mode "${String(scene.overlayMode)}".`,
        sceneId: scene.id,
      });
    }

    const focalPoints = [
      ["desktop", scene.focalPointDesktop],
      ["tablet", scene.focalPointTablet],
      ["mobile", scene.focalPointMobile],
    ] as const;

    for (const [tier, focalPoint] of focalPoints) {
      if (typeof focalPoint !== "string" || focalPoint.trim().length === 0) {
        issues.push({
          code: "focal-point",
          message: `Scene "${scene.id}" must define a ${tier} focal point.`,
          sceneId: scene.id,
        });
      }
    }

    const expectedStillFile = `${String(position + 1).padStart(2, "0")}-${scene.id}.webp`;
    const expectedStillPath = `${JOURNEY_STILL_PUBLIC_DIRECTORY}/${expectedStillFile}`;

    if (
      scene.contractStillFile !== expectedStillFile ||
      (scene.desktopStill !== null && scene.desktopStill !== expectedStillPath)
    ) {
      issues.push({
        code: "still-contract-file",
        message: `Scene "${scene.id}" still contract must be ${expectedStillPath}.`,
        sceneId: scene.id,
      });
    }

    const hasConfiguredPrimaryStill = Boolean(
      scene.desktopStill ?? scene.desktopPoster,
    );
    const expectedStatus = hasConfiguredPrimaryStill ? "ready" : "missing";

    if (scene.status !== expectedStatus) {
      issues.push({
        code: "asset-status",
        message: `Scene "${scene.id}" status must be "${expectedStatus}" for its configured sources.`,
        sceneId: scene.id,
      });
    }

    if (
      scene.clipSrc !== scene.desktopVideo ||
      scene.poster !== (scene.desktopStill ?? scene.desktopPoster)
    ) {
      issues.push({
        code: "compatibility-alias",
        message: `Scene "${scene.id}" compatibility aliases must be derived from desktop sources.`,
        sceneId: scene.id,
      });
    }

    const isEndpoint = position === JOURNEY_SCENE_IDS.length - 1;

    if (isEndpoint) {
      if (scene.mediaRole !== "endpoint" || scene.contractVideoFile !== null) {
        issues.push({
          code: "media-role",
          message: `Final scene "${scene.id}" must be an endpoint without a transition clip.`,
          sceneId: scene.id,
        });
      }

      if (scene.transitionTo !== null) {
        issues.push({
          code: "transition-target",
          message: `Endpoint scene "${scene.id}" cannot have a transition target.`,
          sceneId: scene.id,
        });
      }
    } else {
      const expectedTarget = JOURNEY_SCENE_IDS[position + 1];

      if (scene.mediaRole !== "transition") {
        issues.push({
          code: "media-role",
          message: `Scene "${scene.id}" must own a transition clip.`,
          sceneId: scene.id,
        });
      }

      if (scene.transitionTo !== expectedTarget) {
        issues.push({
          code: "transition-target",
          message: `Scene "${scene.id}" must transition to "${expectedTarget}".`,
          sceneId: scene.id,
        });
      }

      if (scene.contractVideoFile !== `${scene.contractStem}.mp4`) {
        issues.push({
          code: "contract-file",
          message: `Scene "${scene.id}" contract video must match its contract stem.`,
          sceneId: scene.id,
        });
      }
    }
  });

  return issues;
}

export function assertValidSceneConfig(
  scenes: readonly JourneySceneConfig[],
): void {
  const issues = validateSceneConfig(scenes);

  if (issues.length > 0) {
    throw new Error(issues.map((issue) => issue.message).join("\n"));
  }
}

assertValidSceneConfig(SCENES);

export function getSceneByIndex(index: number): SceneConfig {
  const scene = SCENES[index];

  if (!scene) {
    throw new RangeError("Scene index is outside the configured journey.");
  }

  return scene;
}
