import { spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  openSync,
  readSync,
  readdirSync,
  statSync,
} from "node:fs";
import { basename, dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  JOURNEY_POSTER_PUBLIC_DIRECTORY,
  JOURNEY_STILL_PUBLIC_DIRECTORY,
  JOURNEY_VIDEO_PUBLIC_DIRECTORY,
  LEGACY_FIELD_VIDEO_PATH,
  SCENES,
  validateSceneConfig,
} from "../lib/scrollytelling/scene-config.ts";
import {
  JOURNEY_LAYERS,
  JOURNEY_LAYER_PUBLIC_DIRECTORY,
} from "../lib/scrollytelling/layer-config.ts";
import {
  RETURN_EXIT_ASSETS,
  RETURN_EXIT_PUBLIC_DIRECTORY,
} from "../lib/scrollytelling/return-assets.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(projectRoot, "public");
const errors = [];
const configuredPaths = new Map();
const configuredVideos = [];
const configuredStills = [];
const configuredLayers = [];
const configuredReturnExitAssets = [];

function publicUrlToFile(publicUrl) {
  if (!publicUrl.startsWith("/") || publicUrl.includes("?") || publicUrl.includes("#")) {
    throw new Error(`Asset path must be a root-relative public URL: ${publicUrl}`);
  }

  const file = resolve(publicRoot, publicUrl.slice(1));

  if (file !== publicRoot && !file.startsWith(`${publicRoot}${sep}`)) {
    throw new Error(`Asset path escapes public/: ${publicUrl}`);
  }

  return file;
}

function expectedFileName(scene, assetType, variant, extension) {
  const suffix = variant === "mobile" ? "-mobile" : "";

  if (assetType === "still") {
    const stillStem = scene.contractStillFile.slice(
      0,
      -extname(scene.contractStillFile).length,
    );
    return `${stillStem}${suffix}${extension}`;
  }

  return `${scene.contractStem}${suffix}${extension}`;
}

function isContractLocation(publicUrl, publicDirectory) {
  return dirname(publicUrl).replaceAll("\\", "/") === publicDirectory;
}

function hasMp4FileTypeBox(file) {
  const descriptor = openSync(file, "r");
  const header = Buffer.alloc(12);

  try {
    const bytesRead = readSync(descriptor, header, 0, header.length, 0);
    return bytesRead >= 8 && header.toString("ascii", 4, 8) === "ftyp";
  } finally {
    closeSync(descriptor);
  }
}

function hasWebpFileTypeBox(file) {
  const descriptor = openSync(file, "r");
  const header = Buffer.alloc(12);

  try {
    const bytesRead = readSync(descriptor, header, 0, header.length, 0);
    return (
      bytesRead >= 12 &&
      header.toString("ascii", 0, 4) === "RIFF" &&
      header.toString("ascii", 8, 12) === "WEBP"
    );
  } finally {
    closeSync(descriptor);
  }
}

