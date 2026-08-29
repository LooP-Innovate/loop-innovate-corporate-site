# Static Cinematic Scrollytelling Mode

## Status

This is the normative contract for the video-free homepage Journey. It describes
the intended production behavior and integration boundary. It does not by itself
prove that the current runtime, assets, browser behavior, or performance have
passed. Evidence and remaining gates live in pre-asset-checklist.md.

## Why the direction changed

Five generated transition videos are no longer a prerequisite for a complete
brand experience. The Journey now treats six approved still anchors as the
durable visual story and creates cinematic change through deterministic code.
This is a strategic shift, not a fallback:

~~~text
video-dependent scrubbing
  -> still-first, code-driven cinematic storytelling
~~~

The change reduces production dependency, download/decode cost, metadata timing,
and browser seek variance while preserving chapter structure, premium atmosphere,
reverse determinism, and a future path for optional video.

## Retained foundation

Keep the existing:

- FIELD, ORDER, DESIGN, BUILD, ADOPT, RETURN order;
- section-contained sticky track;
- global Journey progress, scene index, local progress, next scene, and blend;
- rail, scene readout, responsive tiers, safe areas, and Journey exit;
- reduced-motion, accessibility, debug, corporate site, SEO, and design tokens;
- pure Timeline tests and configuration-driven assets.

The homepage must not depend on HTML video duration, metadata, currentTime, or a
seek RAF. The Phase 01 video lab and compatibility code may remain isolated for
regression or a future opt-in mode.

## Layer model

Each rendered scene is composed in this order:

~~~text
Scene layer
  -> approved base still or truthful placeholder
  -> atmosphere
  -> structural SVG/CSS overlay
  -> restrained motion accent
  -> contrast shade
  -> scene identity and copy
  -> rail and progress
  -> gated Debug
~~~

Continuous values belong in scoped CSS custom properties or refs. React state is
reserved for scene boundaries, asset readiness, preference changes, and
throttled diagnostics.

## Still asset contract

The six canonical desktop/master paths are:

~~~text
/media/journey/still/01-field.webp
/media/journey/still/02-order.webp
/media/journey/still/03-design.webp
/media/journey/still/04-build.webp
/media/journey/still/05-adopt.webp
/media/journey/still/06-return.webp
~~~

Optional measured mobile crops use the same stem plus -mobile.webp. A mobile
field may remain null; the resolver then reuses the desktop still. Never author a
public URL before the file exists.

FIELD is derived from the existing approved FIELD proof source, but the homepage
must consume 01-field.webp rather than the MP4. Supplied approved inputs map to
02 ORDER, 03 DESIGN, 04 BUILD, 05 ADOPT, and 06 RETURN. File integration is not
considered verified until configuration, validator, automated checks, and browser
inspection pass.

Normal static resolution is:

~~~text
requested still variant
  -> desktop still fallback
  -> explicitly configured legacy poster fallback
  -> generated scene placeholder
~~~

Missing values are null. A generated placeholder shows only scene identity and
development status; it is not a fabricated production image.

## Overlay grammar

Each chapter must change the visual logic, not merely crossfade two bitmaps.

| Scene | Meaning | Overlay and motion grammar |
| --- | --- | --- |
| FIELD | Real world first | Subtle still drift and atmosphere; almost no structural graphics |
| ORDER | The world becomes legible | Faint information paths, alignment lines, sparse nodes, directional flow emergence |
| DESIGN | Structure is authored | More visible grid logic, transparent architectural lines, frames, planes, and measured geometry |
| BUILD | The system activates | Organized flow, route illumination, restrained network activity, no sci-fi overload |
| ADOPT | Technology supports people | Lower graphic density, calmer accents, environmental and human emphasis |
| RETURN | Value returns to circulation | Converging paths, cyclic flow, quiet synthesis, and the only permitted infinity formation |

Overlays are abstract explanatory structure, not factual telemetry. Do not imply
real measured data, live systems, or product capability unless approved evidence
exists.

## Transition grammar

The pure Timeline remains authoritative. A scene is dominant for most of its
interval; near the configured blendStart, the destination still and its overlay
enter through:

- opacity staging;
- bounded scale drift;
- micro parallax;
- blur-to-sharp transition;
- mask reveal or conceal;
- overlay density and node/line emergence.

Forward and reverse scroll must reconstruct the same state. Avoid independent
timers for narrative state, random animation, black gaps, and a plain crossfade
with no conceptual change. Continuous ambient loops, if any, must be subtle,
nonessential, visibility-gated, and absent in reduced motion.

## RETURN-only infinity rule

An infinity may appear only in RETURN. It must be:

- perfectly horizontal;
- one interwoven ribbon;
- two fully closed elliptical loops;
- naturally crossed front-to-back;
- fully visible with no crop;
- restrained blue-to-cyan optical light.

No center sphere, ring, capsule, bar, mechanical core, broken loop, vertical
orientation, or earlier-scene infinity is allowed. If a compliant formation is
not ready, render a quiet abstract circulation state or an empty integration
slot. Never ship a malformed infinity merely to fill the space.

The infinity is decorative. Scene text must carry the meaning, and reduced
motion may show a static completed mark or omit the formation without losing the
RETURN chapter.

## Reduced motion

When prefers-reduced-motion requests reduction:

- render a static still for the current/discrete scene;
- remove parallax, scale drift, blur animation, mask travel, line drawing,
  continuous loops, and smooth rail scrolling;
- simplify or remove animated crossfade;
- retain readable scene identity, order, progress context, and corporate flow;
- keep decorative SVG/canvas out of the accessibility tree;
- do not load optional Journey video.

Reduced motion is a complete still presentation, not a paused animated frame.

## Optional future video

Future videos may be reintroduced scene-by-scene only as an explicit enhancement.
They must not replace the still contract, be required for timing, or block a
scene when absent. Any optional video mode must:

- use the same scene IDs, Timeline, focal tiers, and fallback still;
- keep story meaning outside the video;
- remain disabled in reduced motion;
- validate only configured files;
- preserve the video-free homepage as the baseline and failure mode.

No future integration may silently restore five missing videos as a release gate.

## Performance rules

- Do not add GSAP, Three.js, WebGL, or a particle engine for this mode.
- Prefer transforms, opacity, filters, masks, SVG, and deterministic CSS
  variables.
- Keep high-frequency progress out of React render state.
- Decode only configured nearby stills; do not request nonexistent paths.
- Gate optional ambient RAF by visibility and motion preference, and stop it on
  view exit and unmount.
- Treat blur and large composited layers as measured costs, not free decoration.

## Acceptance gate

The switch is accepted only after automated and browser evidence confirms:

- the homepage works with zero Journey video requests;
- all six still chapters and reverse transitions remain clear;
- missing stills produce placeholders without 404 spam;
- scene overlays are meaningfully distinct and restrained;
- RETURN alone owns a compliant infinity state;
- reduced motion is static and complete;
- established responsive, accessibility, corporate, and performance baselines
  do not regress.

Automated, validator, build, SSR, and HTTP evidence is now recorded as PASS.
Overall status is **PASS WITH NOTES** until the policy-blocked localhost browser
matrix is completed manually and recorded in `pre-asset-checklist.md`.
