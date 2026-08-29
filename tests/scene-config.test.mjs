import assert from "node:assert/strict";
import test from "node:test";

import {
  JOURNEY_ASSETS,
  JOURNEY_SCENE_COPY,
  JOURNEY_STILL_CONTRACT_PATHS,
  JOURNEY_TRACK_HEIGHT_SVH,
  LEGACY_FIELD_VIDEO_PATH,
  SCENES,
  SCENE_IDS,
  TRANSITIONS,
  validateSceneConfig,
} from "../lib/scrollytelling/scene-config.ts";

test("keeps journey headlines in intentional Japanese phrase lines", () => {
  assert.deepEqual(
    Object.values(JOURNEY_SCENE_COPY).map((copy) => copy.main.desktop),
    [
      ["現場を、", "そのまま見る。"],
      ["複雑さを、", "ほどく。"],
      ["人とAIの役割を、", "設計する。"],
      ["仕組みを、", "動く形へ。"],
      ["使われてこそ、", "変わる。"],
      ["現場へ、", "還す。"],
    ],
  );

  for (const copy of Object.values(JOURNEY_SCENE_COPY)) {
    assert.deepEqual(copy.main.mobile, copy.main.desktop);
  }
});

test("uses the fixed six-scene order and a valid single-source config", () => {
  assert.deepEqual(SCENE_IDS, [
    "field",
    "order",
    "design",
    "build",
    "adopt",
    "return",
  ]);
  assert.deepEqual(
    SCENES.map((scene) => scene.label),
    ["FIELD", "ORDER", "DESIGN", "BUILD", "ADOPT", "RETURN"],
  );
  assert.deepEqual(validateSceneConfig(SCENES), []);
});

test("models six still anchors and preserves five optional transition contracts", () => {
  assert.deepEqual(
    SCENES.map((scene) => scene.desktopStill),
    Object.values(JOURNEY_STILL_CONTRACT_PATHS),
  );
  assert.deepEqual(
    SCENES.map((scene) => scene.contractStillFile),
    [
      "01-field.webp",
      "02-order.webp",
      "03-design.webp",
      "04-build.webp",
      "05-adopt.webp",
      "06-return.webp",
    ],
  );
  assert.deepEqual(
    SCENES.map((scene) => scene.overlayMode),
    ["field", "order", "design", "build", "adopt", "return"],
  );

  assert.equal(TRANSITIONS.length, 5);
  assert.equal(JOURNEY_TRACK_HEIGHT_SVH, 650);
  assert.deepEqual(
    TRANSITIONS.map((transition) => transition.contractVideoFile),
    [
      "01-field-to-order.mp4",
      "02-order-to-design.mp4",
      "03-design-to-build.mp4",
      "04-build-to-adopt.mp4",
      "05-adopt-to-return.mp4",
    ],
  );
  assert.equal(SCENES[5].mediaRole, "endpoint");
  assert.equal(SCENES[5].contractVideoFile, null);
});

test("derives the manifest and compatibility aliases from scene config", () => {
  assert.equal(JOURNEY_ASSETS.field.desktopVideo, LEGACY_FIELD_VIDEO_PATH);
  assert.equal(
    JOURNEY_ASSETS.field.desktopStill,
    JOURNEY_STILL_CONTRACT_PATHS.field,
  );
  assert.equal(JOURNEY_ASSETS.field.status, "ready");
  assert.equal(SCENES[0].clipSrc, SCENES[0].desktopVideo);
  assert.equal(SCENES[0].poster, SCENES[0].desktopStill);
  assert.equal(SCENES[0].focalPointDesktop, "center center");
  assert.equal(SCENES[0].focalPointTablet, "12% center");
  assert.equal(SCENES[0].focalPointMobile, "12% center");
  assert.equal(SCENES[4].focalPointMobile, "72% center");
  assert.equal(SCENES[5].focalPointTablet, "38% center");
  assert.equal(SCENES[5].focalPointMobile, "36% center");

  for (const scene of SCENES) {
    assert.equal(JOURNEY_ASSETS[scene.id].status, "ready");
    assert.equal(scene.mobileStill, null);
  }
});

test("reports duplicate ids, non-sequential indexes, and invalid blends", () => {
  const duplicate = SCENES.map((scene) => ({ ...scene }));
  duplicate[1].id = "field";

  const nonSequential = SCENES.map((scene) => ({ ...scene }));
  nonSequential[2].index = 9;

  const invalidBlend = SCENES.map((scene) => ({ ...scene }));
  invalidBlend[3].blendStart = 1;

  assert.ok(
    validateSceneConfig(duplicate).some(
      (issue) => issue.code === "duplicate-id",
    ),
  );
  assert.ok(
    validateSceneConfig(nonSequential).some(
      (issue) => issue.code === "scene-index",
    ),
  );
  assert.ok(
    validateSceneConfig(invalidBlend).some(
      (issue) => issue.code === "blend-start",
    ),
  );
});

test("reports invalid still-first status, overlay, focal point, and contract", () => {
  const invalidStatus = SCENES.map((scene) => ({ ...scene }));
  invalidStatus[1].status = "missing";

  const invalidOverlay = SCENES.map((scene) => ({ ...scene }));
  invalidOverlay[2].overlayMode = "invalid";

  const invalidFocalPoint = SCENES.map((scene) => ({ ...scene }));
  invalidFocalPoint[3].focalPointMobile = "";

  const invalidStillContract = SCENES.map((scene) => ({ ...scene }));
  invalidStillContract[4].contractStillFile = "05-wrong.webp";

  assert.ok(
    validateSceneConfig(invalidStatus).some(
      (issue) => issue.code === "asset-status" && issue.sceneId === "order",
    ),
  );
  assert.ok(
    validateSceneConfig(invalidOverlay).some(
      (issue) => issue.code === "overlay-mode" && issue.sceneId === "design",
    ),
  );
  assert.ok(
    validateSceneConfig(invalidFocalPoint).some(
      (issue) => issue.code === "focal-point" && issue.sceneId === "build",
    ),
  );
  assert.ok(
    validateSceneConfig(invalidStillContract).some(
      (issue) =>
        issue.code === "still-contract-file" && issue.sceneId === "adopt",
    ),
  );
});
