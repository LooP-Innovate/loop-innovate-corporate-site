import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("integrates the real founder portrait only in the existing About founder section", async () => {
  const [routeSource, portrait] = await Promise.all([
    readFile("components/site/RoutePage.tsx", "utf8"),
    readFile("public/media/corporate/founder-koichi-mikami.webp"),
  ]);

  assert.equal(portrait.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(portrait.subarray(8, 12).toString("ascii"), "WEBP");
  assert.match(routeSource, /content\.slug === "about" && index === 0/);
  assert.match(routeSource, /founder-koichi-mikami\.webp/);
  assert.match(routeSource, /alt="L∞P Innovate代表 三上耕一のプロフィール写真"/);
  assert.match(routeSource, /FOUNDER \/ PROFILE/);
  assert.match(routeSource, /三上 耕一/);
  assert.doesNotMatch(routeSource, /priority|loading="eager"/);
});

test("keeps the three principles as one lightweight static-first SVG flow", async () => {
  const [homeSource, graphicSource, siteCss] = await Promise.all([
    readFile("components/site/HomeSections.tsx", "utf8"),
    readFile("components/site/PrincipleGraphic.tsx", "utf8"),
    readFile("components/site/site.module.css", "utf8"),
  ]);
  const reducedMotionCss = siteCss.slice(
    siteCss.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  assert.match(homeSource, /Human-centered[\s\S]*?人から逆算する/);
  assert.match(homeSource, /Intelligent[\s\S]*?判断を仕組みに変える/);
  assert.match(homeSource, /Real-world[\s\S]*?現場で育て続ける/);
  assert.equal(homeSource.match(/<PrincipleGraphic/g)?.length, 3);
  assert.match(graphicSource, /kind: "human" \| "judgment" \| "operation"/);
  assert.match(graphicSource, /aria-hidden="true"/);
  assert.match(graphicSource, /pathLength="1"/);
  assert.doesNotMatch(graphicSource, /<Image|∞|setInterval|requestAnimationFrame/);
  assert.match(siteCss, /\.principleGraphicBase\s*\{[\s\S]*?rgb\(50 139 211 \/ 11%\)/);
  assert.match(siteCss, /\.principleGraphicActive :is\(path, ellipse\)[\s\S]*?stroke-dashoffset: 1/);
  assert.match(siteCss, /article:hover \.principleGraphicActive :is\(path, ellipse\)[\s\S]*?stroke-dashoffset: 0/);
  assert.match(reducedMotionCss, /\.principleGraphicActive\s*\{[\s\S]*?display: none/);
});

test("raises FIELD LOOP figure clarity without adding image filters", async () => {
  const siteCss = await readFile("components/site/site.module.css", "utf8");

  assert.match(siteCss, /\.fieldLoopWideBackground img\s*\{[\s\S]*?opacity: 0\.82/);
  assert.match(siteCss, /\.fieldLoopWideBackground::after\s*\{[\s\S]*?rgb\(247 247 245 \/ 26%\)/);
  assert.doesNotMatch(
    siteCss.match(/\.fieldLoopWideBackground img\s*\{[\s\S]*?\}/)?.[0] ?? "",
    /filter:/,
  );
});
