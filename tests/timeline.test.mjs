import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBlendProgress,
  calculateJourneyTimeline,
  getSceneJourneyProgress,
} from "../lib/scrollytelling/timeline.ts";

const SCENE_COUNT = 6;

function assertApproximately(actual, expected, epsilon = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `Expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

test("maps the six scene checkpoints to deterministic timeline states", () => {
  const checkpoints = [
    {
      progress: 0,
      sceneIndex: 0,
      nextSceneIndex: 1,
      segmentProgress: 0,
      blendProgress: 0,
    },
    {
      progress: 0.2,
      sceneIndex: 1,
      nextSceneIndex: 2,
      segmentProgress: 0,
      blendProgress: 0,
    },
    {
      progress: 0.4,
      sceneIndex: 2,
      nextSceneIndex: 3,
      segmentProgress: 0,
      blendProgress: 0,
    },
    {
      progress: 0.6,
      sceneIndex: 3,
      nextSceneIndex: 4,
      segmentProgress: 0,
      blendProgress: 0,
    },
    {
      progress: 0.8,
      sceneIndex: 4,
      nextSceneIndex: 5,
      segmentProgress: 0,
      blendProgress: 0,
    },
    {
      progress: 1,
      sceneIndex: 5,
      nextSceneIndex: 5,
      segmentProgress: 1,
      blendProgress: 0,
    },
  ];

  for (const expected of checkpoints) {
    const result = calculateJourneyTimeline(expected.progress, SCENE_COUNT);

    assert.equal(result.sceneIndex, expected.sceneIndex);
    assert.equal(result.nextSceneIndex, expected.nextSceneIndex);
    assertApproximately(result.journeyProgress, expected.progress);
    assertApproximately(result.segmentProgress, expected.segmentProgress);
    assertApproximately(result.blendProgress, expected.blendProgress);
  }
});

test("handles values immediately around the 20 percent boundary", () => {
  const before = calculateJourneyTimeline(0.1999, SCENE_COUNT);
  const boundary = calculateJourneyTimeline(0.2, SCENE_COUNT);
  const after = calculateJourneyTimeline(0.2001, SCENE_COUNT);

  assert.equal(before.sceneIndex, 0);
  assert.equal(before.nextSceneIndex, 1);
  assertApproximately(before.segmentProgress, 0.9995);
  assertApproximately(before.blendProgress, 0.995);

  assert.equal(boundary.sceneIndex, 1);
  assert.equal(boundary.nextSceneIndex, 2);
  assertApproximately(boundary.segmentProgress, 0);
  assertApproximately(boundary.blendProgress, 0);

  assert.equal(after.sceneIndex, 1);
  assert.equal(after.nextSceneIndex, 2);
  assertApproximately(after.segmentProgress, 0.0005);
  assertApproximately(after.blendProgress, 0);
});

test("produces the same scene checkpoints in reverse order", () => {
  const sceneIndices = [1, 0.8, 0.6, 0.4, 0.2, 0].map(
    (progress) => calculateJourneyTimeline(progress, SCENE_COUNT).sceneIndex,
  );

  assert.deepEqual(sceneIndices, [5, 4, 3, 2, 1, 0]);
});

test("calculates a configurable linear blend window", () => {
  assert.equal(calculateBlendProgress(0.9), 0);
  assertApproximately(calculateBlendProgress(0.95), 0.5);
  assert.equal(calculateBlendProgress(1), 1);
  assertApproximately(calculateBlendProgress(0.9, 0.8), 0.5);
});

test("clamps journey progress and supports a one-scene journey", () => {
  assert.equal(calculateJourneyTimeline(-1, SCENE_COUNT).journeyProgress, 0);
  assert.equal(calculateJourneyTimeline(2, SCENE_COUNT).journeyProgress, 1);
  assert.equal(calculateJourneyTimeline(Number.NaN, SCENE_COUNT).journeyProgress, 0);

  assert.deepEqual(calculateJourneyTimeline(0.75, 1), {
    journeyProgress: 0.75,
    sceneIndex: 0,
    nextSceneIndex: 0,
    segmentIndex: 0,
    segmentProgress: 0,
    blendProgress: 0,
  });
});

test("converts a rail scene index back to normalized journey progress", () => {
  const targets = Array.from({ length: SCENE_COUNT }, (_, index) =>
    getSceneJourneyProgress(index, SCENE_COUNT),
  );

  assert.deepEqual(targets, [0, 0.2, 0.4, 0.6, 0.8, 1]);
});

test("rejects invalid scene counts, indices, and blend windows", () => {
  assert.throws(() => calculateJourneyTimeline(0, 0), RangeError);
  assert.throws(() => calculateJourneyTimeline(0, 2.5), RangeError);
  assert.throws(() => calculateJourneyTimeline(0, 2, 1), RangeError);
  assert.throws(() => getSceneJourneyProgress(6, SCENE_COUNT), RangeError);
});
