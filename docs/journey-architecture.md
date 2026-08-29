# L∞P Journey Architecture

## Status and scope

This is the current production contract for the video-free, still-first Journey.
It supersedes the Phase 02 video-driven asset model where they differ. The pure
Timeline, sticky geometry, responsive controls, and historical single-video lab
remain useful; homepage acceptance no longer depends on scene video metadata,
duration, currentTime, or seek smoothing.

Implementation and asset integration may be present in source, but the switch is
not Verified until the final automated and browser evidence is recorded in
pre-asset-checklist.md.

## Non-negotiable invariants

- Keep the order FIELD, ORDER, DESIGN, BUILD, ADOPT, RETURN.
- Keep six anchors and five deterministic scroll intervals.
- Author scene paths, overlayMode, focal tiers, blendStart, and status in one
  typed scene configuration.
- Make still images the default Journey source; represent missing assets as null.
- Never request a contract filename before the file exists.
- Calculate progress from the Journey section and release the sticky Stage at its
  end.
- Drive narrative state from scroll progress, not an independent animation clock.
- Keep high-frequency progress in refs or scoped CSS variables.
- Keep RETURN as the only scene allowed to form an infinity.
- Provide a complete static reduced-motion presentation.
- Treat any future video as an optional enhancement with a still fallback.

## Runtime map

~~~text
app and corporate document flow
  -> LoopJourney (section, track, orchestration)
     -> Journey engine (geometry, pure Timeline, preference, debug metrics)
     -> layered Journey Stage
        -> current still or placeholder
        -> next still or placeholder
        -> audited separated layer stack
        -> atmosphere and scene-specific structural overlay
        -> BUILD inner System Window
        -> RETURN-only hybrid infinity and dot release
     -> Journey overlay (scene identity, progress, responsive rail)
     -> gated Journey Debug

lib/scrollytelling
  -> journey types
  -> scene config and validation
  -> still/asset resolver
  -> pure Timeline
  -> selected layer config
  -> pure interaction timeline for BUILD and RETURN
~~~

Component names may remain rationalized rather than mirroring every conceptual
layer. Split a component only when it gains an independent state, reuse, or test
boundary.

## Scene source of truth

Each scene defines:

~~~text
id, index, label
desktopStill, mobileStill
overlayMode
blendStart
focalPointDesktop, focalPointTablet, focalPointMobile
status
optional compatibility media
~~~

Scene IDs are fixed and sequential. overlayMode must match the scene meaning:
field, order, design, build, adopt, or return. Derived manifests, compatibility
aliases, and diagnostics must not be edited separately.

Canonical still URLs are:

~~~text
/media/journey/still/01-field.webp
/media/journey/still/02-order.webp
/media/journey/still/03-design.webp
/media/journey/still/04-build.webp
/media/journey/still/05-adopt.webp
/media/journey/still/06-return.webp
~~~

Optional mobile crops use the same stem plus -mobile.webp. See
journey-asset-spec.md for activation and validation rules.

## Timeline

The pure Timeline remains unchanged in concept:

~~~text
p      = clamp(journeyProgress, 0, 1)
scaled = p * (sceneCount - 1)
~~~

For p below 1, the interval index is floor(scaled) and local progress is its
fraction. Current scene is the interval owner and next scene is the following
anchor. At p = 1, current and next both stabilize on RETURN.

Blend remains configuration-driven:

~~~text
blend = clamp((localProgress - blendStart) / (1 - blendStart), 0, 1)
~~~

The same input reconstructs the same scene, overlay, mask, opacity, blur, and
infinity state in forward or reverse. Timeline tests cover exact and
near-boundary values.

## Track geometry and orientation

Six anchors use one sticky viewport plus five interval lengths. Section-local
geometry drives both progress and inverse rail jumps:

~~~text
progress = (scrollY - sectionTop) / (sectionHeight - stickyHeight)
scene jump = sectionTop + sceneProgress * scrollDistance
~~~

Use 100svh for the stable Stage. ResizeObserver, resize, and orientation signals
recalculate geometry. Orientation handling preserves normalized progress across
the new distance instead of restarting the Journey. If a width boundary changes
the still variant, the replacement source must retain the same scene/local
progress.

## Still resolution and readiness

Static mode resolves:

~~~text
requested still
  -> desktop still fallback
  -> explicitly configured poster compatibility fallback
  -> truthful generated placeholder
~~~

The resolver never invents a URL. Image readiness may change opacity/fallback
state, but it must not control Timeline timing. Decode failure preserves the
placeholder and reports a diagnostic without collapsing the chapter.

