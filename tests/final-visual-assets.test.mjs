import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const WIDE_BACKGROUNDS = [
  "ai-fde-definition-wide.webp",
  "field-loop-fields-wide.webp",
];

const REMOVED_DISPLAY_ASSETS = [
  "ai-fde-flagship.webp",
  "human-centered-ai.webp",
  "system-design-architecture.webp",
  "for-every-field.webp",
];

test("keeps only the two optimized wide visuals in the page integrations", async () => {
  const [routeSource, homeSource, nextConfig, journeySource] = await Promise.all([
    readFile("components/site/RoutePage.tsx", "utf8"),
    readFile("components/site/HomeSections.tsx", "utf8"),
    readFile("next.config.ts", "utf8"),
    readFile("components/scrollytelling/LoopJourney.tsx", "utf8"),
  ]);
  const integratedSource = `${routeSource}\n${homeSource}`;

  assert.match(routeSource, /from "next\/image"/);
  assert.match(homeSource, /from "next\/image"/);
  assert.match(nextConfig, /formats: \["image\/avif", "image\/webp"\]/);
  assert.doesNotMatch(integratedSource, /priority|loading="eager"/);
  assert.doesNotMatch(journeySource, /media\/corporate/);

  for (const asset of WIDE_BACKGROUNDS) {
    const bytes = await readFile(`public/media/corporate/${asset}`);
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP");
    assert.equal(
      integratedSource.match(new RegExp(asset.replaceAll(".", "\\."), "g"))?.length,
      1,
    );
  }

  assert.equal(integratedSource.match(/<Image/g)?.length, WIDE_BACKGROUNDS.length + 1);
  assert.equal(integratedSource.match(/\sfill/g)?.length, WIDE_BACKGROUNDS.length + 1);
  assert.equal(integratedSource.match(/\ssizes="100vw"/g)?.length, WIDE_BACKGROUNDS.length);
  assert.equal(integratedSource.match(/\salt=""/g)?.length, WIDE_BACKGROUNDS.length);
  assert.equal(
    (integratedSource.match(/aria-hidden="true"/g)?.length ?? 0) >= WIDE_BACKGROUNDS.length,
    true,
  );

  for (const asset of REMOVED_DISPLAY_ASSETS) {
    await assert.rejects(access(`public/media/corporate/${asset}`));
    assert.doesNotMatch(integratedSource, new RegExp(asset.replaceAll(".", "\\.")));
  }
  await assert.rejects(access("components/site/RouteAssetVisuals.tsx"));
});

test("places the new images as restrained backgrounds in existing sections", async () => {
  const [routeSource, homeSource, siteCss] = await Promise.all([
    readFile("components/site/RoutePage.tsx", "utf8"),
    readFile("components/site/HomeSections.tsx", "utf8"),
    readFile("components/site/site.module.css", "utf8"),
  ]);

  assert.match(routeSource, /content\.slug === "ai-fde" && index === 0/);
  assert.match(routeSource, /aiFdeDefinitionBackground[\s\S]*?ai-fde-definition-wide\.webp/);
  assert.match(homeSource, /journeyExit[\s\S]*?fieldLoopWideBackground[\s\S]*?field-loop-fields-wide\.webp/);
  assert.match(siteCss, /\.aiFdeDefinitionBackground\s*\{[\s\S]*?position: absolute/);
  assert.match(siteCss, /\.aiFdeDefinitionBackground::after\s*\{[\s\S]*?linear-gradient/);
  assert.match(siteCss, /\.fieldLoopWideBackground\s*\{[\s\S]*?position: absolute/);
  assert.match(siteCss, /\.fieldLoopWideBackground::after\s*\{[\s\S]*?linear-gradient/);
  assert.match(siteCss, /@media \(max-width: 48rem\)[\s\S]*?\.aiFdeDefinitionBackground[\s\S]*?height: 20rem/);
  assert.doesNotMatch(siteCss, /visualAssetSection|asset-mask|asset-fade|asset-scale|asset-reveal/);
});
