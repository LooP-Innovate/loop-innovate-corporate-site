import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps FIELD TO SYSTEM one-shot and reduced-motion safe", async () => {
  const [typewriterSource, motionSource, siteCss] = await Promise.all([
    readFile("components/site/FieldToSystemTypewriter.tsx", "utf8"),
    readFile("components/site/CorporateMotion.tsx", "utf8"),
    readFile("components/site/site.module.css", "utf8"),
  ]);
  const reducedMotionCss = siteCss.slice(
    siteCss.lastIndexOf("@media (prefers-reduced-motion: reduce)"),
  );

  assert.match(typewriterSource, /data-motion="typewriter"/);
  assert.match(typewriterSource, /word: "FIELD"[\s\S]*word: "TO"[\s\S]*word: "SYSTEM"/);
  assert.match(motionSource, /observer\.unobserve\(target\)/);
  assert.match(motionSource, /target\.dataset\.typewriterState = "typing"/);
  assert.match(motionSource, /target\.dataset\.typewriterState = "complete"/);
  assert.match(siteCss, /@keyframes typewriterCursorFinalBlink/);
  assert.match(
    siteCss,
    /\[data-typewriter-state="complete"\] \.typewriterGlyph\s*\{[\s\S]*?opacity: 1 !important;[\s\S]*?animation: none !important;/,
  );
  assert.match(
    siteCss,
    /\[data-typewriter-state="complete"\] \.typewriterCursor\s*\{[\s\S]*?display: none !important;[\s\S]*?animation: none !important;/,
  );
  assert.match(
    reducedMotionCss,
    /\.typewriterGlyph\s*\{[\s\S]*?opacity: 1 !important;[\s\S]*?animation: none !important;/,
  );
  assert.match(
    reducedMotionCss,
    /\.typewriterCursor\s*\{[\s\S]*?display: none !important;/,
  );
});

test("keeps the cursor orb subtle, pointer-only, and render-free", async () => {
  const [controllerSource, homeSource, routeSource, siteCss] =
    await Promise.all([
      readFile("components/site/CursorReactiveLight.tsx", "utf8"),
      readFile("components/site/HomeSections.tsx", "utf8"),
      readFile("components/site/RoutePage.tsx", "utf8"),
      readFile("components/site/site.module.css", "utf8"),
    ]);

  assert.match(controllerSource, /\(pointer: fine\)/);
  assert.match(controllerSource, /\(prefers-reduced-motion: no-preference\)/);
  assert.match(controllerSource, /\(forced-colors: none\)/);
  assert.match(controllerSource, /requestAnimationFrame\(renderFrame\)/);
  assert.doesNotMatch(controllerSource, /useState/);
  assert.match(controllerSource, /NATIVE_CURSOR_SELECTOR/);
  assert.match(controllerSource, /SELECTABLE_TEXT_SELECTOR/);
  assert.match(controllerSource, /TONE_SELECTOR/);
  assert.match(controllerSource, /clamp\(deltaX, -magneticLimit, magneticLimit\)/);
  assert.match(controllerSource, /data-interactive="false"/);
  assert.match(controllerSource, /data-surface-tone="dark"/);
  assert.match(controllerSource, /aria-hidden="true"/);
  assert.match(homeSource, /data-cursor-light-surface/);
  assert.match(routeSource, /data-cursor-light-surface/);
  assert.match(siteCss, /\.cursorOrb\s*\{[\s\S]*?pointer-events: none;/);
  assert.match(siteCss, /\.cursorOrbLens\s*\{[\s\S]*?width: 0\.75rem;[\s\S]*?height: 0\.75rem;/);
  assert.match(siteCss, /data-surface-tone="light"/);
  assert.match(siteCss, /scale\(2\.75\)/);
  assert.match(
    siteCss,
    /@media \(min-width: 64\.001rem\) and \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\) and \(forced-colors: none\)/,
  );
});

test("keeps the final content hierarchy concise and plain-language", async () => {
  const [homeSource, sectionsSource, footerSource, contentSource] =
    await Promise.all([
      readFile("app/page.tsx", "utf8"),
      readFile("components/site/HomeSections.tsx", "utf8"),
      readFile("components/site/SiteFooter.tsx", "utf8"),
      readFile("lib/site/site-content.ts", "utf8"),
    ]);

  assert.doesNotMatch(homeSource, /課題を聞くだけでも、システムを作るだけでも終わらせない。/);
  assert.match(homeSource, /<span>現場を、<\/span>[\s\S]*<span>仕組みから変える。<\/span>/);
  assert.doesNotMatch(footerSource, /現場を、仕組みから変える。/);
  assert.doesNotMatch(sectionsSource, /title="現場を、仕組みから変える。"/);
  assert.match(
    contentSource,
    /現場の課題を整理し、必要な仕組みを考え、実際に作り、使える状態までつなげる支援の進め方です。/,
  );
  assert.match(
    contentSource,
    /「AIを導入すること」から始めるのではなく、まず今の業務を理解し、どこを変えるべきかを整理します。/,
  );
  assert.match(
    contentSource,
    /L∞P Innovateでは、この現場密着型の進め方を「AI-FDE」と呼んでいます。/,
  );
  assert.doesNotMatch(contentSource, /公的資格、認定制度、業界標準/);
});