Only nearby current/destination stills need eager decode. Do not request the
entire future asset contract merely because canonical filenames are known.
Normal browser image caching is preferred to custom Blob prefetching.

## Static visual state

Timeline values drive bounded presentation variables such as:

- current and destination opacity;
- base still scale and micro-parallax;
- blur-to-sharp transition;
- mask reveal;
- structural line/node density;
- overlay transform and intensity;
- RETURN infinity formation progress.

The Stage keeps a stable background/fallback beneath both layers so a transition
cannot expose black. Current remains visually dominant until the configured
boundary; the destination and its overlay then enter as one conceptual chapter.

Use CSS transforms, opacity, masks, filters, and SVG. Minimal RAF is allowed only
for nonessential ambient state that CSS cannot express, and must be visibility-
and preference-gated. Do not add GSAP, Three.js, WebGL, or a particle engine.

## Overlay grammar

- FIELD: real-world image, subtle drift, minimal atmosphere, almost no graphics.
- ORDER: sparse information paths, alignment lines, nodes, directional order.
- DESIGN: clearer grid, architectural frames, transparent planes and geometry.
- BUILD: organized route illumination and restrained activation.
- ADOPT: graphics recede; human/environmental emphasis and quiet support.
- RETURN: paths converge into circulation and may form the only infinity.

Overlay graphics are decorative and abstract. They cannot claim that data is
real, a system is live, or an outcome has been measured.

## RETURN-only infinity

RETURN may reveal one horizontal, interwoven blue-to-cyan ribbon with two closed,
uncropped elliptical loops and a natural front/back crossing. No other scene may
show an infinity motif.

Reject center spheres, rings, bars, capsules, mechanical cores, broken loops,
vertical symbols, cropped edges, and cyberpunk bloom. If a compliant result is
not ready, keep a quiet circulation state or renderer-neutral slot instead of a
bad infinity. Essential RETURN meaning remains in text.

## Reduced motion

When reduction is active:

- base stills remain static;
- drift, parallax, animated blur, mask travel, line drawing, crossfade motion,
  smooth rail scrolling, and continuous loops stop;
- scene identity, order, fallback, progress context, and Journey exit remain;
- optional video does not load;
- Debug reports the static state without driving it.

Reduced motion may discretely select a scene from section progress. It is an
alternate complete presentation rather than a paused effect.

## Responsive contract

The visual tiers are Wide, Desktop, Tablet, Compact, Narrow, and short landscape.
Asset variants remain desktop/mobile:

- Wide/Desktop: desktop still and focal point, full labelled rail.
- Tablet: desktop still, tablet focal point, compact dot rail.
- Compact/Narrow: mobile still with desktop fallback, mobile focal point, rail
  hidden while scene readout and progress remain.
- Short landscape: rail hidden, safe vertical bands, compact Hero and Debug.

Still and poster fallbacks share focal variables. See responsive-strategy.md for
exact boundaries and Pending browser matrix.

## Accessibility and progressive enhancement

Scene stills and structural overlays are decorative when adjacent text names the
chapter; keep them out of the tab order and accessibility tree. Do not announce
continuous progress, overlay density, or decorative formation through aria-live.

Semantic navigation, headings, ordered scene identity, and normal corporate
content must remain understandable if images, CSS effects, or JavaScript fail.
Meaningful editorial imagery outside this decorative Journey contract requires
appropriate alternative text.

## Debug contract

Static diagnostics report:

~~~text
Journey Progress
Scene Index and ID
Next Scene
Local and Blend Progress
Active Still and Next Still
Overlay Mode
Reduced Motion
Journey In View
Asset Status
Responsive tier or focal mode
~~~

Video time, duration, readyState, and seek metrics appear only when an explicit
optional video mode is active. Normal static Debug uses a collapsed, viewport-
bounded disclosure and never drives runtime state. Production hides it unless an
explicit safe flag enables it.

## Optional future video seam

Compatibility code may remain, but the homepage baseline cannot route through it
implicitly. A future scene video:

- is selected only by an explicit mode/configuration;
- uses the same Timeline and still fallback;
- does not carry essential copy or meaning;
- stays disabled for reduced motion;
- is validated only when configured;
- cannot turn absent transition videos back into a release blocker.

The Phase 01 lab remains the regression surface for metadata and seeking.

## Verification status

Static source integration, 24/24 tests, validator, production build, SSR, and
HTTP image delivery pass. Visual forward/reverse behavior, responsive crops,
live Reduced Motion, Console/Network, and browser performance remain Pending
because localhost browser automation was policy-blocked. See
`pre-asset-checklist.md`; do not infer an unqualified visual PASS from this
architecture document.
