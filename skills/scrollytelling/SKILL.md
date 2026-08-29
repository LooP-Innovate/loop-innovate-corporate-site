---
name: scrollytelling
description: Extend, debug, or review the L∞P six-scene still-first Journey, including pure Timeline math, still resolution, overlay grammar, responsive controls, placeholders, reduced motion, validation, and optional future video compatibility.
---

# Work on the L∞P Journey

## Read the contracts

Read docs/journey-architecture.md, docs/static-scrollytelling-mode.md,
docs/journey-asset-spec.md, docs/accessibility.md, and
docs/responsive-strategy.md. Inspect current scene config, still resolver,
Timeline, Stage, overlays, engine, and Debug; do not infer their API from the
historical Phase 02 video document.

## Preserve the model

- Keep FIELD, ORDER, DESIGN, BUILD, ADOPT, RETURN fixed and type-safe.
- Keep one authored scene/config source with desktop/mobile still, overlayMode,
  blendStart, Desktop/Tablet/Mobile focal values, and status.
- Keep missing paths null and never mount a canonical path just because it is
  expected.
- Keep Timeline pure: Journey progress -> scene, next scene, local progress,
  configured blend; progress 1 stabilizes on RETURN.
- Keep the Stage section-contained and sticky, with section-relative rail jumps
  and orientation progress preservation.

## Resolve stills safely

Default resolution is requested still -> desktop still -> configured
compatibility poster -> truthful placeholder. Static mode never selects video
first. Decode only relevant current/destination stills; do not preload every
canonical filename or create Blob URLs.

Canonical paths are /media/journey/still/01-field.webp through 06-return.webp.
Optional mobile crops append -mobile. FIELD is derived from the approved proof
video; the homepage does not depend on that MP4.

## Compose scene state

Drive opacity, scale, parallax, blur, masks, line/node density, and overlays from
Timeline values through refs or scoped CSS variables. Use FIELD minimal
atmosphere, ORDER paths, DESIGN geometry, BUILD activation, ADOPT calm support,
and RETURN convergence. Reverse scroll reconstructs the same state.

Only RETURN may form an infinity: one horizontal interwoven blue-to-cyan ribbon
with two closed uncropped loops. Omit a noncompliant result.

## Reduced motion and accessibility

Reduced motion renders static still chapters with no drift, parallax,
blur/mask/line animation, crossfade motion, continuous loop, smooth rail jump, or
optional video. Keep scene identity/order, placeholder, Journey exit, and
corporate flow. Treat stills/overlays/infinity as decorative when adjacent text
carries meaning; do not announce continuous values.

Keep full rail on Desktop, dot rail on Tablet, and scene readout/progress without
vertical rail on Compact and short landscape. Preserve keyboard, aria-current,
focus, safe areas, and 44px visible targets.

## Validate assets honestly

Asset validation distinguishes:
- READY: configured existing valid still;
- MISSING: expected but unconfigured, placeholder-safe;
- OPTIONAL: mobile crop, compatibility poster, or future video.

Fail configured missing files, invalid path/name/signature, duplicates, or
invalid scene/overlay configuration. Do not fail solely because transition
videos are absent. Validator PASS proves safe configuration, not visual approval.

## Keep video optional

A future video may be selected only by explicit mode/configuration, uses the same
Timeline/still fallback, carries no essential meaning, stays off in reduced
motion, and is validated only when configured. Never restore five videos as a
homepage release gate. Use the Phase 01 lab for seek/metadata regression.

## Verify

Run Timeline/config/resolver/overlay tests, asset validation, lint, typecheck,
build, and Project Skill validation. Browser-test all six scenes forward/reverse,
rail, still crop, overlay distinction, RETURN-only infinity, missing fallback,
zero normal-mode video requests, responsive matrix, reduced motion, Console,
Network, paint/RAF, accessibility, and Journey exit. Leave status Pending without
current evidence.