function validateConfiguredAsset(scene, assetType, variant, publicUrl) {
  const slot = `${scene.label} ${variant} ${assetType}`;
  const previousSlot = configuredPaths.get(publicUrl);

  if (previousSlot) {
    errors.push(`Duplicate configured path ${publicUrl}: ${previousSlot} and ${slot}.`);
  } else {
    configuredPaths.set(publicUrl, slot);
  }

  let file;

  try {
    file = publicUrlToFile(publicUrl);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return;
  }

  const extension = extname(publicUrl).toLowerCase();

  if (assetType === "video") {
    if (extension !== ".mp4") {
      errors.push(`${slot} must use the .mp4 extension: ${publicUrl}`);
    }

    const isLegacyFieldAlias =
      scene.id === "field" &&
      variant === "desktop" &&
      publicUrl === LEGACY_FIELD_VIDEO_PATH;

    if (!isLegacyFieldAlias) {
      const expectedName = expectedFileName(scene, assetType, variant, ".mp4");

      if (
        !isContractLocation(publicUrl, JOURNEY_VIDEO_PUBLIC_DIRECTORY) ||
        basename(publicUrl) !== expectedName
      ) {
        errors.push(
          `${slot} must be ${JOURNEY_VIDEO_PUBLIC_DIRECTORY}/${expectedName}.`,
        );
      }
    }
  } else if (assetType === "still") {
    if (extension !== ".webp") {
      errors.push(`${slot} must use the approved .webp extension: ${publicUrl}`);
    }

    const expectedName = expectedFileName(scene, assetType, variant, ".webp");

    if (
      !isContractLocation(publicUrl, JOURNEY_STILL_PUBLIC_DIRECTORY) ||
      basename(publicUrl) !== expectedName
    ) {
      errors.push(
        `${slot} must be ${JOURNEY_STILL_PUBLIC_DIRECTORY}/${expectedName}.`,
      );
    }
  } else {
    const allowedExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

    if (!allowedExtensions.has(extension)) {
      errors.push(`${slot} uses an unsupported poster extension: ${publicUrl}`);
    }

    const expectedName = expectedFileName(scene, assetType, variant, extension);

    if (
      !isContractLocation(publicUrl, JOURNEY_POSTER_PUBLIC_DIRECTORY) ||
      basename(publicUrl) !== expectedName
    ) {
      errors.push(
        `${slot} must be ${JOURNEY_POSTER_PUBLIC_DIRECTORY}/${expectedName}.`,
      );
    }
  }

  if (!existsSync(file) || !statSync(file).isFile()) {
    errors.push(`${slot} is configured but missing: ${publicUrl}`);
    return;
  }

  if (assetType === "video") {
    try {
      if (!hasMp4FileTypeBox(file)) {
        errors.push(`${slot} is not an MP4 container: ${publicUrl}`);
        return;
      }
    } catch {
      errors.push(`${slot} could not be read: ${publicUrl}`);
      return;
    }

    configuredVideos.push({ scene, variant, publicUrl, file });
  } else if (assetType === "still") {
    try {
      if (!hasWebpFileTypeBox(file)) {
        errors.push(`${slot} is not a WebP container: ${publicUrl}`);
        return;
      }
    } catch {
      errors.push(`${slot} could not be read: ${publicUrl}`);
      return;
    }

    configuredStills.push({ scene, variant, publicUrl, file });
  }
}

function validateSelectedLayer(layer) {
  const slot = `${layer.sceneId.toUpperCase()} selected layer ${layer.id}`;
  const expectedDirectory = `${JOURNEY_LAYER_PUBLIC_DIRECTORY}/${layer.sceneId}`;
  const expectedUrl = `${expectedDirectory}/${layer.id}.webp`;

  if (layer.src !== expectedUrl) {
    errors.push(`${slot} must use canonical path ${expectedUrl}.`);
    return;
  }

  if (configuredPaths.has(layer.src)) {
    errors.push(`Duplicate configured path ${layer.src}: ${slot}.`);
    return;
  }

  configuredPaths.set(layer.src, slot);
  const file = publicUrlToFile(layer.src);

  if (!existsSync(file) || !statSync(file).isFile()) {
    errors.push(`${slot} is configured but missing: ${layer.src}`);
    return;
  }

  try {
    if (!hasWebpFileTypeBox(file)) {
      errors.push(`${slot} is not a WebP container: ${layer.src}`);
      return;
    }
  } catch {
    errors.push(`${slot} could not be read: ${layer.src}`);
    return;
  }

  configuredLayers.push(layer);
  console.log(`LAYER     ${layer.sceneId.toUpperCase()} ${layer.id} (${layer.motion})`);
}

