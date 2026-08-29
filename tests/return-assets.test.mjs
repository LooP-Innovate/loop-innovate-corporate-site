import assert from "node:assert/strict";
import { closeSync, existsSync, openSync, readSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import {
  RETURN_EXIT_ASSETS,
  RETURN_EXIT_PUBLIC_DIRECTORY,
} from "../lib/scrollytelling/return-assets.ts";

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

test("registers R-13 before R-14 as dedicated RETURN exit assets", () => {
  assert.deepEqual(Object.keys(RETURN_EXIT_ASSETS), ["particles", "wash"]);
  assert.equal(
    RETURN_EXIT_ASSETS.particles,
    `${RETURN_EXIT_PUBLIC_DIRECTORY}/white-dot-dissolve-particles.webp`,
  );
  assert.equal(
    RETURN_EXIT_ASSETS.wash,
    `${RETURN_EXIT_PUBLIC_DIRECTORY}/white-transition-wash.webp`,
  );
});

test("backs every RETURN exit asset with a WebP file", () => {
  for (const publicUrl of Object.values(RETURN_EXIT_ASSETS)) {
    const file = resolve("public", publicUrl.slice(1));
    assert.ok(existsSync(file), `Missing RETURN exit asset: ${publicUrl}`);
    assert.ok(isWebp(file), `RETURN exit asset is not WebP: ${publicUrl}`);
  }
});
