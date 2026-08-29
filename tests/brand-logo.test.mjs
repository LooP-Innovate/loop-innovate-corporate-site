import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const LOGO_PATHS = [
  "public/brand/loop-combination-white.png",
  "public/brand/loop-combination-full-color.png",
];

function readPngHeader(buffer) {
  assert.deepEqual(
    [...buffer.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colorType: buffer[25],
  };
}

test("keeps both official Combination logo variants on one RGBA canvas", async () => {
  const headers = await Promise.all(
    LOGO_PATHS.map(async (path) => readPngHeader(await readFile(path))),
  );

  for (const header of headers) {
    assert.deepEqual(header, {
      width: 392,
      height: 72,
      bitDepth: 8,
      colorType: 6,
    });
  }

  assert.deepEqual(headers[0], headers[1]);
});