function validateReturnExitAsset(id, publicUrl) {
  const slot = `RETURN EXIT ${id}`;

  if (
    dirname(publicUrl).replaceAll("\\", "/") !==
      RETURN_EXIT_PUBLIC_DIRECTORY ||
    extname(publicUrl).toLowerCase() !== ".webp"
  ) {
    errors.push(`${slot} must use a WebP in ${RETURN_EXIT_PUBLIC_DIRECTORY}.`);
    return;
  }

  if (configuredPaths.has(publicUrl)) {
    errors.push(`Duplicate configured path ${publicUrl}: ${slot}.`);
    return;
  }

  configuredPaths.set(publicUrl, slot);
  const file = publicUrlToFile(publicUrl);

  if (!existsSync(file) || !statSync(file).isFile()) {
    errors.push(`${slot} is configured but missing: ${publicUrl}`);
    return;
  }

  try {
    if (!hasWebpFileTypeBox(file)) {
      errors.push(`${slot} is not a WebP container: ${publicUrl}`);
      return;
    }
  } catch {
    errors.push(`${slot} could not be read: ${publicUrl}`);
    return;
  }

  configuredReturnExitAssets.push(publicUrl);
  console.log(`RETURN    EXIT ${id}`);
}

function assetLabel(scene) {
  const stills = [scene.desktopStill, scene.mobileStill].filter(Boolean);
  const posters = [scene.desktopPoster, scene.mobilePoster].filter(Boolean);

  if (stills.length > 0) {
    return `STILL ${stills.join(", ")}`;
  }

  if (posters.length > 0) {
    return `POSTER ${posters.join(", ")}`;
  }

  return `expected ${JOURNEY_STILL_PUBLIC_DIRECTORY}/${scene.contractStillFile}`;
}

function scanContractDirectory(publicDirectory, allowedNames) {
  const directory = publicUrlToFile(publicDirectory);

  if (!existsSync(directory)) {
    console.log(`MISSING   ${publicDirectory} directory is not present.`);
    return;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === ".gitkeep" || entry.name === "README.md") {
      continue;
    }

    const publicUrl = `${publicDirectory}/${entry.name}`;

    if (!allowedNames.has(entry.name)) {
      errors.push(`Unexpected asset name in ${publicDirectory}: ${entry.name}`);
      continue;
    }

    if (!configuredPaths.has(publicUrl)) {
      console.log(`OPTIONAL  ${publicUrl} exists but is not configured.`);
    }
  }
}

function parseFrameRate(value) {
  if (!value || value === "0/0") {
    return "unknown";
  }

  const [numerator, denominator] = value.split("/").map(Number);
  const fps = denominator ? numerator / denominator : Number(value);
  return Number.isFinite(fps) ? fps.toFixed(3) : value;
}

function probeVideos() {
  const ffprobeCommand = process.env.FFPROBE_PATH || "ffprobe";
  const version = spawnSync(ffprobeCommand, ["-version"], {
    encoding: "utf8",
    windowsHide: true,
  });

  if (version.status !== 0) {
    console.log("ffprobe  OPTIONAL (not found; metadata checks skipped)");
    return;
  }

  for (const video of configuredVideos) {
    const probe = spawnSync(
      ffprobeCommand,
      [
        "-v",
        "error",
        "-show_entries",
        "stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt:format=duration",
        "-of",
        "json",
        video.file,
      ],
      { encoding: "utf8", windowsHide: true },
    );

    if (probe.status !== 0) {
      errors.push(`ffprobe could not read ${video.publicUrl}.`);
      continue;
    }

    try {
      const data = JSON.parse(probe.stdout);
      const stream = data.streams?.find((candidate) => candidate.codec_type === "video");
      const hasAudio = data.streams?.some((candidate) => candidate.codec_type === "audio");
      const duration = Number(data.format?.duration);

      if (!stream) {
        errors.push(`No video stream found in ${video.publicUrl}.`);
        continue;
      }

      console.log(
        `PROBE     ${video.scene.label} ${video.variant}: ${stream.width}x${stream.height}, ${stream.codec_name}, ${stream.pix_fmt}, ${parseFrameRate(stream.avg_frame_rate)}fps, ${Number.isFinite(duration) ? duration.toFixed(3) : "unknown"}s, audio=${hasAudio ? "yes" : "no"}`,
      );
    } catch {
      errors.push(`ffprobe returned invalid JSON for ${video.publicUrl}.`);
    }
  }
}

