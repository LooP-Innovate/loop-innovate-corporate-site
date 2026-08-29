# Video-Free Scrollytelling Readiness Checklist

## Status legend

- [x] Retained or documented contract supported by existing evidence.
- [~] Implemented/integrated or prepared, but final root verification has not
  yet been supplied.
- [!] Browser evidence blocked by the current localhost automation policy.
- [ ] Pending browser/manual evidence or an external approved input.

Do not promote a still-first item to [x] from documentation or source inspection
alone when it names runtime, browser, network, performance, asset decoding, or
assistive-technology behavior.

## Direction

- [x] Six fixed chapters remain FIELD, ORDER, DESIGN, BUILD, ADOPT, RETURN.
- [x] Pure global progress, local progress, next scene, and blend remain the
  narrative foundation.
- [x] Five generated transition videos are no longer a release requirement.
- [x] Static Cinematic Scrollytelling is documented as the default homepage mode.
- [x] Future video is explicitly optional and cannot replace the still baseline.
- [x] Integrated source, tests, production build, SSR output, HTTP routes, and
  static asset delivery are verified; visual browser QA is tracked separately.

## Still asset mapping

Canonical targets:

~~~text
FIELD   /media/journey/still/01-field.webp
ORDER   /media/journey/still/02-order.webp
DESIGN  /media/journey/still/03-design.webp
BUILD   /media/journey/still/04-build.webp
ADOPT   /media/journey/still/05-adopt.webp
RETURN  /media/journey/still/06-return.webp
~~~

- [x] Canonical names and optional -mobile suffix are documented.
- [x] FIELD source is the existing approved FIELD proof video; homepage output
  must be a derived still rather than the MP4.
- [x] Supplied inputs are mapped to ORDER, DESIGN, BUILD, ADOPT, and RETURN.
- [x] All six public WebPs exist, carry valid WebP signatures, and map exactly
  to scene config. FIELD is 1920x1080; ORDER through RETURN are 1672x941.
- [x] Missing stills resolve to a truthful null-source placeholder without a
  request; unit coverage prevents an invented contract URL.
- [ ] Final visual/crop approval for every public still remains manual.
- [ ] Optional mobile crops are required only where focal calibration is
  insufficient.

Final validator output: **6 READY / 0 MISSING**. Mobile-specific stills and all
future videos are **OPTIONAL**. All six configured WebP containers were verified.

## Static engine

- [x] Six anchors and five deterministic intervals are retained.
- [x] Timeline boundaries and configured blend are independent of media duration.
- [x] Scene configuration is still-first and type-checks desktop/mobile still,
  overlayMode, focal tiers, blendStart, and status.
- [x] The normal homepage path has no dependency on metadata, duration,
  currentTime, or active-video seeking.
- [x] Still resolver uses configured still -> compatibility poster -> placeholder
  without inventing a URL.
- [x] Continuous visual values use CSS variables/refs rather than high-frequency
  React render state.
- [x] Pure timeline tests prove that forward and reverse progress reconstruct the
  same deterministic chapter state.
- [!] Sticky entry, rail jumps, visual reverse traversal, RETURN stabilization,
  release, and Journey exit await integrated browser evidence.

## Overlay grammar

- [x] FIELD is minimal and real-world first.
- [x] ORDER uses sparse paths, alignment, nodes, and directional organization.
- [x] DESIGN uses grids, frames, transparent planes, and architecture.
- [x] BUILD uses organized flow and restrained activation.
- [x] ADOPT reduces graphic intensity and returns emphasis to people/environment.
- [x] RETURN converges into circulation.
- [x] Runtime overlayMode maps one-to-one with all six scenes.
- [x] Each scene has a distinct lightweight CSS/SVG grammar in addition to the
  still-to-still transition.
- [x] Overlay state is deterministic, bounded, and free of unsupported telemetry
  claims.
- [ ] Final visual polish and contrast require browser screenshots.

## RETURN infinity

- [x] Infinity is permitted only in RETURN.
- [x] Shape contract requires one horizontal interwoven ribbon, two fully closed
  uncropped loops, natural crossing, and restrained blue-to-cyan light.
- [x] Sphere, ring, capsule, bar, mechanical core, broken loop, earlier-scene
  infinity, and cyberpunk bloom are prohibited.
- [x] Runtime SVG formation obeys RETURN-only gating and uses one padded,
  horizontal, fully closed figure-eight path without a core element.
- [x] Reduced motion removes path drawing and presents the full static mark.
- [ ] Final Infinity refinement and user visual approval remain Pending.

## Validator

- [x] Semantics are documented:
  - READY = configured existing valid still;
  - MISSING = expected but not configured/supplied, placeholder-safe;
  - OPTIONAL = mobile crop, compatibility poster, or future video not required.
- [x] Validator checks path root, exact naming, supported extension/signature,
  duplicates, configured-file existence, and scene/config integrity.
- [x] A non-null configured missing path is a failure because it would cause a
  preventable runtime request.
