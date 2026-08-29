---
name: motion-design
description: Define and implement restrained accessible motion for L∞P, especially deterministic still-scene transitions, overlay state, UI feedback, reduced motion, and performance safeguards.
---

# Apply restrained L∞P motion

## Give motion a job

State which chapter, hierarchy, direction, or system relationship the motion
communicates. Prefer CSS transforms, opacity, masks, filters, SVG, and existing
Timeline variables. Do not add GSAP, Three.js, WebGL, or particles for polish.

## Drive static cinematics deterministically

Derive still crossfade, scale, parallax, blur, mask, line/node density, and
RETURN formation from Journey/local/blend progress. Keep configured blendStart
as the authority. Forward and reverse must reconstruct the same state; do not use
an independent timer or randomness for narrative state.

Use scene grammar:

- FIELD minimal drift;
- ORDER directional paths;
- DESIGN grid/geometry reveal;
- BUILD organized activation;
- ADOPT quieter support;
- RETURN convergence and the only infinity formation.

Do not animate every layer simultaneously or turn overlays into fake telemetry.

## Schedule safely

Keep high-frequency progress in refs or scoped CSS variables. Reserve React state
for scene boundaries, asset readiness, preferences, and throttled Debug. Gate any
nonessential ambient RAF by visibility and motion preference; stop on view exit,
preference change, and unmount. Avoid permanent will-change on large inactive
layers and measure blur/mask paint cost.

Static mode does not need video currentTime RAF. Use the isolated compatibility
engine only when an explicit future video mode is requested.

## Reduced motion

Treat reduce as a complete static experience. Remove parallax, drift, animated
scale/blur/mask, line drawing, node emergence, crossfade motion, continuous
loops, smooth rail scrolling, and optional video. Preserve scene order, identity,
still/placeholder, and a static compliant RETURN state or no infinity.

## Reject and verify

Reject scroll hijacking, blocking transitions, bounce-heavy easing, random loops,
black gaps, half-formed reduced-motion states, and simultaneous decorative
motion. Browser-test forward/reverse, rapid direction changes, rail jumps,
missing/slow stills, viewport exit, orientation, reduced motion, CPU/paint, and
cleanup before claiming PASS.

