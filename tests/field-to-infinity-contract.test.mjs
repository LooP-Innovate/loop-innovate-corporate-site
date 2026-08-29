import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps Field to Infinity singular, scroll-linked, and lightweight", async () => {
  const [motionSource, routeVisualsSource, homeSource, journeySource] =
    await Promise.all([
      readFile("components/site/FieldToInfinityMotion.tsx", "utf8"),
      readFile("components/site/RouteVisuals.tsx", "utf8"),
      readFile("app/page.tsx", "utf8"),
      readFile("components/scrollytelling/LoopJourney.tsx", "utf8"),
    ]);

  assert.match(motionSource, /const PARTICLE_COUNT = 48/);
  assert.match(
    motionSource,
    /CLUSTER[\s\S]*RELEASE[\s\S]*SPLIT[\s\S]*ALIGNMENT[\s\S]*RECONSTRUCTION[\s\S]*SETTLE/,
  );
  assert.match(motionSource, /requestAnimationFrame\(render\)/);
  assert.match(motionSource, /IntersectionObserver/);
  assert.match(motionSource, /ResizeObserver/);
  assert.match(motionSource, /addEventListener\("scroll", handleScroll/);
  assert.match(motionSource, /removeEventListener\("scroll", handleScroll\)/);
  assert.doesNotMatch(motionSource, /useState/);
  assert.doesNotMatch(motionSource, /gsap|three|webgl/i);

  const routeInstances = routeVisualsSource.match(/<FieldToInfinityMotion \/>/g) ?? [];
  assert.equal(routeInstances.length, 1);
  assert.doesNotMatch(homeSource, /FieldToInfinityMotion/);
  assert.doesNotMatch(journeySource, /FieldToInfinityMotion/);
});

test("keeps the infinity complete, accessible, and static for simplified motion", async () => {
  const [motionSource, siteCss] = await Promise.all([
    readFile("components/site/FieldToInfinityMotion.tsx", "utf8"),
    readFile("components/site/site.module.css", "utf8"),
  ]);

  assert.match(motionSource, /Math\.sin\(theta\) \* width \* 0\.31/);
  assert.match(motionSource, /Math\.sin\(theta \* 2\) \* height \* 0\.145/);
  assert.match(motionSource, /prefers-reduced-motion: reduce/);
  assert.match(motionSource, /const progress = motionEnabled \? calculateProgress\(\) : 1/);
  assert.match(motionSource, /role="img"/);
  assert.match(motionSource, /aria-labelledby=\{titleId\}/);
  assert.match(motionSource, /aria-describedby=\{descriptionId\}/);
  assert.match(motionSource, /<canvas[\s\S]*aria-hidden="true"/);
  assert.match(siteCss, /\.fieldInfinityMotion\s*\{[\s\S]*?aspect-ratio: 12 \/ 7;[\s\S]*?overflow: hidden;/);
  assert.match(
    siteCss,
    /@media \(max-width: 48rem\)[\s\S]*?\.aboutStructureGraphic\s*\{[\s\S]*?right: 0;[\s\S]*?width: 100%;/,
  );
});