- [x] Unconfigured expected stills may remain nonfatal during staged integration.
- [x] Absent transition videos are OPTIONAL and do not fail static mode.
- [x] Optional video probing runs only for configured compatibility media.
- [x] Validator exits 0 with 6 READY, 0 MISSING, and 6 verified WebPs.

## Responsive preservation

- [x] Retained contract covers Wide >=90rem, Desktop >64rem, Tablet >48–64rem,
  Compact <=48rem, Narrow <=30rem, and short landscape <=32rem high.
- [x] Tablet compact rail, Compact hidden rail, safe areas, 100svh Stage, and
  100dvh bounded menus/Debug are documented.
- [x] FIELD focal starting points are Desktop center, Tablet 30%, Mobile 25%.
- [x] Still and compatibility fallbacks use the same three focal tiers.
- [x] Orientation-change logic preserves normalized Journey progress and selected
  chapter at source level.
- [ ] Run the complete viewport matrix for still crop, typography, menu, rail,
  Debug, corporate layout, Journey exit, and horizontal overflow.

## Accessibility and reduced motion

- [x] Semantic page flow, skip link, labelled navigation, Journey heading,
  ordered scene identity, keyboard rail, aria-current, and visible focus remain.
- [x] Continuous visual progress is not a live-region announcement.
- [x] Decorative stills, SVG/CSS overlays, and infinity do not carry essential
  meaning or enter the tab order.
- [x] Reduced motion removes drift, parallax, animated blur, mask travel, line
  drawing, continuous loops, smooth rail scrolling, and optional video.
- [~] Reduced mode preserves static scene identity in source; final live browser
  preference switching remains manual.
- [ ] Keyboard, 200% zoom, contrast, screen-reader order, and live preference
  switching require final browser/manual evidence.

## Corporate, content, and SEO preservation

- [x] Navigation, Journey Hero/exit, Positioning, What We Do, Services, AI/DX,
  Selected Work, Process, Pricing, FAQ, Contact, Footer, and typed routes remain
  in scope.
- [x] Missing cases, proof, final copy, pricing, legal, and policy content remain
  explicit rather than fabricated.
- [x] Production build retains all 18 static/SSG routes, landmarks, route
  metadata, conditional canonical/indexing behavior, and corporate flow.
  conditional canonical/indexing behavior, or normal corporate flow.
- [ ] Final corporate/Journey copy remains subject to user review.
- [ ] Production origin and deployment remain separate approvals.

## Automated verification

Root verification used the bundled Node.js 24 runtime:

- [x] `npm run lint` equivalent — PASS
- [x] `npm run typecheck` equivalent — PASS
- [x] `npm test` equivalent — PASS, 24/24
- [x] `npm run asset:check` equivalent — PASS, 6 READY / 0 MISSING / 6
  verified stills; mobile stills and videos OPTIONAL
- [x] `npm run build` equivalent — PASS, 18 static/SSG pages
- [x] Project Skill quick_validate — PASS, 5/5
- [x] HTTP smoke — `/` 200, `/journey-debug` 200, all six WebPs 200 with
  `image/webp`; SSR contains no `<video>` or legacy FIELD-video reference

## Browser, Network, and Performance QA

The in-app browser refused localhost automation under the current security
policy. No alternate browser or policy workaround was used. The following live
visual/console/network items therefore remain **BLOCKED**, even though source,
SSR, HTTP, and automated evidence pass:

- [ ] Homepage makes zero Journey video requests in normal static mode.
- [ ] All six scenes traverse forward and reverse.
- [ ] Current/destination still crossfades without black gaps.
- [ ] Every overlay grammar is distinct, restrained, and reversible.
- [ ] RETURN alone reveals a compliant infinity.
- [ ] Rail jumps, sticky release, Journey exit, and corporate scroll work.
- [ ] Missing still produces placeholder with no 404 or repeated request.
- [ ] Reduced motion is static and makes zero optional video requests.
- [ ] Wide/Desktop/Tablet/Compact/Narrow/short-landscape matrix passes.
- [ ] documentElement.scrollWidth is never greater than innerWidth.
- [ ] Console has no React, hydration, image, promise, or state-loop error.
- [ ] Network has no nonexistent/repeated media requests.
- [ ] Performance has no runaway RAF, listener leak, or excessive paint/filter
  cost.
- [ ] Physical iOS Safari and Android Chrome remain release QA targets.

## Inputs still needed from the user

Only truly external approval remains:

- final scene and corporate copy;
- final crop/composition approval for the six anchors;
- final RETURN infinity polish/approval;
- any optional mobile-specific still crops proven necessary by QA;
- optional future video assets only if the user later chooses that enhancement;
- real services, case studies, pricing, contact, legal, and policy facts;
- production domain and deployment approval at the later release milestone.

Five transition videos are not a missing requirement.

## Judgment

Current judgment is **PASS WITH NOTES**. The video-free foundation, assets,
automated checks, production build, SSR, and HTTP delivery are ready. A clean
manual/local browser pass across the listed viewports, Reduced Motion, Console,
and Network remains required before promoting this milestone to an unqualified
visual PASS.
