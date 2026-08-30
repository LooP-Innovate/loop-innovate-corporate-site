import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const chunksDirectory = path.join(projectRoot, ".next", "static", "chunks");
const outputPath = path.join(
  projectRoot,
  "docs",
  "wordpress-font-face-reference.css",
);

const cssFiles = (await readdir(chunksDirectory))
  .filter((fileName) => fileName.endsWith(".css"))
  .sort();

const fontFaces = [];

for (const fileName of cssFiles) {
  const css = await readFile(path.join(chunksDirectory, fileName), "utf8");

  for (const match of css.matchAll(/@font-face\{[^}]+\}/g)) {
    if (
      match[0].includes("font-family:Inter") ||
      match[0].includes("font-family:Noto Sans JP")
    ) {
      fontFaces.push(match[0]);
    }
  }
}

if (fontFaces.length === 0) {
  throw new Error(
    "No Inter or Noto Sans JP @font-face declarations were found. Run the production build first.",
  );
}

const formatted = fontFaces
  .map((rule) =>
    rule
      .replace("@font-face{", "@font-face {\n  ")
      .replace(/;/g, ";\n  ")
      .replace(/\}$/, "\n}"),
  )
  .join("\n\n");

const header = `/*
 * Generated from the production Next.js build by:
 *   node scripts/extract-font-face-reference.mjs
 *
 * Migration reference only. Copy the corresponding WOFF2 files, preserve the
 * unicode-range values, verify licenses and URLs, then re-run visual QA before
 * using these declarations in the WordPress theme.
 */

`;

await writeFile(outputPath, `${header}${formatted}\n`, "utf8");
console.log(`Wrote ${fontFaces.length} @font-face declarations to ${outputPath}`);