console.log("Journey asset readiness");

for (const issue of validateSceneConfig(SCENES)) {
  errors.push(`Scene config: ${issue.message}`);
}

for (const scene of SCENES) {
  const sources = [
    ["still", "desktop", scene.desktopStill],
    ["still", "mobile", scene.mobileStill],
    ["video", "desktop", scene.desktopVideo],
    ["video", "mobile", scene.mobileVideo],
    ["poster", "desktop", scene.desktopPoster],
    ["poster", "mobile", scene.mobilePoster],
  ];

  for (const [assetType, variant, publicUrl] of sources) {
    if (publicUrl) {
      validateConfiguredAsset(scene, assetType, variant, publicUrl);
    }
  }

  console.log(
    `${scene.label.padEnd(8)} ${scene.status.toUpperCase().padEnd(7)} ${assetLabel(scene)}`,
  );

  if (!scene.mobileStill) {
    console.log(
      `${"".padEnd(8)} OPTIONAL mobile still (desktop fallback is intentional).`,
    );
  }

  if (scene.mediaRole === "transition") {
    const optionalVideo = scene.desktopVideo
      ? scene.desktopVideo
      : `${JOURNEY_VIDEO_PUBLIC_DIRECTORY}/${scene.contractVideoFile}`;
    console.log(`${"".padEnd(8)} OPTIONAL video ${optionalVideo}`);
  }
}

for (const layers of Object.values(JOURNEY_LAYERS)) {
  for (const layer of layers) {
    validateSelectedLayer(layer);
  }
}

for (const [id, publicUrl] of Object.entries(RETURN_EXIT_ASSETS)) {
  validateReturnExitAsset(id, publicUrl);
}

const stillNames = new Set(
  SCENES.flatMap((scene) => {
    const stem = scene.contractStillFile.slice(0, -".webp".length);
    return [scene.contractStillFile, `${stem}-mobile.webp`];
  }),
);
const videoNames = new Set(
  SCENES.filter((scene) => scene.mediaRole === "transition").flatMap((scene) => [
    `${scene.contractStem}.mp4`,
    `${scene.contractStem}-mobile.mp4`,
  ]),
);
const posterNames = new Set(
  SCENES.flatMap((scene) =>
    [".avif", ".jpeg", ".jpg", ".png", ".webp"].flatMap((extension) => [
      `${scene.contractStem}${extension}`,
      `${scene.contractStem}-mobile${extension}`,
    ]),
  ),
);

scanContractDirectory(JOURNEY_STILL_PUBLIC_DIRECTORY, stillNames);
scanContractDirectory(JOURNEY_VIDEO_PUBLIC_DIRECTORY, videoNames);
scanContractDirectory(JOURNEY_POSTER_PUBLIC_DIRECTORY, posterNames);

for (const [sceneId, layers] of Object.entries(JOURNEY_LAYERS)) {
  scanContractDirectory(
    `${JOURNEY_LAYER_PUBLIC_DIRECTORY}/${sceneId}`,
    new Set(layers.map((layer) => basename(layer.src))),
  );
}
scanContractDirectory(
  RETURN_EXIT_PUBLIC_DIRECTORY,
  new Set(Object.values(RETURN_EXIT_ASSETS).map((asset) => basename(asset))),
);
probeVideos();

if (errors.length > 0) {
  console.error("\nJourney asset validation FAILED");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  const readyCount = SCENES.filter((scene) => scene.status === "ready").length;
  const missingCount = SCENES.length - readyCount;
  console.log(
    `\nJourney asset validation PASS (${readyCount} READY, ${missingCount} MISSING, ${configuredStills.length} verified still files, ${configuredLayers.length} selected layers, ${configuredReturnExitAssets.length} RETURN exit assets; mobile stills and videos OPTIONAL).`,
  );
}
