import {
  JOURNEY_SCENE_IDS,
  type SceneId,
} from "#scrollytelling/journey-types";

export const JOURNEY_LAYER_PUBLIC_DIRECTORY = "/media/journey/layers";

export type JourneyLayerMotion =
  | "mist"
  | "perspective-grid"
  | "lake-grid"
  | "grid-nodes"
  | "city-lights"
  | "ground-lines"
  | "volumetric-frames"
  | "vertical-guides"
  | "design-points"
  | "transparent-frames"
  | "spatial-nodes"
  | "calculation-lines"
  | "information-overlay"
  | "grid-traces"
  | "ambient-glow"
  | "milky-way-stars"
  | "star-field"
  | "dawn-horizon-glow"
  | "subtle-grid-flow"
  | "blue-particles";

export type JourneyLayerAsset = {
  id: string;
  sceneId: SceneId;
  src: `${typeof JOURNEY_LAYER_PUBLIC_DIRECTORY}/${string}.webp`;
  motion: JourneyLayerMotion;
  containsHuman: false;
};

function defineLayer(
  sceneId: SceneId,
  id: string,
  motion: JourneyLayerMotion,
): JourneyLayerAsset {
  return Object.freeze({
    id,
    sceneId,
    src: `${JOURNEY_LAYER_PUBLIC_DIRECTORY}/${sceneId}/${id}.webp`,
    motion,
    containsHuman: false,
  });
}

export const JOURNEY_LAYERS = Object.freeze({
  field: [defineLayer("field", "fog-haze", "mist")],
  order: [
    defineLayer("order", "perspective-grid", "perspective-grid"),
    defineLayer("order", "lake-grid", "lake-grid"),
    defineLayer("order", "grid-nodes", "grid-nodes"),
    defineLayer("order", "city-lights", "city-lights"),
  ],
  design: [
    defineLayer("design", "ground-lines", "ground-lines"),
    defineLayer("design", "volumetric-frames", "volumetric-frames"),
    defineLayer("design", "vertical-guides", "vertical-guides"),
    defineLayer("design", "design-points", "design-points"),
  ],
  build: [
    defineLayer("build", "transparent-frames", "transparent-frames"),
    defineLayer("build", "spatial-nodes", "spatial-nodes"),
    defineLayer("build", "calculation-lines", "calculation-lines"),
  ],
  adopt: [
    defineLayer("adopt", "information-overlay", "information-overlay"),
    defineLayer("adopt", "grid-traces", "grid-traces"),
    defineLayer("adopt", "ambient-glow", "ambient-glow"),
  ],
  return: [
    defineLayer("return", "milky-way-stars", "milky-way-stars"),
    defineLayer("return", "star-field", "star-field"),
    defineLayer("return", "dawn-horizon-glow", "dawn-horizon-glow"),
    defineLayer("return", "subtle-grid-flow", "subtle-grid-flow"),
    defineLayer("return", "blue-particles", "blue-particles"),
  ],
} satisfies Readonly<Record<SceneId, readonly JourneyLayerAsset[]>>);

export function getJourneyLayers(sceneId: SceneId): readonly JourneyLayerAsset[] {
  return JOURNEY_LAYERS[sceneId];
}

export const JOURNEY_LAYER_SCENE_IDS = JOURNEY_SCENE_IDS;
