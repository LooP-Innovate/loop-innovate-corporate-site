import assert from "node:assert/strict";
import test from "node:test";

import {
  getJourneyPreloadWindow,
  resolveJourneyAsset,
  resolveJourneyCrossfadeMediaState,
} from "../lib/scrollytelling/asset-resolver.ts";
import { SCENES } from "../lib/scrollytelling/scene-config.ts";

test("resolves FIELD video and safely reuses it for mobile", () => {
  const desktop = resolveJourneyAsset(SCENES[0]);
  const mobile = resolveJourneyAsset(SCENES[0], { variant: "mobile" });

  assert.deepEqual(desktop, {
    sceneId: "field",
    kind: "video",
    src: "/video/field-v01.mp4",
    status: "ready",
    requestedVariant: "desktop",
    sourceVariant: "desktop",
  });
  assert.equal(mobile.kind, "video");
  assert.equal(mobile.src, "/video/field-v01.mp4");
  assert.equal(mobile.sourceVariant, "desktop");
});

test("falls back from video to poster and then placeholder", () => {
  const posterScene = {
    ...SCENES[1],
    desktopPoster: "/media/journey/poster/02-order-to-design.webp",
    poster: "/media/journey/poster/02-order-to-design.webp",
    status: "ready",
  };
  const poster = resolveJourneyAsset(posterScene);
  const placeholder = resolveJourneyAsset(SCENES[1]);

  assert.equal(poster.kind, "poster");
  assert.equal(
    poster.src,
    "/media/journey/poster/02-order-to-design.webp",
  );
  assert.equal(placeholder.kind, "placeholder");
  assert.equal(placeholder.src, null);
  assert.equal(placeholder.status, "missing");
});

test("reduced motion skips configured video", () => {
  const sceneWithPoster = {
    ...SCENES[0],
    desktopPoster: "/media/journey/poster/01-field-to-order.webp",
    poster: "/media/journey/poster/01-field-to-order.webp",
  };
  const withPoster = resolveJourneyAsset(sceneWithPoster, {
    reducedMotion: true,
  });
  const withoutPoster = resolveJourneyAsset(SCENES[0], {
    reducedMotion: true,
  });

  assert.equal(withPoster.kind, "poster");
  assert.equal(withoutPoster.kind, "placeholder");
  assert.equal(withoutPoster.src, null);
});

test("prefers a mobile-specific source when configured", () => {
  const mobileScene = {
    ...SCENES[0],
    mobileVideo: "/media/journey/video/01-field-to-order-mobile.mp4",
  };
  const resolved = resolveJourneyAsset(mobileScene, { variant: "mobile" });

  assert.equal(
    resolved.src,
    "/media/journey/video/01-field-to-order-mobile.mp4",
  );
  assert.equal(resolved.sourceVariant, "mobile");
});

test("builds bounded direction-aware preload windows", () => {
  assert.deepEqual(
    getJourneyPreloadWindow({
      activeSceneIndex: 2,
      sceneCount: 6,
      direction: 1,
      variant: "desktop",
    }),
    [2, 3, 1],
  );
  assert.deepEqual(
    getJourneyPreloadWindow({
      activeSceneIndex: 2,
      sceneCount: 6,
      direction: -1,
      variant: "desktop",
    }),
    [2, 1, 3],
  );
  assert.deepEqual(
    getJourneyPreloadWindow({
      activeSceneIndex: 2,
      sceneCount: 6,
      direction: 1,
      variant: "mobile",
    }),
    [2, 3],
  );
  assert.deepEqual(
    getJourneyPreloadWindow({
      activeSceneIndex: 2,
      sceneCount: 6,
      direction: -1,
      variant: "mobile",
    }),
    [2, 1],
  );
  assert.deepEqual(
    getJourneyPreloadWindow({
      activeSceneIndex: 0,
      sceneCount: 6,
      direction: -1,
      variant: "mobile",
    }),
    [0],
  );
});

test("rejects invalid preload window inputs", () => {
  assert.throws(
    () =>
      getJourneyPreloadWindow({
        activeSceneIndex: 6,
        sceneCount: 6,
        direction: 1,
        variant: "desktop",
      }),
    RangeError,
  );
  assert.throws(
    () =>
      getJourneyPreloadWindow({
        activeSceneIndex: 0,
        sceneCount: 0,
        direction: 1,
        variant: "desktop",
      }),
    RangeError,
  );
});

test("keeps crossfade media stable across the blend-start deadband", () => {
  assert.equal(resolveJourneyCrossfadeMediaState(0, false), false);
  assert.equal(resolveJourneyCrossfadeMediaState(0.019, false), false);
  assert.equal(resolveJourneyCrossfadeMediaState(0.02, false), true);
  assert.equal(resolveJourneyCrossfadeMediaState(0.006, true), true);
  assert.equal(resolveJourneyCrossfadeMediaState(0.005, true), false);
  assert.equal(resolveJourneyCrossfadeMediaState(Number.NaN, true), false);
});
