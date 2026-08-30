import assert from "node:assert/strict";
import { existsSync, openSync, closeSync, readSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  JOURNEY_LAYERS,
  JOURNEY_LAYER_PUBLIC_DIRECTORY,
  JOURNEY_LAYER_SCENE_IDS,
} from "../lib/scrollytelling/layer-config.ts";

function isWebp(file) {
  const descriptor = openSync(file, "r");
  const header = Buffer.alloc(12);

  try {
    const bytesRead = readSync(descriptor, header, 0, header.length, 0);
    return (
      bytesRead === 12 &&
      header.toString("ascii", 0, 4) === "RIFF" &&
      header.toString("ascii", 8, 12) === "WEBP"
    );
  } finally {
    closeSync(descriptor);
  }
}

test("registers a bounded selected-layer set for all six scenes", () => {
  assert.deepEqual(Object.keys(JOURNEY_LAYERS), [...JOURNEY_LAYER_SCENE_IDS]);
  assert.deepEqual(
    Object.values(JOURNEY_LAYERS).map((layers) => layers.length),
    [1, 4, 4, 3, 3, 5],
  );

  for (const [sceneId, layers] of Object.entries(JOURNEY_LAYERS)) {
    for (const layer of layers) {
      assert.equal(layer.delivery, sceneId === "return" ? "next-image" : "source");
      assert.equal(layer.quality, sceneId === "return" ? 90 : null);
    }
  }
});

test("keeps selected URLs unique, canonical, and backed by WebP files", () => {
  const paths = new Set();

  for (const [sceneId, layers] of Object.entries(JOURNEY_LAYERS)) {
    for (const layer of layers) {
      assert.equal(layer.sceneId, sceneId);
      assert.ok(
        layer.src.startsWith(`${JOURNEY_LAYER_PUBLIC_DIRECTORY}/${sceneId}/`),
      );
      assert.ok(!paths.has(layer.src), `Duplicate layer path: ${layer.src}`);
      paths.add(layer.src);

      const file = resolve("public", layer.src.slice(1));
      assert.ok(existsSync(file), `Missing selected layer: ${layer.src}`);
      assert.ok(isWebp(file), `Selected layer is not WebP: ${layer.src}`);
    }
  }
});

test("never duplicates baked-in people or registers a giant RETURN infinity", () => {
  for (const [sceneId, layers] of Object.entries(JOURNEY_LAYERS)) {
    for (const layer of layers) {
      assert.equal(layer.containsHuman, false);
      assert.ok(!layer.id.includes("infinity"), `${sceneId}/${layer.id}`);
    }
  }

  assert.deepEqual(
    JOURNEY_LAYERS.return.map((layer) => layer.motion),
    [
      "milky-way-stars",
      "star-field",
      "dawn-horizon-glow",
      "subtle-grid-flow",
      "blue-particles",
    ],
  );
});
