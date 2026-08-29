import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps Journey and Corporate effects bounded under reduced motion", async () => {
  const [engineSource, headerSource, journeyCss, siteCss] = await Promise.all([
    readFile("components/scrollytelling/useJourneyEngine.ts", "utf8"),
    readFile("components/site/SiteHeader.tsx", "utf8"),
    readFile("components/scrollytelling/loop-journey.module.css", "utf8"),
    readFile("components/site/site.module.css", "utf8"),
  ]);
  const journeyReducedMotion = journeyCss.slice(
    journeyCss.lastIndexOf("@media (prefers-reduced-motion: reduce)"),
  );
  const siteReducedMotion = siteCss.slice(
    siteCss.lastIndexOf("@media (prefers-reduced-motion: reduce)"),
  );

  assert.match(
    engineSource,
    /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/,
  );
  assert.match(engineSource, /dataset\.returnExitErosion/);
  assert.match(headerSource, /returnExitErosion >= 0\.55/);
  assert.match(journeyReducedMotion, /\.nextLayer\s*\{[\s\S]*?opacity: 0;/);
  assert.match(
    journeyReducedMotion,
    /\.dotDitherAsset,[\s\S]*?\.dotDitherField,[\s\S]*?\.dotDitherWash,[\s\S]*?\.dotDitherRelease\s*\{[\s\S]*?animation: none;[\s\S]*?transition: none;/,
  );
  assert.match(
    journeyReducedMotion,
    /\.buildLensSignalRing,[\s\S]*?\.buildLensRoute,[\s\S]*?\.buildLensFlowDot,[\s\S]*?\.buildLensSequence\s*\{[\s\S]*?animation: none;[\s\S]*?transition: none;/,
  );
  assert.match(
    journeyReducedMotion,
    /\.nextLayer\[data-visual-scene="return"\]\s*\{[\s\S]*?opacity: var\(--loop-return-base-opacity\);/,
  );
  assert.match(
    siteReducedMotion,
    /\.corporateRailTrack\s*\{[\s\S]*?animation: none;[\s\S]*?transform: none;/,
  );
});
