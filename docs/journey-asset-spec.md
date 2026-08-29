# Journey Asset Specification

## Chosen model

Use six still-image scene anchors as the primary production contract:

~~~text
FIELD -> ORDER -> DESIGN -> BUILD -> ADOPT -> RETURN
  01       02        03       04       05       06
~~~

The five Timeline intervals remain, but they interpolate visual state rather than
requiring five transition clips. Video is an optional future enhancement and is
not part of the homepage readiness gate.

## Canonical public paths

Required desktop/master still names are:

~~~text
public/media/journey/still/
  01-field.webp
  02-order.webp
  03-design.webp
  04-build.webp
  05-adopt.webp
  06-return.webp
~~~

Public URLs use the same path beneath /media. Optional mobile crops use:

~~~text
01-field-mobile.webp
02-order-mobile.webp
03-design-mobile.webp
04-build-mobile.webp
05-adopt-mobile.webp
06-return-mobile.webp
~~~

Use lowercase ASCII, a two-digit index, the exact scene ID stem, and WebP.
Do not create or configure a path before its file exists.

The approved FIELD still is extracted from /video/field-v01.mp4 and written to
01-field.webp. The homepage must not use that MP4 as its normal scene source.
Supplied source images map to 02 ORDER, 03 DESIGN, 04 BUILD, 05 ADOPT, and
06 RETURN. Preserve the original inputs; public files are web delivery assets.

## Still technical baseline

- Use a high-quality photographic WebP with an sRGB-compatible color profile.
- Preserve sufficient source resolution for full-bleed Desktop/Wide cover.
- Create a mobile crop only when the shared still plus focal point cannot
  preserve subject and composition.
- Keep essential text, claims, UI labels, logos, and telemetry out of bitmaps.
- Avoid baked-in letterboxing, artificial UI, fake data, and generative defects.
- Record provenance and approval outside the public file when production
  governance requires it.
- Set intrinsic width/height or an equivalent stable aspect container to prevent
  layout shift.

Do not impose an arbitrary file-size or dimension PASS before measuring image
quality and page performance. Optimization must preserve the approved scene.

## Scene configuration

The authored scene source contains, conceptually:

~~~text
id, index, label
desktopStill, mobileStill
overlayMode
blendStart
focalPointDesktop, focalPointTablet, focalPointMobile
status
optional compatibility media
~~~

The scene order and overlayMode are type-safe. Missing paths are null. Derived
manifests, aliases, and Debug data must not become a second authored source.

Normal static resolution is:

~~~text
mobile still when requested
  -> desktop still
  -> explicitly configured poster compatibility fallback
  -> truthful generated placeholder
~~~

Optional future video must be selected only by an explicit mode. It must never
precede the still in the default homepage resolver.

## Focal contract

Every scene owns Desktop, Tablet, and Mobile focal positions. Still and fallback
poster use the same focal tier. Current FIELD calibration begins at:

~~~text
Desktop  center center
Tablet   30% center
Mobile   25% center
~~~

These values are provisional until screenshot QA confirms the left-side person,
skyline, copy region, and crop at every target aspect ratio. Recheck values when
the still changes. An optional mobile file does not remove the need for focal
configuration.

## Missing assets

The application must never turn a canonical contract name into a request merely
because the file is expected. Configuration activates only real files.

~~~text
configured existing still  -> READY
unconfigured expected still -> MISSING, placeholder, no request
future video not configured  -> OPTIONAL, no request
~~~

Do not substitute stock imagery or a production-looking generated image for a
missing approved anchor.

## Validator semantics

npm run asset:check distinguishes asset completeness from contract integrity:

- READY: a configured still exists and passes supported path, extension, naming,
  duplicate, and file-signature checks.
- MISSING: an expected still is not yet configured or supplied. During staged
  integration this is reported clearly and may remain nonfatal because the
  runtime has a truthful placeholder.
- OPTIONAL: a mobile rendition, legacy poster, or future video is absent and is
  not required by static mode.

The command must fail for a preventable runtime defect, including:

- a non-null configured path whose file does not exist;
- a path outside an allowed public contract directory;
- an unsupported extension or invalid file signature;
- duplicate/conflicting asset ownership;
- invalid scene order, ID, overlayMode, blendStart, or status/source relation;
- an unexpected file that violates the directory/naming contract when strict
  directory scanning is enabled.

The command must not fail solely because transition videos are absent. Optional
video metadata probing runs only for a configured video and remains a
compatibility check. A successful validator result means configuration is safe;
it does not mean every scene is visually approved.

## Scene review

For each still confirm:

- the scene meaning matches FIELD, ORDER, DESIGN, BUILD, ADOPT, or RETURN;
- subject anatomy, architecture, perspective, and lighting are credible;
- cross-scene horizon, palette, and world continuity are intentional;
- crop survives Desktop, Tablet, Compact, and short landscape;
- overlay contrast remains readable without obscuring the subject;
- no bitmap includes unsupported copy, fake telemetry, customer proof, or
  accidental logo artifacts.

RETURN is the only anchor that may host an infinity formation. The still itself
does not need a baked infinity; a code-driven compliant formation is preferred
so it can respond to progress and reduced motion.

## Integration workflow

1. Preserve and review the approved source input.
2. Export the exact canonical WebP into public/media/journey/still.
3. Configure only that existing path and its focal tiers.
4. Run asset validation plus scene-config/resolver tests.
5. Inspect the still alone and with its scene overlay.
6. Test forward, reverse, rail jump, blend boundary, missing fallback, reduced
   motion, and responsive crop.
7. Inspect Console and Network for decode errors, repeated requests, and 404s.
8. Record evidence before marking the scene READY in the milestone checklist.

Replacing a placeholder must not require Timeline changes or a scene-specific
branch in the view.

## Future optional video contract

If a scene later receives an approved video, document its path and technical
profile as an optional enhancement. Keep its still as the poster/failure/reduced
motion baseline. Validate codec, pixel format, audio, fast-start, keyframes,
duration, Range behavior, and source switching only for configured videos.

The earlier five-transition encoding model remains historical guidance in the
Phase 01/02 documents. It is not the current production asset requirement.

## Related contracts

- static-scrollytelling-mode.md defines runtime and overlay behavior.
- journey-architecture.md defines ownership and Timeline integration.
- responsive-strategy.md defines focal tiers and viewport acceptance.
- accessibility.md defines decorative imagery and reduced motion.
- pre-asset-checklist.md records evidence and remaining inputs.
