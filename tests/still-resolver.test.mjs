import assert from "node:assert/strict";
import test from "node:test";

import {
  getJourneyStillContractPath,
  resolveJourneyFocalPoint,
  resolveJourneyStill,
} from "../lib/scrollytelling/still-resolver.ts";
import {
  JOURNEY_STILL_CONTRACT_PATHS,
  SCENES,
} from "../lib/scrollytelling/scene-config.ts";

test("resolves each configured desktop still as the primary Journey asset", () => {
  for (const scene of SCENES) {
    assert.deepEqual(resolveJourneyStill(scene), {
      sceneId: scene.id,
      kind: "still",
      src: JOURNEY_STILL_CONTRACT_PATHS[scene.id],
      status: "ready",
      requestedVariant: "desktop",
      sourceVariant: "desktop",
    });
  }
});

test("prefers a mobile still and otherwise safely reuses the desktop still", () => {
  const mobilePath = "/media/journey/still/01-field-mobile.webp";
  const mobileScene = { ...SCENES[0], mobileStill: mobilePath };

  assert.equal(
    resolveJourneyStill(mobileScene, { variant: "mobile" }).src,
    mobilePath,
  );
  assert.equal(
    resolveJourneyStill(mobileScene, { variant: "mobile" }).sourceVariant,
    "mobile",
  );

  const fallback = resolveJourneyStill(SCENES[1], { variant: "mobile" });
  assert.equal(fallback.src, JOURNEY_STILL_CONTRACT_PATHS.order);
  assert.equal(fallback.sourceVariant, "desktop");
});

test("falls back to a configured poster when no still is available", () => {
  const posterPath = "/media/journey/poster/03-design-to-build.webp";
  const posterScene = {
    ...SCENES[2],
    desktopStill: null,
    desktopPoster: posterPath,
    poster: posterPath,
  };
  const resolved = resolveJourneyStill(posterScene);

  assert.equal(resolved.kind, "poster");
  assert.equal(resolved.src, posterPath);
  assert.equal(resolved.status, "ready");
});

test("missing stills resolve to a null placeholder, never a contract URL", () => {
  const missingScene = {
    ...SCENES[3],
    desktopStill: null,
    mobileStill: null,
    desktopPoster: null,
    mobilePoster: null,
    poster: null,
    status: "missing",
  };
  const resolved = resolveJourneyStill(missingScene, { variant: "mobile" });

  assert.equal(resolved.kind, "placeholder");
  assert.equal(resolved.src, null);
  assert.equal(resolved.status, "missing");
  assert.equal(
    getJourneyStillContractPath(missingScene),
    JOURNEY_STILL_CONTRACT_PATHS.build,
  );
});

test("resolves all three configured focal tiers deterministically", () => {
  const field = SCENES[0];

  assert.equal(resolveJourneyFocalPoint(field, "desktop"), "center center");
  assert.equal(resolveJourneyFocalPoint(field, "tablet"), "12% center");
  assert.equal(resolveJourneyFocalPoint(field, "mobile"), "12% center");
});
