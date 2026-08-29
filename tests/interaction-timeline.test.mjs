import assert from "node:assert/strict";
import test from "node:test";

import {
  BUILD_STEP_BOUNDARIES,
  BUILD_WINDOW_STEPS,
  RETURN_FORMATION_END,
  getBuildWindowStep,
  getJourneyInteractionState,
  getReturnExitPhase,
  getReturnExitProgress,
  getReturnExitVisualState,
  getReturnPhase,
  getReturnTransitionProgress,
  normalizeProgress,
} from "../lib/scrollytelling/interaction-timeline.ts";
import { calculateJourneyTimeline } from "../lib/scrollytelling/timeline.ts";

function assertApproximately(actual, expected, epsilon = 1e-10) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `Expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

function atFinalSegment(segmentProgress) {
  return calculateJourneyTimeline((4 + segmentProgress) / 5, 6);
}

test("maps every BUILD boundary to a deterministic inner-window step", () => {
  BUILD_WINDOW_STEPS.forEach((step, index) => {
    const start = BUILD_STEP_BOUNDARIES[index];
    const end = BUILD_STEP_BOUNDARIES[index + 1];

    assert.equal(getBuildWindowStep(start), step);
    assert.equal(getBuildWindowStep(Math.max(start, end - 1e-6)), step);
  });
});

test("uses a complete static BUILD state for reduced motion", () => {
  for (const progress of [0, 0.25, 0.5, 0.999, 1]) {
    assert.equal(getBuildWindowStep(progress, true), "output");
  }
});

test("honors the quiet RETURN dawn phase boundaries", () => {
  const checkpoints = [
    [0, "base"],
    [0.249999, "base"],
    [0.25, "breathing"],
    [0.55, "dawn"],
    [0.8, "complete"],
    [1, "complete"],
  ];

  for (const [progress, phase] of checkpoints) {
    assert.equal(getReturnPhase(progress), phase);
  }
});

test("completes RETURN before the dedicated exit range starts", () => {
  assert.equal(getReturnTransitionProgress(atFinalSegment(0)), 0);
  assertApproximately(
    getReturnTransitionProgress(atFinalSegment(RETURN_FORMATION_END / 2)),
    0.5,
  );
  assertApproximately(
    getReturnTransitionProgress(atFinalSegment(RETURN_FORMATION_END)),
    1,
  );
  assert.equal(getReturnTransitionProgress(atFinalSegment(0.92)), 1);

  assert.equal(getReturnExitProgress(atFinalSegment(0.5)), 0);
  assertApproximately(
    getReturnExitProgress(atFinalSegment(RETURN_FORMATION_END)),
    0,
  );
  assertApproximately(getReturnExitProgress(atFinalSegment(0.86)), 0.5);
  assert.equal(getReturnExitProgress(atFinalSegment(1)), 1);
});

test("maps the RETURN exit through particles, erosion, wash, and white", () => {
  const checkpoints = [
    [0, "hold"],
    [0.04, "particles"],
    [0.2, "erosion"],
    [0.62, "wash"],
    [0.9, "white"],
    [1, "white"],
  ];

  for (const [progress, phase] of checkpoints) {
    assert.equal(getReturnExitPhase(progress), phase);
  }

  const early = getReturnExitVisualState(0.04);
  const middle = getReturnExitVisualState(0.45);
  const complete = getReturnExitVisualState(1);
  assert.equal(early.returnExitParticles, 0);
  assert.ok(middle.returnExitParticles > 0);
  assert.ok(middle.returnExitErosion > 0);
  assert.equal(middle.returnExitWash, 0);
  assert.equal(complete.returnExitParticles, 1);
  assert.equal(complete.returnExitErosion, 1);
  assert.equal(complete.returnExitWash, 1);
  assert.equal(complete.returnExitWhite, 1);
  assert.equal(complete.returnExitEdge, -12);
});

test("keeps RETURN formation and exit fully reversible", () => {
  const segmentValues = [0, 0.18, 0.4, 0.576, 0.72, 0.79, 0.86, 0.94, 1];
  const sample = (segmentProgress) => {
    const timeline = atFinalSegment(segmentProgress);
    return {
      returnProgress: getReturnTransitionProgress(timeline),
      returnPhase: getReturnPhase(getReturnTransitionProgress(timeline)),
      exitProgress: getReturnExitProgress(timeline),
      exitPhase: getReturnExitPhase(getReturnExitProgress(timeline)),
    };
  };
  const forward = segmentValues.map(sample);
  const reverse = [...segmentValues].reverse().map(sample);

  assert.deepEqual(reverse, [...forward].reverse());
});

test("uses deterministic static exit states for reduced motion", () => {
  assert.deepEqual(getReturnExitVisualState(0.19, true), {
    returnExitParticles: 0,
    returnExitErosion: 0,
    returnExitWash: 0,
    returnExitWhite: 0,
    returnExitEdge: 112,
  });
  assert.equal(
    getReturnExitVisualState(0.2, true).returnExitParticles,
    0.86,
  );
  assert.equal(getReturnExitVisualState(0.55, true).returnExitErosion, 1);
  assert.equal(getReturnExitVisualState(0.72, true).returnExitWash, 1);
  assert.equal(getReturnExitVisualState(0.86, true).returnExitWhite, 1);
  assert.equal(getReturnExitPhase(0.19, true), "hold");
  assert.equal(getReturnExitPhase(0.2, true), "particles");
  assert.equal(getReturnExitPhase(0.55, true), "erosion");
  assert.equal(getReturnExitPhase(0.72, true), "wash");
  assert.equal(getReturnExitPhase(0.86, true), "white");
});

test("exposes coherent CSS interaction values without React-only state", () => {
  const buildState = getJourneyInteractionState(
    calculateJourneyTimeline(0.72, 6),
    "build",
    false,
  );
  assert.equal(buildState.buildStep, "ai-workflow");

  const returnState = getJourneyInteractionState(
    atFinalSegment(0.576),
    "adopt",
    false,
  );
  assert.equal(returnState.returnPhase, "complete");
  assertApproximately(returnState.returnProgress, 0.8);
  assert.equal(returnState.returnExitProgress, 0);
});

test("clamps invalid progress and rejects inverted ranges", () => {
  assert.equal(normalizeProgress(Number.NaN, 0.2, 0.4), 0);
  assert.equal(normalizeProgress(-1, 0.2, 0.4), 0);
  assert.equal(normalizeProgress(2, 0.2, 0.4), 1);
  assert.throws(() => normalizeProgress(0.5, 1, 1), RangeError);
});
